-- Add organization_id column to teams table
ALTER TABLE public.teams
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;

-- Optional: Add an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_teams_organization_id ON public.teams(organization_id);

