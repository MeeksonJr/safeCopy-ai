import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { Mail, MessageSquare, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <LandingHeader />

      {/* Hero Section */}
      <section className="px-6 pt-32 pb-16 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Get in{" "}
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">touch</span>
          </h1>
          <p className="mt-6 text-pretty text-lg text-muted-foreground sm:text-xl">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold">Send us a message</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium">
                    Name
                  </label>
                  <Input id="name" placeholder="John Doe" required />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="john@example.com" required />
                </div>
                <div>
                  <label htmlFor="company" className="mb-2 block text-sm font-medium">
                    Company
                  </label>
                  <Input id="company" placeholder="Acme Inc." />
                </div>
                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium">
                    Message
                  </label>
                  <Textarea id="message" placeholder="Tell us how we can help..." rows={5} required />
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-green-600">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Email Us</h3>
                <p className="text-muted-foreground">Our team is here to help</p>
                <a href="mailto:hello@safecopy.ai" className="mt-4 inline-block text-blue-600 hover:underline">
                  hello@safecopy.ai
                </a>
              </div>

              <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-green-600">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Live Chat</h3>
                <p className="text-muted-foreground">Available Monday-Friday, 9am-5pm EST</p>
                <button className="mt-4 text-blue-600 hover:underline">Start a conversation</button>
              </div>

              <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-green-600">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Call Us</h3>
                <p className="text-muted-foreground">Speak with our sales team</p>
                <a href="tel:+18005551234" className="mt-4 inline-block text-blue-600 hover:underline">
                  +1 (800) 555-1234
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}
