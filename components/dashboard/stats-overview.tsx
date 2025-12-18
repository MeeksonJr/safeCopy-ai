import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Shield, AlertTriangle, Zap } from "lucide-react"

interface StatsOverviewProps {
  totalScans: number
  avgScore: number | null
  highRiskCount: number
  creditsRemaining: number
}

export function StatsOverview({ totalScans, avgScore, highRiskCount, creditsRemaining }: StatsOverviewProps) {
  const stats = [
    {
      title: "Total Scans",
      value: totalScans.toLocaleString(),
      icon: TrendingUp,
      color: "text-trust-blue",
      bgColor: "bg-trust-blue/10",
    },
    {
      title: "Avg Safety Score",
      value: avgScore !== null ? avgScore : "—",
      icon: Shield,
      color: avgScore && avgScore >= 80 ? "text-safe-green" : "text-warning-yellow",
      bgColor: avgScore && avgScore >= 80 ? "bg-safe-green/10" : "bg-warning-yellow/10",
    },
    {
      title: "High Risk Flags",
      value: highRiskCount.toLocaleString(),
      icon: AlertTriangle,
      color: "text-risk-red",
      bgColor: "bg-risk-red/10",
    },
    {
      title: "Credits Left",
      value: creditsRemaining.toLocaleString(),
      icon: Zap,
      color: "text-trust-blue",
      bgColor: "bg-trust-blue/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className={`rounded-lg p-2 ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
