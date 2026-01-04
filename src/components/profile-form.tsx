"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { User, Mail, MapPin, Phone, Save, Calendar, Users } from "lucide-react"

interface Profile {
  id: string
  full_name: string | null
  email: string | null
  gender?: string | null
  birthdate?: string | null
  age?: number | null
  phone?: string | null
  address?: string | null
  created_at: string
  updated_at: string
}

interface ProfileFormProps {
  profile: Profile | null
  userEmail: string
}

export function ProfileForm({ profile, userEmail }: ProfileFormProps) {
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [gender, setGender] = useState(profile?.gender || "")
  const [birthdate, setBirthdate] = useState(profile?.birthdate || "")
  const [age, setAge] = useState(profile?.age?.toString() || "")
  const [phone, setPhone] = useState(profile?.phone || "")
  const [address, setAddress] = useState(profile?.address || "")
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

      console.log("Updating profile for user:", user.id)
      console.log("New full name:", fullName)

      const { data, error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          gender: gender,
          birthdate: birthdate,
          age: age ? Number.parseInt(age) : null,
          phone: phone,
          address: address,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()

      if (error) {
        console.error("Database error:", error)
        throw error
      }

      console.log("Profile updated successfully:", data)

      // Show success message first
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })

      // Wait a bit for database consistency
      await new Promise(resolve => setTimeout(resolve, 500))

      // Dispatch custom event to update header
      window.dispatchEvent(new CustomEvent('profile-updated'))

      // Refresh the page data
      router.refresh()

    } catch (error) {
      console.error("Profile update error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="glass-strong border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Profile
        </CardTitle>
        <CardDescription>Manage your personal information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              Email
            </Label>
            <Input id="email" type="email" value={userEmail} className="glass" disabled />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="glass"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              Gender
            </Label>
            <Input
              id="gender"
              type="text"
              placeholder="e.g. Male, Female, Other"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="glass"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthdate" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Birthdate
            </Label>
            <Input
              id="birthdate"
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="glass"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Age
            </Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="glass"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="glass"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Address
            </Label>
            <Input
              id="address"
              type="text"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="glass"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
            <Save className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
