-- BouYousef 2 V041.21.0: Run in the existing Supabase project's SQL editor.
-- Never run on an unrelated project. Does not change auth or existing tables.
create table if not exists public.user_favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  place_id text not null check (char_length(place_id) between 3 and 240 and place_id ~ '^[a-z][a-z0-9-]*:[^[:space:]]+$'),
  created_at timestamptz not null default now(),
  constraint user_favorites_pkey primary key (user_id, place_id)
);
alter table public.user_favorites enable row level security;
revoke all on public.user_favorites from anon;
grant select, insert, delete on public.user_favorites to authenticated;
-- Restrict each operation to auth.uid() so users cannot read or modify others' favorites.
drop policy if exists "by2_favorites_select_own" on public.user_favorites;
create policy "by2_favorites_select_own" on public.user_favorites
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "by2_favorites_insert_own" on public.user_favorites;
create policy "by2_favorites_insert_own" on public.user_favorites
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "by2_favorites_delete_own" on public.user_favorites;
create policy "by2_favorites_delete_own" on public.user_favorites
  for delete to authenticated using ((select auth.uid()) = user_id);
-- No UPDATE privilege granted or UPDATE policy created.
