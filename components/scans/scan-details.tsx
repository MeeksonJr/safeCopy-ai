"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Copy, Check, Sparkles, AlertTriangle, CheckCircle, FileText, Clock, Building2 } from "lucide-react"
import type { Scan, Flag } from "@/lib/types/database"
import Link from "next/link"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

interface ScanDetailsProps {
  scan: Scan
}

export function ScanDetails({ scan }: ScanDetailsProps) {
  const [copiedOriginal, setCopiedOriginal] = useState(false)
  const [copiedRewrite, setCopiedRewrite] = useState(false)
  const { toast } = useToast()

  const handleCopy = async (content: string, type: "original" | "rewrite") => {
    await navigator.clipboard.writeText(content)
    if (type === "original") {
      setCopiedOriginal(true)
      setTimeout(() => setCopiedOriginal(false), 2000)
    } else {
      setCopiedRewrite(true)
      setTimeout(() => setCopiedRewrite(false), 2000)
    }
    toast({
      title: "Copied!",
      description: "Content copied to clipboard.",
    })
  }

  const getRiskBadge = (level: string | null) => {
    switch (level) {
      case "safe":
        return (
          <Badge className="gap-1 bg-safe-green/10 text-safe-green">
            <CheckCircle className="h-3 w-3" />
            Safe
          </Badge>
        )
      case "warning":
        return (
          <Badge className="gap-1 bg-warning-yellow/10 text-warning-yellow">
            <AlertTriangle className="h-3 w-3" />
            Warning
          </Badge>
        )
      case "danger":
        return (
          <Badge className="gap-1 bg-risk-red/10 text-risk-red">
            <AlertTriangle className="h-3 w-3" />
            High Risk
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getScoreColor = (score: number | null) => {
    if (!score) return "text-muted-foreground"
    if (score >= 80) return "text-safe-green"
    if (score >= 50) return "text-warning-yellow"
    return "text-risk-red"
  }

  const getFlagBadgeColor = (type: "high" | "medium" | "low") => {
    switch (type) {
      case "high":
        return "bg-risk-red/10 text-risk-red border-risk-red/20"
      case "medium":
        return "bg-warning-yellow/10 text-warning-yellow border-warning-yellow/20"
      case "low":
        return "bg-trust-blue/10 text-trust-blue border-trust-blue/20"
    }
  }

  const flags = (scan.flagged_issues as Flag[]) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild className="bg-transparent">
            <Link href="/scans">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Scan Details</h1>
            <p className="text-sm text-muted-foreground">Scanned {format(new Date(scan.created_at), "PPp")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getRiskBadge(scan.risk_level)}
          <div className={`text-2xl font-bold ${getScoreColor(scan.safety_score)}`}>
            {scan.safety_score ?? "-"}
            <span className="text-sm font-normal text-muted-foreground">/100</span>
          </div>
        </div>
      </div>

      {/* Meta Info */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <Building2 className="h-5 w-5 text-trust-blue" />
            <div>
              <p className="text-xs text-muted-foreground">Industry</p>
              <p className="font-medium capitalize">{scan.industry?.replace("_", " ") || "General"}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertTriangle className="h-5 w-5 text-warning-yellow" />
            <div>
              <p className="text-xs text-muted-foreground">Issues Found</p>
              <p className="font-medium">{flags.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Content Type</p>
              <p className="font-medium capitalize">{scan.content_type || "Marketing"}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="font-medium capitalize">{scan.status}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Card>
        <Tabs defaultValue="original">
          <CardHeader className="pb-3">
            <TabsList className="grid w-full grid-cols-2 sm:w-auto">
              <TabsTrigger value="original" className="gap-2">
                <FileText className="h-4 w-4" />
                Original
              </TabsTrigger>
              <TabsTrigger value="rewrite" className="gap-2" disabled={!scan.rewritten_content}>
                <Sparkles className="h-4 w-4" />
                AI Rewrite
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            <TabsContent value="original" className="mt-0">
              <div className="relative">
                <div className="min-h-[200px] rounded-lg bg-muted/50 p-4">
                  <pre className="whitespace-pre-wrap font-mono text-sm">{scan.original_content}</pre>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-2 top-2 gap-2 bg-white"
                  onClick={() => handleCopy(scan.original_content, "original")}
                >
                  {copiedOriginal ? <Check className="h-4 w-4 text-safe-green" /> : <Copy className="h-4 w-4" />}
                  {copiedOriginal ? "Copied!" : "Copy"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="rewrite" className="mt-0">
              {scan.rewritten_content ? (
                <div className="relative">
                  <div className="min-h-[200px] rounded-lg bg-safe-green/5 p-4">
                    <Badge className="mb-3 bg-safe-green/10 text-safe-green">
                      <Sparkles className="mr-1 h-3 w-3" />
                      AI Optimized
                    </Badge>
                    <pre className="whitespace-pre-wrap font-mono text-sm">{scan.rewritten_content}</pre>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-2 top-2 gap-2 bg-white"
                    onClick={() => handleCopy(scan.rewritten_content!, "rewrite")}
                  >
                    {copiedRewrite ? <Check className="h-4 w-4 text-safe-green" /> : <Copy className="h-4 w-4" />}
                    {copiedRewrite ? "Copied!" : "Copy"}
                  </Button>
                </div>
              ) : (
                <div className="flex min-h-[200px] items-center justify-center text-muted-foreground">
                  No AI rewrite available for this scan
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Flags */}
      {flags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning-yellow" />
              Compliance Issues ({flags.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {flags.map((flag, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="outline" className={getFlagBadgeColor(flag.type)}>
                    {flag.type.toUpperCase()}
                  </Badge>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="font-mono text-sm text-foreground">"{flag.text}"</p>
                  <p className="text-sm text-muted-foreground">{flag.reason}</p>
                </div>
                {flag.suggestion && (
                  <div className="mt-3 rounded-md bg-safe-green/5 p-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-safe-green">
                      <Sparkles className="h-4 w-4" />
                      Suggested Fix
                    </div>
                    <p className="mt-1 font-mono text-sm">"{flag.suggestion}"</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
