// ── Shared styles ─────────────────────────────────────────────

const base = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { margin: 0; padding: 0; background: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .wrapper { max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; }
    .header { background: #ea580c; padding: 28px 32px; }
    .header h1 { margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; }
    .body { padding: 32px; color: #374151; font-size: 15px; line-height: 1.6; }
    .body p { margin: 0 0 16px; }
    .cta { display: inline-block; margin: 8px 0 24px; padding: 13px 28px; background: #ea580c; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; }
    .list { padding-left: 20px; margin: 0 0 16px; }
    .list li { margin-bottom: 6px; }
    .divider { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
    .footer { padding: 20px 32px; background: #f9fafb; color: #9ca3af; font-size: 12px; line-height: 1.5; }
    .footer a { color: #9ca3af; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header"><h1>Docs Rok</h1></div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>Docs Rok — business paperwork for Australian trade businesses.</p>
      <p>If you didn't create an account, you can safely ignore this email.</p>
    </div>
  </div>
</body>
</html>
`

// ── Welcome email ─────────────────────────────────────────────

// PIVOT (7 Sept 2026): no more timed trial — 2 free documents, permanently,
// then a $149 one-time purchase for the rest. trialEndsAt param removed.
export function welcomeEmail(params: {
  name: string
  email: string
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://docsrok.com.au'

  return {
    subject: 'Your Docs Rok documents are ready',
    html: base(`
      <p>Hi ${params.name || 'there'},</p>
      <p>Welcome to Docs Rok. Your first two documents are ready to view, free — no credit card required.</p>
      <p>We've generated one Standard Operating Procedure and one quote/proposal template,
      customised to your business:</p>
      <a href="${appUrl}/dashboard" class="cta">View my documents →</a>
      <p>Want the full set — the remaining SOPs, subcontractor pack, and every business policy
      document? Unlock everything for a one-time $149, no subscription.</p>
      <hr class="divider" />
      <p style="font-size:13px; color:#6b7280;">
        These are business templates and starting points — review and adapt each one to your
        business before use. Not legal, financial, or professional advice.
      </p>
    `),
  }
}

// ── Trial ending soon (send at day 11 or 12) ──────────────────

export function trialEndingEmail(params: {
  name: string
  daysLeft: number
  trialEndsAt: string
}) {
  const trialDate = new Date(params.trialEndsAt).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://docsrok.com.au'

  return {
    subject: `Your Docs Rok trial ends in ${params.daysLeft} days`,
    html: base(`
      <p>Hi ${params.name || 'there'},</p>
      <p>Your free trial ends on <strong>${trialDate}</strong> — that's ${params.daysLeft} days away.</p>
      <p>To keep accessing your business documents, upgrade to a paid plan:</p>
      <ul class="list">
        <li><strong>Core — $79/month</strong> — SOPs, quote templates, any Australian state</li>
        <li><strong>Plus — $129/month</strong> — Core + subcontractor packs + all policies</li>
        <li><strong>Team — $199/month</strong> — Plus + up to 5 team members</li>
      </ul>
      <a href="${appUrl}/upgrade" class="cta">Upgrade now →</a>
      <p>If you have any questions, reply to this email — we're happy to help.</p>
    `),
  }
}

// ── Trial expired ─────────────────────────────────────────────

export function trialExpiredEmail(params: { name: string }) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://docsrok.com.au'

  return {
    subject: 'Your Docs Rok trial has ended',
    html: base(`
      <p>Hi ${params.name || 'there'},</p>
      <p>Your 14-day trial has ended. Your documents are still saved — upgrade to regain access.</p>
      <a href="${appUrl}/upgrade" class="cta">Choose a plan →</a>
      <p>Plans start at $79/month with no lock-in contracts. Cancel anytime.</p>
    `),
  }
}

// ── Payment confirmed ─────────────────────────────────────────

export function paymentConfirmedEmail(params: {
  name: string
  plan: string
  amount: string
  nextBillingDate: string
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://docsrok.com.au'

  return {
    subject: `Docs Rok — payment confirmed (${params.plan} plan)`,
    html: base(`
      <p>Hi ${params.name || 'there'},</p>
      <p>Payment confirmed. You're now on the <strong>${params.plan}</strong> plan.</p>
      <table style="border-collapse:collapse; width:100%; margin-bottom:16px;">
        <tr>
          <td style="padding:8px 0; color:#6b7280; width:40%;">Plan</td>
          <td style="padding:8px 0; font-weight:600;">${params.plan}</td>
        </tr>
        <tr>
          <td style="padding:8px 0; color:#6b7280;">Amount</td>
          <td style="padding:8px 0; font-weight:600;">${params.amount}/month</td>
        </tr>
        <tr>
          <td style="padding:8px 0; color:#6b7280;">Next billing date</td>
          <td style="padding:8px 0;">${params.nextBillingDate}</td>
        </tr>
      </table>
      <a href="${appUrl}/dashboard" class="cta">Go to dashboard →</a>
      <p style="font-size:13px; color:#6b7280;">
        Manage your subscription, download invoices, or cancel anytime from your
        <a href="${appUrl}/api/stripe/portal" style="color:#ea580c;">billing portal</a>.
      </p>
    `),
  }
}
