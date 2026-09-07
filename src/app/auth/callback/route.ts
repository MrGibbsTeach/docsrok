import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email/resend'
import { welcomeEmail } from '@/lib/email/templates'
import { NextResponse } from 'next/server'

// Handles the OAuth / magic link / email confirmation callback from Supabase
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/onboarding'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Send welcome email if this looks like a new signup (no existing business)
      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', data.user.id)
        .single()

      if (!business) {
        // New user — welcome email is unconditional now (no trial deadline to check).
        const fullName =
          (data.user.user_metadata?.full_name as string | undefined) ?? ''

        const email = welcomeEmail({
          name: fullName,
          email: data.user.email!,
        })

        await sendEmail({
          to: data.user.email!,
          subject: email.subject,
          html: email.html,
        })
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
