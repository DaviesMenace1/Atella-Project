"use server"

import { createClient } from "@/lib/supabase/server"
import { BookingStatus } from "@/lib/types"
import { revalidatePath } from "next/cache"
import { logAudit } from "@/lib/audit"

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("bookings")
    .update({ status, handled_by: user.id, updated_at: new Date().toISOString() })
    .eq("id", bookingId)

  if (error) throw new Error(error.message)

  // Audit log
  await logAudit({
    userId: user.id,
    action: `booking_status_${status}`,
    entity: "bookings",
    entityId: bookingId,
    details: { new_status: status },
  })

  revalidatePath("/admin/bookings")
  revalidatePath("/admin")
}
