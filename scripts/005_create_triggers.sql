-- Function to auto-create profile and organization on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
begin
  -- Create a new organization for the user
  insert into public.organizations (name)
  values (coalesce(new.raw_user_meta_data->>'organization_name', 'My Organization'))
  returning id into new_org_id;

  -- Create the user profile
  insert into public.profiles (id, org_id, full_name, industry, role)
  values (
    new.id,
    new_org_id,
    coalesce(new.raw_user_meta_data->>'full_name', null),
    coalesce(new.raw_user_meta_data->>'industry', null),
    'admin'
  );

  return new;
end;
$$;

-- Trigger to create profile on user creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Add updated_at triggers
drop trigger if exists organizations_updated_at on public.organizations;
create trigger organizations_updated_at
  before update on public.organizations
  for each row
  execute function public.handle_updated_at();

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

drop trigger if exists scans_updated_at on public.scans;
create trigger scans_updated_at
  before update on public.scans
  for each row
  execute function public.handle_updated_at();
