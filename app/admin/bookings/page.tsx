import { createClient } from "@/lib/supabase/server"
import { Booking, BOOKING_CATEGORY_LABELS, BOOKING_STATUS_COLORS, BookingStatus } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookingActions } from "./booking-actions"
import { Users, Phone, Mail, MessageSquare } from "lucide-react"

const ALL_STATUSES: BookingStatus[] = ["pending", "confirmed", "completed", "cancelled", "rescheduled"]

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>
}) {
  const { status, q } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false })

  if (status && ALL_STATUSES.includes(status as BookingStatus)) {
    query = query.eq("status", status)
  }
  if (q) {
    query = query.or(`customer_name.ilike.%${q}%,phone.ilike.%${q}%,email.ilike.%${q}%`)
  }

  const { data } = await query
  const bookings = (data ?? []) as Booking[]

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">Bookings</h1>
        <p className="text-muted-foreground mt-1">Manage all reservations</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <a
          href="/admin/bookings"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !status ? "bg-primary text-white" : "bg-card border border-border text-muted-foreground hover:bg-muted"
          }`}
        >
          All
        </a>
        {ALL_STATUSES.map((s) => (
          <a
            key={s}
            href={`/admin/bookings?status=${s}`}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              status === s ? "bg-primary text-white" : "bg-card border border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {s}
          </a>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-serif text-lg">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
            {status ? ` — ${status}` : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {bookings.length === 0 ? (
            <div className="px-6 py-16 text-center text-muted-foreground">
              No bookings found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-6 py-3 text-muted-foreground font-medium">Guest</th>
                    <th className="text-left px-6 py-3 text-muted-foreground font-medium">Experience</th>
                    <th className="text-left px-6 py-3 text-muted-foreground font-medium">Date / Time</th>
                    <th className="text-left px-6 py-3 text-muted-foreground font-medium">Guests</th>
                    <th className="text-left px-6 py-3 text-muted-foreground font-medium">Status</th>
                    <th className="text-left px-6 py-3 text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-foreground">{booking.customer_name}</p>
                        <div className="flex items-center gap-1 text-muted-foreground text-xs mt-0.5">
                          <Phone className="size-3" />
                          <a href={`tel:${booking.phone}`} className="hover:text-primary">{booking.phone}</a>
                        </div>
                        {booking.email && (
                          <div className="flex items-center gap-1 text-muted-foreground text-xs">
                            <Mail className="size-3" />
                            <a href={`mailto:${booking.email}`} className="hover:text-primary">{booking.email}</a>
                          </div>
                        )}
                        {booking.notes && (
                          <div className="flex items-start gap-1 text-muted-foreground text-xs mt-1 max-w-[200px]">
                            <MessageSquare className="size-3 mt-0.5 shrink-0" />
                            <span className="line-clamp-2">{booking.notes}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-foreground font-medium">
                        {BOOKING_CATEGORY_LABELS[booking.category]}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-foreground font-medium">
                          {new Date(booking.date).toLocaleDateString("en-KE", {
                            weekday: "short", day: "numeric", month: "short", year: "numeric",
                          })}
                        </p>
                        <p className="text-muted-foreground text-xs">{booking.time}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-foreground">
                          <Users className="size-3.5 text-muted-foreground" />
                          <span>{booking.party_size}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${BOOKING_STATUS_COLORS[booking.status]}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <BookingActions bookingId={booking.id} currentStatus={booking.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
