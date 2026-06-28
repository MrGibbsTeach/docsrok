import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY ?? 'missing')

// Sender — update FROM_EMAIL in .env.local once docsrok.com.au is set up in Resend
const FROM = process.env.RESEND_FROM_EMAIL ?? 'Docs Rok <noreply@docsrok.com.au>'

export interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — email not sent:', subject)
    return
  }

  try {
    const { error } = await resend.emails.send({ from: FROM, to, subject, html })
    if (error) console.error('Resend error:', error)
  } catch (err) {
    console.error('Failed to send email:', err)
  }
}
