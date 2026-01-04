import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { BudgetList } from "@/components/budget-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function BudgetsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const currentDate = new Date()
  const { data: budgets } = await supabase
    .from("budgets")
    .select("*")
    .eq("user_id", user.id)
    .eq("month", currentDate.getMonth() + 1)
    .eq("year", currentDate.getFullYear())

  // Fetch current month expenses for budget comparison
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

  const { data: expenses } = await supabase
    .from("expenses")
    .select("amount")
    .eq("user_id", user.id)
    .gte("date", firstDay.toISOString().split("T")[0])
    .lte("date", lastDay.toISOString().split("T")[0])

  const totalSpending = expenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0

  return (
    <div className="min-h-screen">
      <DashboardHeader userName={profile?.full_name || "User"} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Monthly Budget</h1>
            <p className="text-muted-foreground">Set and track your overall monthly spending limit</p>
          </div>
          <Link href="/dashboard/budgets/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Set Budget
            </Button>
          </Link>
        </div>

        <BudgetList budgets={budgets || []} totalSpending={totalSpending} />
      </main>
    </div>
  )
}
