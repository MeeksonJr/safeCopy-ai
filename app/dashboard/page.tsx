import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { RecentScans } from "@/components/dashboard/recent-scans"
import { RiskTrends } from "@/components/dashboard/risk-trends"
import { ComplianceTrendsChart } from "@/components/dashboard/compliance-trends-chart"
import { ContentTypeDistributionChart } from "@/components/dashboard/content-type-distribution-chart"
import { MostCommonFlagsChart } from "@/components/dashboard/most-common-flags-chart"
import { getComplianceTrends, getContentTypeDistribution, getMostCommonFlags } from "@/app/actions/dashboard"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile?.team_id) {
    redirect("/onboarding")
  }

  const { data: team } = await supabase.from("teams").select("*").eq("id", profile.team_id).single()

  // Fetch recent scans
  const { data: recentScans } = await supabase
    .from("scans")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  // Fetch scan statistics
  const { count: totalScans } = await supabase
    .from("scans")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const { data: avgScoreData } = await supabase
    .from("scans")
    .select("safety_score")
    .eq("user_id", user.id)
    .not("safety_score", "is", null)

  const avgScore =
    avgScoreData && avgScoreData.length > 0
      ? Math.round(avgScoreData.reduce((sum, scan) => sum + (scan.safety_score || 0), 0) / avgScoreData.length)
      : null

  const { count: highRiskCount } = await supabase
    .from("scans")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .lt("safety_score", 50)

  const creditsRemaining = team ? (team.monthly_credits || 50) - (team.credits_used || 0) : 0

  const complianceTrends = await getComplianceTrends(user.id, profile?.team_id || null)
  const contentTypeDistribution = await getContentTypeDistribution(user.id, profile?.team_id || null)
  const mostCommonFlags = await getMostCommonFlags(user.id, profile?.team_id || null)

  return (
    <DashboardShell profile={profile}>
      <div className="space-y-8">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-2 text-pretty text-muted-foreground">
            Monitor your compliance activity and team performance.
          </p>
        </div>

        <StatsOverview
          totalScans={totalScans || 0}
          avgScore={avgScore}
          highRiskCount={highRiskCount || 0}
          creditsRemaining={creditsRemaining}
        />

        <div className="grid gap-6 lg:grid-cols-7">
          <ComplianceTrendsChart data={complianceTrends} />
          <ContentTypeDistributionChart data={contentTypeDistribution} />
        </div>

        <div className="grid gap-6 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <RecentScans scans={recentScans || []} />
          </div>
          <div className="lg:col-span-3">
            <RiskTrends scans={recentScans || []} />
            <MostCommonFlagsChart data={mostCommonFlags} />
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
