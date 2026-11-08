'use client'

import { useState } from 'react'
import ExitSurvey from '@/components/ExitSurvey'

// PIVOT (7 Sept 2026): moved from 3 monthly subscription tiers to a single
// one-time $149 AUD purchase that unlocks the full document set. The free
// plan (2 documents) has no time limit, so there's no urgency messaging here
// — just a clear "here's what you get for $149, once" offer.
const INCLUDED = [
  'All 8 core-process SOPs',
  'Quote/proposal templates for every service you offer',
  'Subcontractor & new-hire welcome pack',
  'All 5 business policy documents',
  'Customised to your trade and state',
  'Print-to-PDF download',
  'Regenerate any document, any time',
  'Yours to keep — no subscription, no lock-in',
]

export default function UpgradeClient({
  businessName,
  locked,
  generatedCount,
}: {
  businessName: string | null
  locked: { group: string; items: string[] }[]
  generatedCount: number
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUpgrade() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/stripe/create-checkout', { method: 'POST' })
      const data = (await res.json()) as { url?: string; error?: string }

      if (!res.ok || !data.url) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      window.location.href = data.url
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Unlock your full document set</h1>
        <p className="text-gray-500">
          {businessName ? `Built around ${businessName}. ` : ''}One payment. No subscription, no monthly fee, no lock-in.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg text-center">
          {error}
        </div>
      )}

      <div className="rounded-2xl border-2 border-orange-500 shadow-lg shadow-orange-100 p-8">
        <div className="mb-6 text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl font-bold text-gray-900">$149</span>
            <span className="text-gray-500 text-sm">AUD, one-time</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Full Access — your complete document set</p>
        </div>

        <ul className="space-y-2.5 mb-8">
          {INCLUDED.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
              <svg
                className="w-4 h-4 text-orange-500 mt-0.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </li>
          ))}
        </ul>

        {locked.length > 0 && (
          <div className="mb-8 rounded-xl bg-gray-50 border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-900 mb-1">
              You have {generatedCount} of your documents. Here is what $149 adds:
            </p>
            <div className="mt-3 space-y-3">
              {locked.map((g) => (
                <div key={g.group}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                    {g.group} ({g.items.length})
                  </p>
                  <ul className="text-sm text-gray-700 space-y-0.5">
                    {g.items.map((i) => (
                      <li key={i}>🔒 {i}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-sm bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Redirecting…' : 'Unlock for $149 →'}
        </button>
      </div>

      <ExitSurvey />

      <div className="mt-8 text-center text-sm text-gray-400">
        <p>Price in AUD · GST inclusive · Secure payment via Stripe</p>
        <p className="mt-1">
          Questions?{' '}
          <a href="mailto:support@docsrok.com" className="text-orange-600 hover:underline">
            support@docsrok.com
          </a>
        </p>
      </div>
    </div>
  )
}
