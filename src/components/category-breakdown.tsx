"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart } from "lucide-react"
import { Pie, PieChart as RePieChart, ResponsiveContainer, Cell, Tooltip } from "recharts"

interface Expense {
  amount: number
  categories: {
    name: string
    color: string
    icon: string
  } | null
}

interface CategoryBreakdownProps {
  expenses: Expense[]
}

export function CategoryBreakdown({ expenses }: CategoryBreakdownProps) {
  // Group expenses by category
  const categoryData = expenses.reduce(
    (acc, expense) => {
      const categoryName = expense.categories?.name || "Uncategorized"
      const categoryColor = expense.categories?.color || "#64748b"

      if (!acc[categoryName]) {
        acc[categoryName] = { name: categoryName, value: 0, color: categoryColor }
      }

      acc[categoryName].value += Number(expense.amount)
      return acc
    },
    {} as Record<string, { name: string; value: number; color: string }>,
  )

  const chartData = Object.values(categoryData)
  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="glass-strong border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <PieChart className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Spending distribution by category</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No expense data available</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={(entry) => `${((entry.value / total) * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                />
              </RePieChart>
            </ResponsiveContainer>

            <div className="space-y-3">
              {chartData
                .sort((a, b) => b.value - a.value)
                .map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-3 glass rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${item.value.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{((item.value / total) * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
