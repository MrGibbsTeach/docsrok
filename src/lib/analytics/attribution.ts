/**
 * Read the first-touch attribution cookie set by middleware. Whitelisted keys
 * only, so a tampered cookie cannot write arbitrary data into analytics.
 */
const ATTRIBUTION_KEYS = ['ref', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'gclid', 'referrer', 'landing', 'at']

export function readAttribution(raw: string | undefined): Record<string, string> {
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>
    const out: Record<string, string> = {}
    for (const key of ATTRIBUTION_KEYS) {
      const v = parsed[key]
      if (typeof v === 'string' && v) out[key] = v.slice(0, 120)
    }
    return out
  } catch {
    return {}
  }
}
