"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

interface Expense {
  amount: number
  date: string
}

interface MonthlyTrendProps {
  expenses: Expense[]
}

export function MonthlyTrend({ expenses }: MonthlyTrendProps) {
  // Group expenses by month
  const monthlyData = expenses.reduce(
    (acc, expense) => {
      const date = new Date(expense.date)
      const monthYear = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`

      if (!acc[monthYear]) {
        acc[monthYear] = { month: monthYear, amount: 0 }
      }

      acc[monthYear].amount += Number(expense.amount)
      return acc
    },
    {} as Record<string, { month: string; amount: number }>,
  )

  const chartData = Object.values(monthlyData).slice(-6)

  return (
    <Card className="glass-strong border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle>Monthly Spending Trend</CardTitle>
            <CardDescription>Last 6 months overview</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No expense data available for the selected period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.1)" />
              <XAxis dataKey="month" stroke="rgba(255, 255, 255, 0.5)" style={{ fontSize: "12px" }} />
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
              <Line
                type="monotone"
                dataKey="amount"
                stroke="rgb(16, 185, 129)"
                strokeWidth={3}
                dot={{ fill: "rgb(16, 185, 129)", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
