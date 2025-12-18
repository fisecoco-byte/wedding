-- 创建 RSVP 表
create extension if not exists pgcrypto;

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  guests int not null check (guests >= 1),
  phone text,
  date text not null check (date in ('2025-01-23','2025-01-24')),
  needsLodging boolean not null default false,
  note text,
  created_at timestamptz not null default now()
);

alter table public.rsvps enable row level security;

-- 允许公开插入与读取（前端使用 anon key）
create policy if not exists "Allow public insert" on public.rsvps
  for insert
  to anon, authenticated
  with check (true);

create policy if not exists "Allow public select" on public.rsvps
  for select
  to anon, authenticated
  using (true);

create index if not exists rsvps_created_at_idx on public.rsvps (created_at);
