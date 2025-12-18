-- Create team_invites table
CREATE TABLE IF NOT EXISTS public.team_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  invited_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'writer', 'compliance_officer')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.team_invites ENABLE ROW LEVEL SECURITY;

-- Policies for team_invites
-- Admins can create invitations for their team
CREATE POLICY "Admins can invite members to their team"
  ON public.team_invites FOR INSERT
  WITH CHECK (
    team_id IN (
      SELECT team_id FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'compliance_officer')
    )
  );

-- Users can view invites sent to them (for acceptance/rejection)
CREATE POLICY "Users can view invites sent to them"
  ON public.team_invites FOR SELECT
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Admins can view invites for their team
CREATE POLICY "Admins can view invites for their team"
  ON public.team_invites FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'compliance_officer')
    )
  );

-- Admins can delete invites for their team
CREATE POLICY "Admins can delete invites for their team"
  ON public.team_invites FOR DELETE
  USING (
    team_id IN (
      SELECT team_id FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'compliance_officer')
    )
  );

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_team_invites_team_id ON public.team_invites(team_id);
CREATE INDEX IF NOT EXISTS idx_team_invites_email ON public.team_invites(email);

