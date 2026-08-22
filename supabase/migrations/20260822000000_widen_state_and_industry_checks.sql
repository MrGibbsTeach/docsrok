-- ============================================================================
-- Widen state and industry_type CHECK constraints to match the pivoted product
-- ============================================================================
-- 22 August 2026.
--
-- THIS IS A LIVE SIGNUP BLOCKER, not a tidy-up.
--
-- The 14 July 2026 pivot widened the market from "QLD/NSW construction" to
-- "any Australian state, any trade or service business". The landing page says
-- "Any Australian state" in four separate places and the FAQ says documents are
-- "not tied to any specific state legislation". The onboarding dropdown was
-- extended on 23 July to offer 13 trade types.
--
-- The database was never updated to match. As a result:
--
--   * businesses.state / documents.state only permitted QLD and NSW, so nobody
--     in VIC, WA, SA, TAS, ACT or NT could complete onboarding at all.
--   * businesses.industry_type only permitted the original 8 construction
--     types, so 5 of the 13 options in the live dropdown (carpentry,
--     landscaping, painting_decorating, cleaning_services,
--     handyman_general_repairs) failed at INSERT with a constraint violation.
--
-- The 23 July end-to-end test passed only because it happened to use NSW and
-- plumbing_gasfitting, both of which were inside the old allowed set.
--
-- Widening a CHECK constraint cannot invalidate existing rows, so this is safe
-- to run against production with data present.
-- ============================================================================

alter table public.businesses drop constraint if exists businesses_state_check;
alter table public.businesses add constraint businesses_state_check
  check (state = any (array['QLD','NSW','VIC','WA','SA','TAS','ACT','NT']));

alter table public.documents drop constraint if exists documents_state_check;
alter table public.documents add constraint documents_state_check
  check (state = any (array['QLD','NSW','VIC','WA','SA','TAS','ACT','NT']));

alter table public.businesses drop constraint if exists businesses_industry_type_check;
alter table public.businesses add constraint businesses_industry_type_check
  check (industry_type = any (array[
    'residential_construction','commercial_construction','civil_earthworks',
    'electrical','plumbing_gasfitting','roofing','concrete_formwork',
    'general_construction','carpentry','landscaping','painting_decorating',
    'cleaning_services','handyman_general_repairs'
  ]));

-- Foreign keys had no supporting indexes, so every dashboard load sequentially
-- scanned documents. Irrelevant at one user, not irrelevant at a thousand.
create index if not exists documents_user_id_current_idx
  on public.documents (user_id, is_current);
create index if not exists documents_business_id_idx
  on public.documents (business_id);
create index if not exists businesses_user_id_idx
  on public.businesses (user_id);
