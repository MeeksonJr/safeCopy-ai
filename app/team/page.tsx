import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TeamOverview } from "@/components/team/team-overview"
import { TeamActivity } from "@/components/team/team-activity"
import { getAuditLogs } from "@/app/actions/audit-logs"
import { inviteTeamMember, updateTeamMemberRole } from "@/app/actions/team"

interface TeamPageProps {
  searchParams: {
    search?: string
    action?: string
    page?: string
    pageSize?: string
  }
}

export default async function TeamPage({ searchParams }: TeamPageProps) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch team data if user has a team
  let teamData = null
  let teamMembers = []
  if (profile?.team_id) {
    const { data: team } = await supabase.from("teams").select("*").eq("id", profile.team_id).single()

    const { data: members } = await supabase.from("profiles").select("*").eq("team_id", profile.team_id)

    teamData = team
    teamMembers = members || []
  }

  const searchQuery = searchParams.search || undefined
  const actionFilter = searchParams.action || undefined
  const currentPage = parseInt(searchParams.page || "1")
  const pageSize = parseInt(searchParams.pageSize || "10")

  // Fetch audit logs using the new action
  const { auditLogs, count } = await getAuditLogs({
    teamId: profile?.team_id || undefined,
    searchQuery: searchQuery,
    actionFilter: actionFilter,
    page: currentPage,
    pageSize: pageSize,
  })

  return (
    <DashboardShell profile={profile}>
      <div className="space-y-8">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">Team Management</h1>
          <p className="mt-2 text-pretty text-muted-foreground">Manage team members, roles, and compliance activity.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <TeamOverview
            team={teamData}
            members={teamMembers}
            profile={profile}
            inviteTeamMemberAction={inviteTeamMember}
            updateTeamMemberRoleAction={updateTeamMemberRole}
          />
          <TeamActivity
            logs={auditLogs || []}
            totalLogs={count || 0}
            currentPage={currentPage}
            pageSize={pageSize}
            currentSearch={searchQuery}
            currentActionFilter={actionFilter}
          />
        </div>
      </div>
    </DashboardShell>
  )
}
