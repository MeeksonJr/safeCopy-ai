-- Create organizations table
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'pro', 'enterprise')),
  risk_tolerance int not null default 5 check (risk_tolerance >= 1 and risk_tolerance <= 10),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.organizations enable row level security;

-- Policies for organizations
create policy "Users can view their own organization"
  on public.organizations for select
  using (
    id in (
      select org_id from public.profiles where id = auth.uid()
    )
  );

create policy "Admins can update their organization"
  on public.organizations for update
  using (
    id in (
      select org_id from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );
