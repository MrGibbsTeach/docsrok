import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email/resend'
import { welcomeEmail } from '@/lib/email/templates'
import { track } from '@/lib/analytics/track'

/**
 * Everything that should happen exactly once, the first time an account exists.
 *
 * This lives here rather than in the auth callback because the callback only
 * runs when Supabase sends a confirmation link. Email confirmation is currently
 * off, so signup goes straight to onboarding and the callback never fires —
 * which silently meant no welcome email and no top-of-funnel event.
 *
 * Idempotent: the send is claimed through the unique constraint on email_log,
 * so calling this from both the signup page and the auth callback is safe, and
 * so is a retry.
 */
export async function completeSignup(params: {
  userId: string
  email: string
  fullName: string | null
}): Promise<{ firstTime: boolean }> {
  const { userId, email, fullName } = params

  let supabase: ReturnType<typeof createAdminClient>
  try {
    supabase = createAdminClient()
  } catch (err) {
    console.error('completeSignup: Supabase admin client unavailable:', err)
    return { firstTime: false }
  }

  // Claim first. A duplicate key here means another path already did this.
  const { error: claimError } = await supabase
    .from('email_log')
    .insert({ user_id: userId, template: 'welcome' })

  if (claimError) return { firstTime: false }

  await track('signup_completed', userId)

  const mail = welcomeEmail({ name: fullName ?? '', email })
  await sendEmail({ to: email, subject: mail.subject, html: mail.html })

  return { firstTime: true }
}
