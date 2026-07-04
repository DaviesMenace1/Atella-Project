"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createGalleryItem(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const media_url = (formData.get("media_url") as string).trim()
  const media_type = formData.get("media_type") as "image" | "video"
  const caption = (formData.get("caption") as string)?.trim() || null

  if (!media_url) return { error: "Media URL is required." }
  if (!["image", "video"].includes(media_type)) return { error: "Invalid media type." }

  // Get current max sort_order
  const { data: lastItem } = await supabase
    .from("gallery_items")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .single()

  const sort_order = ((lastItem?.sort_order ?? -1) + 1)

  const { error } = await supabase.from("gallery_items").insert({
    media_url,
    media_type,
    caption,
    sort_order,
  })

  if (error) return { error: error.message }

  revalidatePath("/admin/gallery")
  revalidatePath("/(public)/gallery")
  return { success: true }
}

export async function deleteGalleryItem(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  await supabase.from("gallery_items").delete().eq("id", id)
  revalidatePath("/admin/gallery")
  revalidatePath("/(public)/gallery")
}
