"use server"

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { createAuditLog } from "./create-audit-log"
import type { Flag, Suggestion } from "@/lib/types/database"

interface SaveScanParams {
  originalContent: string
  rewrittenContent?: string
  safetyScore: number
  riskLevel: "safe" | "warning" | "danger"
  flaggedIssues: Flag[]
  suggestions?: Suggestion[]
  industry?: string
  contentType?: string
}

export async function saveScan({
  originalContent,
  rewrittenContent,
  safetyScore,
  riskLevel,
  flaggedIssues,
  suggestions,
  industry,
  contentType,
}: SaveScanParams) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Get user profile to get team_id
  const { data: profile } = await supabase.from("profiles").select("team_id").eq("id", user.id).single()

  // Use admin client to bypass RLS for insert
  const adminClient = createAdminClient()

  // Insert scan
  const { data: scan, error } = await adminClient
    .from("scans")
    .insert({
      user_id: user.id,
      team_id: profile?.team_id || null,
      original_content: originalContent,
      rewritten_content: rewrittenContent || null,
      safety_score: safetyScore,
      risk_level: riskLevel,
      flagged_issues: flaggedIssues,
      suggestions: suggestions || [],
      industry: industry || "general",
      content_type: contentType || "marketing",
      status: "completed",
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error saving scan:", error)
    throw error
  }

  // Create audit log
  await createAuditLog({
    action: safetyScore < 50 ? "scan_high_risk" : "scan_completed",
    details: {
      scan_id: scan.id,
      safety_score: safetyScore,
      risk_level: riskLevel,
      flags_count: flaggedIssues.length,
    },
    scanId: scan.id,
  })

  return scan
}
