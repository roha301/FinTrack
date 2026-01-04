import { Progress } from "@/components/ui/progress"
import { Target } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
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

interface SavingsGoalsProps {
  savingsGoals: SavingsGoal[]
}

export function SavingsGoals({ savingsGoals }: SavingsGoalsProps) {
  return (
    <div className="glass-strong rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Savings Goals</h2>
        <Target className="w-5 h-5 text-muted-foreground" />
      </div>

      {savingsGoals.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No savings goals yet</p>
          <p className="text-sm text-muted-foreground mt-1">Create goals to track your savings progress</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savingsGoals.map((goal) => {
            const percentage = (Number(goal.current_amount) / Number(goal.target_amount)) * 100

            return (
              <div key={goal.id} className="glass rounded-xl p-4 hover:scale-105 transition-transform">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${goal.color}20` }}
                  >
                    <span className="text-2xl">{goal.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{goal.name}</p>
                    {goal.deadline && (
                      <p className="text-xs text-muted-foreground">
                        Due {formatDistanceToNow(new Date(goal.deadline), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-bold">{percentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={Math.min(percentage, 100)} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatINR(Number(goal.current_amount))}</span>
                    <span>{formatINR(Number(goal.target_amount))}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
