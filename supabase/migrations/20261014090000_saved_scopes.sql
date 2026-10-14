-- Saved scopes: the scope a signed-in user is building, kept in their account.
--
-- The scope itself is just a list of guide slugs (see src/content/scope.ts), so
-- the table stores exactly that and nothing derived. Everything the scope page
-- shows is recomputed from the model, which means a saved scope never goes
-- stale when the content changes.
--
-- Written to be re-runnable: it was applied directly to the database, and a
-- second apply from the repo must be a no-op rather than an error.

create table if not exists public.saved_scopes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  -- Null means "not named yet": the app titles it from its picks. Naming it
  -- sets this; clearing the name returns it to null.
  name text check (name is null or char_length(btrim(name)) between 1 and 120),
  -- Autosave never writes an empty scope, so a row always has at least one pick.
  picks text[] not null check (cardinality(picks) between 1 and 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists saved_scopes_user_updated_idx
  on public.saved_scopes (user_id, updated_at desc);

-- Row level security is the whole access model: the browser talks to this
-- table directly, so a user can only ever see and change their own rows.
alter table public.saved_scopes enable row level security;

drop policy if exists "Users read their own scopes" on public.saved_scopes;
create policy "Users read their own scopes" on public.saved_scopes
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users create their own scopes" on public.saved_scopes;
create policy "Users create their own scopes" on public.saved_scopes
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users update their own scopes" on public.saved_scopes;
create policy "Users update their own scopes" on public.saved_scopes
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users delete their own scopes" on public.saved_scopes;
create policy "Users delete their own scopes" on public.saved_scopes
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Supabase grants every privilege on a new public table to anon and
-- authenticated by default. The policies above already exclude anon, and row
-- level security does not apply to TRUNCATE at all, so take everything back
-- and grant only the four things the app does.
revoke all on public.saved_scopes from anon, authenticated;
grant select, insert, update, delete on public.saved_scopes to authenticated;

-- Keep updated_at honest without trusting the client to send it.
create or replace function public.saved_scopes_touch()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- A trigger function has no business being callable as an RPC. Firing a
-- trigger does not check the caller's EXECUTE privilege, so this is safe.
revoke all on function public.saved_scopes_touch() from public, anon, authenticated;

drop trigger if exists saved_scopes_touch on public.saved_scopes;
create trigger saved_scopes_touch
  before update on public.saved_scopes
  for each row execute function public.saved_scopes_touch();
