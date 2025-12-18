// components/dashboard/content-type-distribution-chart.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface ContentTypeDistribution {
  name: string
  value: number
}

interface ContentTypeDistributionChartProps {
  data: ContentTypeDistribution[]
}

const COLORS = ["#2563EB", "#10B981", "#EF4444", "#F59E0B", "#6366F1", "#EC4899"]

export function ContentTypeDistributionChart({ data }: ContentTypeDistributionChartProps) {
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Content Type Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No data to display yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "oklch(0.12 0 0)",
                  border: "1px solid oklch(0.22 0 0)",
                  borderRadius: "8px",
                }}
                formatter={(value: number, name: string) => [`${value}`, name.charAt(0).toUpperCase() + name.slice(1)]}
              />
              <Legend
                align="right"
                verticalAlign="middle"
                layout="vertical"
                wrapperStyle={{ right: -20, width: "30%" }}
                formatter={(value: string) => <span className="text-sm text-muted-foreground">{value.charAt(0).toUpperCase() + value.slice(1)}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

