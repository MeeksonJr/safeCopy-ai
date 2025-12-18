import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { Shield, Target, Users, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Trust First",
      description:
        "We build tools that protect businesses and their customers. Security and compliance are non-negotiable.",
    },
    {
      icon: Target,
      title: "Results Driven",
      description: "Every feature is designed to reduce risk and increase confidence in your marketing content.",
    },
    {
      icon: Users,
      title: "Customer Obsessed",
      description: "We listen to our users and iterate fast. Your feedback shapes our roadmap.",
    },
    {
      icon: Zap,
      title: "Move Fast",
      description: "Regulations change constantly. We update our AI models daily to keep you protected.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
              Building the Future of
              <span className="bg-gradient-to-r from-trust-blue to-safe-green bg-clip-text text-transparent">
                {" "}
                Compliance
              </span>
            </h1>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
              SafeCopy AI was born from a simple question: Why do businesses still get fined for preventable marketing
              mistakes? We're here to change that.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-foreground">Our Story</h2>
            <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                In 2024, a real estate broker friend got slapped with a $15,000 fine for writing "guaranteed ROI" in a
                Facebook ad. He had no idea it was illegal. That conversation sparked SafeCopy AI.
              </p>
              <p>
                We realized that compliance tools were either too expensive, too complicated, or too late. Lawyers
                review content after it's written. Compliance training happens once a year. Nobody prevents the mistake
                before it happens.
              </p>
              <p>
                So we built an AI that works in real-time. It scans as you type, flags risky phrases instantly, and
                suggests compliant alternatives with one click. Now over 1,200 professionals use SafeCopy to protect
                their businesses every day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-surface/30 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Our Values</h2>
            <p className="mt-4 text-lg text-muted-foreground">The principles that guide everything we build.</p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2">
            {values.map((value) => {
              const Icon = value.icon
              return (
                <div key={value.title} className="rounded-2xl border border-border bg-card p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-trust-blue/10">
                    <Icon className="h-6 w-6 text-trust-blue" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-foreground">{value.title}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Meet the Team</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We're a small but mighty team of engineers, compliance experts, and AI researchers.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { name: "Alex Thompson", role: "CEO & Co-Founder", image: "AT" },
              { name: "Priya Sharma", role: "CTO & Co-Founder", image: "PS" },
              { name: "Marcus Johnson", role: "Head of Compliance", image: "MJ" },
            ].map((member) => (
              <div key={member.name} className="text-center">
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-trust-blue/10 text-2xl font-bold text-trust-blue">
                  {member.image}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-surface/30 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Join Us on This Mission</h2>
            <p className="mt-4 text-lg text-muted-foreground">Help us build a world where compliance is effortless.</p>
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
