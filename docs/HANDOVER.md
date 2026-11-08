# Technical handover (public-safe subset)

Last updated: 18 Oct 2026. Master at `4b936a0`. No business figures, customer data or secrets belong in this file.

## Stack
Next.js 16 (App Router, Turbopack) on Vercel (syd1). Supabase Postgres + Auth with RLS. Stripe Checkout (one-time purchase). Resend for outbound email. Documents generated with the Claude API (`claude-opus-4-5`, `max_tokens` 4096, concurrency 8 with retry/backoff). Tables: profiles, businesses, subscriptions, documents, analytics_events, email_log. Migrations are in `supabase/`.

## Behaviour to preserve
- Free tier gives 2 documents, one-time purchase unlocks the full 24-document set.
- Generation is guarded by a per-business lock (`businesses.generation_started_at`, 6 min TTL) and a unique partial index on current documents. Do not reintroduce a generate button on the in-progress dashboard state.
- First-touch attribution (`ref`, `utm_*`, `gclid`, referrer, landing) is stored in a 90-day `dr_src` cookie by middleware and written to `signup_completed` props.
- Lifecycle emails always carry a one-click unsubscribe. A daily cron keeps the free Supabase project from pausing.
- Legacy WHS types and prompts remain in code but must stay unreachable from the UI.

## Lessons
- RLS blocks server paths with no user session (webhooks, cron). Use a lazily built service-role client and check affected row counts.
- If the UI can produce new values, widen the DB CHECK constraints and test at the edges.
- Module-level `throw` in an SDK client breaks the Vercel build. Env vars added after a deploy need a redeploy.
- Stripe SDK v22: `current_period_end` is on subscription items; `apiVersion` must be `2026-06-24.dahlia`.
- `next build` fails offline on the Google Fonts fetch in `layout.tsx`; stub it for a local build check.
- On Windows, `.git/index.lock` can stick; delete it rather than working around with git plumbing.

## Open engineering tasks
1. Verify the Vercel deployment for `4b936a0` is READY and a fresh test business generates exactly once.
2. Confirm attribution lands on the next real signup.
3. Free-to-paid conversion work: pick the two most impressive free documents, make the paywall preview the locked ones, review the ad landing page.

## Session log
- 18 Oct 2026: handover system added (this file, AGENTS.md section). No code changes.
- 9 Nov 2026: /upgrade is now a server page (`page.tsx`) that names the user's still-locked documents, passed to `UpgradeClient.tsx`. Customer-facing support address changed from the never-configured docsrok.com.au to support@docsrok.com (upgrade, privacy, terms); email template fallback URL now https://www.docsrok.com. Commit 3088180, Vercel READY.
