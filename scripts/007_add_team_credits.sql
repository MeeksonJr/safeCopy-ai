-- Add credits column to teams table and update plan limits
-- Credits are per-team, not per-user

-- Add credits_used column to track usage
ALTER TABLE public.teams 
ADD COLUMN IF NOT EXISTS credits_used INTEGER DEFAULT 0;

-- Add monthly_credits column based on plan
ALTER TABLE public.teams 
ADD COLUMN IF NOT EXISTS monthly_credits INTEGER DEFAULT 50;

-- Update existing teams with default credits based on plan
UPDATE public.teams 
SET monthly_credits = CASE 
  WHEN plan = 'free' THEN 50
  WHEN plan = 'pro' THEN 500
  WHEN plan = 'enterprise' THEN 5000
  ELSE 50
END
WHERE monthly_credits IS NULL OR monthly_credits = 0;

-- Create function to get remaining credits
CREATE OR REPLACE FUNCTION public.get_team_credits_remaining(team_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  remaining INTEGER;
BEGIN
  SELECT (monthly_credits - credits_used) INTO remaining
  FROM public.teams
  WHERE id = team_uuid;
  
  RETURN COALESCE(remaining, 0);
END;
$$;

-- Create function to decrement credits
CREATE OR REPLACE FUNCTION public.use_team_credit(team_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  SELECT (monthly_credits - credits_used) INTO current_credits
  FROM public.teams
  WHERE id = team_uuid;
  
  IF current_credits > 0 THEN
    UPDATE public.teams 
    SET credits_used = credits_used + 1,
        scan_count = scan_count + 1,
        updated_at = NOW()
    WHERE id = team_uuid;
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;
