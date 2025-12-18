import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ScanDetails } from "@/components/scans/scan-details"

export default async function ScanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: scan } = await supabase.from("scans").select("*").eq("id", id).eq("user_id", user.id).single()

  if (!scan) {
    notFound()
  }

  return (
    <DashboardShell profile={profile}>
      <ScanDetails scan={scan} />
    </DashboardShell>
  )
}
