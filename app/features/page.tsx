import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { Shield, Zap, Users, BarChart3, FileCheck, Clock, Lock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <LandingHeader />

      {/* Hero Section */}
      <section className="px-6 pt-32 pb-16 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Everything you need for{" "}
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              compliance confidence
            </span>
          </h1>
          <p className="mt-6 text-pretty text-lg text-muted-foreground sm:text-xl">
            Powerful features designed to protect your business and accelerate your marketing
          </p>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-lg transition-all hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-green-600">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Real-Time Scanning</h3>
              <p className="text-muted-foreground">
                Instant compliance checking as you type. Catch risky phrases before they go live.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-lg transition-all hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-green-600">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">AI-Powered Rewrites</h3>
              <p className="text-muted-foreground">
                One-click fixes for flagged content. Our AI suggests compliant alternatives instantly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-lg transition-all hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-green-600">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Industry-Specific Rules</h3>
              <p className="text-muted-foreground">
                Tailored compliance checks for Real Estate, Finance, Healthcare, and more.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-lg transition-all hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-green-600">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Team Management</h3>
              <p className="text-muted-foreground">
                Invite team members, set roles, and monitor compliance across your organization.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-lg transition-all hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-green-600">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Analytics Dashboard</h3>
              <p className="text-muted-foreground">
                Track safety scores, flag trends, and team performance with detailed insights.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-lg transition-all hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-green-600">
                <FileCheck className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Audit Trail</h3>
              <p className="text-muted-foreground">
                Complete compliance documentation with immutable logs for every scan and action.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-lg transition-all hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-green-600">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Batch Processing</h3>
              <p className="text-muted-foreground">
                Scan multiple pieces of content at once. Perfect for campaigns and bulk reviews.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-lg transition-all hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-green-600">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Enterprise Security</h3>
              <p className="text-muted-foreground">
                Bank-level encryption, SSO support, and SOC 2 compliance for peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-r from-blue-600 to-green-600 p-12 text-center shadow-2xl">
          <h2 className="text-balance text-3xl font-bold text-white sm:text-4xl">Ready to experience SafeCopy AI?</h2>
          <p className="mt-4 text-lg text-blue-50">Start your free trial today. No credit card required.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/auth/sign-up">Start Free Trial</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}
