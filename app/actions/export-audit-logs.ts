"use server"

import { createClient } from "@/lib/supabase/server"
import { getAuditLogs } from "./audit-logs"
import { AuditLog } from "@/lib/types/database"
import puppeteer from 'puppeteer'

interface ExportAuditLogsParams {
  teamId?: string
  searchQuery?: string
  actionFilter?: string
}

export async function exportAuditLogsToPdf({
  teamId,
  searchQuery,
  actionFilter,
}: ExportAuditLogsParams): Promise<{ success: boolean; data?: string; error?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  // Ensure the user has permission to export logs (e.g., admin or compliance_officer role)
  const { data: profile } = await supabase.from("profiles").select("role, team_id").eq("id", user.id).single()

  if (!profile || (profile.role !== "admin" && profile.role !== "compliance_officer")) {
    return { success: false, error: "Forbidden: Insufficient permissions to export audit logs." }
  }

  // Fetch all relevant audit logs (without pagination for export)
  const { auditLogs, count, error } = await getAuditLogs({
    teamId: teamId || profile.team_id || undefined, // Use provided teamId or user's teamId
    searchQuery,
    actionFilter,
    pageSize: 99999, // Fetch all for export
  })

  if (error || !auditLogs) {
    console.error("[v0] Error fetching audit logs for export:", error?.message || error);
    return { success: false, error: error?.message || "Failed to retrieve audit logs for export." };
  }

  if (auditLogs.length === 0) {
    return { success: false, error: "No audit logs found for the given criteria." };
  }

  try {
    const pdfContent = `
      <h1>Audit Log Report</h1>
      <p>Generated on: ${new Date().toLocaleString()}</p>
      <p>Filters: ${searchQuery ? `Search: "${searchQuery}"` : "None"}, ${actionFilter && actionFilter !== "all" ? `Action: "${actionFilter}"` : "None"}</p>
      <p>Total Logs: ${auditLogs.length}</p>
      <br/>
      ${auditLogs
        .map(
          (log: AuditLog) => `
        <div>
          <h3>Action: ${log.action}</h3>
          <p>User ID: ${log.user_id}</p>
          <p>Team ID: ${log.team_id || "N/A"}</p>
          <p>Timestamp: ${new Date(log.created_at).toLocaleString()}</p>
          <p>Details: ${JSON.stringify(log.details)}</p>
          <hr/>
        </div>
      `,
        )
        .join("")}
    `

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(pdfContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    return { success: true, data: Buffer.from(pdfBuffer).toString('base64') };
  } catch (error: any) {
    console.error("[v0] Error generating PDF:", error);
    return { success: false, error: "Failed to generate PDF report." };
  }
}