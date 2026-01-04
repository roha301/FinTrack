"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, FileText, PiggyBank, Download } from "lucide-react"
import Link from "next/link"
import { QuickAddExpense } from "./quick-add-expense"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
  icon: string
  color: string
}

interface QuickActionsProps {
  categories?: Category[]
}

export function QuickActions({ categories = [] }: QuickActionsProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handlePrintReport = async () => {
    setIsGenerating(true)

    try {
      const currentDate = new Date()
      const response = await fetch("/api/reports/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate report")
      }

      const htmlContent = await response.text()

      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(htmlContent)
        printWindow.document.close()

        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print()
          }, 250)
        }
      }

      toast({
        title: "Success",
        description: "Report generated! Print or save as PDF from the print dialog.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate report",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }
  return (
    <div className="glass-strong rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickAddExpense categories={categories} />

        <Link href="/dashboard/budgets">
          <Button className="w-full h-auto flex-col gap-2 py-6 bg-transparent" variant="outline">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-accent" />
            </div>
            <span className="text-sm">Set Budget</span>
          </Button>
        </Link>

        <Link href="/dashboard/savings">
          <Button className="w-full h-auto flex-col gap-2 py-6 bg-transparent" variant="outline">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <PiggyBank className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm">Savings Goal</span>
          </Button>
        </Link>

        <Button
          onClick={handlePrintReport}
          disabled={isGenerating}
          className="w-full h-auto flex-col gap-2 py-6 bg-transparent"
          variant="outline"
        >
          <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
            <Download className="w-6 h-6 text-accent" />
          </div>
          <span className="text-sm">{isGenerating ? "Generating..." : "Print Report"}</span>
        </Button>
      </div>
    </div>
  )
}

function Wallet({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  )
}
