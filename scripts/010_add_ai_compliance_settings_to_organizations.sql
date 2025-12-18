-- Add AI compliance settings columns to organizations table
ALTER TABLE public.organizations
ADD COLUMN IF NOT EXISTS custom_ai_instructions TEXT,
ADD COLUMN IF NOT EXISTS custom_rule_sets TEXT[];

