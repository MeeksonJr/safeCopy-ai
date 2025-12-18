"use server"

import { createClient } from "@/lib/supabase/server"

interface GetScansParams {
  userId?: string
  teamId?: string
  searchQuery?: string
  minSafetyScore?: number
  maxSafetyScore?: number
  page?: number
  pageSize?: number
  industry?: string
}

export async function getScans({
  userId,
  teamId,
  searchQuery,
  minSafetyScore,
  maxSafetyScore,
  page = 1,
  pageSize = 10,
}: GetScansParams) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && !userId && !teamId) {
    throw new Error("Unauthorized: No user or specific ID provided for scan fetching")
  }

  let query = supabase.from("scans").select("*", { count: "exact" }).order("created_at", { ascending: false })

  if (userId) {
    query = query.eq("user_id", userId)
  } else if (teamId) {
    query = query.eq("team_id", teamId)
  } else if (user) {
    query = query.eq("user_id", user.id)
  }

  if (searchQuery) {
    query = query.ilike("original_text", `%${searchQuery}%`)
  }

  if (minSafetyScore !== undefined) {
    query = query.gte("safety_score", minSafetyScore)
  }

  if (maxSafetyScore !== undefined) {
    query = query.lte("safety_score", maxSafetyScore)
  }

  const start = (page - 1) * pageSize
  const end = start + pageSize - 1
  query = query.range(start, end)

  const { data: scans, error, count } = await query

  if (error) {
    console.error("[v0] Error fetching scans:", error)
    throw error
  }

  return { scans, count }
}

