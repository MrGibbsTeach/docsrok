import { createHmac, timingSafeEqual } from 'crypto'

/**
 * One-click unsubscribe links have to work with nobody logged in — the person
 * is reading an email, not sitting in a session — so the link itself has to
 * prove which account it belongs to. An HMAC keyed on a server secret means
 * nobody can forge a link for someone else's account, and there's nothing to
 * store, rotate, or expire.
 *
 * Falls back to CRON_SECRET so this works the moment it ships, without a new
 * env var being a blocker. Set a dedicated UNSUBSCRIBE_SECRET in Vercel when
 * convenient — it costs nothing and narrows what CRON_SECRET is trusted for.
 */
function secret(): string {
  return process.env.UNSUBSCRIBE_SECRET ?? process.env.CRON_SECRET ?? 'insecure-dev-secret'
}

export function signUnsubscribeToken(userId: string): string {
  return createHmac('sha256', secret()).update(userId).digest('hex')
}

export function verifyUnsubscribeToken(userId: string, token: string): boolean {
  const expected = signUnsubscribeToken(userId)
  const a = Buffer.from(expected)
  const b = Buffer.from(token)
  // Different lengths would throw inside timingSafeEqual rather than just
  // returning false, so that case is handled before it gets there.
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

/**
 * The link every outbound marketing/lifecycle email should carry in its
 * footer. Transactional mail (a receipt, a password reset) doesn't need one.
 */
export function unsubscribeLink(userId: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://docsrok.com'
  const token = signUnsubscribeToken(userId)
  return `${appUrl}/api/unsubscribe?u=${userId}&t=${token}`
}
