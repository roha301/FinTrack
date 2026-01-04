import { TrendingUp, TrendingDown, Wallet, Target } from "lucide-react"
import { formatINR } from "@/lib/utils/currency"

interface StatsOverviewProps {
  totalExpenses: number
  totalBudget: number
  savingsGoalsCount: number
  expensesCount: number
}

export function StatsOverview({ totalExpenses, totalBudget, savingsGoalsCount, expensesCount }: StatsOverviewProps) {
  const budgetRemaining = totalBudget - totalExpenses
  const budgetPercentage = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Expenses */}
      <div className="glass-strong rounded-2xl p-6 hover:scale-105 transition-transform">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-destructive" />
          </div>
        </div>
        <p className="text-3xl font-bold">{formatINR(totalExpenses)}</p>
        <p className="text-xs text-muted-foreground mt-1">{expensesCount} transactions this month</p>
      </div>

      {/* Budget Remaining */}
      <div className="glass-strong rounded-2xl p-6 hover:scale-105 transition-transform">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">Budget Remaining</p>
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
        </div>
        <p className="text-3xl font-bold">{formatINR(Math.max(0, budgetRemaining))}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {budgetPercentage.toFixed(0)}% of {formatINR(totalBudget)} spent
        </p>
      </div>

      {/* Savings Goals */}
      <div className="glass-strong rounded-2xl p-6 hover:scale-105 transition-transform">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">Active Goals</p>
          <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-accent" />
          </div>
        </div>
        <p className="text-3xl font-bold">{savingsGoalsCount}</p>
        <p className="text-xs text-muted-foreground mt-1">Savings goals in progress</p>
      </div>

      {/* Month Status */}
      <div className="glass-strong rounded-2xl p-6 hover:scale-105 transition-transform">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">Month Status</p>
          <div
            className={`w-10 h-10 rounded-lg ${budgetRemaining >= 0 ? "bg-primary/20" : "bg-destructive/20"} flex items-center justify-center`}
          >
            {budgetRemaining >= 0 ? (
              <TrendingUp className="w-5 h-5 text-primary" />
            ) : (
              <TrendingDown className="w-5 h-5 text-destructive" />
            )}
          </div>
        </div>
        <p className="text-3xl font-bold">{budgetRemaining >= 0 ? "On Track" : "Over Budget"}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {budgetRemaining >= 0 ? "Keep up the good work!" : "Consider reducing expenses"}
        </p>
      </div>
    </div>
  )
}
