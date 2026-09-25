import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email/resend'
import { nudgeDay2, nudgeDay7, nudgeDay21, nudgeOngoing } from '@/lib/email/templates'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * One daily job doing three unrelated but equally unglamorous things.
 *
 * 1. Touches the database so the Supabase free tier does not pause after 7 idle
 *    days. A paused project means a real visitor hits a dead signup form, which
 *    is a far worse outcome than this cron looking pointless.
 * 2. Sends the day 2 / 7 / 21 lifecycle emails to free-plan accounts.
 * 3. Sends an infrequent ongoing check-in (every ONGOING_INTERVAL_DAYS, starting
 *    ONGOING_START_DAYS after signup) to anyone who is past the day-21 sequence,
 *    still hasn't purchased, and hasn't unsubscribed. Before 24 Sept 2026 this
 *    is where sends just stopped forever — see the migration and
 *    src/lib/email/unsubscribe.ts for why that changed: signing up is enough
 *    trust to stay on the list, the unsubscribe link is what lets someone
 *    actually leave it, and nobody should be silently dropped in between.
 *
 * Vercel's Hobby plan allows a small number of cron jobs at daily frequency, so
 * all three share one endpoint rather than burning separate slots.
 */

const NUDGES = [
  { template: 'nudge_day2', afterDays: 2, build: nudgeDay2 },
  { template: 'nudge_day7', afterDays: 7, build: nudgeDay7 },
  { template: 'nudge_day21', afterDays: 21, build: nudgeDay21 },
] as const

// First ongoing check-in lands 60 days after the day-21 nudge, then repeats
// every 60 days indefinitely until purchase or unsubscribe.
const ONGOING_START_DAYS = 81
const ONGOING_INTERVAL_DAYS = 60

function firstName(fullName: string | null, email: string): string {
  if (fullName && fullName.trim()) return fullName.trim().split(/\s+/)[0]
  return email.split('@')[0]
}

export async function GET(request: Request) {
  // Fails closed on purpose. This endpoint sends email, so an unset secret must
  // stop the job rather than leave a public URL that anyone can use to trigger a
  // mail-out. Vercel sends this header automatically once CRON_SECRET is set.
  const secret = process.env.CRON_SECRET
  if (!secret) {
    console.error('cron: CRON_SECRET is not set, refusing to run')
    return NextResponse.json({ error: 'Cron secret not configured' }, { status: 500 })
  }
  if (request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let supabase: ReturnType<typeof createAdminClient>
  try {
    supabase = createAdminClient()
  } catch (err) {
    console.error('cron: Supabase admin client unavailable:', err)
    return NextResponse.json({ error: 'Supabase unavailable' }, { status: 500 })
  }

  // ── 1. Keep-alive ─────────────────────────────────────────────────────
  const { error: pingError } = await supabase
    .from('subscriptions')
    .select('id')
    .limit(1)

  if (pingError) {
    console.error('cron: keep-alive query failed:', pingError.message)
  }

  // ── 2. Fixed-day lifecycle emails ────────────────────────────────────
  const sent: Record<string, number> = {}

  for (const nudge of NUDGES) {
    // Everyone who signed up on the target day, still has not purchased, and
    // has not unsubscribed. A one-day window keeps each account eligible for
    // exactly one send even if the cron is late or re-run; the unique
    // constraint on email_log is the belt-and-braces guarantee.
    const start = new Date(Date.now() - (nudge.afterDays + 1) * 86_400_000).toISOString()
    const end = new Date(Date.now() - nudge.afterDays * 86_400_000).toISOString()

    const { data: candidates, error } = await supabase
      .from('subscriptions')
      .select('user_id, status, profiles!inner (id, email, full_name, created_at, marketing_opt_out)')
      .neq('status', 'active')
      .eq('profiles.marketing_opt_out', false)
      .gte('profiles.created_at', start)
      .lt('profiles.created_at', end)

    if (error) {
      console.error(`cron: candidate query failed for ${nudge.template}:`, error.message)
      continue
    }
    if (!candidates || candidates.length === 0) continue

    const userIds = candidates.map((c) => c.user_id)
    const { data: alreadySent } = await supabase
      .from('email_log')
      .select('user_id')
      .eq('template', nudge.template)
      .in('user_id', userIds)

    const skip = new Set((alreadySent ?? []).map((r) => r.user_id))
    let count = 0

    for (const row of candidates) {
      if (skip.has(row.user_id)) continue

      const profile = row.profiles as unknown as {
        email: string
        full_name: string | null
      }
      if (!profile?.email) continue

      // Claim the send first. If the insert loses a race with a concurrent run,
      // the unique constraint rejects it and nobody gets a duplicate email.
      const { error: claimError } = await supabase
        .from('email_log')
        .insert({ user_id: row.user_id, template: nudge.template })

      if (claimError) continue

      const email = nudge.build({ name: firstName(profile.full_name, profile.email), userId: row.user_id })
      const ok = await sendEmail({ to: profile.email, subject: email.subject, html: email.html })

      if (ok) {
        count++
      } else {
        // Delivery failed — release the claim so tomorrow's run retries this
        // user instead of the send being silently and permanently lost.
        await supabase.from('email_log').delete().eq('user_id', row.user_id).eq('template', nudge.template)
      }
    }

    if (count > 0) sent[nudge.template] = count
  }

  // ── 3. Ongoing check-in (infrequent, indefinite) ─────────────────────
  // Not a fixed-day query like the ones above, because there is no single
  // "day N" — this repeats forever at ONGOING_INTERVAL_DAYS, so each user's
  // eligibility is computed from their own signup date rather than matched
  // against one date range.
  {
    const cutoff = new Date(Date.now() - ONGOING_START_DAYS * 86_400_000).toISOString()

    const { data: candidates, error } = await supabase
      .from('subscriptions')
      .select('user_id, status, profiles!inner (id, email, full_name, created_at, marketing_opt_out)')
      .neq('status', 'active')
      .eq('profiles.marketing_opt_out', false)
      .lte('profiles.created_at', cutoff)

    if (error) {
      console.error('cron: ongoing candidate query failed:', error.message)
    } else if (candidates && candidates.length > 0) {
      let count = 0

      for (const row of candidates) {
        const profile = row.profiles as unknown as {
          email: string
          full_name: string | null
          created_at: string
        }
        if (!profile?.email) continue

        const daysSinceSignup = Math.floor(
          (Date.now() - new Date(profile.created_at).getTime()) / 86_400_000
        )
        if (daysSinceSignup < ONGOING_START_DAYS) continue
        const sinceStart = daysSinceSignup - ONGOING_START_DAYS
        if (sinceStart % ONGOING_INTERVAL_DAYS !== 0) continue

        const cycle = sinceStart / ONGOING_INTERVAL_DAYS + 1
        const template = `nudge_ongoing_${cycle}`

        // Same claim-first pattern as the fixed-day nudges. Each cycle is its
        // own template value, so the existing unique(user_id, template)
        // constraint on email_log is still what prevents a duplicate send if
        // the cron re-runs the same day — no schema change needed for an
        // ongoing, indefinitely-repeating email.
        const { error: claimError } = await supabase
          .from('email_log')
          .insert({ user_id: row.user_id, template })

        if (claimError) continue

        const email = nudgeOngoing({ name: firstName(profile.full_name, profile.email), userId: row.user_id })
        const ok = await sendEmail({ to: profile.email, subject: email.subject, html: email.html })

        if (ok) {
          count++
        } else {
          await supabase.from('email_log').delete().eq('user_id', row.user_id).eq('template', template)
        }
      }

      if (count > 0) sent['nudge_ongoing'] = count
    }
  }

  console.log('cron: daily run complete', { keepAlive: !pingError, sent })
  return NextResponse.json({ ok: true, keepAlive: !pingError, sent })
}
