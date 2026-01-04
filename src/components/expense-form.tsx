"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

interface Category {
  id: string
  name: string
  icon: string
  color: string
}

interface ExpenseFormProps {
  categories: Category[]
  expense?: {
    id: string
    amount: number
    description: string
    date: string
    category_id: string
  }
}

export function ExpenseForm({ categories, expense }: ExpenseFormProps) {
  const [amount, setAmount] = useState(expense?.amount.toString() || "")
  const [description, setDescription] = useState(expense?.description || "")
  const [date, setDate] = useState(expense?.date || new Date().toISOString().split("T")[0])
  const [categoryId, setCategoryId] = useState(expense?.category_id || "")
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

      const expenseData = {
        user_id: user.id,
        amount: Number.parseFloat(amount),
        description,
        date,
        category_id: categoryId,
      }

      if (expense) {
        const { error } = await supabase.from("expenses").update(expenseData).eq("id", expense.id)
        if (error) throw error
        toast({
          title: "Success",
          description: "Expense updated successfully",
        })
      } else {
        const { error } = await supabase.from("expenses").insert(expenseData)
        if (error) throw error
        toast({
          title: "Success",
          description: "Expense added successfully",
        })
      }

      router.push("/dashboard/expenses")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save expense",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Link href="/dashboard/expenses">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Expenses
        </Button>
      </Link>

      <Card className="glass-strong border-primary/20">
        <CardHeader>
          <CardTitle>{expense ? "Edit Expense" : "Add New Expense"}</CardTitle>
          <CardDescription>Enter the details of your expense</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger className="glass">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What did you spend on?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="glass"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="glass"
                required
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Saving..." : expense ? "Update Expense" : "Add Expense"}
                <Save className="w-4 h-4 ml-2" />
              </Button>
              <Link href="/dashboard/expenses" className="flex-1">
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
