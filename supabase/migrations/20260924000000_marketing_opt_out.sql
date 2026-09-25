-- ============================================================================
-- Marketing opt-out, and stop the lifecycle emails from just going silent
-- ============================================================================
-- 24 September 2026.
--
-- There was no unsubscribe link anywhere and no opt-out column. The day-21
-- lifecycle email even told people "no need to unsubscribe from anything"
-- because after it, the emails just stopped forever.
--
-- The new model: signing up is enough trust to stay on the list. There is now
-- a real one-click unsubscribe (src/app/api/unsubscribe/route.ts) on every
-- lifecycle/marketing email from the very first one, and this column is what
-- it sets. Short of that, nobody is silently dropped — the daily cron (see
-- src/app/api/cron/daily/route.ts) adds an infrequent ongoing check-in after
-- day 21 instead of stopping.
-- ============================================================================

alter table public.profiles
  add column if not exists marketing_opt_out boolean not null default false,
  add column if not exists marketing_opt_out_at timestamptz;
