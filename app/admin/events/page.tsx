import { createClient } from "@/lib/supabase/server"
import { Event } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EventActions } from "./event-actions"
import { CalendarDays } from "lucide-react"

export default async function AdminEventsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false })

  const events = (data ?? []) as Event[]
  const now = new Date()

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Events</h1>
          <p className="text-muted-foreground mt-1">Manage resort events</p>
        </div>
        <EventActions mode="create" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.length === 0 && (
          <div className="col-span-full bg-muted rounded-2xl p-12 text-center text-muted-foreground">
            No events yet. Create your first event above.
          </div>
        )}
        {events.map((event) => {
          const isPast = new Date(event.event_date) < now
          return (
            <Card key={event.id} className={isPast ? "opacity-60" : ""}>
              <div className={`px-5 py-3 flex items-center gap-3 border-b border-border ${isPast ? "bg-muted" : "bg-primary/10"}`}>
                <CalendarDays className={`size-4 shrink-0 ${isPast ? "text-muted-foreground" : "text-primary"}`} />
                <span className="text-sm font-medium text-foreground">
                  {new Date(event.event_date).toLocaleDateString("en-KE", {
                    weekday: "short", day: "numeric", month: "short", year: "numeric",
                  })}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {new Date(event.event_date).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-serif font-bold text-lg text-foreground leading-snug">{event.title}</h3>
                  <Badge className={`shrink-0 text-xs border-0 ${event.is_active && !isPast ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>
                    {isPast ? "Past" : event.is_active ? "Active" : "Hidden"}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
                  {event.description}
                </p>
                <EventActions mode="manage" event={event} />
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
