"use server"

import { createClient } from "@/lib/supabase/server"
import { BookingCategory } from "@/lib/types"

export async function createBooking(formData: FormData) {
  const category = formData.get("category") as BookingCategory
  const date = formData.get("date") as string
  const time = formData.get("time") as string
  const party_size = parseInt(formData.get("party_size") as string, 10)
  const customer_name = (formData.get("customer_name") as string).trim()
  const phone = (formData.get("phone") as string).trim()
  const email = (formData.get("email") as string)?.trim() || null
  const notes = (formData.get("notes") as string)?.trim() || null

  // Validate required fields
  if (!category || !date || !time || !customer_name || !phone) {
    return { error: "Please fill in all required fields." }
  }
  if (isNaN(party_size) || party_size < 1) {
    return { error: "Please enter a valid number of guests." }
  }
  if (!["chill_dine", "party", "family_day", "boat_ride"].includes(category)) {
    return { error: "Invalid booking category." }
  }

  const supabase = await createClient()

  // === Availability Block Check (Spec Section 5 & 8) ===
  const { data: blocks } = await supabase
    .from("availability_blocks")
    .select("*")
    .or(`category.eq.${category},category.eq.all`)
    .eq("blocked_date", date)

  if (blocks && blocks.length > 0) {
    const block = blocks[0]
    return {
      error: `This date is blocked${block.blocked_time_range ? ` (${block.blocked_time_range})` : ""}. ${block.reason || "Please select another date."}`,
    }
  }

  const { error } = await supabase.from("bookings").insert({
    category,
    date,
    time,
    party_size,
    customer_name,
    phone,
    email,
    notes,
    status: "pending",
  })

  if (error) {
    console.error("[v0] Booking insert error:", error)
    return { error: "Something went wrong. Please try again or call us directly." }
  }

  // === NOTIFICATION (Spec FR3 + Non-negotiable) ===
  // Production: integrate WhatsApp Business API or email service (Resend)
  // Current implementation: Structured console log (visible in Vercel) + WhatsApp deep link for resort staff

  const resortWhatsApp = "254799096255" // Update from site_settings in production
  const message = `New Booking Request for Attela Beach Resort\n\n` +
    `Experience: ${category}\nDate: ${date}\nTime: ${time}\nGuests: ${party_size}\n` +
    `Name: ${customer_name}\nPhone: ${phone}\nEmail: ${email || "N/A"}\nNotes: ${notes || "None"}`

  console.log("=== NEW BOOKING NOTIFICATION ===")
  console.log(message)
  console.log(`Quick WhatsApp to resort: https://wa.me/${resortWhatsApp}?text=${encodeURIComponent(message)}`)

  return { 
    success: true,
    // Optional: return link so success UI can offer "Message us on WhatsApp"
    whatsappLink: `https://wa.me/${resortWhatsApp}?text=${encodeURIComponent(message)}`
  }
}
