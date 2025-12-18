// components/dashboard/compliance-trends-chart.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

interface ChartDataPoint {
  date: string
  value: number
}

interface ComplianceTrendsChartProps {
  data: ChartDataPoint[]
}

export function ComplianceTrendsChart({ data }: ComplianceTrendsChartProps) {
  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle>Compliance Trends (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No data to display yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <XAxis dataKey="date" stroke="oklch(0.5 0 0)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} stroke="oklch(0.5 0 0)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3", stroke: "oklch(0.5 0 0)" }}
                contentStyle={{
                  background: "oklch(0.12 0 0)",
                  border: "1px solid oklch(0.22 0 0)",
                  borderRadius: "8px",
                }}
                labelFormatter={(label) => `Date: ${label}`}
                formatter={(value: number) => [`${value}%`, "Safety Score"]
                }
              />
              <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

