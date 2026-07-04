"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function loginAction(formData: FormData) {
  const supabase = await createClient()

    const email = formData.get("email") as string
      const password = formData.get("password") as string

        const { error } = await supabase.auth.signInWithPassword({
            email,
                password,
                  })

                    if (error) {
                        // Login failed
                            redirect("/admin/login?error=Invalid+credentials")
                              }

                                // Login successful → go to admin dashboard
                                  redirect("/admin")
                                  }

"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Lock } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const supabase = await createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError("Invalid email or password. Please try again.")
      } else {
        router.push("/admin")
        router.refresh()
      }
    })
  }

  return (
    <div className="min-h-screen bg-foreground flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <Image src="/images/hero-lake.png" alt="" fill className="object-cover" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative size-16 rounded-2xl overflow-hidden mb-4">
            <Image src="/images/logo.png" alt="Attela Beach Resort" fill className="object-cover" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-white">Attela Beach Resort</h1>
          <p className="text-white/50 text-sm mt-1">Staff Portal</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="size-10 rounded-xl bg-primary/15 flex items-center justify-center mb-3">
              <Lock className="size-5 text-primary" />
            </div>
            <CardTitle className="font-serif text-xl">Sign In</CardTitle>
            <CardDescription>Access the resort management dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-semibold text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@attelabeachresort.com"
                  className="rounded-xl"
                  autoComplete="email"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-semibold text-foreground">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="rounded-xl"
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl p-3">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-full h-11 font-semibold"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-white/30 text-xs mt-6">
          Staff access only. Contact your administrator for credentials.
        </p>
      </div>
    </div>
  )
}
