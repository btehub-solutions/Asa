create extension if not exists "pgcrypto";

create table if not exists public.artworks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  artist_name text not null,
  artist_image_url text,
  artist_bio text,
  artist_quote text,
  cultural_roots text,
  artist_story text,
  nationality text,
  city_base text,
  year_active text,
  image_url text not null,
  extra_image_urls text[] not null default '{}',
  medium text not null,
  year_created text,
  dimensions text,
  categories text[] not null default '{}',
  price numeric,
  availability text not null default 'For Sale' check (availability in ('For Sale', 'Not for Sale', 'Sold')),
  cultural_significance text,
  piece_story text,
  yoruba_connection text,
  tags text[] not null default '{}',
  commission_rate numeric,
  admin_notes text,
  publication_status text not null default 'Draft' check (publication_status in ('Draft', 'Published', 'Archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.join_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  location text,
  style text,
  instagram text,
  website text,
  commission text,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists artworks_publication_status_idx on public.artworks (publication_status);
create index if not exists artworks_created_at_idx on public.artworks (created_at desc);
create index if not exists artworks_categories_idx on public.artworks using gin (categories);

alter table public.artworks enable row level security;
alter table public.join_applications enable row level security;

drop policy if exists "Published artworks are public" on public.artworks;
create policy "Published artworks are public"
  on public.artworks for select
  using (publication_status = 'Published');

drop policy if exists "Join applications are server-only" on public.join_applications;
create policy "Join applications are server-only"
  on public.join_applications for select
  using (false);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_artworks_updated_at on public.artworks;
create trigger set_artworks_updated_at
before update on public.artworks
for each row execute procedure public.set_updated_at();

-- Create a public storage bucket named "artworks" in Supabase Storage.
-- In Storage policies, allow public SELECT and service-role INSERT/UPDATE/DELETE.
