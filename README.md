# Docs Rok

AI-written business paperwork for Australian trade businesses: SOPs, quote and proposal templates, subcontractor welcome packs and business policies, customised to the business's trade and state. Live at https://www.docsrok.com.

## For AI agents and contributors
Start with [`AGENTS.md`](AGENTS.md), then [`docs/HANDOVER.md`](docs/HANDOVER.md) (technical state, locks, engineering task cards). This repo is public: no money figures, customer data or secrets.

## Stack
Next.js 16 (App Router, Turbopack) on Vercel, Supabase (Postgres, Auth, RLS), Stripe Checkout, Resend, Claude API for generation. Next.js 16 has breaking changes: read `node_modules/next/dist/docs/` before writing code.

## Layout
- `src/app` : routes (`(auth)`, `(app)` dashboard/documents/upgrade, `api`, `resources`, legal pages)
- `src/lib` : document prompts, types, Stripe, Supabase, email, analytics, SEO resource pages
- `supabase/` : migrations
- `docs/HANDOVER.md` : technical handover; `docs/marketing/` : outreach drafts

## Run locally
```bash
npm install
npm run dev
```
Needs the env vars listed in `docs/HANDOVER.md` (names only; values live in Vercel).
