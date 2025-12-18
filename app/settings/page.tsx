import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SettingsForm } from "@/components/settings/settings-form"

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get team info if user has a team
  let team = null
  let organization = null
  if (profile?.team_id) {
    const { data } = await supabase.from("teams").select("*").eq("id", profile.team_id).single()
    team = data
    if (team?.organization_id) {
      const { data: orgData } = await supabase.from("organizations").select("*").eq("id", team.organization_id).single()
      organization = orgData
    }
  }

  return (
    <DashboardShell profile={profile}>
      <SettingsForm profile={profile} team={team} organization={organization} userEmail={user.email || ""} />
    </DashboardShell>
  )
}
