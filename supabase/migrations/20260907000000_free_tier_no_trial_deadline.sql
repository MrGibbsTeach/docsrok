-- PIVOT (7 Sept 2026): moved from a 14-day timed trial to a permanent free
-- tier (2 documents, no expiry) plus a $149 one-time purchase for the rest.
-- New signups get trial_ends_at = null; "paid" is determined solely by
-- subscriptions.status = 'active', set by the Stripe webhook.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
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
    null
  );

  return new;
end;
$$;
