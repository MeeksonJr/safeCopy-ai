"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Shield, Building2, Briefcase, Heart, ChevronRight, Loader2, Sparkles } from "lucide-react"
import { completeOnboarding } from "@/app/actions/onboarding"
import { useToast } from "@/hooks/use-toast"

interface OnboardingWizardProps {
  userEmail: string
  userId: string
}

const industries = [
  {
    value: "real_estate",
    label: "Real Estate",
    icon: Building2,
    description: "Property sales, rentals, and investments",
  },
  {
    value: "finance",
    label: "Financial Services",
    icon: Briefcase,
    description: "Banking, insurance, and investments",
  },
  {
    value: "healthcare",
    label: "Healthcare",
    icon: Heart,
    description: "Medical services and products",
  },
  {
    value: "other",
    label: "Other Industry",
    icon: Sparkles,
    description: "General marketing compliance",
  },
]

export function OnboardingWizard({ userEmail, userId }: OnboardingWizardProps) {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    industry: "",
    teamName: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  const handleNext = () => {
    if (step === 1 && (!formData.fullName || !formData.companyName)) {
      toast({
        title: "Required fields",
        description: "Please fill in your name and company.",
        variant: "destructive",
      })
      return
    }
    if (step === 2 && !formData.industry) {
      toast({
        title: "Select an industry",
        description: "Please select your primary industry.",
        variant: "destructive",
      })
      return
    }
    setStep(step + 1)
  }

  const handleComplete = async () => {
    if (!formData.teamName) {
      toast({
        title: "Team name required",
        description: "Please enter a name for your team.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await completeOnboarding({
        userId,
        fullName: formData.fullName,
        companyName: formData.companyName,
        industry: formData.industry,
        teamName: formData.teamName,
      })

      if (result.success) {
        toast({
          title: "Welcome to SafeCopy AI!",
          description: "Your account is ready. Let's scan some content!",
        })
        router.push("/dashboard")
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("[v0] Onboarding error:", error)
      toast({
        title: "Setup failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-white to-green-50/30 p-4">
      <div className="mb-8 flex items-center gap-2">
        <Shield className="h-8 w-8 text-trust-blue" />
        <span className="text-2xl font-bold text-foreground">SafeCopy AI</span>
      </div>

      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-trust-blue/10">
            <span className="text-lg font-bold text-trust-blue">{step}/3</span>
          </div>
          <CardTitle className="text-2xl">
            {step === 1 && "Tell us about yourself"}
            {step === 2 && "What industry are you in?"}
            {step === 3 && "Create your team"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "We'll personalize your compliance experience"}
            {step === 2 && "This helps us apply the right regulations"}
            {step === 3 && "Teams help you collaborate and track usage"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Smith"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Acme Real Estate"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="h-12"
                />
              </div>
              <p className="text-sm text-muted-foreground">Signed in as: {userEmail}</p>
            </div>
          )}

          {step === 2 && (
            <RadioGroup
              value={formData.industry}
              onValueChange={(value) => setFormData({ ...formData, industry: value })}
              className="grid gap-3"
            >
              {industries.map((industry) => (
                <Label
                  key={industry.value}
                  htmlFor={industry.value}
                  className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition-all hover:bg-muted/50 ${
                    formData.industry === industry.value ? "border-trust-blue bg-trust-blue/5" : "border-border"
                  }`}
                >
                  <RadioGroupItem value={industry.value} id={industry.value} className="sr-only" />
                  <div
                    className={`rounded-lg p-2 ${
                      formData.industry === industry.value ? "bg-trust-blue text-white" : "bg-muted"
                    }`}
                  >
                    <industry.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{industry.label}</p>
                    <p className="text-sm text-muted-foreground">{industry.description}</p>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  placeholder={`${formData.companyName || "My"} Team`}
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  className="h-12"
                />
              </div>
              <div className="rounded-lg border border-safe-green/30 bg-safe-green/5 p-4">
                <h4 className="font-medium text-safe-green">Free Plan Includes:</h4>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• 50 compliance scans per month</li>
                  <li>• AI-powered content rewrites</li>
                  <li>• Basic audit logging</li>
                  <li>• 1 team member</li>
                </ul>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1" disabled={isLoading}>
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={handleNext} className="flex-1 gap-2 bg-trust-blue hover:bg-trust-blue/90">
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={isLoading}
                className="flex-1 gap-2 bg-trust-blue hover:bg-trust-blue/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <Sparkles className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
