-- 10 Oct 2026
-- 1. Per-business generation lock (see src/app/api/documents/generate/route.ts).
alter table public.businesses
  add column if not exists generation_started_at timestamptz;

-- 2. Backstop: at most one current document per (user, type, activity_key).
--    Retire the duplicate batch from the 5 Oct double run first (keep the earliest).
update public.documents d
set is_current = false
where d.is_current
  and exists (
    select 1 from public.documents e
    where e.is_current
      and e.user_id = d.user_id
      and e.type = d.type
      and coalesce(e.activity_key, '') = coalesce(d.activity_key, '')
      and (e.created_at, e.id) < (d.created_at, d.id)
  );

create unique index if not exists documents_one_current_per_key
  on public.documents (user_id, type, coalesce(activity_key, ''))
  where is_current;

-- 3. Mark Gibba's own test accounts so they never count as customers.
alter table public.profiles
  add column if not exists is_internal boolean not null default false;

update public.profiles
set is_internal = true
where email ilike 'claytongibbs%@gmail.com';
