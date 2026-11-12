# Technical handover (public-safe subset)

Last updated: 12 Nov 2026. Master at `328f183`. No business figures, customer data or secrets belong in this file.

## Stack
Next.js 16 (App Router, Turbopack) on Vercel (syd1). Supabase Postgres + Auth with RLS. Stripe Checkout (one-time purchase). Resend for outbound email. Documents generated with the Claude API (`claude-opus-4-5`, `max_tokens` 4096, concurrency 8 with retry/backoff). Tables: profiles, businesses, subscriptions, documents, analytics_events, email_log. Migrations are in `supabase/`.

## Env vars (names only, values live in Vercel)
`ANTHROPIC_API_KEY`, `CRON_SECRET`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_CORE` (`STRIPE_PRICE_PLUS`, `STRIPE_PRICE_TEAM` legacy), `UNSUBSCRIBE_SECRET`.

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

## Locks
| File or area | Held by | Since | Task |
|---|---|---|---|
| (none) | | | |

## Open engineering tasks (IDs match the private TASKS.md)
From 12 Nov, Codex is primary for code and Claude Code reviews. Copy and content for several tasks come from ChatGPT via the private board (task IDs ending `c`); do not build those pages until the content exists.

| ID | Task | Primary / backup | Done when |
|---|---|---|---|
| T-01 | Password reset: "Forgot password?" on /login, request page, set-new-password page (Supabase `resetPasswordForEmail`) | Codex / Claude Code | A test alias resets its password on production and lands on /dashboard |
| T-02 | Honest claims: remove "Most popular" badge; replace "Fully editable" until Word export ships; one GST wording on `/`, `/terms`, `/upgrade` (owner decides which) | Codex / Claude Code | All three pages use identical price wording |
| T-03 | Events `document_viewed`, `document_printed`, `document_downloaded` in `AnalyticsEvent` and `CLIENT_EVENTS` | Codex / Claude Code | Rows appear from a test account |
| T-06 | `src/lib/resource-pages.ts`: VIC regulator is the Building and Plumbing Commission; VIC electricians are Energy Safe Victoria (per-trade override). Add `/llms.txt` and JSON-LD (Organization, Product with Offer, FAQPage) | Codex / Claude Code | Pages show new text; llms.txt returns 200; Rich Results test passes |
| T-08 | Fresh-signup walkthrough desktop and 390 px with a test alias; friction list with screenshots (kept private) | Claude Code | Walkthrough done, aliases marked internal |
| T-09 | Word (.docx) download for every document | Codex / Claude Code | Downloaded file opens in Word with headings and tables intact |
| T-11 | Public sample documents for a fictional business on `/` and `/resources` (content from T-11c) | Codex / Claude Code | Samples viewable without signup |
| T-15 | Paywall: blurred first section of 3 locked documents | Codex / Claude Code | Visible on /upgrade for a free account |
| T-17 | Free-pair test for builders (quote template + terms of trade) | Codex / Claude Code | Builder signups get the new pair; others unchanged |

Owner-gated (do not start until the private TASKS.md says unblocked): T-13 partner promotion codes, T-14 state facts data file, T-21 guarantee wording.

## Session log
- 18 Oct 2026: handover system added (this file, AGENTS.md section). No code changes.
- 9 Nov 2026: /upgrade is now a server page (`page.tsx`) that names the user's still-locked documents, passed to `UpgradeClient.tsx`. Customer-facing support address changed from the never-configured docsrok.com.au to support@docsrok.com (upgrade, privacy, terms); email template fallback URL now https://www.docsrok.com. Commit 3088180, Vercel READY.
- 12 Nov 2026: team workflow added (AGENTS.md project-handover block, engineering task cards and locks here, `.github/copilot-instructions.md` pointer). No code changes.
- 12 Nov 2026: repo tidy: real README, `marketing/` moved to `docs/marketing/`, env var names listed, Codex set as primary for code. No code changes.
