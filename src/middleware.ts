import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — required to keep session alive
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Redirect unauthenticated users away from protected routes
  const protectedPaths = ['/dashboard', '/onboarding']
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))

  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages
  const authPaths = ['/login', '/signup']
  const isAuthPage = authPaths.includes(pathname)

  if (user && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  captureAttribution(request, supabaseResponse)

  return supabaseResponse
}

/**
 * First-touch attribution. When a visitor arrives with ?ref=, utm_* or gclid,
 * remember where they came from for 90 days so the signup can be credited to
 * the right channel (Google Ads, a resource page, an outreach link...).
 *
 * First touch wins: an existing cookie is never overwritten, so a later visit
 * from a bookmark does not erase the ad click that actually brought them in.
 */
const ATTRIBUTION_COOKIE = 'dr_src'
const ATTRIBUTION_PARAMS = ['ref', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'gclid'] as const

function captureAttribution(request: NextRequest, response: NextResponse) {
  if (request.cookies.get(ATTRIBUTION_COOKIE)) return

  const params = request.nextUrl.searchParams
  const src: Record<string, string> = {}
  for (const key of ATTRIBUTION_PARAMS) {
    const value = params.get(key)
    if (value) src[key] = value.slice(0, 120)
  }

  const referrer = request.headers.get('referer')
  if (referrer) {
    try {
      const host = new URL(referrer).hostname
      if (host && !host.endsWith('docsrok.com')) src.referrer = host
    } catch {
      // ignore malformed referrers
    }
  }

  // Only set the cookie when there is something worth recording.
  if (Object.keys(src).length === 0) return

  src.landing = request.nextUrl.pathname.slice(0, 120)
  src.at = new Date().toISOString()

  response.cookies.set(ATTRIBUTION_COOKIE, JSON.stringify(src), {
    maxAge: 60 * 60 * 24 * 90,
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secure: true,
  })
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
