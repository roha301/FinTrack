"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bot, Send, Sparkles, TrendingUp, PiggyBank, Target } from "lucide-react"
import { useToast } from "@/hooks/use-toast"


export default function AdvisorPage() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm Finley, your AI financial advisor. I can help you with budgeting tips, expense analysis, savings strategies, and financial planning. How can I assist you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const quickActions = [
    { icon: TrendingUp, label: "Analyze my spending", prompt: "Analyze my spending patterns this month" },
    { icon: PiggyBank, label: "Savings tips", prompt: "Give me tips to save more money" },
    { icon: Target, label: "Budget advice", prompt: "Help me create a realistic monthly budget" },
  ]

  const handleSend = async (customPrompt?: string) => {
    const messageText = customPrompt || input
    if (!messageText.trim()) return

    const userMessage = { role: "user" as const, content: messageText }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get AI response')
      }

      const assistantMessage = {
        role: "assistant" as const,
        content: data.response,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('API error:', error)

      const errorMessage = error instanceof Error ? error.message : 'Unable to connect to AI service'

      const assistantMessage = {
        role: "assistant" as const,
        content: `I apologize, but I'm currently unable to provide personalized advice. ${errorMessage}. Please try again in a moment.`,
      }

      setMessages((prev) => [...prev, assistantMessage])

      toast({
        title: "Connection Error",
        description: "Unable to connect to AI service. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center animate-glow">
          <Bot className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Finley AI Advisor</h1>
          <p className="text-muted-foreground">Your personal financial assistant</p>
        </div>
      </div>

      <Card className="glass-strong border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get instant financial advice</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="glass h-auto py-4 flex-col gap-2 bg-transparent"
              onClick={() => handleSend(action.prompt)}
              disabled={isLoading}
            >
              <action.icon className="w-5 h-5 text-primary" />
              <span className="text-sm">{action.label}</span>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card className="glass-strong border-primary/20">
        <CardHeader>
          <CardTitle>Chat with Finley</CardTitle>
          <CardDescription>Ask me anything about your finances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-[400px] overflow-y-auto space-y-4 p-4 glass rounded-lg">
              {messages.map((message, index) => (
                <div key={index} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "glass-strong border border-primary/20"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary animate-pulse" />
                  </div>
                  <div className="glass-strong border border-primary/20 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">Finley is thinking...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Textarea
                placeholder="Ask Finley about budgeting, savings, or expenses..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                className="glass min-h-[60px]"
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                size="icon"
                className="h-[60px] w-[60px]"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
