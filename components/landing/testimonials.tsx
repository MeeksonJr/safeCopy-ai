import { Star } from "lucide-react"

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Martinez",
      role: "Real Estate Agent, RE/MAX",
      content:
        "SafeCopy caught a 'guaranteed ROI' claim in my listing before I posted it. Probably saved me $10K in fines.",
      rating: 5,
    },
    {
      name: "James Chen",
      role: "Financial Advisor, Morgan Stanley",
      content: "The AI rewrites are incredible. It keeps my messaging persuasive while staying 100% SEC compliant.",
      rating: 5,
    },
    {
      name: "Dr. Emily Roberts",
      role: "Healthcare Marketing Director",
      content:
        "Our team's safety score went from 72% to 96% in one month. The dashboard makes compliance actually fun.",
      rating: 5,
    },
  ]

  return (
    <section id="testimonials" className="bg-surface/30 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Loved by Compliance Professionals
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground leading-relaxed">
            See what real users are saying about SafeCopy AI.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="flex flex-col rounded-2xl border border-border bg-card p-8">
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-warning-yellow text-warning-yellow" />
                ))}
              </div>

              {/* Content */}
              <p className="mt-6 text-muted-foreground leading-relaxed">{testimonial.content}</p>

              {/* Author */}
              <div className="mt-6">
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
