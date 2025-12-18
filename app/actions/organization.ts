// app/actions/organization.ts
"use server"

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface UpdateOrganizationAiSettingsParams {
  organizationId: string
  customAiInstructions?: string | null
  customRuleSets?: string[] | null
}

export async function updateOrganizationAiSettings({
  organizationId,
  customAiInstructions,
  customRuleSets,
}: UpdateOrganizationAiSettingsParams) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: "Unauthorized" }
  }

  try {
    const adminClient = createAdminClient()

    // Verify the updating user is an admin or compliance_officer of the organization
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .eq("org_id", organizationId) // Assuming profiles are linked to organizations directly
      .single()

    if (profileError || !profile || (profile.role !== "admin" && profile.role !== "compliance_officer")) {
      return { error: "Forbidden: Insufficient permissions to update organization AI settings." }
    }

    const { data: updatedOrganization, error: updateError } = await adminClient
      .from("organizations")
      .update({
        custom_ai_instructions: customAiInstructions,
        custom_rule_sets: customRuleSets,
        updated_at: new Date().toISOString(),
      })
      .eq("id", organizationId)
      .select()
      .single()

    if (updateError) {
      console.error("[v0] Error updating organization AI settings:", updateError)
      return { error: updateError.message }
    }

    revalidatePath("/settings")
    return { success: true, organization: updatedOrganization }
  } catch (error) {
    console.error("[v0] Unexpected error updating organization AI settings:", error)
    return { error: "An unexpected error occurred during AI settings update." }
  }
}

