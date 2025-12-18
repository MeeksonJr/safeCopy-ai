import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { Home, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function RealEstatePage() {
  const commonViolations = [
    {
      wrong: "Guaranteed 15% ROI on this property",
      right: "Historical data shows potential for strong returns",
      fine: "$10,000+",
    },
    {
      wrong: "Best investment you'll ever make",
      right: "Well-positioned investment opportunity",
      fine: "$5,000+",
    },
    {
      wrong: "This property will definitely appreciate",
      right: "Strong appreciation trends in this area",
      fine: "$8,000+",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 flex items-center gap-2">
                <Home className="h-8 w-8 text-trust-blue" />
                <span className="text-sm font-semibold text-trust-blue">For Real Estate Professionals</span>
              </div>
              <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
                Protect Your Real Estate Business from RESPA & Fair Housing Violations
              </h1>
              <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
                One wrong word in a listing can cost you $15,000. SafeCopy AI scans your MLS listings, social posts, and
                email campaigns for illegal claims before you publish.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="bg-trust-blue hover:bg-trust-blue/90">
                  <Link href="/auth/sign-up">Start Free Trial</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-transparent">
                  <Link href="#violations">See Common Violations</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-risk-red" />
                    <span className="text-sm text-risk-red font-semibold">High Risk Detected</span>
                  </div>
                  <p className="text-muted-foreground">
                    "This home is a <span className="bg-risk-red/20 text-risk-red">guaranteed investment</span> with{" "}
                    <span className="bg-warning-yellow/20 text-warning-yellow">certain appreciation</span>."
                  </p>
                  <div className="flex items-center gap-3 border-t border-border pt-4">
                    <CheckCircle className="h-5 w-5 text-safe-green" />
                    <span className="text-sm text-safe-green font-semibold">SafeCopy Suggestion</span>
                  </div>
                  <p className="text-muted-foreground">
                    "This home offers strong investment potential with favorable market conditions."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-surface/30 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-trust-blue">847</div>
              <div className="mt-1 text-sm text-muted-foreground">Real Estate Agents</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-safe-green">$2.4M</div>
              <div className="mt-1 text-sm text-muted-foreground">Fines Prevented</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">50K+</div>
              <div className="mt-1 text-sm text-muted-foreground">Listings Scanned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">99.2%</div>
              <div className="mt-1 text-sm text-muted-foreground">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Violations */}
      <section id="violations" className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Common Real Estate Violations
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              These phrases trigger fines. SafeCopy catches them all.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-4xl space-y-6">
            {commonViolations.map((violation, index) => (
              <div key={index} className="rounded-2xl border border-border bg-card p-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-risk-red">
                      <AlertTriangle className="h-4 w-4" />
                      Wrong
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{violation.wrong}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-safe-green">
                      <CheckCircle className="h-4 w-4" />
                      Right
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{violation.right}</p>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Potential Fine</div>
                    <p className="mt-2 text-2xl font-bold text-risk-red">{violation.fine}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features for RE */}
      <section className="bg-surface/30 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Built for Real Estate Workflows
            </h2>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-8">
              <TrendingUp className="h-8 w-8 text-trust-blue" />
              <h3 className="mt-4 text-xl font-semibold text-foreground">MLS Listing Scanner</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                Paste your entire MLS description. Get instant feedback on RESPA, Fair Housing, and HUD violations.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8">
              <Home className="h-8 w-8 text-safe-green" />
              <h3 className="mt-4 text-xl font-semibold text-foreground">Social Media Templates</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                Pre-approved captions for Instagram, Facebook, and LinkedIn. Never guess what's legal again.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Join 847 Real Estate Agents Staying Compliant
            </h2>
            <div className="mt-8">
              <Button asChild size="lg" className="bg-trust-blue hover:bg-trust-blue/90">
                <Link href="/auth/sign-up">Start Free Trial</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">14-day free trial · No credit card required</p>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}
