import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatsOverview } from "@/components/stats-overview"
import { RecentExpenses } from "@/components/recent-expenses"
import { BudgetProgress } from "@/components/budget-progress"
import { SavingsGoals } from "@/components/savings-goals"
import { QuickActions } from "@/components/quick-actions"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch current month expenses
  const currentDate = new Date()
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

  const { data: expenses } = await supabase
    .from("expenses")
    .select("*, categories(*)")
    .eq("user_id", user.id)
    .gte("date", firstDay.toISOString().split("T")[0])
    .lte("date", lastDay.toISOString().split("T")[0])
    .order("date", { ascending: false })

  const { data: budgets } = await supabase
    .from("budgets")
    .select("*")
    .eq("user_id", user.id)
    .eq("month", currentDate.getMonth() + 1)
    .eq("year", currentDate.getFullYear())

  // Fetch savings goals
  const { data: savingsGoals } = await supabase
    .from("savings_goals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)

  // Calculate total expenses for the month
  const totalExpenses = expenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0

  // Calculate total budget
  const totalBudget = budgets?.reduce((sum, budget) => sum + Number(budget.amount), 0) || 0

  // Calculate category-wise spending
  const categorySpending = expenses?.reduce(
    (acc, expense) => {
      const categoryName = expense.categories?.name || "Uncategorized"
      acc[categoryName] = (acc[categoryName] || 0) + Number(expense.amount)
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="min-h-screen">
      <DashboardHeader userName={profile?.full_name || "User"} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Stats Overview */}
          <StatsOverview
            totalExpenses={totalExpenses}
            totalBudget={totalBudget}
            savingsGoalsCount={savingsGoals?.length || 0}
            expensesCount={expenses?.length || 0}
          />

          {/* Quick Actions */}
          <QuickActions categories={categories || []} />

          {/* Main Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Expenses */}
            <RecentExpenses expenses={expenses || []} />

            {/* Budget Progress */}
            <BudgetProgress budgets={budgets || []} totalExpenses={totalExpenses} />
          </div>

          {/* Savings Goals */}
          <SavingsGoals savingsGoals={savingsGoals || []} />
        </div>
      </main>
    </div>
  )
}
