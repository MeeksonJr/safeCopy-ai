import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ComplianceScanner } from "@/components/scanner/compliance-scanner"

export default async function ScannerPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-background">
      <ComplianceScanner profile={profile} />
    </div>
  )
}
