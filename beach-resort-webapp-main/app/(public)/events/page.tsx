import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Event } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, ArrowRight } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Events | Attela Beach Resort",
  description:
    "Friday DJ sessions, Saturday party nights, Family Sunday Funday and more. See upcoming events at Attela Beach Resort, Kisumu.",
}

export default async function EventsPage() {
  const supabase = await createClient()
  const now = new Date().toISOString()

  const [{ data: upcoming }, { data: past }] = await Promise.all([
    supabase
      .from("events")
      .select("*")
      .eq("is_active", true)
      .gte("event_date", now)
      .order("event_date", { ascending: true }),
    supabase
      .from("events")
      .select("*")
      .eq("is_active", true)
      .lt("event_date", now)
      .order("event_date", { ascending: false })
      .limit(6),
  ])

  const upcomingEvents = (upcoming ?? []) as Event[]
  const pastEvents = (past ?? []) as Event[]

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-foreground">
        <div className="absolute inset-0 opacity-25">
          <Image src="/images/exp-dj.png" alt="" fill className="object-cover" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-4">
            What&apos;s On
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-white mb-6 text-balance">
            Events at Attela
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
            From lakeside DJ nights to family fundays — something is always happening at Attela Beach Resort.
          </p>
        </div>
      </section>

      {/* Upcoming */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-10">Upcoming Events</h2>
          {upcomingEvents.length === 0 ? (
            <div className="bg-muted rounded-2xl p-12 text-center">
              <p className="text-muted-foreground">No upcoming events right now. Check back soon or follow us on social media!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {event.poster_url && (
                    <div className="relative aspect-video">
                      <Image src={event.poster_url} alt={event.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="bg-primary px-6 py-3 flex items-center gap-3">
                    <CalendarDays className="size-4 text-white shrink-0" />
                    <span className="text-white text-sm font-medium">
                      {new Date(event.event_date).toLocaleDateString("en-KE", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="size-4 text-muted-foreground" />
                      <span className="text-muted-foreground text-sm">
                        {new Date(event.event_date).toLocaleTimeString("en-KE", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <Badge className="ml-auto bg-green-100 text-green-800 border-0 text-xs">Upcoming</Badge>
                    </div>
                    <h3 className="font-serif font-bold text-xl text-foreground mb-2">{event.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                      {event.description}
                    </p>
                    <Button
                      asChild
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-white rounded-full w-full"
                    >
                      <Link href="/booking?category=party">
                        Reserve a Spot <ArrowRight className="size-3.5 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past events */}
      {pastEvents.length > 0 && (
        <section className="pb-20 px-4 sm:px-6 lg:px-8 bg-muted py-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-10">Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden opacity-75">
                  <div className="bg-muted-foreground/20 px-6 py-3 flex items-center gap-3">
                    <CalendarDays className="size-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground text-sm">
                      {new Date(event.event_date).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-serif font-bold text-lg text-foreground mb-2">{event.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{event.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
