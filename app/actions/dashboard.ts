// app/actions/dashboard.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import type { Scan, Flag } from "@/lib/types/database"
import { subDays, format, parseISO } from "date-fns"

interface ScanTrendData {
  created_at: string;
  safety_score: number | null;
}

interface ScanContentTypeData {
  content_type: string | null;
}

interface ScanFlagData {
  flagged_issues: Flag[] | null;
}

interface ChartDataPoint {
  date: string
  value: number
}

interface ContentTypeDistribution {
  name: string
  value: number
}

interface CommonFlag {
  name: string
  value: number
}

export async function getComplianceTrends(userId: string, teamId: string | null, days: number = 30): Promise<ChartDataPoint[]> {
  const supabase = await createClient()
  const startDate = subDays(new Date(), days)

  let query = supabase.from("scans")
    .select("created_at, safety_score")
    .eq("user_id", userId)
    .gte("created_at", startDate.toISOString())
    .not("safety_score", "is", null)

  if (teamId) {
    query = query.or(`user_id.eq.${userId},team_id.eq.${teamId}`)
  }

  const { data: scans, error } = await query.order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching compliance trends:", error)
    return []
  }

  const dailyScores: { [key: string]: { sum: number, count: number } } = {}
  scans.forEach((scan: ScanTrendData) => {
    const date = format(parseISO(scan.created_at), 'yyyy-MM-dd')
    if (!dailyScores[date]) {
      dailyScores[date] = { sum: 0, count: 0 }
    }
    dailyScores[date].sum += scan.safety_score || 0
    dailyScores[date].count += 1
  })

  const trends: ChartDataPoint[] = []
  for (let i = days - 1; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd')
    const avgScore = dailyScores[date] ? Math.round(dailyScores[date].sum / dailyScores[date].count) : 0
    trends.push({ date: format(parseISO(date), 'MMM d'), value: avgScore })
  }

  return trends
}

export async function getContentTypeDistribution(userId: string, teamId: string | null): Promise<ContentTypeDistribution[]> {
  const supabase = await createClient()

  let query = supabase.from("scans")
    .select("content_type")
    .eq("user_id", userId)
    .not("content_type", "is", null)

  if (teamId) {
    query = query.or(`user_id.eq.${userId},team_id.eq.${teamId}`)
  }

  const { data: scans, error } = await query

  if (error) {
    console.error("Error fetching content type distribution:", error)
    return []
  }

  const typeCounts: { [key: string]: number } = {}
  scans.forEach((scan: ScanContentTypeData) => {
    const type = scan.content_type || "other"
    typeCounts[type] = (typeCounts[type] || 0) + 1
  })

  return Object.entries(typeCounts).map(([name, value]) => ({ name, value }))
}

export async function getMostCommonFlags(userId: string, teamId: string | null, limit: number = 5): Promise<CommonFlag[]> {
  const supabase = await createClient()

  let query = supabase.from("scans")
    .select("flagged_issues")
    .eq("user_id", userId)
    .not("flagged_issues", "is", null)

  if (teamId) {
    query = query.or(`user_id.eq.${userId},team_id.eq.${teamId}`)
  }

  const { data: scans, error } = await query

  if (error) {
    console.error("Error fetching common flags:", error)
    return []
  }

  const flagCounts: { [key: string]: number } = {}
  scans.forEach((scan: ScanFlagData) => {
    if (scan.flagged_issues) {
      (scan.flagged_issues as Flag[]).forEach(flag => {
        const flagType = flag.type || "unknown"
        flagCounts[flagType] = (flagCounts[flagType] || 0) + 1
      })
    }
  })

  return Object.entries(flagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([name, value]) => ({ name, value }))
}

