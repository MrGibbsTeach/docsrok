import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Service-role Supabase client.
 *
 * Use this ONLY in server-side contexts that have no user session and
 * therefore cannot satisfy Row Level Security — currently just the Stripe
 * webhook handler. It bypasses RLS entirely, so it must never be imported
 * into a Client Component or any route that echoes data back to a caller
 * without its own authorisation check.
 *
 * Deliberately NOT initialised at module scope: a module-level throw is
 * evaluated during Vercel's "Collecting page data" step and kills the build.
 * See the deployment lessons in AGENTS.md.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Supabase admin client unavailable: NEXT_PUBLIC_SUPABASE_URL and ' +
        'SUPABASE_SERVICE_ROLE_KEY must both be set. Add SUPABASE_SERVICE_ROLE_KEY ' +
        'in Vercel (Supabase dashboard → Project Settings → API → service_role key).'
    )
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { 'X-Client-Info': 'docsrok-webhook' } },
  })
}
