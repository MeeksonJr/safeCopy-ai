"use server"

import { createClient } from "@/lib/supabase/server"

interface CreateAuditLogParams {
  action: string
  details?: Record<string, any>
  scanId?: string
}

export async function createAuditLog({ action, details = {}, scanId }: CreateAuditLogParams) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Get user profile to get team_id
  const { data: profile } = await supabase.from("profiles").select("team_id").eq("id", user.id).single()

  const { error } = await supabase.from("audit_logs").insert({
    user_id: user.id,
    team_id: profile?.team_id || null,
    scan_id: scanId || null,
    action,
    details,
  })

  if (error) {
    console.error("[v0] Error creating audit log:", error)
    throw error
  }
}
