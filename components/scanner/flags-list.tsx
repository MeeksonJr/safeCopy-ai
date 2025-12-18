"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Sparkles } from "lucide-react"
import type { Flag } from "@/lib/types/database"

interface FlagsListProps {
  flags: Flag[]
  content: string
  onApplySuggestion: (newContent: string) => void
}

export function FlagsList({ flags, content, onApplySuggestion }: FlagsListProps) {
  const handleApplySuggestion = (flag: Flag) => {
    if (!flag.suggestion) return

    const before = content.substring(0, flag.start)
    const after = content.substring(flag.end)
    const newContent = before + flag.suggestion + after

    onApplySuggestion(newContent)
  }

  const getBadgeColor = (type: "high" | "medium" | "low") => {
    switch (type) {
      case "high":
        return "bg-risk-red/10 text-risk-red border-risk-red/20"
      case "medium":
        return "bg-warning-yellow/10 text-warning-yellow border-warning-yellow/20"
      case "low":
        return "bg-trust-blue/10 text-trust-blue border-trust-blue/20"
    }
  }

  if (flags.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Compliance Flags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No issues detected yet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Compliance Flags ({flags.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {flags.map((flag, index) => (
          <div key={index} className="space-y-2 rounded-lg border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <Badge variant="outline" className={getBadgeColor(flag.type)}>
                {flag.type.toUpperCase()}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="font-mono text-sm text-foreground">"{flag.text}"</p>
              <p className="text-sm text-muted-foreground">{flag.reason}</p>
            </div>

            {flag.suggestion && (
              <div className="mt-3 space-y-2 rounded-md bg-safe-green/5 p-3">
                <div className="flex items-center gap-2 text-sm font-medium text-safe-green">
                  <Sparkles className="h-4 w-4" />
                  Suggested Fix
                </div>
                <p className="font-mono text-sm text-foreground">"{flag.suggestion}"</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 w-full border-safe-green/20 text-safe-green hover:bg-safe-green/10 bg-transparent"
                  onClick={() => handleApplySuggestion(flag)}
                >
                  Apply Suggestion
                </Button>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
