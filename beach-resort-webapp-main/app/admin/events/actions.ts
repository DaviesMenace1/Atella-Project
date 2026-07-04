"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createEvent(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const title = (formData.get("title") as string).trim()
  const description = (formData.get("description") as string)?.trim() || null
  const event_date = formData.get("event_date") as string

  if (!title || !event_date) return { error: "Title and date are required." }

  const { error } = await supabase.from("events").insert({
    title, description, event_date: new Date(event_date).toISOString(), is_active: true,
  })

  if (error) return { error: error.message }
  revalidatePath("/admin/events")
  revalidatePath("/(public)/events")
  return { success: true }
}

export async function deleteEvent(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  await supabase.from("events").delete().eq("id", id)
  revalidatePath("/admin/events")
  revalidatePath("/(public)/events")
}

export async function toggleEventActive(id: string, is_active: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  await supabase.from("events").update({ is_active, updated_at: new Date().toISOString() }).eq("id", id)
  revalidatePath("/admin/events")
  revalidatePath("/(public)/events")
}
