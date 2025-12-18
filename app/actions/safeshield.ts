// app/actions/safeshield.ts
"use server"

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { generateRandomString } from "@/lib/utils"

interface RequestCertificationParams {
  organizationId: string
}

export async function requestSafeShieldCertification({
  organizationId,
}: RequestCertificationParams) {
  const supabase = createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: "Unauthorized" }
  }

  try {
    const adminClient = createAdminClient()

    // Verify the requesting user is an admin or compliance_officer of the organization
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .eq("org_id", organizationId)
      .single()

    if (profileError || !profile || (profile.role !== "admin" && profile.role !== "compliance_officer")) {
      return { error: "Forbidden: Insufficient permissions to request SafeShield certification." }
    }

    // In a real scenario, this would trigger a more complex review process:
    // 1. Check organization's compliance history (e.g., average safety score over time).
    // 2. Potentially require manual review by a compliance officer.
    // 3. Upon approval, set safeshield_certified to true and generate badge code.

    // For now, simulate an automatic approval and badge generation
    const badgeCode = `<div data-safeshield-id="${organizationId}" style="display:inline-block;padding:8px 12px;border:1px solid #10B981;border-radius:4px;background-color:#10B9811A;color:#10B981;font-family:sans-serif;font-size:14px;font-weight:600;">Verified by SafeCopy AI</div>`

    const { data: updatedOrganization, error: updateError } = await adminClient
      .from("organizations")
      .update({
        safeshield_certified: true,
        safeshield_badge_code: badgeCode,
        updated_at: new Date().toISOString(),
      })
      .eq("id", organizationId)
      .select()
      .single()

    if (updateError) {
      console.error("[v0] Error updating organization for SafeShield certification:", updateError)
      return { error: updateError.message }
    }

    revalidatePath("/settings")
    return { success: true, organization: updatedOrganization }
  } catch (error) {
    console.error("[v0] Unexpected error requesting SafeShield certification:", error)
    return { error: "An unexpected error occurred during SafeShield certification request." }
  }
}

