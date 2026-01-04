"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { SettingsIcon, Bell, Mail, TrendingUp, Calendar, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    budgetAlerts: true,
    expenseReminders: true,
    weeklyReports: false,
    monthlyReports: true,
    savingsGoalAlerts: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data: profile } = await supabase.from("profiles").select("settings").eq("id", user.id).single()

      if (profile?.settings) {
        setSettings({ ...settings, ...profile.settings })
      }
    } catch (error) {
      console.error("[v0] Error loading settings:", error)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("profiles").update({ settings }).eq("id", user.id)

      if (error) throw error

      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
          <SettingsIcon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your notification preferences</p>
        </div>
      </div>

      <Card className="glass-strong border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified (currently stored for future implementation)</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="emailNotifications">Email Notifications</Label>
              </div>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch
              id="emailNotifications"
              checked={settings.emailNotifications}
              onCheckedChange={() => toggleSetting("emailNotifications")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="budgetAlerts">Budget Alerts</Label>
              </div>
              <p className="text-sm text-muted-foreground">Get notified when approaching budget limits</p>
            </div>
            <Switch
              id="budgetAlerts"
              checked={settings.budgetAlerts}
              onCheckedChange={() => toggleSetting("budgetAlerts")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="expenseReminders">Expense Reminders</Label>
              </div>
              <p className="text-sm text-muted-foreground">Daily reminders to log your expenses</p>
            </div>
            <Switch
              id="expenseReminders"
              checked={settings.expenseReminders}
              onCheckedChange={() => toggleSetting("expenseReminders")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="weeklyReports">Weekly Reports</Label>
              </div>
              <p className="text-sm text-muted-foreground">Receive weekly spending summaries</p>
            </div>
            <Switch
              id="weeklyReports"
              checked={settings.weeklyReports}
              onCheckedChange={() => toggleSetting("weeklyReports")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="monthlyReports">Monthly Reports</Label>
              </div>
              <p className="text-sm text-muted-foreground">Receive monthly financial reports</p>
            </div>
            <Switch
              id="monthlyReports"
              checked={settings.monthlyReports}
              onCheckedChange={() => toggleSetting("monthlyReports")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="savingsGoalAlerts">Savings Goal Alerts</Label>
              </div>
              <p className="text-sm text-muted-foreground">Get notified about savings goal progress</p>
            </div>
            <Switch
              id="savingsGoalAlerts"
              checked={settings.savingsGoalAlerts}
              onCheckedChange={() => toggleSetting("savingsGoalAlerts")}
            />
          </div>

          <Button onClick={handleSave} disabled={isLoading} className="w-full">
            {isLoading ? "Saving..." : "Save Preferences"}
            <Save className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
