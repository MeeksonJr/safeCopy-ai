-- Create scans table
create table if not exists public.scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  org_id uuid not null references public.organizations(id) on delete cascade,
  content_hash text not null,
  original_text text not null,
  rewritten_text text,
  safety_score int check (safety_score >= 0 and safety_score <= 100),
  flags_found jsonb default '[]'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.scans enable row level security;

-- Policies for scans
create policy "Users can view their own scans"
  on public.scans for select
  using (auth.uid() = user_id);

create policy "Users can view scans in their organization"
  on public.scans for select
  using (
    org_id in (
      select org_id from public.profiles where id = auth.uid()
    )
  );

create policy "Users can insert their own scans"
  on public.scans for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own scans"
  on public.scans for update
  using (auth.uid() = user_id);

create policy "Users can delete their own scans"
  on public.scans for delete
  using (auth.uid() = user_id);

-- Create index for faster lookups
create index if not exists scans_user_id_idx on public.scans(user_id);
create index if not exists scans_org_id_idx on public.scans(org_id);
create index if not exists scans_content_hash_idx on public.scans(content_hash);
