import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { ExpensesList } from "@/components/expenses-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function ExpensesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch all expenses
  const { data: expenses } = await supabase
    .from("expenses")
    .select("*, categories(*)")
    .eq("user_id", user.id)
    .order("date", { ascending: false })

  // Fetch categories
  const { data: categories } = await supabase.from("categories").select("*").eq("user_id", user.id)

  return (
    <div className="min-h-screen">
      <DashboardHeader userName={profile?.full_name || "User"} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Expenses</h1>
            <p className="text-muted-foreground">Track and manage your expenses</p>
          </div>
          <Link href="/dashboard/expenses/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </Link>
        </div>

        <ExpensesList expenses={expenses || []} categories={categories || []} />
      </main>
    </div>
  )
}
