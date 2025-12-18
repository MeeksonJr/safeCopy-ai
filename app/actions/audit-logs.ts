"use server"

import { createClient } from "@/lib/supabase/server"

interface GetAuditLogsParams {
  userId?: string
  teamId?: string
  searchQuery?: string
  actionFilter?: string
  page?: number
  pageSize?: number
}

export async function getAuditLogs({
  userId,
  teamId,
  searchQuery,
  actionFilter,
  page = 1,
  pageSize = 10,
}: GetAuditLogsParams) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && !userId && !teamId) {
    throw new Error("Unauthorized: No user or specific ID provided for audit log fetching")
  }

  let query = supabase.from("audit_logs").select("*", { count: "exact" }).order("created_at", { ascending: false })

  if (userId) {
    query = query.eq("user_id", userId)
  } else if (teamId) {
    query = query.eq("team_id", teamId)
  } else if (user) {
    // If no specific user or team ID, fetch logs for the current authenticated user's team if they have one
    const { data: profile } = await supabase.from("profiles").select("team_id").eq("id", user.id).single()
    if (profile?.team_id) {
      query = query.eq("team_id", profile.team_id)
    } else {
      query = query.eq("user_id", user.id)
    }
  }

  if (actionFilter) {
    query = query.eq("action", actionFilter)
  }

  if (searchQuery) {
    query = query.or(`action.ilike.%${searchQuery}%,details::text.ilike.%${searchQuery}%`)
  }

  const start = (page - 1) * pageSize
  const end = start + pageSize - 1
  query = query.range(start, end)

  const { data: auditLogs, error, count } = await query

  if (error) {
    console.error("[v0] Error fetching audit logs:", error)
    throw error
  }

  return { auditLogs, count }
}

