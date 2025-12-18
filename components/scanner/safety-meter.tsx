import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertTriangle, CheckCircle2 } from "lucide-react"

interface SafetyMeterProps {
  score: number | null
  isAnalyzing: boolean
}

export function SafetyMeter({ score, isAnalyzing }: SafetyMeterProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-safe-green"
    if (score >= 50) return "text-warning-yellow"
    return "text-risk-red"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="h-8 w-8 text-safe-green" />
    if (score >= 50) return <AlertTriangle className="h-8 w-8 text-warning-yellow" />
    return <Shield className="h-8 w-8 text-risk-red" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Safety Score</CardTitle>
      </CardHeader>
      <CardContent>
        {score === null && !isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Shield className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Start typing to see your safety score</p>
          </div>
        ) : isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="h-24 w-24 animate-pulse rounded-full border-4 border-trust-blue/20" />
            <p className="mt-4 text-sm text-muted-foreground">Analyzing content...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="mb-4">{getScoreIcon(score!)}</div>
            <div className={`text-5xl font-bold ${getScoreColor(score!)}`}>{score}</div>
            <div className="mt-2 text-sm text-muted-foreground">out of 100</div>

            <div className="mt-6 w-full">
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full transition-all duration-500 ${
                    score! >= 80 ? "bg-safe-green" : score! >= 50 ? "bg-warning-yellow" : "bg-risk-red"
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              {score! >= 80
                ? "Excellent! Your content is compliant."
                : score! >= 50
                  ? "Moderate risk. Review flagged items."
                  : "High risk! Fix critical issues."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
