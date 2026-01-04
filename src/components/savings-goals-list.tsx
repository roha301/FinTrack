"use client"

import { useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Target, Plus, Minus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { formatINR } from "@/lib/utils/currency"

interface SavingsGoal {
  id: string
  name: string
  target_amount: number
  current_amount: number
  deadline: string | null
  icon: string
  color: string
}

interface SavingsGoalsListProps {
  savingsGoals: SavingsGoal[]
}

export function SavingsGoalsList({ savingsGoals }: SavingsGoalsListProps) {
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null)
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this savings goal?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("savings_goals").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Savings goal deleted successfully",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete savings goal",
        variant: "destructive",
      })
    }
  }

  const handleUpdateAmount = async (type: "add" | "subtract") => {
    if (!selectedGoal || !amount) return
    setIsLoading(true)

    try {
      const supabase = createClient()
      const newAmount =
        type === "add"
          ? Number(selectedGoal.current_amount) + Number.parseFloat(amount)
          : Math.max(0, Number(selectedGoal.current_amount) - Number.parseFloat(amount))

      const { error } = await supabase
        .from("savings_goals")
        .update({ current_amount: newAmount })
        .eq("id", selectedGoal.id)

      if (error) throw error

      toast({
        title: "Success",
        description: `${type === "add" ? "Added" : "Subtracted"} ₹${amount} ${type === "add" ? "to" : "from"} your savings goal`,
      })

      setSelectedGoal(null)
      setAmount("")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update savings goal",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (savingsGoals.length === 0) {
    return (
      <div className="glass-strong rounded-2xl p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground mb-2">No savings goals yet</p>
        <p className="text-sm text-muted-foreground">Create goals to start tracking your savings</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savingsGoals.map((goal) => {
          const percentage = (Number(goal.current_amount) / Number(goal.target_amount)) * 100
          const isCompleted = percentage >= 100

          return (
            <div
              key={goal.id}
              className="glass-strong rounded-2xl p-6 hover:scale-105 transition-transform cursor-pointer"
              onClick={() => setSelectedGoal(goal)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${goal.color}20` }}
                  >
                    <span className="text-3xl">{goal.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-lg truncate">{goal.name}</p>
                    {goal.deadline && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(goal.deadline) > new Date()
                          ? `Due ${formatDistanceToNow(new Date(goal.deadline), { addSuffix: true })}`
                          : "Overdue"}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(goal.id)
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className={`font-bold ${isCompleted ? "text-primary" : ""}`}>{percentage.toFixed(0)}%</span>
                </div>
                <Progress
                  value={Math.min(percentage, 100)}
                  className="h-3"
                  indicatorClassName={isCompleted ? "bg-primary" : ""}
                />
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">Current</p>
                    <p className="font-bold">{formatINR(Number(goal.current_amount))}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Target</p>
                    <p className="font-bold">{formatINR(Number(goal.target_amount))}</p>
                  </div>
                </div>

                {isCompleted && (
                  <div className="text-center text-xs text-primary bg-primary/10 p-2 rounded-lg font-medium">
                    Goal Achieved!
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <Dialog open={!!selectedGoal} onOpenChange={() => setSelectedGoal(null)}>
        <DialogContent className="glass-strong border-primary/20">
          <DialogHeader>
            <DialogTitle>Update Savings</DialogTitle>
            <DialogDescription>Add or subtract from your savings goal</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center p-4 glass rounded-xl">
              <p className="text-sm text-muted-foreground mb-1">Current Amount</p>
              <p className="text-3xl font-bold">{formatINR(Number(selectedGoal?.current_amount || 0))}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="glass"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleUpdateAmount("add")}
                disabled={isLoading || !amount}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
              <Button
                onClick={() => handleUpdateAmount("subtract")}
                disabled={isLoading || !amount}
                variant="outline"
                className="bg-transparent"
              >
                <Minus className="w-4 h-4 mr-2" />
                Subtract
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
