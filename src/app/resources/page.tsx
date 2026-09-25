import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { RESOURCE_PAGES } from '@/lib/resource-pages'
import { SiteNav } from '@/components/SiteNav'
import { SiteFooter } from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Business Document Templates by Trade & State',
  description:
    'SOPs, quote templates, subcontractor packs, and business policy documents for Australian trade businesses, by trade and state. Two documents free, full set is a one-time $149.',
  alternates: { canonical: '/resources' },
}

const TRADE_ORDER = ['electrician', 'plumber', 'builder']
const TRADE_TITLES: Record<string, string> = {
  electrician: 'Electricians',
  plumber: 'Plumbers',
  builder: 'Builders',
}

export default function ResourcesIndexPage() {
  return (
    <div className="min-h-screen bg-paper">
      <SiteNav />

      <section className="border-b border-line px-4 py-16 text-center sm:px-6">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Business document templates, by trade and state
          </h1>
          <p className="mt-6 text-lg text-muted">
            SOPs, quote templates, subcontractor packs, and business policies, generated for your
            specific trade and Australian state. Two documents free, full set is a one-time $149.
          </p>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-14">
          {TRADE_ORDER.map((trade) => {
            const pages = RESOURCE_PAGES.filter((p) => p.tradeSearchTerm === trade)
            return (
              <div key={trade}>
                <h2 className="border-l-2 border-brand pl-3 font-display text-xl font-bold text-ink">
                  {TRADE_TITLES[trade]}
                </h2>
                <div className="mt-5 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
                  {pages.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/resources/${p.slug}`}
                      className="group flex flex-col justify-between bg-paper p-5 transition-colors hover:bg-brand-light"
                    >
                      <div>
                        <div className="font-display font-bold text-ink">{p.stateLabel}</div>
                        <div className="mt-1 text-sm text-muted">
                          Templates for {p.tradeSearchTerm}s in {p.state}
                        </div>
                      </div>
                      <ArrowRight className="mt-4 h-4 w-4 text-brand opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
