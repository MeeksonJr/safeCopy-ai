"use server"

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { analyzeScan } from "./analyze"
import { createAuditLog } from "./create-audit-log"

interface CreateTemplateParams {
  title: string
  content: string
  category: string
  industry: string
}

export async function createTemplate({ title, content, category, industry }: CreateTemplateParams) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Get user profile for team_id
  const { data: profile } = await supabase.from("profiles").select("team_id").eq("id", user.id).single()

  // Analyze content to get safety score
  const analysis = await analyzeScan(content, industry)

  // Use admin client to bypass RLS
  const adminClient = createAdminClient()

  const { data: template, error } = await adminClient
    .from("templates")
    .insert({
      user_id: user.id,
      team_id: profile?.team_id || null,
      title,
      content,
      category,
      industry,
      safety_score: analysis.safetyScore,
      is_approved: analysis.safetyScore >= 80,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating template:", error)
    throw error
  }

  // Create audit log
  await createAuditLog({
    action: "template_created",
    details: {
      template_id: template.id,
      title,
      safety_score: analysis.safetyScore,
    },
  })

  return template
}

export async function deleteTemplate(templateId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const adminClient = createAdminClient()

  const { error } = await adminClient.from("templates").delete().eq("id", templateId).eq("user_id", user.id)

  if (error) {
    console.error("[v0] Error deleting template:", error)
    throw error
  }

  await createAuditLog({
    action: "template_deleted",
    details: { template_id: templateId },
  })

  return { success: true }
}

interface GetTemplatesParams {
  category?: string
  industry?: string
  searchQuery?: string
  page?: number
  pageSize?: number
  userId?: string // New optional parameter
  teamId?: string // New optional parameter
  excludeUserId?: string // New optional parameter
}

export async function getTemplates({
  category,
  industry,
  searchQuery,
  page = 1,
  pageSize = 10,
  userId,
  teamId,
  excludeUserId,
}: GetTemplatesParams) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && !userId && !teamId) {
    throw new Error("Unauthorized: No user or specific ID provided for template fetching")
  }

  let query = supabase.from("templates").select("*", { count: "exact" })

  // Apply filters based on provided parameters
  if (userId) {
    query = query.eq("user_id", userId)
  } else if (teamId) {
    query = query.eq("team_id", teamId)
    if (excludeUserId) {
      query = query.neq("user_id", excludeUserId)
    }
  } else if (user) { // Fallback to current authenticated user if no specific ID is provided
    query = query.eq("user_id", user.id)
  }

  if (category) {
    query = query.eq("category", category)
  }

  if (industry) {
    query = query.eq("industry", industry)
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`)
  }

  const start = (page - 1) * pageSize
  const end = start + pageSize - 1
  query = query.range(start, end)

  const { data: templates, error, count } = await query

  if (error) {
    console.error("[v0] Error fetching templates:", error)
    throw error
  }

  return { templates, count }
}

interface UpdateTemplateParams {
  templateId: string
  title?: string
  content?: string
  category?: string
  industry?: string
}

export async function updateTemplate({
  templateId,
  title,
  content,
  category,
  industry,
}: UpdateTemplateParams) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Verify the template belongs to the user or their team
  const { data: existingTemplate, error: fetchError } = await supabase
    .from("templates")
    .select("user_id, team_id, industry, title") // Added title here
    .eq("id", templateId)
    .single()

  if (fetchError || !existingTemplate) {
    console.error("[v0] Error fetching existing template:", fetchError)
    throw new Error("Template not found or unauthorized")
  }

  const { data: profile } = await supabase.from("profiles").select("team_id").eq("id", user.id).single()

  if (existingTemplate.user_id !== user.id && existingTemplate.team_id !== profile?.team_id) {
    throw new Error("Unauthorized to update this template")
  }

  let safetyScore = null
  let isApproved = null
  if (content) {
    const analysis = await analyzeScan(content, industry || existingTemplate.industry)
    safetyScore = analysis.safetyScore
    isApproved = analysis.safetyScore >= 80
  }

  const adminClient = createAdminClient()

  const { data: updatedTemplate, error } = await adminClient
    .from("templates")
    .update({
      ...(title && { title }),
      ...(content && { content }),
      ...(category && { category }),
      ...(industry && { industry }),
      ...(safetyScore !== null && { safety_score: safetyScore }),
      ...(isApproved !== null && { is_approved: isApproved }),
    })
    .eq("id", templateId)
    .select()
    .single()

  if (error) {
    console.error("[v0] Error updating template:", error)
    throw error
  }

  await createAuditLog({
    action: "template_updated",
    details: { template_id: templateId, title: title || existingTemplate.title },
  })

  return updatedTemplate
}
