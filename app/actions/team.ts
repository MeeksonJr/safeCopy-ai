"use server"

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createTeam(teamName: string) {
  const supabase = await createClient()

  // Get the authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: "You must be logged in to create a team" }
  }

  try {
    const adminClient = createAdminClient()

    // Create team using admin client
    const { data: newTeam, error: teamError } = await adminClient
      .from("teams")
      .insert({
        name: teamName,
        owner_id: user.id,
        plan: "free",
      })
      .select()
      .single()

    if (teamError) {
      console.error("[v0] Team creation error:", teamError)
      return { error: teamError.message }
    }

    // Update user profile with team_id and admin role
    const { error: profileError } = await adminClient
      .from("profiles")
      .update({ team_id: newTeam.id, role: "admin" })
      .eq("id", user.id)

    if (profileError) {
      console.error("[v0] Profile update error:", profileError)
      return { error: profileError.message }
    }

    // Create audit log
    await adminClient.from("audit_logs").insert({
      user_id: user.id,
      team_id: newTeam.id,
      action: "team_created",
      details: { team_name: teamName },
    })

    revalidatePath("/team")
    return { success: true, team: newTeam }
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return { error: "An unexpected error occurred" }
  }
}

interface InviteTeamMemberParams {
  teamId: string
  email: string
  role: 'admin' | 'writer' | 'compliance_officer'
}

export async function inviteTeamMember({
  teamId,
  email,
  role,
}: InviteTeamMemberParams) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: "You must be logged in to invite team members" }
  }

  try {
    const adminClient = createAdminClient()

    // Verify the inviting user is an admin or compliance_officer of the team
    const { data: inviterProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .eq("team_id", teamId)
      .single()

    if (!inviterProfile || (inviterProfile.role !== "admin" && inviterProfile.role !== "compliance_officer")) {
      return { error: "Forbidden: Insufficient permissions to invite team members" }
    }

    // Check if user is already in the team
    const { data: existingMember } = await adminClient
      .from("profiles")
      .select("id")
      .eq("team_id", teamId)
      .eq("email", email)
      .single()

    if (existingMember) {
      return { error: "User with this email is already a member of this team" }
    }

    // Check for pending invitations to the same email for this team
    const { data: existingInvite } = await adminClient
      .from("team_invites")
      .select("id")
      .eq("team_id", teamId)
      .eq("email", email)
      .eq("status", "pending")
      .single()

    if (existingInvite) {
      return { error: "An invitation has already been sent to this email for this team" }
    }

    // Create the invitation
    const { data: newInvite, error: inviteError } = await adminClient
      .from("team_invites")
      .insert({
        team_id: teamId,
        email,
        invited_by_user_id: user.id,
        role,
      })
      .select()
      .single()

    if (inviteError) {
      console.error("[v0] Team invitation error:", inviteError)
      return { error: inviteError.message }
    }

    // TODO: Send invitation email to the invited user

    // Create audit log
    await adminClient.from("audit_logs").insert({
      user_id: user.id,
      team_id: teamId,
      action: "team_member_invited",
      details: { invited_email: email, assigned_role: role, invite_id: newInvite.id },
    })

    revalidatePath("/team")
    return { success: true, invite: newInvite }
  } catch (error) {
    console.error("[v0] Unexpected error inviting team member:", error)
    return { error: "An unexpected error occurred during invitation" }
  }
}

interface UpdateTeamMemberRoleParams {
  profileId: string
  newRole: 'admin' | 'writer' | 'compliance_officer'
}

export async function updateTeamMemberRole({
  profileId,
  newRole,
}: UpdateTeamMemberRoleParams) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: "You must be logged in to update team member roles" }
  }

  try {
    const adminClient = createAdminClient()

    // Verify the updating user is an admin or compliance_officer of the team
    const { data: invokerProfile } = await supabase
      .from("profiles")
      .select("role, team_id")
      .eq("id", user.id)
      .single()

    // Get target member's current team_id
    const { data: targetProfile } = await adminClient
      .from("profiles")
      .select("team_id, role")
      .eq("id", profileId)
      .single()

    if (!invokerProfile || !targetProfile || invokerProfile.team_id !== targetProfile.team_id) {
      return { error: "Forbidden: You can only update roles for members in your own team" }
    }

    if (invokerProfile.role !== "admin" && invokerProfile.role !== "compliance_officer") {
      return { error: "Forbidden: Insufficient permissions to update team member roles" }
    }

    // Prevent changing the role of the team owner (if owner is admin, a separate transfer ownership should exist)
    // For simplicity, we'll just prevent changing the role of 'admin' if the invoker is not an admin themselves
    if (targetProfile.role === "admin" && invokerProfile.role !== "admin") {
      return { error: "Forbidden: Only an admin can change another admin's role" }
    }

    const { data: updatedProfile, error: updateError } = await adminClient
      .from("profiles")
      .update({ role: newRole })
      .eq("id", profileId)
      .select()
      .single()

    if (updateError) {
      console.error("[v0] Profile role update error:", updateError)
      return { error: updateError.message }
    }

    // Create audit log
    await adminClient.from("audit_logs").insert({
      user_id: user.id,
      team_id: invokerProfile.team_id,
      action: "team_member_role_updated",
      details: { target_profile_id: profileId, new_role: newRole, old_role: targetProfile.role },
    })

    revalidatePath("/team")
    return { success: true, profile: updatedProfile }
  } catch (error) {
    console.error("[v0] Unexpected error updating team member role:", error)
    return { error: "An unexpected error occurred during role update" }
  }
}
