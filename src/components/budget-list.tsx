"use client"

import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Trash2, TrendingUp, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { formatINR } from "@/lib/utils/currency"

interface Budget {
  id: string
  amount: number
  month: number
  year: number
}

interface BudgetListProps {
  budgets: Budget[]
  totalSpending: number
}

export function BudgetList({ budgets, totalSpending }: BudgetListProps) {
  const { toast } = useToast()
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this budget?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("budgets").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Budget deleted successfully",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete budget",
        variant: "destructive",
      })
    }
  }

  if (budgets.length === 0) {
    return (
      <div className="glass-strong rounded-2xl p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground mb-2">No budget set for this month</p>
        <p className="text-sm text-muted-foreground">
          Set a monthly budget to track your spending limit and stay on track
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {budgets.map((budget) => {
        const percentage = (totalSpending / Number(budget.amount)) * 100
        const remaining = Number(budget.amount) - totalSpending

        return (
          <div key={budget.id} className="glass-strong rounded-2xl p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {new Date(budget.year, budget.month - 1).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <p className="text-muted-foreground">Overall monthly spending limit</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(budget.id)}>
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="glass rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-1">Budget</p>
                <p className="text-3xl font-bold text-primary">{formatINR(Number(budget.amount))}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-1">Spent</p>
                <p className="text-3xl font-bold text-destructive">{formatINR(totalSpending)}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-1">Remaining</p>
                <p className={`text-3xl font-bold ${remaining < 0 ? "text-destructive" : "text-primary"}`}>
                  {formatINR(Math.abs(remaining))}
                  {remaining < 0 && <span className="text-sm ml-1">over</span>}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Progress
                value={Math.min(percentage, 100)}
                className="h-4"
                indicatorClassName={
                  percentage > 90 ? "bg-destructive" : percentage > 70 ? "bg-yellow-500" : "bg-primary"
                }
              />

              <div className="flex justify-between items-center">
                <span className={`font-medium ${percentage > 90 ? "text-destructive" : "text-muted-foreground"}`}>
                  {percentage.toFixed(1)}% of budget used
                </span>
                <span className="text-muted-foreground">{formatINR(Number(budget.amount))}</span>
              </div>

              {percentage > 90 && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg mt-4">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">
                    {percentage >= 100
                      ? "Budget exceeded! You've overspent this month."
                      : "Warning: You're close to exceeding your budget!"}
                  </span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
