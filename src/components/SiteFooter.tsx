import Link from 'next/link'

/**
 * Shared site footer — see SiteNav.tsx for why this was pulled out of three
 * separate copy-pasted blocks.
 */
export function SiteFooter() {
  return (
    <footer className="bg-ink px-4 py-14 text-paper-dim sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-10 sm:flex-row">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-brand font-display text-xs font-bold text-white">
              DR
            </span>
            <span className="font-display text-lg font-bold text-white">Docs Rok</span>
          </div>
          <p className="mt-3 max-w-[22ch] text-sm text-paper-dim/70">
            Business paperwork for Australian trades. Any trade, any state.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:flex sm:gap-16">
          <div>
            <div className="font-display text-xs font-bold uppercase tracking-wider text-white/60">
              Product
            </div>
            <div className="mt-3 space-y-2 text-sm">
              <div><Link href="/#how-it-works" className="transition-colors hover:text-white">How it works</Link></div>
              <div><Link href="/resources" className="transition-colors hover:text-white">Resources</Link></div>
              <div><Link href="/#pricing" className="transition-colors hover:text-white">Pricing</Link></div>
              <div><Link href="/signup" className="transition-colors hover:text-white">Start free</Link></div>
            </div>
          </div>
          <div>
            <div className="font-display text-xs font-bold uppercase tracking-wider text-white/60">
              Account
            </div>
            <div className="mt-3 space-y-2 text-sm">
              <div><Link href="/login" className="transition-colors hover:text-white">Sign in</Link></div>
              <div><Link href="/dashboard" className="transition-colors hover:text-white">Dashboard</Link></div>
            </div>
          </div>
          <div>
            <div className="font-display text-xs font-bold uppercase tracking-wider text-white/60">
              Legal
            </div>
            <div className="mt-3 space-y-2 text-sm">
              <div><Link href="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link></div>
              <div><Link href="/terms" className="transition-colors hover:text-white">Terms of Service</Link></div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-xs text-paper-dim/50">
        <p>
          &copy; {new Date().getFullYear()} Docs Rok. Documents are templates and starting points
          for your business — review and adapt them before use. Not legal, financial, or
          professional advice.
        </p>
      </div>
    </footer>
  )
}
