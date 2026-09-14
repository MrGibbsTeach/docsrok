import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY ?? 'missing')

// Sender — set RESEND_FROM_EMAIL in Vercel once docsrok.com is verified in Resend.
// (Previously defaulted to docsrok.com.au, a domain that was never set up in
// Resend — every send silently 403'd until this was caught on 2026-09-14.)
const FROM = process.env.RESEND_FROM_EMAIL ?? 'Docs Rok <noreply@docsrok.com>'

export interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

/**
 * Returns true only if Resend accepted the send. Callers that claim an
 * email_log row before sending (the anti-duplicate/anti-race pattern) should
 * release that claim on false, so a real failure can be retried rather than
 * silently recorded as sent forever.
 */
export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — email not sent:', subject)
    return false
  }

  try {
    const { error } = await resend.emails.send({ from: FROM, to, subject, html })
    if (error) {
      console.error('Resend error:', error)
      return false
    }
    return true
  } catch (err) {
    console.error('Failed to send email:', err)
    return false
  }
}
