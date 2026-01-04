import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ExpenseForm } from "@/components/expense-form"

export default async function NewExpensePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch categories
  const { data: categories, error: fetchError } = await supabase.from("categories").select("*").eq("user_id", user.id)

  if (fetchError) {
    console.error("Error fetching categories:", fetchError)
  }

  // If no categories exist, create default ones
  if (!categories || categories.length === 0) {
    const defaultCategories = [
      { user_id: user.id, name: "Food & Dining", icon: "🍔", color: "#10b981" },
      { user_id: user.id, name: "Transportation", icon: "🚗", color: "#3b82f6" },
      { user_id: user.id, name: "Shopping", icon: "🛍️", color: "#8b5cf6" },
      { user_id: user.id, name: "Entertainment", icon: "🎬", color: "#f59e0b" },
      { user_id: user.id, name: "Bills & Utilities", icon: "💡", color: "#ef4444" },
      { user_id: user.id, name: "Healthcare", icon: "🏥", color: "#ec4899" },
      { user_id: user.id, name: "Education", icon: "📚", color: "#6366f1" },
      { user_id: user.id, name: "Other", icon: "💰", color: "#64748b" },
    ]

    const { error: insertError } = await supabase.from("categories").insert(defaultCategories)

    if (insertError) {
      console.error("Error inserting categories:", insertError)
    }

    // Re-fetch categories after insertion
    const { data: newCategories, error: refetchError } = await supabase.from("categories").select("*").eq("user_id", user.id)

    if (refetchError) {
      console.error("Error refetching categories:", refetchError)
    }

    console.log("Categories created:", newCategories)

    return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-8 max-w-2xl pt-16">
          <ExpenseForm categories={newCategories || []} />
        </main>
      </div>
    )
  }

  console.log("Existing categories:", categories)

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8 max-w-2xl pt-16">
        <ExpenseForm categories={categories || []} />
      </main>
    </div>
  )
}
