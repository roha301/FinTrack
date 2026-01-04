"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export function TextbookForm() {
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [price, setPrice] = useState("")
  const [purchasedDate, setPurchasedDate] = useState(new Date().toISOString().split("T")[0])
  const [semester, setSemester] = useState("")
  const [condition, setCondition] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Not authenticated")
      }

      const { error } = await supabase.from("textbooks").insert({
        user_id: user.id,
        title,
        subject,
        price: Number.parseFloat(price),
        purchased_date: purchasedDate,
        semester,
        condition,
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Textbook added successfully",
      })

      router.push("/dashboard/textbooks")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add textbook",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Link href="/dashboard/textbooks">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Textbooks
        </Button>
      </Link>

      <Card className="glass-strong border-primary/20">
        <CardHeader>
          <CardTitle>Add Textbook</CardTitle>
          <CardDescription>Track your course materials and expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Textbook Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Introduction to Computer Science"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="glass"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                type="text"
                placeholder="Computer Science"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="glass"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="glass"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchasedDate">Purchase Date</Label>
                <Input
                  id="purchasedDate"
                  type="date"
                  value={purchasedDate}
                  onChange={(e) => setPurchasedDate(e.target.value)}
                  className="glass"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Select value={semester} onValueChange={setSemester} required>
                  <SelectTrigger className="glass">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                    <SelectItem value="Spring 2025">Spring 2025</SelectItem>
                    <SelectItem value="Summer 2025">Summer 2025</SelectItem>
                    <SelectItem value="Fall 2025">Fall 2025</SelectItem>
                    <SelectItem value="Spring 2026">Spring 2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select value={condition} onValueChange={setCondition}>
                  <SelectTrigger className="glass">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Like New">Like New</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Textbook"}
                <Save className="w-4 h-4 ml-2" />
              </Button>
              <Link href="/dashboard/textbooks" className="flex-1">
                <Button type="button" variant="outline" className="w-full bg-transparent">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
