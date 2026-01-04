import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { ExpenseChart } from "@/components/expense-chart"
import { CategoryBreakdown } from "@/components/category-breakdown"
import { MonthlyTrend } from "@/components/monthly-trend"
import { PDFGenerator } from "@/components/pdf-generator"

export default async function ReportsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch last 6 months of expenses
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const { data: expenses } = await supabase
    .from("expenses")
    .select("*, categories(*)")
    .eq("user_id", user.id)
    .gte("date", sixMonthsAgo.toISOString().split("T")[0])
    .order("date", { ascending: true })

  const { data: categories } = await supabase.from("categories").select("*").eq("user_id", user.id)

  return (
    <div className="min-h-screen">
      <DashboardHeader userName={profile?.full_name || "User"} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Visualize your spending patterns and generate reports</p>
        </div>

        <div className="space-y-6">
          {/* PDF Generator */}
          <PDFGenerator />

          {/* Monthly Trend */}
          <MonthlyTrend expenses={expenses || []} />

          {/* Category Breakdown */}
          <CategoryBreakdown expenses={expenses || []} />

          {/* Expense Timeline Chart */}
          <ExpenseChart expenses={expenses || []} />
        </div>
      </main>
    </div>
  )
}
