"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import type { Scan } from "@/lib/types/database"

interface RiskTrendsProps {
  scans: Scan[]
}

export function RiskTrends({ scans }: RiskTrendsProps) {
  const riskData = [
    {
      category: "High Risk",
      count: scans.filter((s) => s.safety_score !== null && s.safety_score < 50).length,
      fill: "oklch(0.6 0.22 25)",
    },
    {
      category: "Medium Risk",
      count: scans.filter((s) => s.safety_score !== null && s.safety_score >= 50 && s.safety_score < 80).length,
      fill: "oklch(0.75 0.15 85)",
    },
    {
      category: "Safe",
      count: scans.filter((s) => s.safety_score !== null && s.safety_score >= 80).length,
      fill: "oklch(0.65 0.18 145)",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {scans.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No data to display yet
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={riskData}>
                <XAxis dataKey="category" stroke="oklch(0.5 0 0)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.5 0 0)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "oklch(0.18 0 0)" }}
                  contentStyle={{
                    background: "oklch(0.12 0 0)",
                    border: "1px solid oklch(0.22 0 0)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-6 space-y-2">
              {riskData.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-sm text-muted-foreground">{item.category}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.count}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
