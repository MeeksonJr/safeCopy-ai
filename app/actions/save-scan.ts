"use server"

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { createAuditLog } from "./create-audit-log"
import type { Flag, Suggestion } from "@/lib/types/database"

interface SaveScanParams {
  scanId?: string
  originalContent: string
  rewrittenContent?: string
  safetyScore: number
  riskLevel: "safe" | "warning" | "danger"
  flaggedIssues: Flag[]
  suggestions?: Suggestion[]
  industry?: string
  contentType?: string
}

export async function saveScan(
  scanId: string | undefined,
  {
    originalContent,
    rewrittenContent,
    safetyScore,
    riskLevel,
    flaggedIssues,
    suggestions,
    industry,
    contentType,
  }: Omit<SaveScanParams, "scanId">,
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Get user profile to get team_id
  const { data: profile, error: profileError } = await supabase.from("profiles").select("team_id").eq("id", user.id).single()
  if (profileError || !profile?.team_id) {
    throw new Error("User does not belong to a team or profile not found.")
  }

  // Check and decrement credits
  const { data: creditUseResult, error: creditError } = await supabase.rpc('use_team_credit', { team_uuid: profile.team_id })

  if (creditError) {
    console.error("[v0] Error using team credit:", creditError)
    throw new Error("Failed to use team credit.")
  }

  if (!creditUseResult) {
    throw new Error("Insufficient credits to perform scan.")
  }

  // Use admin client to bypass RLS for insert
  const adminClient = createAdminClient()

  let currentScanId = scanId
  let currentScanVersionNumber = 1

  if (currentScanId) {
    // Fetch the existing scan to determine the next version number
    const { data: existingScan, error: fetchScanError } = await adminClient
      .from("scans")
      .select("id, current_version_id")
      .eq("id", currentScanId)
      .single()

    if (fetchScanError || !existingScan) {
      console.error("[v0] Error fetching existing scan:", fetchScanError)
      throw new Error("Failed to fetch existing scan.")
    }

    // Get the highest version number for this scan
    const { data: latestVersion, error: fetchVersionError } = await adminClient
      .from("scan_versions")
      .select("version_number")
      .eq("scan_id", currentScanId)
      .order("version_number", { ascending: false })
      .limit(1)
      .single()

    if (fetchVersionError && fetchVersionError.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error("[v0] Error fetching latest scan version:", fetchVersionError)
      throw new Error("Failed to fetch latest scan version.")
    }

    if (latestVersion) {
      currentScanVersionNumber = latestVersion.version_number + 1
    }
  } else {
    // Create new scan entry
    const { data: newScan, error: insertScanError } = await adminClient
      .from("scans")
      .insert({
        user_id: user.id,
        team_id: profile?.team_id || null,
        industry: industry || "general",
        content_type: contentType || "marketing",
        status: "completed",
        // The current_version_id will be set after the first version is created
      })
      .select("id")
      .single()

    if (insertScanError || !newScan) {
      console.error("[v0] Error inserting new scan:", insertScanError)
      throw insertScanError
    }
    currentScanId = newScan.id
  }

  if (!currentScanId) {
    throw new Error("Scan ID could not be determined.")
  }

  // Insert new scan version
  const { data: newVersion, error: versionError } = await adminClient
    .from("scan_versions")
    .insert({
      scan_id: currentScanId,
      version_number: currentScanVersionNumber,
      original_text: originalContent,
      rewritten_content: rewrittenContent || null,
    })
    .select()
    .single()

  if (versionError || !newVersion) {
    console.error("[v0] Error inserting scan version:", versionError)
    throw versionError
  }

  // Update the main scan entry with the latest analysis and current version ID
  const { data: updatedScan, error: updateScanError } = await adminClient
    .from("scans")
    .update({
      safety_score: safetyScore,
      risk_level: riskLevel,
      flagged_issues: flaggedIssues,
      suggestions: suggestions || [],
      current_version_id: newVersion.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", currentScanId)
    .select()
    .single()

  if (updateScanError || !updatedScan) {
    console.error("[v0] Error updating scan with new version:", updateScanError)
    throw updateScanError
  }

  const scan = updatedScan

  if (Error) {
    console.error("[v0] Error saving scan:", Error)
    throw Error
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
