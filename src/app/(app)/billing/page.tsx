'use client'

import { useState } from 'react'

export default function BillingPortalRedirect() {
  const [loading, setLoading] = useState(false)

  async function handlePortal() {
    setLoading(true)
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const data = await res.json() as { url?: string; error?: string }
    if (data.url) {
      window.location.href = data.url
    } else {
      alert(data.error ?? 'Could not open billing portal.')
      setLoading(false)
    }
  }

  // Auto-redirect on mount
  if (typeof window !== 'undefined') {
    handlePortal()
  }

  return (
    <div className="flex items-center justify-center py-20">
      <p className="text-gray-500 text-sm">Redirecting to billing portal…</p>
    </div>
  )
}
