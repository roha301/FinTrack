import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { formatCurrency } from "@/lib/utils/currency"

export async function POST(request: Request) {
  try {
    const { month, year } = await request.json()

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    // Fetch expenses for the specified month
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)

    const { data: expenses } = await supabase
      .from("expenses")
      .select("*, categories(*)")
      .eq("user_id", user.id)
      .gte("date", firstDay.toISOString().split("T")[0])
      .lte("date", lastDay.toISOString().split("T")[0])
      .order("date", { ascending: false })

    if (!expenses || expenses.length === 0) {
      return NextResponse.json({ error: "No expenses found for this period" }, { status: 404 })
    }

    // Calculate totals
    const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0)

    const categoryTotals = expenses.reduce(
      (acc, expense) => {
        const categoryName = expense.categories?.name || "Uncategorized"
        acc[categoryName] = (acc[categoryName] || 0) + Number(expense.amount)
        return acc
      },
      {} as Record<string, number>,
    )

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>FinTrack Expense Report</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
            background: white;
            color: #1f2937;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 30px;
            border-bottom: 4px solid #10b981;
          }
          .header h1 {
            color: #10b981;
            font-size: 36px;
            margin-bottom: 10px;
          }
          .header .period {
            font-size: 18px;
            color: #6b7280;
            margin-top: 5px;
          }
          .info {
            background: #f0fdf4;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 30px;
            border: 2px solid #10b981;
          }
          .info p {
            margin: 8px 0;
            font-size: 14px;
          }
          .info strong {
            color: #065f46;
            display: inline-block;
            width: 120px;
          }
          h2 {
            color: #10b981;
            margin: 30px 0 20px 0;
            font-size: 24px;
            border-bottom: 2px solid #d1fae5;
            padding-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
          }
          thead {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          }
          th {
            padding: 15px;
            text-align: left;
            color: white;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          td {
            padding: 12px 15px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
          }
          tbody tr:hover {
            background: #f9fafb;
          }
          tbody tr:last-child td {
            border-bottom: none;
          }
          .amount {
            font-weight: 600;
            color: #10b981;
          }
          .total-box {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            margin: 30px 0;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          }
          .total-box .label {
            font-size: 16px;
            opacity: 0.9;
            margin-bottom: 8px;
          }
          .total-box .amount {
            font-size: 42px;
            font-weight: bold;
            color: white;
          }
          .summary {
            margin-top: 40px;
            padding: 25px;
            background: #f9fafb;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
          }
          .summary h3 {
            color: #1f2937;
            margin-bottom: 20px;
            font-size: 20px;
          }
          .category-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            margin: 10px 0;
            background: white;
            border-radius: 8px;
            border-left: 4px solid #10b981;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          .category-name {
            font-weight: 600;
            color: #1f2937;
          }
          .category-amount {
            font-weight: 700;
            color: #10b981;
            font-size: 16px;
          }
          .category-percent {
            color: #6b7280;
            font-size: 13px;
            margin-left: 10px;
          }
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #9ca3af;
            font-size: 12px;
          }
          @media print {
            body { padding: 20px; }
            .total-box { break-inside: avoid; }
            .summary { break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>💰 FinTrack Expense Report</h1>
          <div class="period">${new Date(year, month - 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</div>
        </div>

        <div class="info">
          <p><strong>Name:</strong> ${profile?.full_name || "User"}</p>
          <p><strong>Email:</strong> ${profile?.email || ""}</p>
          <p><strong>Report Generated:</strong> ${new Date().toLocaleDateString("en-IN")} at ${new Date().toLocaleTimeString("en-IN")}</p>
        </div>

        <h2>📊 Expense Details</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${expenses
              .map(
                (expense) => `
              <tr>
                <td>${new Date(expense.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                <td>${expense.categories?.icon || "💰"} ${expense.categories?.name || "Uncategorized"}</td>
                <td>${expense.description}</td>
                <td class="amount" style="text-align: right;">${formatCurrency(Number(expense.amount))}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>

        <div class="total-box">
          <div class="label">Total Expenses</div>
          <div class="amount">${formatCurrency(totalExpenses)}</div>
        </div>

        <div class="summary">
          <h3>📈 Category Breakdown</h3>
          ${Object.entries(categoryTotals)
            .sort(([, a], [, b]) => b - a)
            .map(
              ([category, amount]) => `
            <div class="category-item">
              <span class="category-name">${category}</span>
              <div>
                <span class="category-amount">${formatCurrency(amount)}</span>
                <span class="category-percent">(${((amount / totalExpenses) * 100).toFixed(1)}%)</span>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>

        <div class="footer">
          <p>Generated by FinTrack - Your Personal Finance Manager</p>
          <p>© ${new Date().getFullYear()} FinTrack. All rights reserved.</p>
        </div>
      </body>
      </html>
    `

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="FinTrack-Report-${year}-${month.toString().padStart(2, "0")}.html"`,
      },
    })
  } catch (error) {
    console.error("[v0] PDF generation error:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
