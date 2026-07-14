'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const PLANS = [
  {
    id: 'core' as const,
    name: 'Core',
    price: '$79',
    description: 'For sole traders and small crews.',
    features: [
      '1 business profile',
      'SOPs for your key processes',
      'Quote/proposal templates',
      'Any Australian state',
      'Customised to your trade',
      'Print-to-PDF download',
      'Email support',
    ],
    highlight: false,
  },
  {
    id: 'plus' as const,
    name: 'Plus',
    price: '$129',
    description: 'For growing businesses.',
    features: [
      'Everything in Core',
      'Subcontractor welcome packs',
      'All business policy documents',
      'Regenerate documents any time',
      'Priority email support',
    ],
    highlight: true,
  },
  {
    id: 'team' as const,
    name: 'Team',
    price: '$199',
    description: 'For larger businesses and subcontractors.',
    features: [
      'Everything in Plus',
      'Up to 5 team members',
      'Multiple business profiles',
      'Dedicated support',
    ],
    highlight: false,
  },
]

export default function UpgradePage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleUpgrade(planId: 'core' | 'plus' | 'team') {
    setLoading(planId)
    setError(null)

    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      })

      const data = await res.json() as { url?: string; error?: string }

      if (!res.ok || !data.url) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        setLoading(null)
        return
      }

      window.location.href = data.url
    } catch {
      setError('Network error. Please try again.')
      setLoading(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Choose your plan</h1>
        <p className="text-gray-500">
          All plans include a 14-day free trial. No credit card required to start.
          <br />Cancel anytime — no lock-in contracts.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg text-center">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl border-2 p-8 flex flex-col ${
              plan.highlight
                ? 'border-orange-500 shadow-lg shadow-orange-100'
                : 'border-gray-200'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most popular
                </span>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900">{plan.name}</h2>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-500 text-sm">/month AUD</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
            </div>

            <ul className="space-y-2.5 mb-8 flex-1">
              {plan.features.map((f) => (
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

            <button
              onClick={() => handleUpgrade(plan.id)}
              disabled={loading !== null}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${
                plan.highlight
                  ? 'bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50'
                  : 'bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50'
              }`}
            >
              {loading === plan.id ? 'Redirecting…' : `Start ${plan.name} plan`}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center text-sm text-gray-400">
        <p>
          All prices in AUD · GST inclusive · Secure payment via Stripe
        </p>
        <p className="mt-1">
          Questions?{' '}
          <a href="mailto:hello@docsrok.com.au" className="text-orange-600 hover:underline">
            hello@docsrok.com.au
          </a>
        </p>
      </div>
    </div>
  )
}
