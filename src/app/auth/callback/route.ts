import { createClient } from '@/lib/supabase/server'
import { completeSignup } from '@/lib/auth/welcome'
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
      // Safe to call unconditionally: completeSignup claims the send through a
      // unique constraint, so if the signup page already did this, it no-ops.
      if (data.user.email) {
        await completeSignup({
          userId: data.user.id,
          email: data.user.email,
          fullName: (data.user.user_metadata?.full_name as string | undefined) ?? null,
        })
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
