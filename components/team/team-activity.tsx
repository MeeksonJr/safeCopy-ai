import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"
import { Shield, Users, Scan, FileText, Search, Filter, Download } from "lucide-react"
import type { AuditLog } from "@/lib/types/database"
import { exportAuditLogsToPdf } from "@/app/actions/export-audit-logs"

interface TeamActivityProps {
  logs: AuditLog[]
  totalLogs: number
  currentPage: number
  pageSize: number
  currentSearch?: string
  currentActionFilter?: string
  teamId?: string // Add teamId for PDF export
}

export function TeamActivity({
  logs,
  totalLogs,
  currentPage,
  pageSize,
  currentSearch,
  currentActionFilter,
  teamId,
}: TeamActivityProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(name, value)
    return params.toString()
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value) {
      router.push(`/team?${createQueryString("search", value)}`)
    } else {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("search")
      router.push(`/team?${params.toString()}`)
    }
  }

  const handleActionFilterChange = (value: string) => {
    if (value !== "all") {
      router.push(`/team?${createQueryString("action", value)}`)
    } else {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("action")
      router.push(`/team?${params.toString()}`)
    }
  }

  const totalPages = Math.ceil(totalLogs / pageSize)

  const getActionIcon = (action: string) => {
    if (action.includes("team")) return <Users className="h-4 w-4" />
    if (action.includes("scan")) return <Scan className="h-4 w-4" />
    if (action.includes("template")) return <FileText className="h-4 w-4" />
    return <Shield className="h-4 w-4" />
  }

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      team_created: "Created team",
      team_member_added: "Added team member",
      team_member_removed: "Removed team member",
      scan_completed: "Completed scan",
      scan_high_risk: "High-risk scan detected",
      template_created: "Created template",
      template_approved: "Approved template",
    }
    return labels[action] || action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const handleExportPdf = async () => {
    setIsExporting(true)
    toast({
      title: "Exporting audit logs...",
      description: "Your PDF report is being generated.",
    })
    try {
      const result = await exportAuditLogsToPdf({
        teamId,
        searchQuery: currentSearch,
        actionFilter: currentActionFilter,
      })

      if (result.success && result.data) {
        // For now, we're returning an HTML string. To download as PDF,
        // you'd typically receive a base64 string or a direct file URL
        // from the server and handle the download here.
        // Example for downloading a simple text file/html string:
        const blob = new Blob([result.data], { type: "text/html" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `audit_logs_${new Date().toISOString()}.html` // Change to .pdf when actual PDF generation is implemented
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast({
          title: "Export complete!",
          description: "Audit logs exported successfully (as HTML for now).",
        })
      } else {
        throw new Error(result.error || "Failed to export audit logs.")
      }
    } catch (error: any) {
      console.error("Error exporting audit logs:", error)
      toast({
        title: "Export Failed",
        description: error.message || "There was an error generating the audit log report.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

    return (
      <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Audit Log</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportPdf}
          disabled={isExporting || totalLogs === 0}
          className="gap-2"
        >
          {isExporting ? "Exporting..." : "Export to PDF"}
          <Download className="h-4 w-4" />
        </Button>
        </CardHeader>
        <CardContent>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search actions or details..."
              value={currentSearch || ""}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          <Select value={currentActionFilter || "all"} onValueChange={handleActionFilterChange}>
            <SelectTrigger className="w-[180px] shrink-0">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="team_created">Team Created</SelectItem>
              <SelectItem value="team_member_added">Member Added</SelectItem>
              <SelectItem value="team_member_removed">Member Removed</SelectItem>
              <SelectItem value="scan_completed">Scan Completed</SelectItem>
              <SelectItem value="scan_high_risk">High-Risk Scan</SelectItem>
              <SelectItem value="template_created">Template Created</SelectItem>
              <SelectItem value="template_approved">Template Approved</SelectItem>
              <SelectItem value="export_pdf">Export PDF</SelectItem>
              <SelectItem value="warning_ignored">Warning Ignored</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {logs.length === 0 && totalLogs === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Shield className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No activity recorded yet</p>
          </div>
        ) : logs.length === 0 && totalLogs > 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No audit logs match your filters</p>
          </div>
        ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
              <div className="mt-0.5 rounded-lg bg-trust-blue/10 p-2 text-trust-blue">{getActionIcon(log.action)}</div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-foreground">{getActionLabel(log.action)}</p>
                  {log.details && Object.keys(log.details).length > 0 && (
                  <p className="text-xs text-muted-foreground">
                      {Object.entries(log.details)
                        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
                      .join(", ")}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}

            {totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href={currentPage > 1 ? `/team?${createQueryString("page", (currentPage - 1).toString())}` : "#"}
                      aria-disabled={currentPage <= 1}
                      tabIndex={currentPage <= 1 ? -1 : undefined}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href={`/team?${createQueryString("page", (i + 1).toString())}`}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href={currentPage < totalPages ? `/team?${createQueryString("page", (currentPage + 1).toString())}` : "#"}
                      aria-disabled={currentPage >= totalPages}
                      tabIndex={currentPage >= totalPages ? -1 : undefined}
                      className={currentPage >= totalPages ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
        </div>
        )}
      </CardContent>
    </Card>
  )
}
