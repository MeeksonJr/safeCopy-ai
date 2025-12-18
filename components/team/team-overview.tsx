"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Users, Plus, Crown, MoreVertical, Mail, UserPlus, Shield, User, UserCheck } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { createTeam, inviteTeamMember, updateTeamMemberRole } from "@/app/actions/team"
import type { Profile, UserRole } from "@/lib/types/database"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

interface TeamOverviewProps {
  team: any
  members: Profile[]
  profile: Profile | null
  inviteTeamMemberAction: typeof inviteTeamMember
  updateTeamMemberRoleAction: typeof updateTeamMemberRole
}

export function TeamOverview({ team, members, profile }: TeamOverviewProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [teamName, setTeamName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [showInviteDialog, setShowInviteDialog] = useState(false)

  const handleCreateTeam = async () => {
    if (!teamName.trim()) return

    setIsCreating(true)
    setError(null)

    const result = await createTeam(teamName)

    if (result.error) {
      setError(result.error)
      setIsCreating(false)
    }
    // Server action handles revalidation, no need for router.refresh()
  }

  const inviteFormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    role: z.enum(["admin", "writer", "compliance_officer"], { invalid_type_error: "Please select a role." }),
  })

  type InviteFormValues = z.infer<typeof inviteFormSchema>

  const InviteMemberDialog = ({
    open,
    onOpenChange,
    teamId,
    inviteTeamMemberAction,
  }: {
    open: boolean
    onOpenChange: (open: boolean) => void
    teamId: string
    inviteTeamMemberAction: typeof inviteTeamMember
  }) => {
    const { toast } = useToast()
    const form = useForm<InviteFormValues>({
      resolver: zodResolver(inviteFormSchema),
      defaultValues: {
        email: "",
        role: "writer", // Default role
      },
    })

    const handleInviteSubmit = async (values: InviteFormValues) => {
      try {
        const result = await inviteTeamMemberAction({
          teamId: teamId,
          email: values.email,
          role: values.role,
        })

        if (result.success) {
          toast({
            title: "Invitation sent!",
            description: `An invitation has been sent to ${values.email}.`,
          })
          onOpenChange(false)
          form.reset()
        } else {
          toast({
            title: "Error sending invitation",
            description: result.error,
            variant: "destructive",
          })
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "An unexpected error occurred.",
          variant: "destructive",
        })
      }
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite New Member</DialogTitle>
            <DialogDescription>Send an email invitation to a new team member.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleInviteSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="member@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="writer">Writer</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="compliance_officer">Compliance Officer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-trust-blue hover:bg-trust-blue/90">
              Send Invitation
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  if (!team) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-4 text-sm text-muted-foreground">
              You're not part of a team yet. Create one to collaborate!
            </p>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-trust-blue hover:bg-trust-blue/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Team
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a New Team</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="team-name">Team Name</Label>
                    <Input
                      id="team-name"
                      placeholder="Acme Real Estate"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-risk-red">{error}</p>}
                  <Button
                    className="w-full bg-trust-blue hover:bg-trust-blue/90"
                    onClick={handleCreateTeam}
                    disabled={isCreating || !teamName.trim()}
                  >
                    {isCreating ? "Creating..." : "Create Team"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getRoleBadge = (role: string) => {
    if (role === "admin") return <Badge className="bg-trust-blue/10 text-trust-blue border-trust-blue/20">Admin</Badge>
    if (role === "member") return <Badge variant="outline">Member</Badge>
    return <Badge variant="outline">Viewer</Badge>
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <span>{team.name}</span>
          <Badge variant="outline" className="capitalize">
            {team.plan}
          </Badge>
        </CardTitle>
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <InviteMemberDialog
            open={showInviteDialog}
            onOpenChange={setShowInviteDialog}
            teamId={team.id}
            inviteTeamMemberAction={inviteTeamMember}
          />
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
            <div className="text-sm">
              <p className="font-medium text-foreground">Scan Usage</p>
              <p className="text-muted-foreground">
                {team.scan_count} / {team.scan_limit} scans
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-trust-blue">
                {Math.round((team.scan_count / team.scan_limit) * 100)}%
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-foreground">Team Members ({members.length})</h3>
            <div className="space-y-2">
              {members.map((member) => {
                const initials =
                  member.full_name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "U"

                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-trust-blue/10 text-sm text-trust-blue">{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {member.full_name || "User"}
                          {member.id === team.owner_id && <Crown className="ml-1 inline h-3 w-3 text-warning-yellow" />}
                        </p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    {member.id !== team.owner_id && profile?.role === "admin" ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 data-[state=open]:bg-muted">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem
                            onClick={async () => {
                              await updateTeamMemberRole({
                                profileId: member.id,
                                newRole: "admin",
                              })
                            }}
                            disabled={member.role === "admin"}
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Make Admin</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async () => {
                              await updateTeamMemberRole({
                                profileId: member.id,
                                newRole: "writer",
                              })
                            }}
                            disabled={member.role === "writer"}
                          >
                            <User className="mr-2 h-4 w-4" />
                            <span>Make Writer</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async () => {
                              await updateTeamMemberRole({
                                profileId: member.id,
                                newRole: "compliance_officer",
                              })
                            }}
                            disabled={member.role === "compliance_officer"}
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            <span>Make Compliance</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      getRoleBadge(member.role || "member")
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
