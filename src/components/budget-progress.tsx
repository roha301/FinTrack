import { Progress } from "@/components/ui/progress"
import { TrendingUp } from "lucide-react"
import { formatINR } from "@/lib/utils/currency"

interface Budget {
  id: string
  amount: number
  month: number
  year: number
  name: string
}

interface BudgetProgressProps {
  budgets: Budget[]
  totalExpenses: number
}

export function BudgetProgress({ budgets, totalExpenses }: BudgetProgressProps) {
  const totalBudget = budgets.reduce((sum, budget) => sum + Number(budget.amount), 0)
  const percentage = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0

  return (
    <div className="glass-strong rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Budget Progress</h2>
        <TrendingUp className="w-5 h-5 text-muted-foreground" />
      </div>

      {budgets.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No budgets set</p>
          <p className="text-sm text-muted-foreground mt-1">Create budgets to track your spending limits</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💰</span>
                <div>
                  <p className="font-medium">Overall Monthly Budget</p>
                  <p className="text-xs text-muted-foreground">
                    {budgets.length} budget{budgets.length !== 1 ? "s" : ""} active
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  {formatINR(totalExpenses)} / {formatINR(totalBudget)}
                </p>
                <p className="text-xs text-muted-foreground">{percentage.toFixed(0)}% used</p>
              </div>
            </div>
            <Progress
              value={Math.min(percentage, 100)}
              className="h-3"
              indicatorClassName={
                percentage > 90 ? "bg-destructive" : percentage > 70 ? "bg-yellow-500" : "bg-emerald-500"
              }
            />
            {percentage > 90 && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive font-medium">⚠️ Budget Alert!</p>
                <p className="text-xs text-destructive/80 mt-1">
                  You've used over 90% of your monthly budget. Consider reducing expenses.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-4 border-t">
            <p className="text-sm font-medium text-muted-foreground">Budget Breakdown</p>
            {budgets.map((budget) => (
              <div key={budget.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm">{budget.name}</span>
                </div>
                <span className="text-sm font-medium">{formatINR(Number(budget.amount))}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
