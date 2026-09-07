'use client'

import { useEffect, useState } from 'react'

const REASONS = [
  { key: 'too_expensive', label: 'Too expensive' },
  { key: 'not_convinced', label: "Not sure the documents are good enough" },
  { key: 'free_was_enough', label: 'I only needed the two free ones' },
  { key: 'later', label: 'Interested, just not right now' },
]

/**
 * The substitute for customer interviews.
 *
 * Nobody on this product does sales calls, so when someone reaches the pricing
 * page and does not buy, this one question is the only chance to find out why.
 * Deliberately optional, one click, and it never blocks the page.
 */
export default function ExitSurvey() {
  const [picked, setPicked] = useState<string | null>(null)
  const [comment, setComment] = useState('')
  const [sent, setSent] = useState(false)

  // Record that the paywall was actually seen, so the survey response rate and
  // the drop-off rate can be told apart later.
  useEffect(() => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'paywall_viewed' }),
    }).catch(() => {})
  }, [])

  function submit(reason: string, text: string) {
    setSent(true)
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'exit_survey', reason, comment: text }),
    }).catch(() => {})
  }

  if (sent) {
    return (
      <p className="text-center text-sm text-gray-400 mt-10">
        Thanks, that genuinely helps.
      </p>
    )
  }

  return (
    <div className="mt-12 border-t border-gray-100 pt-8">
      <p className="text-center text-sm text-gray-500 mb-4">
        Not buying today? Tell us why in one click.
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {REASONS.map((r) => (
          <button
            key={r.key}
            onClick={() => {
              if (r.key === 'later' || r.key === 'free_was_enough') {
                submit(r.key, '')
              } else {
                setPicked(r.key)
              }
            }}
            className={`text-sm px-3.5 py-2 rounded-lg border transition-colors ${
              picked === r.key
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {picked && (
        <div className="mt-4 max-w-md mx-auto flex flex-col gap-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            maxLength={500}
            placeholder="Anything more? (optional)"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-400"
          />
          <button
            onClick={() => submit(picked, comment)}
            className="self-center bg-gray-900 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Send
          </button>
        </div>
      )}
    </div>
  )
}
