import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TemplatesLibrary } from "@/components/templates/templates-library"
import { getTemplates, createTemplate, updateTemplate, deleteTemplate } from "@/app/actions/templates"

export default async function TemplatesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch user's saved templates using the new action
  const { templates: userTemplates } = await getTemplates({ userId: user.id })

  // Fetch team templates if user has a team
  let teamTemplates: any[] = []
  if (profile?.team_id) {
    const { templates: fetchedTeamTemplates } = await getTemplates({ teamId: profile.team_id, excludeUserId: user.id })
    teamTemplates = fetchedTeamTemplates || []
  }

  return (
    <DashboardShell profile={profile}>
      <TemplatesLibrary
        userTemplates={userTemplates || []}
        teamTemplates={teamTemplates}
        profile={profile}
        createTemplateAction={createTemplate}
        updateTemplateAction={updateTemplate}
        deleteTemplateAction={deleteTemplate}
      />
    </DashboardShell>
  )
}

