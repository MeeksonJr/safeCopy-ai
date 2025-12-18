import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BlogPage() {
  const posts = [
    {
      title: "Understanding Real Estate Compliance in 2025",
      excerpt: "Navigate the latest regulations and avoid costly mistakes with our comprehensive guide.",
      date: "December 10, 2024",
      readTime: "5 min read",
      category: "Real Estate",
      image: "/real-estate-compliance.jpg",
    },
    {
      title: "5 Financial Advertising Phrases That Could Get You Fined",
      excerpt: "Learn which common marketing phrases violate SEC and FINRA regulations.",
      date: "December 8, 2024",
      readTime: "4 min read",
      category: "Finance",
      image: "/financial-compliance.jpg",
    },
    {
      title: "How AI is Revolutionizing Compliance Management",
      excerpt: "Discover how artificial intelligence is transforming the way businesses handle compliance.",
      date: "December 5, 2024",
      readTime: "6 min read",
      category: "Technology",
      image: "/ai-compliance.jpg",
    },
    {
      title: "HIPAA Marketing Guidelines: What You Need to Know",
      excerpt: "A complete breakdown of HIPAA compliance for healthcare marketing professionals.",
      date: "December 3, 2024",
      readTime: "7 min read",
      category: "Healthcare",
      image: "/healthcare-compliance-abstract.png",
    },
    {
      title: "Building a Culture of Compliance in Your Organization",
      excerpt: "Best practices for fostering compliance awareness across your team.",
      date: "November 30, 2024",
      readTime: "5 min read",
      category: "Management",
      image: "/compliance-culture.jpg",
    },
    {
      title: "The Cost of Non-Compliance: Real-World Case Studies",
      excerpt: "Learn from companies that faced hefty fines and reputational damage.",
      date: "November 28, 2024",
      readTime: "8 min read",
      category: "Case Studies",
      image: "/compliance-fines.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <LandingHeader />

      {/* Hero Section */}
      <section className="px-6 pt-32 pb-16 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Compliance{" "}
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Insights</span>
          </h1>
          <p className="mt-6 text-pretty text-lg text-muted-foreground sm:text-xl">
            Stay informed with the latest compliance trends, regulations, and best practices
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <article
                key={index}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-all hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-sm">
                    {post.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold leading-tight group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">{post.excerpt}</p>
                  <Button variant="ghost" size="sm" className="group/btn p-0 h-auto text-blue-600 hover:text-blue-700">
                    Read more
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-r from-blue-600 to-green-600 p-12 text-center shadow-2xl">
          <h2 className="text-balance text-3xl font-bold text-white sm:text-4xl">Stay up to date</h2>
          <p className="mt-4 text-lg text-blue-50">
            Get the latest compliance news and insights delivered to your inbox
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full max-w-md rounded-lg border-0 px-4 py-3 text-foreground shadow-lg sm:w-auto"
            />
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}
