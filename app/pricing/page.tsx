import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <LandingHeader />

      {/* Hero Section */}
      <section className="px-6 pt-32 pb-16 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Simple, transparent{" "}
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">pricing</span>
          </h1>
          <p className="mt-6 text-pretty text-lg text-muted-foreground sm:text-xl">
            Choose the plan that fits your team. All plans include a 14-day free trial.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Starter Plan */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-border bg-card p-8 shadow-lg">
              <div className="mb-6">
                <h3 className="text-2xl font-bold">Starter</h3>
                <p className="mt-2 text-sm text-muted-foreground">Perfect for individuals</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">$49</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>
              <ul className="mb-8 space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-sm">100 scans per month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-sm">Real-time scanning</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-sm">AI-powered rewrites</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-sm">Basic analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-sm">Email support</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-transparent" variant="outline">
                <Link href="/auth/sign-up">Start Free Trial</Link>
              </Button>
            </div>

            {/* Professional Plan - Featured */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-blue-600 bg-card p-8 shadow-2xl">
              <div className="absolute -right-12 top-6 rotate-45 bg-gradient-to-r from-blue-600 to-green-600 px-12 py-1 text-xs font-semibold text-white shadow-lg">
                POPULAR
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold">Professional</h3>
                <p className="mt-2 text-sm text-muted-foreground">For growing teams</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">$149</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>
              <ul className="mb-8 space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-sm">500 scans per month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-sm">Everything in Starter</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-sm">Team management (up to 10 users)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-sm">Advanced analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-sm">Audit trail & reporting</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-sm">Priority support</span>
                </li>
              </ul>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700"
              >
                <Link href="/auth/sign-up">Start Free Trial</Link>
              </Button>
            </div>

            {/* Enterprise Plan */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-border bg-card p-8 shadow-lg">
              <div className="mb-6">
                <h3 className="text-2xl font-bold">Enterprise</h3>
                <p className="mt-2 text-sm text-muted-foreground">For large organizations</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">Custom</span>
                </div>
              </div>
              <ul className="mb-8 space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-sm">Unlimited scans</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-sm">Everything in Professional</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-sm">Unlimited team members</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-sm">Custom integrations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-sm">SSO & advanced security</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-sm">Dedicated account manager</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-transparent" variant="outline">
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}
