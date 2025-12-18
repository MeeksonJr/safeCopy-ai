"use server"

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { createAuditLog } from "./create-audit-log"

interface UpdateProfileParams {
  fullName: string
  companyName: string
  industry: string
}

export async function updateProfile({ fullName, companyName, industry }: UpdateProfileParams) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const adminClient = createAdminClient()

  const { error } = await adminClient
    .from("profiles")
    .update({
      full_name: fullName,
      company_name: companyName,
      industry,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (error) {
    console.error("[v0] Error updating profile:", error)
    throw error
  }

  await createAuditLog({
    action: "profile_updated",
    details: {
      full_name: fullName,
      company_name: companyName,
      industry,
    },
  })

  return { success: true }
}
