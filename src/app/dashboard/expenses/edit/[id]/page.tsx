import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { ExpenseForm } from "@/components/expense-form"

export default async function EditExpensePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch the expense
  const { data: expense } = await supabase.from("expenses").select("*").eq("id", id).eq("user_id", user.id).single()

  if (!expense) {
    redirect("/dashboard/expenses")
  }

  // Fetch categories
  const { data: categories } = await supabase.from("categories").select("*").eq("user_id", user.id)

  return (
    <div className="min-h-screen">
      <DashboardHeader userName={profile?.full_name || "User"} />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <ExpenseForm categories={categories || []} expense={expense} />
      </main>
    </div>
  )
}
