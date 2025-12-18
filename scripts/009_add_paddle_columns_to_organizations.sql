-- Add Paddle-related columns to organizations table
ALTER TABLE public.organizations
ADD COLUMN IF NOT EXISTS paddle_customer_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS paddle_subscription_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS subscription_status TEXT;

-- Optionally, create an index for faster lookups by Paddle customer ID
CREATE INDEX IF NOT EXISTS idx_organizations_paddle_customer_id ON public.organizations(paddle_customer_id);

