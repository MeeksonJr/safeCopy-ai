"use client"

import { FileText, Scan, AlertTriangle, CheckCircle } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: FileText,
      title: "Write Your Copy",
      description: "Type or paste your marketing content into the SafeCopy editor.",
      color: "trust-blue",
    },
    {
      icon: Scan,
      title: "AI Scans in Real-Time",
      description: "Our AI analyzes every word against industry regulations as you type.",
      color: "safe-green",
    },
    {
      icon: AlertTriangle,
      title: "See Risks Highlighted",
      description: "High-risk phrases appear in red, medium risks in yellow. Click for details.",
      color: "warning-yellow",
    },
    {
      icon: CheckCircle,
      title: "Apply Safe Alternatives",
      description: "One-click AI rewrites turn risky copy into compliant, converting content.",
      color: "safe-green",
    },
  ]

  return (
    <section id="how-it-works" className="bg-surface/30 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl">How It Works</h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground leading-relaxed">
            From risky copy to compliant content in four simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.title} className="relative">
                  {/* Connector Line (hidden on mobile) */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-gradient-to-r from-border to-transparent lg:block" />
                  )}

                  <div className="relative flex flex-col items-center text-center">
                    {/* Step Number */}
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                      {index + 1}
                    </div>

                    {/* Icon */}
                    <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-${step.color}/10`}>
                      <Icon className={`h-8 w-8 text-${step.color}`} />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
