-- Manual display order for albums (lower = earlier in gallery / admin list).
alter table public.albums
  add column if not exists sort_order integer not null default 0;

-- Match previous behavior: newest first → smallest sort_order for newest rows
with ranked as (
  select id, row_number() over (order by created_at desc) as rn
  from public.albums
)
update public.albums a
set sort_order = ranked.rn
from ranked
where a.id = ranked.id;

create index if not exists albums_sort_order_idx on public.albums (sort_order asc, created_at desc);
