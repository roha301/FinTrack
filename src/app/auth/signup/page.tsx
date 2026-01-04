"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Sparkles, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function SignUpPage() {
  const [step, setStep] = useState<"info" | "otp">("info")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [otpSentTime, setOtpSentTime] = useState<number | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const { toast } = useToast()
  const router = useRouter()

  // Countdown timer effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (otpSentTime && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            return 0
          }
          return prevCountdown - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [otpSentTime, countdown])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          data: {
            full_name: fullName,
          },
        },
      })

      if (otpError) throw otpError

      setOtpSentTime(Date.now())
      setStep("otp")

      toast({
        title: "OTP Sent!",
        description: "Please check your email for the 8-digit verification code. It expires in 60 seconds.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "signup",
      })

      if (error) throw error

      if (!data.user) {
        throw new Error("Verification failed")
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        const { error: updateError } = await supabase.auth.updateUser({
          password: password,
        })

        if (updateError) {
          console.error("[v0] Password update error:", updateError.message)
          throw new Error("Failed to set password")
        }
      }

      const { error: profileError } = await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: fullName,
        email: email,
      })

      if (profileError) {
        console.error("[v0] Profile update error:", profileError.message)
      }

      toast({
        title: "Success!",
        description: "Your account has been verified successfully.",
      })

      router.push("/dashboard")
    } catch (error: any) {
      let errorMessage = "Invalid or expired OTP code"

      if (error.message?.includes("expired")) {
        errorMessage = "OTP has expired. Please request a new code."
      } else if (error.message?.includes("invalid")) {
        errorMessage = "Invalid OTP code. Please check and try again."
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (otpSentTime && Date.now() - otpSentTime < 60000) {
      toast({
        title: "Please wait",
        description: "You can request a new code after 60 seconds.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) throw error

      setOtpSentTime(Date.now())
      setOtp("")

      toast({
        title: "OTP Resent!",
        description: "A new 8-digit code has been sent to your email.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend OTP",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-primary/5 rounded-full animate-float" style={{ animationDelay: '1s', animationDuration: '7s' }}></div>
        <div className="absolute bottom-1/3 left-1/4 w-28 h-28 bg-accent/5 rounded-full animate-float" style={{ animationDelay: '3s', animationDuration: '9s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-primary/8 rounded-full animate-float" style={{ animationDelay: '5s', animationDuration: '6s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4 animate-float">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-primary/30">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <span className="text-3xl font-bold text-primary transition-all duration-300 hover:scale-105">FinTrack</span>
          </div>
        </div>

        <Card className="glass-strong border-primary/20 shadow-2xl animate-slide-up transition-all duration-500 hover:shadow-primary/10" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>Join FinTrack and take control of your finances</CardDescription>
          </CardHeader>
          <CardContent>
            {step === "info" ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 glass"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 glass"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 glass"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 glass"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-primary hover:underline">
                    Login
                  </Link>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-glow">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">We've sent an 8-digit code to {email}</p>
                  <p className="text-xs text-muted-foreground mt-2">Please check your inbox and spam folder</p>
                  <div className="flex items-center justify-center gap-1 mt-3 text-xs text-orange-500">
                    <span>Code expires in {formatTime(countdown)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="00000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="text-center text-2xl tracking-widest glass"
                    maxLength={8}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 8}>
                  {isLoading ? "Verifying..." : "Verify & Create Account"}
                </Button>

                <Button type="button" variant="ghost" className="w-full" onClick={() => setStep("info")}>
                  Back to signup
                </Button>

                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="w-full text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  Didn't receive code? Resend
                </button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
