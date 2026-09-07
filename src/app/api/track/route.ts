import { createClient } from '@/lib/supabase/server'
import { track, type AnalyticsEvent } from '@/lib/analytics/track'
import { NextResponse } from 'next/server'

/**
 * Client-side funnel events.
 *
 * Only these three can be fired from the browser, and the user id always comes
 * from the session rather than the request body, so this cannot be used to write
 * arbitrary events or attribute them to someone else.
 */
const CLIENT_EVENTS: AnalyticsEvent[] = [
  'onboarding_completed',
  'paywall_viewed',
  'exit_survey',
]

const MAX_COMMENT = 500

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as {
      event?: string
      reason?: string
      comment?: string
    }

    const event = body.event as AnalyticsEvent
    if (!CLIENT_EVENTS.includes(event)) {
      return NextResponse.json({ error: 'Unknown event' }, { status: 400 })
    }

    // Whitelist the survey fields rather than storing whatever was posted.
    const props: Record<string, unknown> = {}
    if (typeof body.reason === 'string') props.reason = body.reason.slice(0, 80)
    if (typeof body.comment === 'string' && body.comment.trim()) {
      props.comment = body.comment.trim().slice(0, MAX_COMMENT)
    }

    await track(event, user.id, props)

    return NextResponse.json({ ok: true })
  } catch {
    // Instrumentation must never surface an error to the user.
    return NextResponse.json({ ok: false })
  }
}
