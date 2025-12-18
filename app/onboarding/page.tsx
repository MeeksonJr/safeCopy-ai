import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard"

export default async function OnboardingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if already onboarded
  const { data: profile } = await supabase.from("profiles").select("team_id").eq("id", user.id).single()

  if (profile?.team_id) {
    redirect("/dashboard")
  }

  return <OnboardingWizard userEmail={user.email || ""} userId={user.id} />
}
