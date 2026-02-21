-- Run this in Supabase SQL Editor (outside Payload migrations).

create table if not exists public.firm_users (
  supabase_user_id uuid primary key references auth.users (id) on delete cascade,
  payload_business_id integer not null,
  created_at timestamptz not null default now()
);

create index if not exists firm_users_payload_business_id_idx
  on public.firm_users (payload_business_id);

alter table public.firm_users enable row level security;

drop policy if exists firm_users_select_own_row on public.firm_users;
create policy firm_users_select_own_row
  on public.firm_users
  for select
  to authenticated
  using (auth.uid() = supabase_user_id);

drop policy if exists firm_users_no_client_insert on public.firm_users;
create policy firm_users_no_client_insert
  on public.firm_users
  for insert
  to authenticated
  with check (false);

drop policy if exists firm_users_no_client_mutation on public.firm_users;
create policy firm_users_no_client_mutation
  on public.firm_users
  for all
  to authenticated
  using (false)
  with check (false);
