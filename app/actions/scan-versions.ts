"use server"

import { createClient } from "@/lib/supabase/server"
import type { ScanVersion } from "@/lib/types/database"

export async function getScanVersions(scanId: string): Promise<ScanVersion[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Fetch all versions for the given scan_id, ordered by version_number ascending
  const { data: scanVersions, error } = await supabase
    .from("scan_versions")
    .select("*")
    .eq("scan_id", scanId)
    .order("version_number", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching scan versions:", error)
    throw new Error("Failed to retrieve scan versions.")
  }

  return scanVersions
}

