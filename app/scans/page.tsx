import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ScansHistory } from "@/components/scans/scans-history"
import { getScans } from "@/app/actions/scans"

interface ScansPageProps {
  searchParams: {
    search?: string
    risk?: string
    industry?: string
    page?: string
    pageSize?: string
  }
}

export default async function ScansPage({ searchParams }: ScansPageProps) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const searchQuery = searchParams.search || undefined
  const riskFilter = searchParams.risk || undefined
  const industryFilter = searchParams.industry || undefined
  const currentPage = parseInt(searchParams.page || "1")
  const pageSize = parseInt(searchParams.pageSize || "10")

  const { scans, count } = await getScans({
    userId: user.id,
    searchQuery: searchQuery,
    minSafetyScore: riskFilter === "safe" ? 80 : undefined,
    maxSafetyScore: riskFilter === "danger" ? 49 : undefined,
    industry: industryFilter,
    page: currentPage,
    pageSize: pageSize,
  })

  return (
    <DashboardShell profile={profile}>
      <ScansHistory
        scans={scans || []}
        totalScans={count || 0}
        currentPage={currentPage}
        pageSize={pageSize}
        currentSearch={searchQuery}
        currentRiskFilter={riskFilter}
        currentIndustryFilter={industryFilter}
      />
    </DashboardShell>
  )
}
