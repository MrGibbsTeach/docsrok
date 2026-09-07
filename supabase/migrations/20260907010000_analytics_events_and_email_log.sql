-- Funnel instrumentation. Written server-side with the service-role client only,
-- so RLS is enabled with no policies: nothing reachable by an end user's session
-- can read or write this table.
create table if not exists public.analytics_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references public.profiles (id) on delete set null,
  event      text not null,
  props      jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_event_created_idx
  on public.analytics_events (event, created_at desc);
create index if not exists analytics_events_user_idx
  on public.analytics_events (user_id);

alter table public.analytics_events enable row level security;

-- One row per lifecycle email actually sent. The unique constraint is what
-- stops a re-run of the daily cron from emailing the same person twice.
create table if not exists public.email_log (
  id       uuid primary key default gen_random_uuid(),
  user_id  uuid not null references public.profiles (id) on delete cascade,
  template text not null,
  sent_at  timestamptz not null default now(),
  unique (user_id, template)
);

create index if not exists email_log_user_idx on public.email_log (user_id);

alter table public.email_log enable row level security;
