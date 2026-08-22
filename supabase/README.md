# Database

The schema for this project lived only inside the hosted Supabase project until
22 August 2026. These files are the version-controlled copy.

- `migrations/00000000000000_baseline_schema.sql` — the schema exactly as it was
  on 22 August 2026, captured by introspecting the live database. It includes
  the pre-pivot CHECK constraints so the history is accurate.
- `migrations/20260822000000_widen_state_and_industry_checks.sql` — widens
  `state` to all Australian states and `industry_type` to all 13 trade types, so
  the database matches what the product actually sells. Also adds the missing
  foreign key indexes.

## Applying a migration

Easiest route, no tooling required: open the Supabase dashboard, go to
**SQL Editor**, paste the contents of the migration file, and run it.

## Things worth knowing

**Every RLS policy is scoped to `auth.uid()`.** Any server-side code with no
user session, which means the Stripe webhook, must use the service-role key via
`src/lib/supabase/admin.ts`. Using the normal cookie-based client there makes
every statement silently affect zero rows. That was the cause of the checkout
bug fixed on 22 August 2026.

**The service-role key bypasses RLS entirely.** Never import `admin.ts` into a
Client Component, and never expose the key through a `NEXT_PUBLIC_` variable.

**Some column names are pre-pivot leftovers.** `businesses.whs_responsible_name`
and `whs_responsible_role` are just the main business contact now, and
`work_activities` holds the services a business offers. They were kept to avoid
a rename migration. `documents.regulatory_citation` is written as an empty
string for all current document types.
