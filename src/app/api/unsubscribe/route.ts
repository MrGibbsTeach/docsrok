import { createAdminClient } from '@/lib/supabase/admin'
import { verifyUnsubscribeToken } from '@/lib/email/unsubscribe'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * One-click unsubscribe. No login, no confirmation step, no "are you sure" —
 * clicking the link in the email is the confirmation. Renders a small
 * self-contained page rather than redirecting into the app, since someone
 * unsubscribing from marketing email is not a session we can assume exists.
 */
function page(message: string) {
  return new NextResponse(
    `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Docs Rok</title>
  <style>
    body { margin: 0; padding: 40px 20px; background: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .card { max-width: 480px; margin: 40px auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px; text-align: center; color: #374151; }
    .card h1 { color: #ea580c; font-size: 20px; margin: 0 0 12px; }
    .card p { font-size: 15px; line-height: 1.6; margin: 0; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Docs Rok</h1>
    <p>${message}</p>
  </div>
</body>
</html>`,
    { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } }
  )
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('u')
  const token = searchParams.get('t')

  if (!userId || !token || !verifyUnsubscribeToken(userId, token)) {
    return page(
      "That unsubscribe link isn't valid. If you'd still like to stop hearing from us, reply to any of our emails and we'll take care of it by hand."
    )
  }

  try {
    const supabase = createAdminClient()
    const { error } = await supabase
      .from('profiles')
      .update({ marketing_opt_out: true, marketing_opt_out_at: new Date().toISOString() })
      .eq('id', userId)

    if (error) {
      console.error('unsubscribe: update failed:', error.message)
      return page("Something went wrong on our end. Reply to any of our emails and we'll unsubscribe you by hand.")
    }
  } catch (err) {
    console.error('unsubscribe: threw:', err)
    return page("Something went wrong on our end. Reply to any of our emails and we'll unsubscribe you by hand.")
  }

  return page(
    "You're unsubscribed. We won't email you again unless you buy something or sign up again. Your two free documents are still sitting in your account whenever you want them."
  )
}
