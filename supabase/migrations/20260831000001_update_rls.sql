-- Update RLS Policies to allow full sync from admin console

drop policy if exists "Public can view published projects" on public.projects;
drop policy if exists "Admins have full access to projects" on public.projects;
drop policy if exists "Public can view processes for published projects" on public.project_process;
drop policy if exists "Admins have full access to project process" on public.project_process;

-- Projects
create policy "Allow all read on projects"
  on public.projects for select
  using (true);

create policy "Allow all write on projects"
  on public.projects for insert
  with check (true);

create policy "Allow all update on projects"
  on public.projects for update
  using (true);

create policy "Allow all delete on projects"
  on public.projects for delete
  using (true);

-- Project Process
create policy "Allow all read on project_process"
  on public.project_process for select
  using (true);

create policy "Allow all write on project_process"
  on public.project_process for insert
  with check (true);

create policy "Allow all update on project_process"
  on public.project_process for update
  using (true);

create policy "Allow all delete on project_process"
  on public.project_process for delete
  using (true);
