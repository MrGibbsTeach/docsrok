import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import {
  buildSopPrompt,
  buildSubcontractorPackPrompt,
  buildQuoteTemplatePrompt,
  buildBusinessPolicyPrompt,
} from '@/lib/documents/prompts'
import { PROCESS_TYPES, POLICY_TYPES } from '@/lib/types'

// The full starter suite is ~24 documents. Give the function room to finish;
// Vercel silently caps this to the plan maximum if it is lower.
export const maxDuration = 300

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? 'missing',
})

const MAX_ATTEMPTS = 4
// Firing all ~24 prompts at once reliably triggered 529 Overloaded responses.
// A modest cap plus backoff is far more likely to complete than a burst.
const CONCURRENCY = 8

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function isRetryable(err: unknown): boolean {
  const status = (err as { status?: number })?.status
  if (typeof status === 'number') {
    // 429 rate limit, 529 overloaded, and any 5xx are worth another go.
    return status === 408 || status === 409 || status === 429 || status >= 500
  }
  const name = (err as { name?: string })?.name
  return name === 'APIConnectionError' || name === 'APIConnectionTimeoutError'
}

async function callClaude(prompt: string): Promise<string> {
  let lastErr: unknown
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const message = await anthropic.messages.create({
        model: 'claude-opus-4-5',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      })
      const block = message.content[0]
      if (block.type !== 'text') throw new Error('Unexpected Claude response type')
      return block.text
    } catch (err) {
      lastErr = err
      if (attempt === MAX_ATTEMPTS || !isRetryable(err)) throw err
      const backoff = 1000 * 2 ** (attempt - 1) + Math.floor(Math.random() * 400)
      console.warn(
        `Claude call failed (attempt ${attempt}/${MAX_ATTEMPTS}), retrying in ${backoff}ms`,
        (err as { status?: number })?.status ?? err
      )
      await sleep(backoff)
    }
  }
  throw lastErr
}

/** Promise.allSettled semantics, but with a cap on how many run at once. */
async function settleWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<PromiseSettledResult<R>[]> {
  const results = new Array<PromiseSettledResult<R>>(items.length)
  let cursor = 0

  async function worker(): Promise<void> {
    for (;;) {
      const i = cursor++
      if (i >= items.length) return
      try {
        results[i] = { status: 'fulfilled', value: await fn(items[i], i) }
      } catch (reason) {
        results[i] = { status: 'rejected', reason }
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker())
  )
  return results
}

type Task = {
  type: string
  title: string
  prompt: string
  activityKey?: string
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse optional body — supports targeted single-doc generation
    // activityKey doubles as: SOP process key, quote job-type key, or policy type key,
    // depending on docType. subcontractor_pack has no sub-key.
    let body: { activityKey?: string; docType?: string } = {}
    try {
      body = await request.json()
    } catch {
      // No body — full initial generation
    }

    const { activityKey, docType } = body

    // Fetch the business for this user
    const { data: business, error: bizError } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (bizError || !business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // ── Single document generation (Add / Regenerate from dashboard) ────
    if (docType) {
      let task: Task

      if (docType === 'sop') {
        if (!activityKey) {
          return NextResponse.json({ error: 'activityKey (process type) required for sop' }, { status: 400 })
        }
        await supabase
          .from('documents')
          .update({ is_current: false })
          .eq('user_id', user.id)
          .eq('type', 'sop')
          .eq('activity_key', activityKey)

        task = {
          type: 'sop',
          title: `SOP — ${activityKey.replace(/_/g, ' ')} — ${business.name}`,
          prompt: buildSopPrompt(business, activityKey),
          activityKey,
        }
      } else if (docType === 'quote_template') {
        if (!activityKey) {
          return NextResponse.json({ error: 'activityKey (job type) required for quote_template' }, { status: 400 })
        }
        await supabase
          .from('documents')
          .update({ is_current: false })
          .eq('user_id', user.id)
          .eq('type', 'quote_template')
          .eq('activity_key', activityKey)

        task = {
          type: 'quote_template',
          title: `Quote Template — ${activityKey.replace(/_/g, ' ')} — ${business.name}`,
          prompt: buildQuoteTemplatePrompt(business, activityKey),
          activityKey,
        }
      } else if (docType === 'business_policy') {
        if (!activityKey) {
          return NextResponse.json({ error: 'activityKey (policy type) required for business_policy' }, { status: 400 })
        }
        await supabase
          .from('documents')
          .update({ is_current: false })
          .eq('user_id', user.id)
          .eq('type', 'business_policy')
          .eq('activity_key', activityKey)

        task = {
          type: 'business_policy',
          title: `${activityKey.replace(/_/g, ' ')} — ${business.name}`,
          prompt: buildBusinessPolicyPrompt(business, activityKey),
          activityKey,
        }
      } else if (docType === 'subcontractor_pack') {
        await supabase
          .from('documents')
          .update({ is_current: false })
          .eq('user_id', user.id)
          .eq('type', 'subcontractor_pack')

        task = {
          type: 'subcontractor_pack',
          title: `Subcontractor & New-Hire Welcome Pack — ${business.name}`,
          prompt: buildSubcontractorPackPrompt(business),
        }
      } else {
        return NextResponse.json({ error: 'Unknown document type' }, { status: 400 })
      }

      const markdown = await callClaude(task.prompt)

      const { error: insertError } = await supabase.from('documents').insert({
        business_id: business.id,
        user_id: user.id,
        type: task.type,
        title: task.title,
        content: { markdown, generated_at: new Date().toISOString() },
        activity_key: task.activityKey ?? null,
        state: business.state,
        regulatory_citation: '',
        is_current: true,
        version: 1,
      })

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, generated: 1, failed: 0 })
    }

    // ── Full initial generation ───────────────────────────────────────────
    // Avoid re-generating if docs already exist
    const { data: existing } = await supabase
      .from('documents')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_current', true)
      .limit(1)

    if (existing && existing.length > 0) {
      return NextResponse.json({ message: 'Documents already generated' })
    }

    // Build task list — the full starter suite:
    // 8 core-process SOPs + 1 subcontractor pack + 1 quote template per selected
    // service + 5 business policies. Every new business gets the same starter set;
    // services_offered (stored as work_activities) personalises quote templates.
    const servicesOffered = (business.work_activities as string[]).length > 0
      ? (business.work_activities as string[])
      : ['general_services']

    const tasks: Task[] = [
      ...PROCESS_TYPES.map(({ key }) => ({
        type: 'sop',
        title: `SOP — ${key.replace(/_/g, ' ')} — ${business.name}`,
        prompt: buildSopPrompt(business, key),
        activityKey: key,
      })),
      {
        type: 'subcontractor_pack',
        title: `Subcontractor & New-Hire Welcome Pack — ${business.name}`,
        prompt: buildSubcontractorPackPrompt(business),
      },
      ...servicesOffered.map((jobType) => ({
        type: 'quote_template',
        title: `Quote Template — ${jobType.replace(/_/g, ' ')} — ${business.name}`,
        prompt: buildQuoteTemplatePrompt(business, jobType),
        activityKey: jobType,
      })),
      ...POLICY_TYPES.map(({ key }) => ({
        type: 'business_policy',
        title: `${key.replace(/_/g, ' ')} — ${business.name}`,
        prompt: buildBusinessPolicyPrompt(business, key),
        activityKey: key,
      })),
    ]

    // Generate all documents, capped concurrency with retry/backoff.
    const results = await settleWithConcurrency(tasks, CONCURRENCY, async (task) => {
      const markdown = await callClaude(task.prompt)
      return { ...task, markdown }
    })

    const failures: string[] = []
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        const label = `${tasks[i].type}${tasks[i].activityKey ? `/${tasks[i].activityKey}` : ''}`
        failures.push(label)
        console.error(`Failed to generate ${label}:`, r.reason)
      }
    })

    const inserts = results
      .filter(
        (r): r is PromiseFulfilledResult<Task & { markdown: string }> =>
          r.status === 'fulfilled'
      )
      .map(({ value }) => ({
        business_id: business.id,
        user_id: user.id,
        type: value.type,
        title: value.title,
        content: {
          markdown: value.markdown,
          generated_at: new Date().toISOString(),
        },
        activity_key: value.activityKey ?? null,
        state: business.state,
        regulatory_citation: '',
        is_current: true,
        version: 1,
      }))

    if (inserts.length === 0) {
      const firstReason = results.find((r) => r.status === 'rejected') as
        | PromiseRejectedResult
        | undefined
      const detail =
        firstReason?.reason instanceof Error
          ? firstReason.reason.message
          : String(firstReason?.reason ?? 'unknown error')
      console.error('All documents failed to generate:', detail)
      return NextResponse.json(
        { error: `All documents failed to generate. First error: ${detail}` },
        { status: 500 }
      )
    }

    const { error: insertError } = await supabase.from('documents').insert(inserts)

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      generated: inserts.length,
      failed: failures.length,
      failedDocuments: failures,
    })
  } catch (err) {
    console.error('Generation error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
