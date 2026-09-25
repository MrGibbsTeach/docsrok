import type { Metadata } from 'next'
import { Barlow, Barlow_Semi_Condensed } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SITE_NAME, SITE_URL } from '@/lib/site'
import './globals.css'

// Barlow + Barlow Semi Condensed: one type family in two widths, rather than
// the default Next.js/Inter pairing every generic template ships with. Barlow
// was drawn with the condensed lettering of highway signage and license
// plates as a reference point, which reads as sturdy/utilitarian in a way
// that suits a trades product better than a neutral tech-SaaS grotesk.
const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-barlow',
  display: 'swap',
})

const barlowCondensed = Barlow_Semi_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})

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
    <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body className="font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
