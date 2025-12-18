"use client"

import { Scan, FileCheck, Users, Shield, Zap, BarChart3 } from "lucide-react"

export function BentoFeatures() {
  const features = [
    {
      icon: Scan,
      title: "Real-Time Scanning",
      description: "AI analyzes your content as you type. High-risk phrases highlighted instantly.",
      color: "trust-blue",
      size: "large",
    },
    {
      icon: Zap,
      title: "Instant Rewrites",
      description: "Click any flagged phrase for AI-powered alternatives that stay compliant.",
      color: "safe-green",
      size: "small",
    },
    {
      icon: Users,
      title: "Team Dashboard",
      description: "Monitor team safety scores and gamify compliance training.",
      color: "warning-yellow",
      size: "small",
    },
    {
      icon: Shield,
      title: "Audit Trails",
      description: "Immutable logs of every scan. Export compliance reports for legal protection.",
      color: "trust-blue",
      size: "medium",
    },
    {
      icon: BarChart3,
      title: "Risk Analytics",
      description: "Beautiful dashboards showing team performance and risk trends over time.",
      color: "safe-green",
      size: "medium",
    },
    {
      icon: FileCheck,
      title: "Industry Templates",
      description: "Pre-approved copy templates for Real Estate, Finance, and Healthcare.",
      color: "trust-blue",
      size: "small",
    },
  ]

  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Your Compliance Operating System
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground leading-relaxed">
            Not just a tool. Infrastructure that protects every word you publish.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Large Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-trust-blue/50 hover:shadow-lg sm:col-span-2 lg:col-span-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-trust-blue/10 transition-transform group-hover:scale-110">
              <Scan className="h-6 w-6 text-trust-blue" />
            </div>
            <h3 className="mt-4 text-2xl font-semibold text-foreground">Real-Time Scanning</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              AI analyzes your content as you type. High-risk phrases highlighted in red, medium risks in yellow. Know
              instantly what's dangerous before you hit publish.
            </p>
            <div className="mt-6 flex gap-2">
              <div className="h-2 w-16 rounded-full bg-risk-red" />
              <div className="h-2 w-12 rounded-full bg-warning-yellow" />
              <div className="h-2 w-20 rounded-full bg-safe-green" />
            </div>
          </div>

          {/* Small Cards */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-safe-green/50 hover:shadow-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-safe-green/10 transition-transform group-hover:scale-110">
              <Zap className="h-5 w-5 text-safe-green" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">Instant Rewrites</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Click any flagged phrase for AI-powered alternatives that stay compliant.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-warning-yellow/50 hover:shadow-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-yellow/10 transition-transform group-hover:scale-110">
              <Users className="h-5 w-5 text-warning-yellow" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">Team Dashboard</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Monitor team safety scores and gamify compliance training.
            </p>
          </div>

          {/* Medium Cards */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-trust-blue/50 hover:shadow-lg sm:col-span-2 lg:col-span-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-trust-blue/10 transition-transform group-hover:scale-110">
              <Shield className="h-5 w-5 text-trust-blue" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">Audit Trails</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Immutable logs of every scan. Export compliance reports for legal protection.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-safe-green/50 hover:shadow-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-safe-green/10 transition-transform group-hover:scale-110">
              <BarChart3 className="h-5 w-5 text-safe-green" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">Risk Analytics</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Beautiful dashboards showing team performance and risk trends.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-trust-blue/50 hover:shadow-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-trust-blue/10 transition-transform group-hover:scale-110">
              <FileCheck className="h-5 w-5 text-trust-blue" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">Industry Templates</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Pre-approved copy templates for Real Estate, Finance, and Healthcare.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
