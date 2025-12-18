export function SocialProof() {
  const companies = [
    { name: "Keller Williams", logo: "KW" },
    { name: "RE/MAX", logo: "RE/MAX" },
    { name: "Century 21", logo: "C21" },
    { name: "Coldwell Banker", logo: "CB" },
    { name: "Berkshire Hathaway", logo: "BH" },
    { name: "Compass", logo: "CO" },
  ]

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-muted-foreground">
          Trusted by agents at leading brokerages
        </p>
        <div className="mt-10 grid grid-cols-2 items-center gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {companies.map((company) => (
            <div
              key={company.name}
              className="flex h-16 items-center justify-center rounded-lg border border-border bg-card/50 px-4 transition-all hover:border-trust-blue/30 hover:bg-card"
            >
              <span className="text-lg font-bold text-muted-foreground">{company.logo}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
