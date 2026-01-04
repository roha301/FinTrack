"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

interface Expense {
  amount: number
  date: string
  categories: {
    name: string
    color: string
  } | null
}

interface ExpenseChartProps {
  expenses: Expense[]
}

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  // Group expenses by week
  const weeklyData = expenses.reduce(
    (acc, expense) => {
      const date = new Date(expense.date)
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()))
      const weekKey = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })

      if (!acc[weekKey]) {
        acc[weekKey] = { week: weekKey, amount: 0 }
      }

      acc[weekKey].amount += Number(expense.amount)
      return acc
    },
    {} as Record<string, { week: string; amount: number }>,
  )

  const chartData = Object.values(weeklyData).slice(-8)

  return (
    <Card className="glass-strong border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle>Weekly Expenses</CardTitle>
            <CardDescription>Last 8 weeks spending</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No expense data available</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.1)" />
              <XAxis dataKey="week" stroke="rgba(255, 255, 255, 0.5)" style={{ fontSize: "12px" }} />
              <YAxis stroke="rgba(255, 255, 255, 0.5)" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#fff" }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]}
              />
              <Bar dataKey="amount" fill="rgb(16, 185, 129)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
