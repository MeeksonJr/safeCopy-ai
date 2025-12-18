"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Plus,
  Search,
  Copy,
  Check,
  Sparkles,
  Building2,
  DollarSign,
  Heart,
  Briefcase,
  Mail,
  MessageSquare,
  Megaphone,
  MoreVertical,
  Pencil,
  Trash,
  ExternalLink,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Profile, Template } from "@/lib/types/database"
import { useToast } from "@/hooks/use-toast"
import { CreateTemplateDialog } from "./create-template-dialog"
import { EditTemplateDialog } from "./edit-template-dialog"
import { DeleteTemplateDialog } from "./delete-template-dialog"

interface TemplatesLibraryProps {
  userTemplates: Template[]
  teamTemplates: Template[]
  profile: Profile | null
  createTemplateAction: (params: { title: string; content: string; category: string; industry: string }) => Promise<any>
  updateTemplateAction: (params: { templateId: string; title?: string; content?: string; category?: string; industry?: string }) => Promise<any>
  deleteTemplateAction: (templateId: string) => Promise<any>
}

// Pre-built compliant templates
const PRESET_TEMPLATES = [
  {
    id: "real-estate-listing",
    title: "Property Listing Email",
    category: "email",
    industry: "real_estate",
    safetyScore: 95,
    content: `Subject: New Listing Alert: [Property Address]

Hi [First Name],

I wanted to share an exciting new listing that may interest you based on your preferences.

Property Highlights:
• [X] bedrooms, [X] bathrooms
• [Square footage] square feet
• Located in [Neighborhood]
• Listed at $[Price]

This property offers excellent features including [key feature 1], [key feature 2], and [key feature 3].

I'd be happy to schedule a showing at your convenience. Properties in this area have historically shown strong market activity, though past performance is not indicative of future results.

Would you like to learn more about this opportunity?

Best regards,
[Your Name]
[License Number]`,
  },
  {
    id: "financial-advisor-intro",
    title: "Financial Services Introduction",
    category: "email",
    industry: "finance",
    safetyScore: 92,
    content: `Subject: Introduction to Our Wealth Management Services

Dear [Client Name],

Thank you for your interest in our financial planning services. I'd like to introduce you to how we approach wealth management.

Our Process:
• Comprehensive financial assessment
• Personalized strategy development
• Regular portfolio reviews
• Ongoing support and guidance

Important Disclosure: All investments carry risk, including potential loss of principal. Past performance does not guarantee future results. Our strategies are tailored to individual circumstances and risk tolerance.

I'd welcome the opportunity to discuss your financial goals in a complimentary consultation.

Sincerely,
[Your Name]
[Registration/License Information]
[Required Disclosures]`,
  },
  {
    id: "healthcare-service",
    title: "Healthcare Service Announcement",
    category: "social",
    industry: "healthcare",
    safetyScore: 94,
    content: `Introducing our new [Service Name] program!

Our team of licensed professionals is here to support your wellness journey.

What to expect:
✓ Personalized assessment
✓ Evidence-based approaches
✓ Ongoing monitoring and support

Results may vary based on individual circumstances. This service is not intended to diagnose, treat, cure, or prevent any disease. Please consult with your healthcare provider to determine if this program is right for you.

Schedule your consultation today: [Link]

#Healthcare #Wellness #[YourPractice]`,
  },
  {
    id: "general-promo",
    title: "Promotional Announcement",
    category: "social",
    industry: "general",
    safetyScore: 96,
    content: `We're excited to announce our [Event/Promotion Name]!

For a limited time, enjoy:
• [Benefit 1]
• [Benefit 2]
• [Benefit 3]

This offer is available [timeframe] while supplies last. Terms and conditions apply. See [link] for full details.

Visit us at [location/website] to learn more.

[Required disclaimers if applicable]`,
  },
  {
    id: "real-estate-market-update",
    title: "Market Update Newsletter",
    category: "email",
    industry: "real_estate",
    safetyScore: 93,
    content: `Subject: [Month] Market Update for [Area]

Hi [First Name],

Here's your monthly real estate market snapshot:

Market Statistics (Source: [MLS/Data Source]):
• Median Sale Price: $[X] ([+/-X%] from last month)
• Average Days on Market: [X] days
• Active Listings: [X]

What This Means:
[Brief analysis of current conditions]

Please note: Market conditions can change rapidly, and historical data does not predict future performance. Individual property values depend on many factors.

Questions about buying or selling? I'm here to help.

[Your Name]
[License Number]`,
  },
  {
    id: "investment-newsletter",
    title: "Investment Newsletter Update",
    category: "email",
    industry: "finance",
    safetyScore: 90,
    content: `Subject: Q[X] Investment Insights

Dear Valued Client,

Here's our quarterly market perspective:

Market Overview:
[Brief, factual summary of market conditions]

Our Outlook:
[Forward-looking statements clearly labeled as opinions]

Important Reminders:
• Diversification does not ensure profit or protect against loss
• Past performance is not indicative of future results
• Please review your investment objectives periodically

Action Items:
• Schedule your quarterly review
• Update beneficiary information if needed

Disclosures: [Required regulatory disclosures]

[Your Name]
[Registration Information]`,
  },
]

const CATEGORY_ICONS: Record<string, any> = {
  email: Mail,
  social: MessageSquare,
  ad: Megaphone,
  other: FileText,
}

const INDUSTRY_ICONS: Record<string, any> = {
  real_estate: Building2,
  finance: DollarSign,
  healthcare: Heart,
  general: Briefcase,
}

export function TemplatesLibrary({
  userTemplates,
  teamTemplates,
  profile,
  createTemplateAction,
  updateTemplateAction,
  deleteTemplateAction,
}: TemplatesLibraryProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [templateToEdit, setTemplateToEdit] = useState<Template | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null)
  const { toast } = useToast()

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    toast({
      title: "Copied!",
      description: "Template copied to clipboard.",
    })
  }

  const filterTemplates = (templates: any[], searchTerm: string) => {
    if (!searchTerm) return templates
    const lower = searchTerm.toLowerCase()
    return templates.filter(
      (t) =>
        t.title.toLowerCase().includes(lower) ||
        t.category?.toLowerCase().includes(lower) ||
        t.industry?.toLowerCase().includes(lower),
    )
  }

  const filteredPresets = filterTemplates(PRESET_TEMPLATES, search)
  const filteredUserTemplates = filterTemplates(userTemplates, search)
  const filteredTeamTemplates = filterTemplates(teamTemplates, search)

  const TemplateCard = ({ template, isPreset = false }: { template: any; isPreset?: boolean }) => {
    const CategoryIcon = CATEGORY_ICONS[template.category] || FileText
    const IndustryIcon = INDUSTRY_ICONS[template.industry] || Briefcase

    return (
      <Card className="group relative overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="line-clamp-1 text-base">{template.title}</CardTitle>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="gap-1 text-xs">
                  <CategoryIcon className="h-3 w-3" />
                  {template.category}
                </Badge>
                <Badge variant="outline" className="gap-1 text-xs">
                  <IndustryIcon className="h-3 w-3" />
                  {template.industry?.replace("_", " ")}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge
                className={`${
                  template.safetyScore >= 90
                    ? "bg-safe-green/10 text-safe-green"
                    : template.safetyScore >= 70
                      ? "bg-warning-yellow/10 text-warning-yellow"
                      : "bg-risk-red/10 text-risk-red"
                }`}
              >
                {template.safetyScore}%
              </Badge>
              {isPreset && (
                <Badge variant="outline" className="gap-1 text-xs text-trust-blue">
                  <Sparkles className="h-3 w-3" />
                  Preset
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 max-h-32 overflow-hidden rounded-md bg-muted/50 p-3">
            <p className="line-clamp-4 font-mono text-xs text-muted-foreground">{template.content}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2 bg-transparent"
              onClick={() => handleCopy(template.content, template.id)}
            >
              {copiedId === template.id ? (
                <>
                  <Check className="h-4 w-4 text-safe-green" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
            <Button size="sm" className="flex-1 gap-2 bg-trust-blue hover:bg-trust-blue/90" asChild>
              <a href={`/scanner?template=${encodeURIComponent(template.content)}`}>
                <FileText className="h-4 w-4" />
                Use in Scanner
              </a>
            </Button>
            {!isPreset && (template.user_id === profile?.id || template.team_id === profile?.team_id) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setTemplateToEdit(template)
                      setShowEditDialog(true)
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setTemplateToDelete(template)
                      setShowDeleteDialog(true)
                    }}
                    className="text-risk-red focus:text-risk-red"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Templates Library</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Pre-approved compliant templates for quick, safe communication
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2 bg-trust-blue hover:bg-trust-blue/90">
          <Plus className="h-4 w-4" />
          Create Template
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search templates by name, category, or industry..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="presets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="presets" className="gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Preset</span> Templates
          </TabsTrigger>
          <TabsTrigger value="my-templates" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">My</span> Templates
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2">
            Team <span className="hidden sm:inline">Templates</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="presets" className="mt-6">
          {filteredPresets.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">No templates match your search</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPresets.map((template) => (
                <TemplateCard key={template.id} template={template} isPreset />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-templates" className="mt-6">
          {filteredUserTemplates.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {search ? "No templates match your search" : "You haven't created any templates yet"}
                </p>
                {!search && (
                  <Button
                    variant="outline"
                    className="mt-4 gap-2 bg-transparent"
                    onClick={() => setShowCreateDialog(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Create Your First Template
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredUserTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          {!profile?.team_id ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">Join a team to access shared templates</p>
                <Button variant="outline" className="mt-4 gap-2 bg-transparent" asChild>
                  <a href="/team">Go to Team Settings</a>
                </Button>
              </CardContent>
            </Card>
          ) : filteredTeamTemplates.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {search ? "No templates match your search" : "No team templates available yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTeamTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateTemplateDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} profile={profile} createTemplateAction={createTemplateAction} />

      {templateToEdit && (
        <EditTemplateDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          template={templateToEdit}
          profile={profile}
          updateTemplateAction={updateTemplateAction}
        />
      )}

      {templateToDelete && (
        <DeleteTemplateDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          template={templateToDelete}
          deleteTemplateAction={deleteTemplateAction}
        />
      )}
    </div>
  )
}
