'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  activityKey?: string
  docType?: string
  label: string
  variant?: 'add' | 'regenerate'
}

export default function GenerateDocButton({ activityKey, docType, label, variant = 'add' }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const router = useRouter()

  async function handleGenerate() {
    setStatus('loading')
    try {
      const res = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityKey, docType }),
      })
      const data = await res.json() as { success?: boolean; error?: string }
      if (data.success) {
        setStatus('done')
        router.refresh()
      } else {
        console.error('Generate error:', data.error)
        setStatus('error')
      }
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  if (status === 'loading') {
    return (
      <span className="text-xs text-gray-400 italic">Generating…</span>
    )
  }

  if (status === 'error') {
    return (
      <button
        onClick={handleGenerate}
        className="text-xs text-red-600 underline"
      >
        Failed — retry
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
