"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, LogOut } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"

interface DashboardHeaderProps {
  userName: string
}

export function DashboardHeader({ userName: initialUserName }: DashboardHeaderProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [userName, setUserName] = useState(initialUserName)

  // Function to fetch user name
  const fetchUserName = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single()

        if (profile?.full_name) {
          setUserName(profile.full_name)
        }
      }
    } catch (error) {
      console.error("Failed to fetch user name:", error)
    }
  }

  // Fetch updated user name when component mounts or when profile might change
  useEffect(() => {
    fetchUserName()
  }, [])

  // Listen for profile updates (when page refreshes after profile change)
  useEffect(() => {
    setUserName(initialUserName)
  }, [initialUserName])

  // Listen for profile update events
  useEffect(() => {
    const handleProfileUpdate = () => {
      fetchUserName()
    }

    window.addEventListener('profile-updated', handleProfileUpdate)
    return () => window.removeEventListener('profile-updated', handleProfileUpdate)
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              {/* Finance-themed logo: Dollar sign */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-primary"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-primary">FinTrack</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <p className="text-sm text-muted-foreground">Welcome back,</p>
              <p className="font-semibold">{userName}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
