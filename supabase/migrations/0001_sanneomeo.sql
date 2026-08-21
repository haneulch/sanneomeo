-- 산너머(sanneomeo) 저장 계층: CSV(users.csv, stamps.csv) → Postgres 이전.
-- 컬럼은 lib/store/types.ts 의 User/Stamp 를 snake_case 로 그대로 옮긴 것.
-- 접근은 전부 Next API 라우트(service role) 경유 — RLS 활성 + 정책 없음 = anon 차단.

create table if not exists public.sanneomeo_users (
  id          text primary key,            -- Supabase Auth uuid 또는 'demo-user'
  provider    text not null check (provider in ('demo', 'google')),
  provider_id text not null,
  email       text not null default '',
  name        text not null default '',
  created_at  timestamptz not null default now()
);

create table if not exists public.sanneomeo_stamps (
  id          uuid primary key default gen_random_uuid(),
  user_id     text not null references public.sanneomeo_users(id) on delete cascade,
  mountain_ko text not null,
  mountain_en text not null,
  kind        text not null check (kind in ('peak', 'temple')),
  stamped_at  timestamptz not null default now(),
  unique (user_id, mountain_ko)             -- 같은 산 중복 적립 방지 (API는 기존 스탬프 반환)
);

create index if not exists sanneomeo_stamps_user_idx on public.sanneomeo_stamps (user_id);

alter table public.sanneomeo_users  enable row level security;
alter table public.sanneomeo_stamps enable row level security;
-- 정책 의도적으로 없음: anon/authenticated 직접 접근 차단, service role만 통과.
