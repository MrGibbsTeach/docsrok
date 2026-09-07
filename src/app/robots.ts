import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

/**
 * Everything behind a login is disallowed: those pages are per-account, have no
 * search value, and a crawler hitting /api routes wastes crawl budget on things
 * that return 401s.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard', '/onboarding', '/upgrade', '/documents/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
