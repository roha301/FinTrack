import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
// import ollama from "ollama" // Temporarily disabled - requires ollama package

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Initialize Supabase client
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Temporary response while Ollama is not configured
    const aiResponse = `I appreciate your question about: "${message}". Currently, the AI financial advisor is temporarily unavailable as the Ollama service needs to be properly configured. Please ensure Ollama is installed and running with a compatible model loaded.

For now, here are some general financial tips:
• Track your expenses regularly to understand your spending patterns
• Set realistic budgets for different categories
• Save a portion of your income consistently
• Review your financial goals regularly

Please check back once the AI service is properly configured!`

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error('API error:', error)

    return NextResponse.json({
      error: "Unable to process your request. Please try again.",
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
    }, { status: 500 })
  }
}
