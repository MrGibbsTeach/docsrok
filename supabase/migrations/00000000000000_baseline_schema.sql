-- ============================================================================
-- Docs Rok — baseline schema
-- ============================================================================
-- Captured 22 August 2026 by introspecting the live Supabase project
-- (mutwixlyponohtaqmkzb, ap-southeast-1). Until this file existed the schema
-- lived ONLY inside that project, with no version-controlled copy anywhere.
--
-- This reflects the database as it actually was on that date, INCLUDING the
-- pre-pivot CHECK constraints on state and industry_type. Those are corrected
-- by the next migration in this folder, not here, so the history stays honest.
-- ============================================================================

-- ── Functions ───────────────────────────────────────────────────────────────

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );

  insert into public.subscriptions (user_id, plan, status, trial_ends_at)
  values (
    new.id,
    'trial',
    'trialing',
    now() + interval '14 days'
  );

  return new;
end;
$function$;

-- ── Tables ──────────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  full_name  text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.businesses (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references public.profiles (id) on delete cascade,
  name                  text not null,
  abn                   text,
  address               text,
  state                 text not null,
  industry_type         text not null,
  employee_count_range  text not null,
  -- Legacy column names retained from the pre-pivot product to avoid a rename
  -- migration. whs_responsible_* is now just "main contact"; work_activities
  -- now holds services offered.
  whs_responsible_name  text,
  whs_responsible_role  text,
  work_activities       text[] not null default '{}'::text[],
  onboarding_completed  boolean not null default false,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  constraint businesses_state_check
    check (state = any (array['QLD','NSW'])),
  constraint businesses_industry_type_check
    check (industry_type = any (array[
      'residential_construction','commercial_construction','civil_earthworks',
      'electrical','plumbing_gasfitting','roofing','concrete_formwork',
      'general_construction'
    ])),
  constraint businesses_employee_count_range_check
    check (employee_count_range = any (array['1-4','5-10','11-20','21-50','50+']))
);

create table if not exists public.subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null unique references public.profiles (id) on delete cascade,
  stripe_customer_id     text unique,
  stripe_subscription_id text unique,
  plan                   text not null default 'trial',
  status                 text not null default 'trialing',
  trial_ends_at          timestamptz,
  current_period_end     timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  constraint subscriptions_plan_check
    check (plan = any (array['trial','core','plus','team'])),
  constraint subscriptions_status_check
    check (status = any (array['trialing','active','past_due','canceled','incomplete']))
);

create table if not exists public.documents (
  id                  uuid primary key default gen_random_uuid(),
  business_id         uuid not null references public.businesses (id) on delete cascade,
  user_id             uuid not null references public.profiles (id) on delete cascade,
  type                text not null,
  title               text not null,
  content             jsonb not null default '{}'::jsonb,
  activity_key        text,
  state               text not null,
  regulatory_citation text not null,
  pdf_storage_path    text,
  version             integer not null default 1,
  is_current          boolean not null default true,
  created_at          timestamptz not null default now(),
  constraint documents_state_check
    check (state = any (array['QLD','NSW'])),
  constraint documents_type_check
    check (type = any (array[
      -- legacy WHS types, unreachable from the current UI
      'whs_policy','swms','hazard_register','incident_report','emergency_procedures',
      -- current post-pivot types
      'sop','subcontractor_pack','quote_template','business_policy'
    ]))
);

-- ── Triggers ────────────────────────────────────────────────────────────────

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

drop trigger if exists businesses_updated_at on public.businesses;
create trigger businesses_updated_at
  before update on public.businesses
  for each row execute function public.handle_updated_at();

drop trigger if exists subscriptions_updated_at on public.subscriptions;
create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.handle_updated_at();

-- ── Row Level Security ──────────────────────────────────────────────────────
-- Every policy is scoped to auth.uid(). That means any server-side code with
-- no user session (the Stripe webhook) MUST use the service-role key, or its
-- statements silently affect zero rows. See src/lib/supabase/admin.ts.

alter table public.profiles      enable row level security;
alter table public.businesses    enable row level security;
alter table public.subscriptions enable row level security;
alter table public.documents     enable row level security;

create policy "profiles_select_own" on public.profiles
  for select to public using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert to public with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update to public using (auth.uid() = id);

create policy "businesses_select_own" on public.businesses
  for select to public using (auth.uid() = user_id);
create policy "businesses_insert_own" on public.businesses
  for insert to public with check (auth.uid() = user_id);
create policy "businesses_update_own" on public.businesses
  for update to public using (auth.uid() = user_id);

create policy "subscriptions_select_own" on public.subscriptions
  for select to public using (auth.uid() = user_id);
create policy "subscriptions_insert_own" on public.subscriptions
  for insert to public with check (auth.uid() = user_id);
create policy "subscriptions_update_own" on public.subscriptions
  for update to public using (auth.uid() = user_id);

create policy "documents_select_own" on public.documents
  for select to public using (auth.uid() = user_id);
create policy "documents_insert_own" on public.documents
  for insert to public with check (auth.uid() = user_id);
create policy "documents_update_own" on public.documents
  for update to public using (auth.uid() = user_id);
