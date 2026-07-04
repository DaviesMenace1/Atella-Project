"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createMenuItem(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const category = (formData.get("category") as string).trim()
  const name = (formData.get("name") as string).trim()
  const description = (formData.get("description") as string)?.trim() || null
  const priceStr = formData.get("price") as string
  const price = priceStr ? parseFloat(priceStr) : null
  const currency = (formData.get("currency") as string)?.trim() || "KES"

  if (!category || !name) return { error: "Category and name are required." }

  const { error } = await supabase.from("menu_items").insert({
    category,
    name,
    description,
    price,
    currency,
    is_available: true,
    sort_order: 0,
  })

  if (error) return { error: error.message }

  revalidatePath("/admin/menu")
  revalidatePath("/(public)/menu")
  return { success: true }
}

export async function deleteMenuItem(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  await supabase.from("menu_items").delete().eq("id", id)
  revalidatePath("/admin/menu")
  revalidatePath("/(public)/menu")
}

export async function toggleMenuItemAvailable(id: string, is_available: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  await supabase.from("menu_items").update({ is_available, updated_at: new Date().toISOString() }).eq("id", id)
  revalidatePath("/admin/menu")
  revalidatePath("/(public)/menu")
}
