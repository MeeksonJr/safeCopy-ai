"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Save, Sparkles, Copy, Check, RefreshCw, FileText, AlertTriangle, CheckCircle, Zap } from "lucide-react"
import type { Profile } from "@/lib/types/database"
import { analyzeScan, type AnalysisResult } from "@/app/actions/analyze"
import { saveScan } from "@/app/actions/save-scan"
import { SafetyMeter } from "./safety-meter"
import { FlagsList } from "./flags-list"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface ComplianceScannerProps {
  profile: Profile | null
}

export function ComplianceScanner({ profile }: ComplianceScannerProps) {
  const [content, setContent] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("original")
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleAnalyze = useCallback(
    async (text: string) => {
      if (!text.trim() || text.length < 20) {
        setAnalysis(null)
        return
      }

      setIsAnalyzing(true)

      try {
        const result = await analyzeScan(text, profile?.industry || "general")
        setAnalysis(result)
      } catch (error) {
        console.error("[v0] Analysis error:", error)
        toast({
          title: "Analysis Error",
          description: "Failed to analyze content. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsAnalyzing(false)
      }
    },
    [profile, toast],
  )

  const handleManualAnalyze = () => {
    if (content.length >= 20) {
      handleAnalyze(content)
    }
  }

  const handleSave = async () => {
    if (!content.trim() || !analysis) return

    setIsSaving(true)

    try {
      await saveScan({
        originalContent: content,
        rewrittenContent: analysis.rewrittenContent,
        safetyScore: analysis.safetyScore,
        riskLevel: analysis.riskLevel,
        flaggedIssues: analysis.flags,
        suggestions: analysis.suggestions,
        industry: profile?.industry || "general",
      })

      toast({
        title: "Scan saved!",
        description: "Your scan has been saved to your dashboard.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("[v0] Error saving scan:", error)
      toast({
        title: "Error",
        description: "Failed to save scan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopyRewrite = async () => {
    if (analysis?.rewrittenContent) {
      await navigator.clipboard.writeText(analysis.rewrittenContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Copied!",
        description: "Compliant version copied to clipboard.",
      })
    }
  }

  const handleUseRewrite = () => {
    if (analysis?.rewrittenContent) {
      setContent(analysis.rewrittenContent)
      setActiveTab("original")
      toast({
        title: "Content replaced",
        description: "Your content has been replaced with the compliant version.",
      })
    }
  }

  const handleApplySuggestion = (newContent: string) => {
    setContent(newContent)
  }

  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    if (content.length >= 20) {
      const timer = setTimeout(() => {
        handleAnalyze(content)
      }, 1500)
      setDebounceTimer(timer)
    } else {
      setAnalysis(null)
    }

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
    }
  }, [content])

  const getRiskColor = (level: string) => {
    switch (level) {
      case "safe":
        return "bg-safe-green/10 text-safe-green border-safe-green/20"
      case "warning":
        return "bg-warning-yellow/10 text-warning-yellow border-warning-yellow/20"
      case "danger":
        return "bg-risk-red/10 text-risk-red border-risk-red/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50/50 via-white to-green-50/30">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-trust-blue" />
            <span className="text-lg font-semibold text-foreground">SafeCopy AI</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Badge variant="outline" className="hidden sm:flex">
              {profile?.industry || "General"}
            </Badge>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Compliance Scanner</h1>
                <p className="mt-1 text-sm text-muted-foreground sm:mt-2 sm:text-base">
                  AI-powered analysis with automatic compliant rewrites
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleManualAnalyze}
                  disabled={isAnalyzing || content.length < 20}
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                >
                  <RefreshCw className={`h-4 w-4 ${isAnalyzing ? "animate-spin" : ""}`} />
                  <span className="hidden sm:inline">Re-analyze</span>
                </Button>
                {analysis && (
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    size="sm"
                    className="gap-2 bg-trust-blue hover:bg-trust-blue/90"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Analysis Status Bar */}
          {analysis && (
            <Card className={`mb-6 border ${getRiskColor(analysis.riskLevel)}`}>
              <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  {analysis.riskLevel === "safe" ? (
                    <CheckCircle className="h-5 w-5 text-safe-green" />
                  ) : analysis.riskLevel === "warning" ? (
                    <AlertTriangle className="h-5 w-5 text-warning-yellow" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-risk-red" />
                  )}
                  <p className="text-sm font-medium">{analysis.overallAssessment}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getRiskColor(analysis.riskLevel)}>
                    {analysis.flags.length} issue{analysis.flags.length !== 1 ? "s" : ""} found
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Editor Section */}
            <div className="lg:col-span-2">
              <Card className="shadow-sm">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <TabsList className="grid w-full grid-cols-2 sm:w-auto">
                        <TabsTrigger value="original" className="gap-2">
                          <FileText className="h-4 w-4" />
                          <span>Original</span>
                        </TabsTrigger>
                        <TabsTrigger value="rewrite" className="gap-2" disabled={!analysis?.rewrittenContent}>
                          <Sparkles className="h-4 w-4" />
                          <span>AI Rewrite</span>
                        </TabsTrigger>
                      </TabsList>

                      {isAnalyzing && (
                        <div className="flex items-center gap-2 text-sm text-trust-blue">
                          <Zap className="h-4 w-4 animate-pulse" />
                          <span>Analyzing with AI...</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <TabsContent value="original" className="mt-0">
                      <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Paste your email, social media post, ad copy, or any marketing content here...

Example: 'Guaranteed 20% returns! This exclusive investment opportunity won't last. Act now for insider access to our proven wealth-building strategy!'"
                        className="min-h-[300px] resize-none font-mono text-sm sm:min-h-[400px] sm:text-base"
                      />
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground sm:text-sm">
                        <span>{content.length} characters</span>
                        {content.length > 0 && content.length < 20 && (
                          <span className="text-warning-yellow">Minimum 20 characters</span>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="rewrite" className="mt-0">
                      {analysis?.rewrittenContent ? (
                        <>
                          <div className="relative">
                            <Textarea
                              value={analysis.rewrittenContent}
                              readOnly
                              className="min-h-[300px] resize-none bg-safe-green/5 font-mono text-sm sm:min-h-[400px] sm:text-base"
                            />
                            <Badge className="absolute right-3 top-3 bg-safe-green/10 text-safe-green">
                              <Sparkles className="mr-1 h-3 w-3" />
                              AI Optimized
                            </Badge>
                          </div>
                          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-muted-foreground sm:text-sm">
                              This version has been rewritten to be compliant while maintaining your message.
                            </p>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCopyRewrite}
                                className="gap-2 bg-transparent"
                              >
                                {copied ? <Check className="h-4 w-4 text-safe-green" /> : <Copy className="h-4 w-4" />}
                                {copied ? "Copied!" : "Copy"}
                              </Button>
                              <Button
                                size="sm"
                                onClick={handleUseRewrite}
                                className="gap-2 bg-trust-blue hover:bg-trust-blue/90"
                              >
                                <Sparkles className="h-4 w-4" />
                                Use This
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex min-h-[300px] items-center justify-center text-muted-foreground sm:min-h-[400px]">
                          <p>Enter content to generate a compliant rewrite</p>
                        </div>
                      )}
                    </TabsContent>
                  </CardContent>
                </Tabs>
              </Card>
            </div>

            {/* Results Sidebar */}
            <div className="space-y-6">
              <SafetyMeter score={analysis?.safetyScore ?? null} isAnalyzing={isAnalyzing} />
              <FlagsList flags={analysis?.flags || []} content={content} onApplySuggestion={handleApplySuggestion} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
