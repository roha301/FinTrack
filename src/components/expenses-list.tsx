"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Edit, Trash2, Receipt } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { formatINR } from "@/lib/utils/currency"

interface Expense {
  id: string
  amount: number
  description: string
  date: string
  categories: {
    id: string
    name: string
    icon: string
    color: string
  } | null
}

interface Category {
  id: string
  name: string
  icon: string
  color: string
}

interface ExpensesListProps {
  expenses: Expense[]
  categories: Category[]
}

export function ExpensesList({ expenses, categories }: ExpensesListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.categories?.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = !selectedCategory || expense.categories?.id === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("expenses").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Expense deleted successfully",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete expense",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="glass-strong rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="whitespace-nowrap"
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="glass-strong rounded-2xl p-6">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No expenses found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {searchTerm || selectedCategory ? "Try adjusting your filters" : "Start tracking your expenses"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 rounded-xl glass hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${expense.categories?.color}20` }}
                  >
                    <span className="text-2xl">{expense.categories?.icon || "💰"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{expense.description}</p>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span>{expense.categories?.name || "Uncategorized"}</span>
                      <span>•</span>
                      <span>{format(new Date(expense.date), "MMM dd, yyyy")}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-xl font-bold text-destructive whitespace-nowrap">
                    -{formatINR(Number(expense.amount))}
                  </p>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/expenses/edit/${expense.id}`}>
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(expense.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
