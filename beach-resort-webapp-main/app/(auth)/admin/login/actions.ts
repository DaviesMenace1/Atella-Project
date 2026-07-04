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