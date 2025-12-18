"use client"

import { useEffect, useRef, useState } from "react"

export function StatsBar() {
  const statsRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 },
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const stats = [
    { value: "98%", label: "Safety Score", color: "text-safe-green" },
    { value: "2.4s", label: "Avg Scan Time", color: "text-trust-blue" },
    { value: "10K+", label: "Scans Daily", color: "text-foreground" },
    { value: "$0", label: "In Fines Paid", color: "text-foreground" },
  ]

  return (
    <section ref={statsRef} className="border-y border-border bg-surface/30 py-12 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className={`text-3xl font-bold ${stat.color} sm:text-4xl`}>{stat.value}</div>
              <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
