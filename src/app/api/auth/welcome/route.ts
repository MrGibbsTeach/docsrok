import { createClient } from '@/lib/supabase/server'
import { completeSignup } from '@/lib/auth/welcome'
import { NextResponse } from 'next/server'

/**
 * Called by the signup page once an account exists. Takes the user from the
 * session rather than the request body, so it cannot be used to trigger mail
 * to anyone else.
 */
export async function POST() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { firstTime } = await completeSignup({
      userId: user.id,
      email: user.email,
      fullName: (user.user_metadata?.full_name as string | undefined) ?? null,
    })

    return NextResponse.json({ ok: true, firstTime })
  } catch (err) {
    console.error('welcome route error:', err)
    // Never block signup on this.
    return NextResponse.json({ ok: false })
  }
}
