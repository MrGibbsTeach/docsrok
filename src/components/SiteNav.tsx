import Link from 'next/link'

/**
 * Shared site header. Previously copy-pasted with small drifts across
 * page.tsx, resources/page.tsx and resources/[slug]/page.tsx — one component
 * now, so a nav change (or this redesign) can't land on two of three pages.
 */
export function SiteNav() {
  return (
    <nav className="sticky top-0 z-10 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-ink font-display text-sm font-bold text-paper">
            DR
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-ink">
            Docs Rok
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/resources"
            className="hidden text-sm font-medium text-ink-2 transition-colors hover:text-ink sm:inline"
          >
            Resources
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-ink-2 transition-colors hover:text-ink"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Start free
          </Link>
        </div>
      </div>
    </nav>
  )
}
