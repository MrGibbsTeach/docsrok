import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { RESOURCE_PAGES } from '@/lib/resource-pages'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/signup`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/resources`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    ...RESOURCE_PAGES.map((p) => ({
      url: `${SITE_URL}/resources/${p.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
