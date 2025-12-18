-- Create audit_logs table (immutable for compliance)
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  actor_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  metadata jsonb default '{}'::jsonb,
  ip_address inet,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.audit_logs enable row level security;

-- Policies for audit_logs (read-only for users, admins can view org logs)
create policy "Admins can view organization audit logs"
  on public.audit_logs for select
  using (
    org_id in (
      select org_id from public.profiles 
      where id = auth.uid() and role in ('admin', 'compliance_officer')
    )
  );

create policy "System can insert audit logs"
  on public.audit_logs for insert
  with check (true);

-- Create index for faster lookups
create index if not exists audit_logs_org_id_idx on public.audit_logs(org_id);
create index if not exists audit_logs_actor_id_idx on public.audit_logs(actor_id);
create index if not exists audit_logs_created_at_idx on public.audit_logs(created_at);
