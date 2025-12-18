"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = heroRef.current?.querySelectorAll(".fade-in")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={heroRef} className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-24">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-trust-blue/5 via-background to-safe-green/5" />
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-trust-blue/10 blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-[300px] w-[300px] rounded-full bg-safe-green/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="fade-in mb-8 flex justify-center opacity-0 [animation-delay:100ms]">
            <div className="group relative overflow-hidden rounded-full bg-trust-blue/10 px-4 py-2 ring-1 ring-trust-blue/20 transition-all hover:bg-trust-blue/20 hover:ring-trust-blue/30">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-trust-blue" />
                <span className="text-sm font-semibold text-trust-blue">AI-Powered Compliance OS</span>
                <ArrowRight className="h-4 w-4 text-trust-blue transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1 className="fade-in text-balance text-5xl font-bold tracking-tight text-foreground opacity-0 [animation-delay:200ms] sm:text-6xl md:text-7xl">
            Stop Worrying About
            <span className="bg-gradient-to-r from-trust-blue to-safe-green bg-clip-text text-transparent">
              {" "}
              Compliance
            </span>
          </h1>

          {/* Subheadline */}
          <p className="fade-in mt-6 text-pretty text-lg leading-relaxed text-muted-foreground opacity-0 [animation-delay:300ms] sm:text-xl">
            SafeCopy AI scans your marketing content in real-time, flags legal risks, and rewrites dangerous copy —
            before it costs you thousands in fines.
          </p>

          {/* CTA Buttons */}
          <div className="fade-in mt-10 flex flex-col items-center justify-center gap-4 opacity-0 [animation-delay:400ms] sm:flex-row">
            <Button asChild size="lg" className="group w-full bg-trust-blue hover:bg-trust-blue/90 sm:w-auto">
              <Link href="/auth/sign-up">
                Start Scanning Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
              <Link href="#features">See How It Works</Link>
            </Button>
          </div>

          {/* Social Proof */}
          <p className="fade-in mt-8 text-sm text-muted-foreground opacity-0 [animation-delay:500ms]">
            Trusted by <span className="font-semibold text-foreground">1,200+</span> Real Estate agents, Financial
            advisors, and Healthcare marketers
          </p>
        </div>

        {/* Hero Visual */}
        <div className="fade-in relative mt-16 opacity-0 [animation-delay:600ms]">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border bg-card/50 shadow-2xl backdrop-blur">
            <div className="aspect-video w-full bg-gradient-to-br from-trust-blue/10 to-safe-green/10 p-8">
              <div className="flex h-full flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-risk-red" />
                  <div className="h-3 w-3 rounded-full bg-warning-yellow" />
                  <div className="h-3 w-3 rounded-full bg-safe-green" />
                </div>
                <div className="flex-1 rounded-lg border border-border/50 bg-background/80 p-6 backdrop-blur">
                  <div className="space-y-3">
                    <div className="h-4 w-3/4 rounded bg-muted" />
                    <div className="h-4 w-full rounded bg-risk-red/20" />
                    <div className="h-4 w-5/6 rounded bg-muted" />
                    <div className="h-4 w-2/3 rounded bg-warning-yellow/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
