import { Hero } from "@/components/landing/hero"
import { StatsBar } from "@/components/landing/stats-bar"
import { BentoFeatures } from "@/components/landing/bento-features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { SocialProof } from "@/components/landing/social-proof"
import { Pricing } from "@/components/landing/pricing"
import { Testimonials } from "@/components/landing/testimonials"
import { FinalCTA } from "@/components/landing/final-cta"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingHeader } from "@/components/landing/landing-header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <Hero />
      <StatsBar />
      <BentoFeatures />
      <HowItWorks />
      <SocialProof />
      <Pricing />
      <Testimonials />
      <FinalCTA />
      <LandingFooter />
    </div>
  )
}
