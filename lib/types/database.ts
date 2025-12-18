export type SubscriptionTier = "free" | "pro" | "enterprise"
export type UserRole = "admin" | "member" | "viewer" | "writer" | "compliance_officer"
export type ScanStatus = "processing" | "completed" | "failed"
export type RiskLevel = "safe" | "warning" | "danger"

export interface Team {
  id: string
  name: string
  owner_id: string
  plan: SubscriptionTier
  scan_count: number
  scan_limit: number
  monthly_credits: number
  credits_used: number
  organization_id: string | null
  created_at: string
  updated_at: string
}

export interface Organization {
  id: string
  name: string
  subscription_tier: SubscriptionTier
  risk_tolerance: number
  paypal_customer_id: string | null
  paypal_subscription_id: string | null
  subscription_status: string | null
  custom_ai_instructions: string | null
  custom_rule_sets: string[] | null
  safeshield_certified: boolean
  safeshield_badge_code: string | null
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  industry: string | null
  company_name: string | null
  team_id: string | null
  org_id: string | null
  created_at: string
  updated_at: string
}

export interface Scan {
  id: string
  user_id: string
  team_id: string | null
  original_content: string
  rewritten_content: string | null
  safety_score: number | null
  risk_level: RiskLevel | null
  flagged_issues: Flag[]
  suggestions: Suggestion[]
  content_type: string | null
  industry: string | null
  status: ScanStatus
  created_at: string
  updated_at: string
  current_version_id: string | null
}

export interface ScanVersion {
  id: string
  scan_id: string
  version_number: number
  original_text: string
  rewritten_content: string | null
  created_at: string
}

export interface Flag {
  type: "high" | "medium" | "low"
  text: string
  reason: string
  start: number
  end: number
  suggestion?: string
}

export interface Suggestion {
  original: string
  replacement: string
  reason: string
}

export interface Template {
  id: string
  user_id: string
  team_id: string | null
  title: string
  content: string
  category: string
  industry: string | null
  safety_score: number
  is_approved: boolean
  created_at: string
  updated_at: string
}

export interface AuditLog {
  id: string
  user_id: string
  team_id: string | null
  scan_id: string | null
  action: string
  details: Record<string, any>
  created_at: string
}

export interface TeamInvite {
  id: string
  team_id: string
  email: string
  role: UserRole
  status: "pending" | "accepted" | "expired"
  invited_by: string
  created_at: string
  expires_at: string
}
