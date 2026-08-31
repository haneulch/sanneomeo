-- 스탬프 정상 인증 사진. 카메라 캡쳐 JPEG(클라이언트에서 리사이즈)를 base64로 저장.
-- CSV 어댑터의 data/store/photos/{stampId}.jpg 와 동일 시맨틱.
-- 접근은 전부 Next API 라우트(service role) 경유 — RLS 활성 + 정책 없음 = anon 차단.

create table if not exists public.sanneomeo_stamp_photos (
  stamp_id   uuid primary key references public.sanneomeo_stamps(id) on delete cascade,
  user_id    text not null references public.sanneomeo_users(id) on delete cascade,
  data       text not null,                 -- JPEG base64 (data URL 프리픽스 제외)
  created_at timestamptz not null default now()
);

create index if not exists sanneomeo_stamp_photos_user_idx
  on public.sanneomeo_stamp_photos (user_id);

alter table public.sanneomeo_stamp_photos enable row level security;
