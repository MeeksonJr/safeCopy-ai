import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import type { Scan } from "@/lib/types/database"

interface RecentScansProps {
  scans: Scan[]
}

export function RecentScans({ scans }: RecentScansProps) {
  const getScoreBadge = (score: number | null) => {
    if (score === null) return <Badge variant="outline">Pending</Badge>
    if (score >= 80) return <Badge className="bg-safe-green/10 text-safe-green border-safe-green/20">{score}</Badge>
    if (score >= 50)
      return <Badge className="bg-warning-yellow/10 text-warning-yellow border-warning-yellow/20">{score}</Badge>
    return <Badge className="bg-risk-red/10 text-risk-red border-risk-red/20">{score}</Badge>
  }

  if (scans.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-muted-foreground">No scans yet. Start by scanning your first content!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Scans</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {scans.map((scan) => (
            <div key={scan.id} className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
              <div className="flex-1 space-y-1 overflow-hidden">
                <p className="truncate font-mono text-sm text-foreground">
                  {scan.original_content.substring(0, 80)}
                  {scan.original_content.length > 80 && "..."}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(scan.created_at), { addSuffix: true })}
                </p>
              </div>
              <div>{getScoreBadge(scan.safety_score)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
