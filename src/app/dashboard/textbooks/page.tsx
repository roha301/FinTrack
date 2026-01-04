import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { TextbookList } from "@/components/textbook-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function TextbooksPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: textbooks } = await supabase
    .from("textbooks")
    .select("*")
    .eq("user_id", user.id)
    .order("purchased_date", { ascending: false })

  return (
    <div className="min-h-screen">
      <DashboardHeader userName={profile?.full_name || "User"} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Textbook Tracker</h1>
            <p className="text-muted-foreground">Track your course materials and textbook expenses</p>
          </div>
          <Link href="/dashboard/textbooks/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Textbook
            </Button>
          </Link>
        </div>

        <TextbookList textbooks={textbooks || []} />
      </main>
    </div>
  )
}
