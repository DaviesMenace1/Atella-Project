import Image from "next/image"
import { BookingForm } from "./booking-form"
import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Book Now | Attela Beach Resort",
  description: "Reserve your experience at Attela Beach Resort — chill & dine, party events, family day, or sunset boat rides on Lake Victoria, Kisumu.",
}

export default async function BookingPage() {
  const supabase = await createClient()
  const { data: blocks } = await supabase
    .from("availability_blocks")
    .select("blocked_date, category, blocked_time_range, reason")

  const blockedDates = (blocks ?? []).map((b: any) => ({
    date: b.blocked_date,
    category: b.category,
    timeRange: b.blocked_time_range,
    reason: b.reason,
  }))
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-foreground">
        <div className="absolute inset-0 opacity-30">
          <Image src="/images/hero-lake.png" alt="" fill className="object-cover" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-4">
            Make a Reservation
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-white mb-6 text-balance">
            Book Your Experience
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
            Fill in the form below and our team will confirm your booking within a few hours.
          </p>
        </div>
      </section>

      {/* Booking form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <BookingForm blockedDates={blockedDates} />
        </div>
      </section>
    </div>
  )
}
