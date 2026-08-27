-- ==============================================================================
-- GIFTED PROJECT EXHIBITION - SUPABASE POSTGRESQL SCHEMA
-- ==============================================================================

-- 1. Create Projects Table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  subtitle text,
  team_name text,
  student_display_names text[] not null default '{}',
  grade text,
  program text,
  year integer not null default 2026,
  category text not null,
  tags text[] not null default '{}',
  question text not null,
  summary text not null,
  motivation text,
  description text not null,
  reflection text,
  next_question text,
  thumbnail_url text not null,
  report_pdf_url text,
  presentation_pdf_url text,
  presentation_original_url text,
  video_url text,
  external_project_url text,
  featured boolean default false,
  published boolean default true,
  display_order integer default 0,
  badge text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Create Project Process (Timeline Journey) Table
create table if not exists public.project_process (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text not null,
  image_url text,
  display_order integer not null default 0,
  created_at timestamptz default now()
);

-- 3. Create Reactions Table (Anti-spam with visitor_token)
create table if not exists public.reactions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  reaction_type text not null check (reaction_type in ('clap', 'idea', 'rocket', 'heart')),
  visitor_token text not null,
  created_at timestamptz default now()
);

-- Indexing for high-performance gallery and search queries
create index if not exists idx_projects_slug on public.projects(slug);
create index if not exists idx_projects_category on public.projects(category);
create index if not exists idx_projects_published on public.projects(published);
create index if not exists idx_projects_featured on public.projects(featured);
create index if not exists idx_process_project_id on public.project_process(project_id);
create index if not exists idx_reactions_project on public.reactions(project_id);
create index if not exists idx_reactions_token on public.reactions(visitor_token);

-- 4. Enable Row Level Security (RLS)
alter table public.projects enable row level security;
alter table public.project_process enable row level security;
alter table public.reactions enable row level security;

-- Public can read published projects
create policy "Public can view published projects"
  on public.projects for select
  using (published = true);

-- Authenticated admins have full access to projects
create policy "Admins have full access to projects"
  on public.projects for all
  using (auth.role() = 'authenticated');

-- Public can read project processes for published projects
create policy "Public can view processes for published projects"
  on public.project_process for select
  using (
    exists (
      select 1 from public.projects
      where projects.id = project_process.project_id
      and projects.published = true
    )
  );

-- Admins full access to process
create policy "Admins have full access to project process"
  on public.project_process for all
  using (auth.role() = 'authenticated');

-- Anyone can read reactions
create policy "Public can view reactions"
  on public.reactions for select
  using (true);

-- Anyone can insert reactions
create policy "Public can insert reactions"
  on public.reactions for insert
  with check (true);

-- 5. Storage Buckets (Run in Supabase Storage SQL Editor if needed)
insert into storage.buckets (id, name, public)
values 
  ('project-thumbnails', 'project-thumbnails', true),
  ('project-reports', 'project-reports', true),
  ('project-presentations', 'project-presentations', true),
  ('project-images', 'project-images', true)
on conflict (id) do nothing;
