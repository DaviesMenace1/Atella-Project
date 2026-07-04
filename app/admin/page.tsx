import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Users,
} from "lucide-react"
import { BOOKING_CATEGORY_LABELS, BOOKING_STATUS_COLORS, Booking } from "@/lib/types"

async function getDashboardData() {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]

  const [
    { count: totalBookings },
    { count: pendingCount },
    { count: confirmedCount },
    { count: todayCount },
    { data: recentBookings },
  ] = await Promise.all([
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
    supabase.from("bookings").select("*", { count: "exact", head: true }).gte("date", today),
    supabase.from("bookings").select("*").order("created_at", { ascending: false }).limit(8),
  ])

  return {
    totalBookings: totalBookings ?? 0,
    pendingCount: pendingCount ?? 0,
    confirmedCount: confirmedCount ?? 0,
    todayCount: todayCount ?? 0,
    recentBookings: (recentBookings ?? []) as Booking[],
  }
}

const STAT_CARDS = [
  {
    key: "totalBookings",
    label: "Total Bookings",
    icon: TrendingUp,
    color: "text-primary bg-primary/15",
  },
  {
    key: "pendingCount",
    label: "Awaiting Confirmation",
    icon: Clock,
    color: "text-yellow-600 bg-yellow-100",
  },
  {
    key: "confirmedCount",
    label: "Confirmed",
    icon: CheckCircle2,
    color: "text-green-600 bg-green-100",
  },
  {
    key: "todayCount",
    label: "Today & Upcoming",
    icon: CalendarDays,
    color: "text-accent bg-accent/15",
  },
]

export default async function AdminDashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          {new Date().toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map((stat) => {
          const Icon = stat.icon
          const value = data[stat.key as keyof typeof data]
          return (
            <Card key={stat.key}>
              <CardContent className="p-5 flex flex-col gap-3">
                <div className={`size-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="font-serif font-bold text-3xl text-foreground">{String(value)}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="pb-4 flex flex-row items-center justify-between">
          <CardTitle className="font-serif text-xl">Recent Bookings</CardTitle>
          <a href="/admin/bookings" className="text-primary text-sm font-medium hover:underline">
            View all
          </a>
        </CardHeader>
        <CardContent className="p-0">
          {data.recentBookings.length === 0 ? (
            <div className="px-6 py-12 text-center text-muted-foreground">
              No bookings yet. They&apos;ll appear here when guests book online.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-3 text-muted-foreground font-medium">Guest</th>
                    <th className="text-left px-6 py-3 text-muted-foreground font-medium">Experience</th>
                    <th className="text-left px-6 py-3 text-muted-foreground font-medium">Date & Time</th>
                    <th className="text-left px-6 py-3 text-muted-foreground font-medium">Guests</th>
                    <th className="text-left px-6 py-3 text-muted-foreground font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">{booking.customer_name}</p>
                        <p className="text-muted-foreground text-xs">{booking.phone}</p>
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        {BOOKING_CATEGORY_LABELS[booking.category]}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-foreground">
                          {new Date(booking.date).toLocaleDateString("en-KE", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </p>
                        <p className="text-muted-foreground text-xs">{booking.time}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Users className="size-3.5 text-muted-foreground" />
                          <span className="text-foreground">{booking.party_size}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${BOOKING_STATUS_COLORS[booking.status]}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
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
