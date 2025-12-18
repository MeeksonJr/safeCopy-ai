"use server"

import { generateObject } from "ai"
import { z } from "zod"
import type { Flag, Suggestion } from "@/lib/types/database"

// Compliance rule patterns for quick pre-screening
const COMPLIANCE_PATTERNS = {
  real_estate: [
    { pattern: /\b(guarantee|guaranteed|promise)\b/gi, severity: "high", category: "False Promise" },
    { pattern: /\b(exclusive|limited time|act now|hurry)\b/gi, severity: "medium", category: "Urgency Tactic" },
    { pattern: /\b\d+%\s*(return|profit|gain|appreciation)\b/gi, severity: "high", category: "Return Projection" },
    { pattern: /\b(best|#1|number one|top rated)\b/gi, severity: "medium", category: "Unsubstantiated Claim" },
    { pattern: /\b(no risk|risk-free|safe investment)\b/gi, severity: "high", category: "Risk Misrepresentation" },
  ],
  finance: [
    { pattern: /\b(guaranteed return|guaranteed profit|no risk)\b/gi, severity: "high", category: "SEC Violation" },
    { pattern: /\b(secret|insider|exclusive opportunity)\b/gi, severity: "high", category: "FINRA Violation" },
    { pattern: /\b(double your money|get rich|financial freedom)\b/gi, severity: "high", category: "Misleading Claim" },
    { pattern: /\b(can't lose|sure thing|100%)\b/gi, severity: "high", category: "False Guarantee" },
  ],
  healthcare: [
    { pattern: /\b(cure|cures|cured|miracle)\b/gi, severity: "high", category: "FDA Violation" },
    { pattern: /\b(guaranteed results|proven to)\b/gi, severity: "high", category: "Unsubstantiated Claim" },
    { pattern: /\b(no side effects|completely safe)\b/gi, severity: "high", category: "Safety Misrepresentation" },
  ],
  general: [
    { pattern: /\b(best|#1|number one|top)\b/gi, severity: "medium", category: "Superlative Claim" },
    { pattern: /\b(instant|immediate|overnight)\b/gi, severity: "medium", category: "Unrealistic Timeframe" },
    { pattern: /\b(free|no cost|zero cost)\b/gi, severity: "low", category: "Free Claim" },
  ],
}

const AnalysisSchema = z.object({
  overallAssessment: z.string().describe("Brief 1-2 sentence overall compliance assessment"),
  safetyScore: z.number().min(0).max(100).describe("Safety score from 0-100"),
  riskLevel: z.enum(["safe", "warning", "danger"]).describe("Overall risk level"),
  flags: z.array(
    z.object({
      type: z.enum(["high", "medium", "low"]),
      text: z.string().describe("The exact problematic text"),
      reason: z.string().describe("Why this is a compliance issue"),
      regulation: z.string().optional().describe("Relevant regulation if applicable"),
      suggestion: z.string().describe("Compliant alternative text"),
    }),
  ),
  rewrittenContent: z.string().describe("Fully rewritten compliant version of the content"),
  suggestions: z.array(
    z.object({
      original: z.string(),
      replacement: z.string(),
      reason: z.string(),
    }),
  ),
})

export interface AnalysisResult {
  safetyScore: number
  riskLevel: "safe" | "warning" | "danger"
  flags: Flag[]
  suggestions: Suggestion[]
  rewrittenContent: string
  overallAssessment: string
}

export async function analyzeScan(content: string, industry = "general"): Promise<AnalysisResult> {
  // Quick pre-screening with regex patterns
  const patternFlags = quickPatternScan(content, industry)

  // If content is too short, just return pattern-based analysis
  if (content.length < 50) {
    const score = calculateScore(patternFlags)
    return {
      safetyScore: score,
      riskLevel: score >= 80 ? "safe" : score >= 50 ? "warning" : "danger",
      flags: patternFlags,
      suggestions: [],
      rewrittenContent: content,
      overallAssessment:
        patternFlags.length === 0
          ? "Content appears compliant based on initial screening."
          : `Found ${patternFlags.length} potential compliance issue(s).`,
    }
  }

  try {
    // Use AI for deep analysis
    const industryContext = getIndustryContext(industry)

    const { object } = await generateObject({
      model: "anthropic/claude-sonnet-4-20250514",
      schema: AnalysisSchema,
      prompt: `You are an expert compliance analyst specializing in ${industry} marketing regulations.

INDUSTRY CONTEXT:
${industryContext}

CONTENT TO ANALYZE:
"""
${content}
"""

INITIAL PATTERN FLAGS FOUND:
${patternFlags.length > 0 ? patternFlags.map((f) => `- "${f.text}": ${f.reason}`).join("\n") : "None"}

Analyze this marketing content for compliance issues. Be thorough but fair - not every strong claim is a violation. Consider:
1. Specific regulatory violations (FTC, SEC, FINRA, HUD, FDA as applicable)
2. Misleading or deceptive language
3. Unsubstantiated claims
4. False guarantees or promises
5. Missing disclaimers

For the rewritten content:
- Maintain the marketing intent and persuasive tone
- Replace problematic phrases with compliant alternatives
- Add necessary disclaimers where appropriate
- Keep it natural and engaging, not overly legalistic`,
    })

    // Merge pattern flags with AI flags, avoiding duplicates
    const mergedFlags = mergeFlags(
      patternFlags,
      object.flags.map((f) => ({
        type: f.type,
        text: f.text,
        reason: f.reason,
        start: content.indexOf(f.text),
        end: content.indexOf(f.text) + f.text.length,
        suggestion: f.suggestion,
      })),
    )

    return {
      safetyScore: object.safetyScore,
      riskLevel: object.riskLevel,
      flags: mergedFlags,
      suggestions: object.suggestions,
      rewrittenContent: object.rewrittenContent,
      overallAssessment: object.overallAssessment,
    }
  } catch (error) {
    console.error("[v0] AI analysis error:", error)
    // Fallback to pattern-based analysis
    const score = calculateScore(patternFlags)
    return {
      safetyScore: score,
      riskLevel: score >= 80 ? "safe" : score >= 50 ? "warning" : "danger",
      flags: patternFlags,
      suggestions: patternFlags.map((f) => ({
        original: f.text,
        replacement: f.suggestion || f.text,
        reason: f.reason,
      })),
      rewrittenContent: content,
      overallAssessment: `Pattern analysis found ${patternFlags.length} potential issue(s). AI analysis unavailable.`,
    }
  }
}

function quickPatternScan(content: string, industry: string): Flag[] {
  const flags: Flag[] = []
  const patterns = [
    ...(COMPLIANCE_PATTERNS[industry as keyof typeof COMPLIANCE_PATTERNS] || []),
    ...COMPLIANCE_PATTERNS.general,
  ]

  for (const rule of patterns) {
    const matches = content.matchAll(rule.pattern)
    for (const match of matches) {
      if (match.index !== undefined) {
        flags.push({
          type: rule.severity as "high" | "medium" | "low",
          text: match[0],
          reason: `${rule.category}: This phrase may violate compliance guidelines.`,
          start: match.index,
          end: match.index + match[0].length,
          suggestion: getSuggestion(match[0], rule.category),
        })
      }
    }
  }

  return flags
}

function getSuggestion(text: string, category: string): string {
  const suggestions: Record<string, Record<string, string>> = {
    "False Promise": {
      guarantee: "may help",
      guaranteed: "designed to",
      promise: "aim to",
    },
    "Urgency Tactic": {
      exclusive: "special",
      "limited time": "current",
      "act now": "learn more",
      hurry: "explore",
    },
    "Superlative Claim": {
      best: "leading",
      "#1": "top-rated",
      "number one": "highly rated",
      top: "excellent",
    },
  }

  const lowerText = text.toLowerCase()
  for (const [cat, replacements] of Object.entries(suggestions)) {
    if (category.includes(cat) || cat.includes(category)) {
      for (const [original, replacement] of Object.entries(replacements)) {
        if (lowerText.includes(original)) {
          return replacement
        }
      }
    }
  }
  return text
}

function calculateScore(flags: Flag[]): number {
  let score = 100
  for (const flag of flags) {
    if (flag.type === "high") score -= 25
    else if (flag.type === "medium") score -= 10
    else score -= 5
  }
  return Math.max(0, Math.min(100, score))
}

function mergeFlags(patternFlags: Flag[], aiFlags: Flag[]): Flag[] {
  const seen = new Set<string>()
  const merged: Flag[] = []

  // AI flags take priority
  for (const flag of aiFlags) {
    const key = flag.text.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      merged.push(flag)
    }
  }

  // Add pattern flags not covered by AI
  for (const flag of patternFlags) {
    const key = flag.text.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      merged.push(flag)
    }
  }

  return merged
}

function getIndustryContext(industry: string): string {
  const contexts: Record<string, string> = {
    real_estate: `Real Estate Marketing Regulations:
- HUD Fair Housing Act: Prohibits discriminatory language and steering
- RESPA: Regulates settlement services disclosures
- State licensing laws: Vary by jurisdiction
- NAR Code of Ethics: Professional standards
- FTC Act: Prohibits deceptive advertising
Key concerns: Property guarantees, return projections, urgency tactics, discrimination`,

    finance: `Financial Services Regulations:
- SEC regulations: Securities marketing rules
- FINRA rules: Broker-dealer advertising standards
- Investment Advisers Act: Advisor marketing requirements
- FTC Act: Consumer protection
Key concerns: Return guarantees, risk misrepresentation, insider language, testimonials without disclaimers`,

    healthcare: `Healthcare Marketing Regulations:
- FDA regulations: Drug and device claims
- FTC Act: Health product advertising
- HIPAA: Patient privacy in marketing
- State medical board rules
Key concerns: Cure claims, unsubstantiated efficacy, safety misrepresentation, testimonials`,

    general: `General Marketing Regulations:
- FTC Act: Truth in advertising
- CAN-SPAM: Email marketing rules
- State consumer protection laws
Key concerns: Superlative claims, false urgency, deceptive pricing, unsubstantiated claims`,
  }

  return contexts[industry] || contexts.general
}
