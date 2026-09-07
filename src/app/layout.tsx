import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SITE_NAME, SITE_URL } from '@/lib/site'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  // metadataBase makes every relative canonical and OG URL resolve against the
  // live host. Without it Next emits relative URLs that crawlers and social
  // scrapers cannot follow.
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Docs Rok — Business Paperwork for Australian Trades',
    template: '%s — Docs Rok',
  },
  description:
    'Generate SOPs, subcontractor packs, quote templates, and business policies for your trade business. Customised to your business in minutes.',
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_AU',
    url: '/',
    title: 'Docs Rok — Business Paperwork for Australian Trades',
    description:
      'SOPs, quote templates, subcontractor packs and business policies, customised to your trade and your state. Two documents free.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Docs Rok — Business Paperwork for Australian Trades',
    description:
      'SOPs, quote templates, subcontractor packs and business policies, customised to your trade and your state. Two documents free.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
