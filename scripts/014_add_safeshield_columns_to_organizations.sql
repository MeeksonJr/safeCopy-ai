-- Add SafeShield certification columns to organizations table
ALTER TABLE public.organizations
ADD COLUMN IF NOT EXISTS safeshield_certified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS safeshield_badge_code TEXT;

