"use client"

import { Button } from "@/components/ui/button"
import { Trash2, BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { formatINR } from "@/lib/utils/currency"

interface Textbook {
  id: string
  title: string
  subject: string
  price: number
  purchased_date: string
  semester: string
  condition: string | null
}

interface TextbookListProps {
  textbooks: Textbook[]
}

export function TextbookList({ textbooks }: TextbookListProps) {
  const { toast } = useToast()
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this textbook?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("textbooks").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Textbook deleted successfully",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete textbook",
        variant: "destructive",
      })
    }
  }

  if (textbooks.length === 0) {
    return (
      <div className="glass-strong rounded-2xl p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground mb-2">No textbooks tracked yet</p>
        <p className="text-sm text-muted-foreground">Start tracking your course materials and expenses</p>
      </div>
    )
  }

  const totalSpent = textbooks.reduce((sum, book) => sum + Number(book.price), 0)

  return (
    <div className="space-y-6">
      <div className="glass-strong rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-2">Total Textbook Expenses</h2>
        <p className="text-4xl font-bold text-primary">{formatINR(totalSpent)}</p>
        <p className="text-muted-foreground mt-1">{textbooks.length} textbooks tracked</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {textbooks.map((textbook) => (
          <div key={textbook.id} className="glass-strong rounded-2xl p-6 hover:scale-105 transition-transform">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(textbook.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <h3 className="font-bold text-lg mb-2 line-clamp-2">{textbook.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{textbook.subject}</p>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="font-bold text-primary">{formatINR(Number(textbook.price))}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Semester</span>
                <span className="text-sm font-medium">{textbook.semester}</span>
              </div>
              {textbook.condition && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Condition</span>
                  <span className="text-sm font-medium">{textbook.condition}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Purchased</span>
                <span className="text-sm">
                  {new Date(textbook.purchased_date).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
