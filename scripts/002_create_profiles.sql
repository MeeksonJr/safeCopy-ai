-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid references public.organizations(id) on delete cascade,
  role text not null default 'writer' check (role in ('admin', 'writer', 'compliance_officer')),
  full_name text,
  industry text,
  credits_remaining int not null default 100,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can view profiles in their organization"
  on public.profiles for select
  using (
    org_id in (
      select org_id from public.profiles where id = auth.uid()
    )
  );

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can update profiles in their organization"
  on public.profiles for update
  using (
    org_id in (
      select org_id from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);
