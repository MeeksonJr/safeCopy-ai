"use server"

import { createAdminClient } from "@/lib/supabase/server"

interface OnboardingData {
  userId: string
  fullName: string
  companyName: string
  industry: string
  teamName: string
}

export async function completeOnboarding(data: OnboardingData) {
  const supabase = createAdminClient()

  try {
    // Create team first
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .insert({
        name: data.teamName,
        owner_id: data.userId,
        plan: "free",
        scan_count: 0,
        scan_limit: 50,
        monthly_credits: 50,
        credits_used: 0,
      })
      .select()
      .single()

    if (teamError) {
      console.error("[v0] Team creation error:", teamError)
      throw teamError
    }

    // Update profile with team and details
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: data.fullName,
        company_name: data.companyName,
        industry: data.industry,
        team_id: team.id,
        role: "admin",
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.userId)

    if (profileError) {
      console.error("[v0] Profile update error:", profileError)
      throw profileError
    }

    // Create audit log
    await supabase.from("audit_logs").insert({
      user_id: data.userId,
      team_id: team.id,
      action: "account_created",
      details: {
        team_name: data.teamName,
        industry: data.industry,
        plan: "free",
      },
    })

    return { success: true, teamId: team.id }
  } catch (error) {
    console.error("[v0] Onboarding error:", error)
    return { success: false, error: "Failed to complete onboarding" }
  }
}
