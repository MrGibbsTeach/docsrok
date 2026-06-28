import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import {
  buildWhsPolicyPrompt,
  buildSwmsPrompt,
  buildHazardRegisterPrompt,
  buildIncidentReportPrompt,
  buildEmergencyProceduresPrompt,
} from '@/lib/documents/prompts'
import { REGULATORY, type StateCode } from '@/lib/documents/regulatory'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

async function callClaude(prompt: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })
  const block = message.content[0]
  if (block.type !== 'text') throw new Error('Unexpected Claude response type')
  return block.text
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

    const reg = REGULATORY[business.state as StateCode]

    // ── Single document generation (Add SWMS / Regenerate) ──────────────
    if (activityKey || docType) {
      let task: Task

      if (activityKey) {
        // Check if this SWMS already exists — if so, mark it as not current before regenerating
        await supabase
          .from('documents')
          .update({ is_current: false })
          .eq('user_id', user.id)
          .eq('type', 'swms')
          .eq('activity_key', activityKey)

        task = {
          type: 'swms',
          title: `SWMS — ${activityKey.replace(/_/g, ' ')} — ${business.name}`,
          prompt: buildSwmsPrompt(business, activityKey),
          activityKey,
        }
      } else {
        // Regenerate a non-SWMS document type
        await supabase
          .from('documents')
          .update({ is_current: false })
          .eq('user_id', user.id)
          .eq('type', docType!)

        const prompts: Record<string, string> = {
          whs_policy: buildWhsPolicyPrompt(business),
          hazard_register: buildHazardRegisterPrompt(business),
          incident_report: buildIncidentReportPrompt(business),
          emergency_procedures: buildEmergencyProceduresPrompt(business),
        }

        if (!prompts[docType!]) {
          return NextResponse.json({ error: 'Unknown document type' }, { status: 400 })
        }

        task = {
          type: docType!,
          title: `${docType!.replace(/_/g, ' ')} — ${business.name}`,
          prompt: prompts[docType!],
        }
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
        regulatory_citation: reg.citation,
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

    // Build task list — all doc types + one SWMS per work activity
    const tasks: Task[] = [
      {
        type: 'whs_policy',
        title: `WHS Policy — ${business.name}`,
        prompt: buildWhsPolicyPrompt(business),
      },
      {
        type: 'hazard_register',
        title: `Hazard Register — ${business.name}`,
        prompt: buildHazardRegisterPrompt(business),
      },
      {
        type: 'incident_report',
        title: `Incident Report Form — ${business.name}`,
        prompt: buildIncidentReportPrompt(business),
      },
      {
        type: 'emergency_procedures',
        title: `Emergency Procedures — ${business.name}`,
        prompt: buildEmergencyProceduresPrompt(business),
      },
      ...(business.work_activities as string[]).map((activity) => ({
        type: 'swms',
        title: `SWMS — ${activity.replace(/_/g, ' ')} — ${business.name}`,
        prompt: buildSwmsPrompt(business, activity),
        activityKey: activity,
      })),
    ]

    // Generate all documents in parallel
    const results = await Promise.allSettled(
      tasks.map(async (task) => {
        const markdown = await callClaude(task.prompt)
        return { ...task, markdown }
      })
    )

    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.error(`Failed to generate ${tasks[i].type}:`, r.reason)
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
        regulatory_citation: reg.citation,
        is_current: true,
        version: 1,
      }))

    if (inserts.length === 0) {
      return NextResponse.json({ error: 'All documents failed to generate' }, { status: 500 })
    }

    const { error: insertError } = await supabase.from('documents').insert(inserts)

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      generated: inserts.length,
      failed: results.filter((r) => r.status === 'rejected').length,
    })
  } catch (err) {
    console.error('Generation error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
