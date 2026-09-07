import { createAdminClient } from '@/lib/supabase/admin'

/**
 * The five funnel steps, plus the exit survey.
 *
 * There are no sales calls and no customer interviews on this product, so these
 * events are the only feedback loop that exists. Each one answers a specific
 * question: where people stop, and why.
 */
export type AnalyticsEvent =
  | 'signup_completed'
  | 'onboarding_completed'
  | 'generation_completed'
  | 'generation_failed'
  | 'paywall_viewed'
  | 'checkout_started'
  | 'purchase_completed'
  | 'exit_survey'

/**
 * Record one funnel event. Deliberately fire-and-forget: instrumentation must
 * never be able to break the thing it is measuring, so every failure is logged
 * and swallowed rather than thrown.
 *
 * Uses the service-role client because analytics_events has RLS on with no
 * policies — an end user's session cannot read or write it at all.
 */
export async function track(
  event: AnalyticsEvent,
  userId: string | null,
  props: Record<string, unknown> = {}
): Promise<void> {
  try {
    const supabase = createAdminClient()
    const { error } = await supabase.from('analytics_events').insert({
      user_id: userId,
      event,
      props,
    })
    if (error) console.error(`track(${event}) failed:`, error.message)
  } catch (err) {
    console.error(`track(${event}) threw:`, err)
  }
}
