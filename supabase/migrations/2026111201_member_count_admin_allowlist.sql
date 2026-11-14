-- Run once in the Supabase project's SQL Editor.
-- Only Supabase service_role reads this table; no browser access is permitted.
create table if not exists public.by3_admin_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.by3_admin_members enable row level security;
revoke all on table public.by3_admin_members from public, anon, authenticated;
grant select on table public.by3_admin_members to service_role;

-- Then add ONLY your actual admin account's UUID from Authentication > Users:
-- insert into public.by3_admin_members(user_id) values ('YOUR-ADMIN-USER-UUID')
-- on conflict (user_id) do nothing;
-- Do NOT paste a password or service role key here or in the website files.
