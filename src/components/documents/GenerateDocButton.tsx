'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  activityKey?: string
  docType?: string
  label: string
  variant?: 'add' | 'regenerate' | 'retry' | 'unlock'
}

export default function GenerateDocButton({
  activityKey,
  docType,
  label,
  variant = 'add',
}: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()
  // React state updates aren't synchronous, so a fast double-click can fire
  // handleGenerate twice before the "Generating…" state re-renders and swaps
  // the button out. That's how a single click on "Generate remaining
  // documents" turned into two full (paid, Anthropic-billed) generation runs
  // in testing. A ref-based lock closes that gap immediately, on the same tick.
  const inFlight = useRef(false)

  async function handleGenerate() {
    if (inFlight.current) return
    inFlight.current = true
    setStatus('loading')
    setErrorMessage(null)
    try {
      const res = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityKey, docType }),
      })

      let data: { success?: boolean; error?: string; message?: string } = {}
      try {
        data = (await res.json()) as typeof data
      } catch {
        // Non-JSON response (gateway timeout, HTML error page).
      }

      // `message: 'Documents already generated'` is a success from the user's
      // point of view, so treat any 2xx as success rather than requiring the
      // success flag specifically.
      if (res.ok && !data.error) {
        setStatus('done')
        router.refresh()
        return
      }

      const message =
        data.error ??
        (res.status === 504
          ? 'Generation timed out. Please try again.'
          : `Generation failed (${res.status}).`)
      console.error('Generate error:', message)
      setErrorMessage(message)
      setStatus('error')
    } catch (err) {
      console.error(err)
      setErrorMessage(
        err instanceof Error ? err.message : 'Could not reach the server. Check your connection.'
      )
      setStatus('error')
    } finally {
      inFlight.current = false
    }
  }

  if (status === 'loading') {
    return <span className="text-xs text-gray-400 italic">Generating…</span>
  }

  if (status === 'error') {
    return (
      <span className="inline-flex flex-col items-center gap-1">
        <button
          onClick={handleGenerate}
          className={
            variant === 'retry'
              ? 'bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-orange-700 transition-colors'
              : 'text-xs text-red-600 underline'
          }
        >
          {variant === 'retry' ? 'Try again' : 'Failed — retry'}
        </button>
        {errorMessage && (
          <span className="text-xs text-red-600 max-w-xs break-words">{errorMessage}</span>
        )}
      </span>
    )
  }

  if (variant === 'retry') {
    return (
      <button
        onClick={handleGenerate}
        className="bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-orange-700 transition-colors"
      >
        Try generating again
      </button>
    )
  }

  if (variant === 'unlock') {
    return (
      <button
        onClick={handleGenerate}
        className="shrink-0 bg-orange-600 text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap"
      >
        Generate remaining documents →
      </button>
    )
  }

  if (variant === 'regenerate') {
    return (
      <button
        onClick={handleGenerate}
        className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
        title={`Regenerate ${label}`}
      >
        Regenerate
      </button>
    )
  }

  return (
    <button
      onClick={handleGenerate}
      className="shrink-0 text-sm border border-orange-300 text-orange-700 px-4 py-1.5 rounded-md hover:bg-orange-50 transition-colors font-medium"
    >
      + Generate
    </button>
  )
}
