import type { Metadata } from 'next'
import Link from 'next/link'
import { RESOURCE_PAGES } from '@/lib/resource-pages'

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
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-orange-600 font-bold text-lg tracking-tight">
            Docs Rok
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              Start free
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-16 pb-12 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
            Business document templates, by trade and state
          </h1>
          <p className="text-lg text-gray-500">
            SOPs, quote templates, subcontractor packs, and business policies, generated for your
            specific trade and Australian state. Two documents free, full set is a one-time $149.
          </p>
        </div>
      </section>

      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-10">
          {TRADE_ORDER.map((trade) => {
            const pages = RESOURCE_PAGES.filter((p) => p.tradeSearchTerm === trade)
            return (
              <div key={trade}>
                <h2 className="text-xl font-bold text-gray-900 mb-4">{TRADE_TITLES[trade]}</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {pages.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/resources/${p.slug}`}
                      className="border border-gray-100 rounded-xl p-5 hover:border-orange-200 hover:bg-orange-50 transition-colors"
                    >
                      <div className="font-semibold text-gray-900">{p.stateLabel}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        Templates for {p.tradeSearchTerm}s in {p.state}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start justify-between gap-6">
          <div>
            <div className="text-orange-500 font-bold text-lg mb-1">Docs Rok</div>
            <div className="text-xs">Business paperwork for Australian trades</div>
          </div>
          <div className="flex gap-8 text-sm">
            <div>
              <div className="text-gray-300 font-medium mb-2">Legal</div>
              <div className="space-y-1 text-xs">
                <div><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></div>
                <div><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto border-t border-gray-800 mt-8 pt-6 text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} Docs Rok.</p>
        </div>
      </footer>
    </div>
  )
}
