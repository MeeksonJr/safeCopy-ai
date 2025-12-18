import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { DollarSign, Shield, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function FinancialServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 flex items-center gap-2">
                <DollarSign className="h-8 w-8 text-trust-blue" />
                <span className="text-sm font-semibold text-trust-blue">For Financial Advisors</span>
              </div>
              <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
                Stay SEC & FINRA Compliant Without the Legal Bills
              </h1>
              <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
                Financial marketing is a minefield. One "guaranteed return" claim can trigger a $50,000 fine. SafeCopy
                AI reviews your content against SEC, FINRA, and state regulations in real-time.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="bg-trust-blue hover:bg-trust-blue/90">
                  <Link href="/auth/sign-up">Start Free Trial</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-transparent">
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-risk-red" />
                    <span className="text-sm text-risk-red font-semibold">SEC Violation Detected</span>
                  </div>
                  <p className="text-muted-foreground">
                    "Invest with us for <span className="bg-risk-red/20 text-risk-red">guaranteed 12% returns</span> and{" "}
                    <span className="bg-warning-yellow/20 text-warning-yellow">risk-free growth</span>."
                  </p>
                  <div className="flex items-center gap-3 border-t border-border pt-4">
                    <CheckCircle className="h-5 w-5 text-safe-green" />
                    <span className="text-sm text-safe-green font-semibold">Compliant Alternative</span>
                  </div>
                  <p className="text-muted-foreground">
                    "Our strategy has historically delivered competitive returns. Past performance does not guarantee
                    future results."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-surface/30 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-trust-blue">312</div>
              <div className="mt-1 text-sm text-muted-foreground">Financial Advisors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-safe-green">100%</div>
              <div className="mt-1 text-sm text-muted-foreground">Compliant Campaigns</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">8K+</div>
              <div className="mt-1 text-sm text-muted-foreground">Emails Reviewed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">$0</div>
              <div className="mt-1 text-sm text-muted-foreground">In Fines</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Financial Services Compliance Made Simple
            </h2>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-8">
              <Shield className="h-8 w-8 text-trust-blue" />
              <h3 className="mt-4 text-xl font-semibold text-foreground">SEC & FINRA Rules</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                Trained on current SEC advertising rules, FINRA regulations, and state-specific requirements.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8">
              <DollarSign className="h-8 w-8 text-safe-green" />
              <h3 className="mt-4 text-xl font-semibold text-foreground">Disclosure Generator</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                Automatically suggests required disclosures for investment performance claims.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-surface/30 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Protect Your Practice from Compliance Risks
            </h2>
            <div className="mt-8">
              <Button asChild size="lg" className="bg-trust-blue hover:bg-trust-blue/90">
                <Link href="/auth/sign-up">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}
