import { formatDistanceToNow } from "date-fns"
import { Receipt } from "lucide-react"
import { formatINR } from "@/lib/utils/currency"

interface Expense {
  id: string
  amount: number
  description: string
  date: string
  categories: {
    name: string
    icon: string
    color: string
  } | null
}

interface RecentExpensesProps {
  expenses: Expense[]
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  return (
    <div className="glass-strong rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Recent Expenses</h2>
        <Receipt className="w-5 h-5 text-muted-foreground" />
      </div>

      {expenses.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No expenses yet</p>
          <p className="text-sm text-muted-foreground mt-1">Start tracking your expenses to see them here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {expenses.slice(0, 5).map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 rounded-xl glass hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${expense.categories?.color}20` }}
                >
                  <span className="text-xl">{expense.categories?.icon || "💰"}</span>
                </div>
                <div>
                  <p className="font-medium">{expense.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {expense.categories?.name || "Uncategorized"} •{" "}
                    {formatDistanceToNow(new Date(expense.date), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <p className="text-lg font-bold text-destructive">-{formatINR(Number(expense.amount))}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
