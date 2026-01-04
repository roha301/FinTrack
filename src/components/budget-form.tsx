"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export function BudgetForm() {
  const currentDate = new Date()
  const [amount, setAmount] = useState("")
  const [month, setMonth] = useState((currentDate.getMonth() + 1).toString())
  const [year, setYear] = useState(currentDate.getFullYear().toString())
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Not authenticated")
      }

      const { error } = await supabase.from("budgets").insert({
        user_id: user.id,
        amount: Number.parseFloat(amount),
        month: Number.parseInt(month),
        year: Number.parseInt(year),
      })

      if (error) {
        if (error.code === "23505") {
          throw new Error("Budget already exists for this month")
        }
        throw error
      }

      toast({
        title: "Success",
        description: "Monthly budget set successfully",
      })

      router.push("/dashboard/budgets")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to set budget",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ]

  return (
    <div>
      <Link href="/dashboard/budgets">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Budgets
        </Button>
      </Link>

      <Card className="glass-strong border-primary/20">
        <CardHeader>
          <CardTitle>Set Monthly Budget</CardTitle>
          <CardDescription>Set your overall spending limit for the month</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Monthly Budget Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="glass"
                required
              />
              <p className="text-sm text-muted-foreground">
                This is your total spending limit for all expenses this month
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="month">Month</Label>
                <Select value={month} onValueChange={setMonth} required>
                  <SelectTrigger className="glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  min="2020"
                  max="2100"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="glass"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Setting Budget..." : "Set Budget"}
                <Save className="w-4 h-4 ml-2" />
              </Button>
              <Link href="/dashboard/budgets" className="flex-1">
                <Button type="button" variant="outline" className="w-full bg-transparent">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
