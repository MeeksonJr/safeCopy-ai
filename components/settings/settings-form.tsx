"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { User, Building2, Bell, Shield, Loader2, Check, CreditCard } from "lucide-react"
import type { Profile, Team } from "@/lib/types/database"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { updateProfile } from "@/app/actions/profile"

interface SettingsFormProps {
  profile: Profile | null
  team: Team | null
  userEmail: string
}

export function SettingsForm({ profile, team, userEmail }: SettingsFormProps) {
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [companyName, setCompanyName] = useState(profile?.company_name || "")
  const [industry, setIndustry] = useState(profile?.industry || "general")
  const [isSaving, setIsSaving] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(true)
  const [highRiskAlerts, setHighRiskAlerts] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  const handleSaveProfile = async () => {
    setIsSaving(true)

    try {
      await updateProfile({
        fullName,
        companyName,
        industry,
      })

      toast({
        title: "Settings saved!",
        description: "Your profile has been updated.",
      })

      router.refresh()
    } catch (error) {
      console.error("[v0] Error saving profile:", error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Manage your account, preferences, and subscription
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:grid-cols-4">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Subscription</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-trust-blue" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your personal details and industry settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={userEmail} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Inc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="real_estate">Real Estate</SelectItem>
                      <SelectItem value="finance">Financial Services</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="general">General / Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Determines compliance rules applied to scans</p>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="gap-2 bg-trust-blue hover:bg-trust-blue/90"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Team Info Card */}
          {team && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-trust-blue" />
                  Team Information
                </CardTitle>
                <CardDescription>Your current team and role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Team Name</p>
                    <p className="font-medium">{team.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Your Role</p>
                    <Badge variant="outline" className="mt-1 capitalize">
                      {profile?.role?.replace("_", " ")}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Plan</p>
                    <Badge className="mt-1 bg-trust-blue/10 text-trust-blue capitalize">{team.plan}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-trust-blue" />
                Email Notifications
              </CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Compliance Report</Label>
                  <p className="text-sm text-muted-foreground">Get a summary of your team's compliance activity</p>
                </div>
                <Switch checked={weeklyReport} onCheckedChange={setWeeklyReport} disabled={!emailNotifications} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>High-Risk Alerts</Label>
                  <p className="text-sm text-muted-foreground">Immediate alerts when high-risk content is detected</p>
                </div>
                <Switch checked={highRiskAlerts} onCheckedChange={setHighRiskAlerts} disabled={!emailNotifications} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-trust-blue" />
                Current Plan
              </CardTitle>
              <CardDescription>Manage your subscription and billing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-trust-blue/20 bg-trust-blue/5 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Badge className="mb-2 bg-trust-blue text-white capitalize">{team?.plan || "Free"} Plan</Badge>
                    <h3 className="text-2xl font-bold">
                      {team?.plan === "enterprise" ? "Custom" : team?.plan === "pro" ? "$49" : "$0"}
                      <span className="text-base font-normal text-muted-foreground">/month</span>
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Scans Used</p>
                    <p className="text-2xl font-bold">
                      {team?.scan_count || 0}
                      <span className="text-base font-normal text-muted-foreground">/{team?.scan_limit || 50}</span>
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-safe-green" />
                    <span>{team?.scan_limit || 50} scans per month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-safe-green" />
                    <span>AI-powered compliance analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-safe-green" />
                    <span>Automatic content rewriting</span>
                  </div>
                  {(team?.plan === "pro" || team?.plan === "enterprise") && (
                    <>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-safe-green" />
                        <span>Team collaboration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-safe-green" />
                        <span>Audit trail & reporting</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {team?.plan !== "enterprise" && (
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    View Plans
                  </Button>
                  <Button className="flex-1 bg-trust-blue hover:bg-trust-blue/90">Upgrade Plan</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-trust-blue" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Change Password</p>
                  <p className="text-sm text-muted-foreground">Update your password regularly for security</p>
                </div>
                <Button variant="outline" className="bg-transparent">
                  Change
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Badge variant="outline" className="text-warning-yellow">
                  Coming Soon
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-risk-red/20 bg-risk-red/5 p-4">
                <div>
                  <p className="font-medium text-risk-red">Delete Account</p>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                </div>
                <Button
                  variant="outline"
                  className="border-risk-red/20 text-risk-red hover:bg-risk-red/10 bg-transparent"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
