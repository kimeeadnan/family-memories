-- Albums: one per event (e.g. Raya 2024, Family Day 2025)
create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  created_at timestamptz not null default now()
);

-- Photos: belong to an album, stored in Supabase Storage
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.albums(id) on delete cascade,
  storage_path text not null,
  sort_order int not null default 0,
  caption text,
  created_at timestamptz not null default now()
);

create index if not exists photos_album_id_idx on public.photos(album_id);
create index if not exists albums_created_at_idx on public.albums(created_at desc);

-- Storage bucket: create via Supabase Dashboard or API
-- Bucket name: memories (private). Policies below allow service role full access.
-- RLS is not required if only the Next.js server (service role) accesses the DB.

comment on table public.albums is 'Family memory albums (title only)';
comment on table public.photos is 'Photos in an album; storage_path is path in Storage bucket';
