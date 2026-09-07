/**
 * Canonical origin for the site.
 *
 * www is the live host (docsrok.com redirects to it), and canonical URLs must
 * match the host that actually serves the page or search engines treat the two
 * as duplicates and split whatever authority the site earns.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.docsrok.com'

export const SITE_NAME = 'Docs Rok'
export const SITE_TAGLINE = 'Business paperwork for Australian trades'
