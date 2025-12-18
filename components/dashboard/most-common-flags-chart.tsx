// components/dashboard/most-common-flags-chart.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

interface CommonFlag {
  name: string
  value: number
}

interface MostCommonFlagsChartProps {
  data: CommonFlag[]
}

export function MostCommonFlagsChart({ data }: MostCommonFlagsChartProps) {
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Most Common Flags</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No data to display yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} layout="vertical">
              <XAxis type="number" stroke="oklch(0.5 0 0)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="oklch(0.5 0 0)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={90} // Adjust width to prevent label truncation
              />
              <Tooltip
                cursor={{ fill: "oklch(0.18 0 0)" }}
                contentStyle={{
                  background: "oklch(0.12 0 0)",
                  border: "1px solid oklch(0.22 0 0)",
                  borderRadius: "8px",
                }}
                formatter={(value: number, name: string) => [`${value}`, name.charAt(0).toUpperCase() + name.slice(1)]}
              />
              <Bar dataKey="value" fill="#EF4444" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

