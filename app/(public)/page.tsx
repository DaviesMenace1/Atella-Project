import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Experience, Event } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Ship,
  Music,
  Users,
  Sunset,
  Phone,
  ArrowRight,
  CalendarDays,
  UtensilsCrossed,
  Waves,
} from "lucide-react"

async function getHomeData() {
  const supabase = await createClient()
  const [{ data: experiences }, { data: events }, { data: settings }] = await Promise.all([
    supabase
      .from("experiences")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .limit(4),
    supabase
      .from("events")
      .select("*")
      .eq("is_active", true)
      .gte("event_date", new Date().toISOString())
      .order("event_date", { ascending: true })
      .limit(3),
    supabase.from("site_settings").select("*"),
  ])

  const settingsMap = (settings ?? []).reduce((acc: Record<string, string>, s: any) => {
    acc[s.key] = s.value
    return acc
  }, {})

  return {
    experiences: experiences ?? [],
    events: events ?? [],
    heroTagline: settingsMap.hero_tagline || "Where the Lake Meets the Good Life",
    heroSubtitle:
      settingsMap.hero_subtitle ||
      "Sunset boat cruises, lakeside dining, DJ nights, and family escapes on the shores of Lake Victoria.",
  }
}

const EXPERIENCE_IMAGES: Record<string, string> = {
  "Sunset Boat Cruise": "/images/exp-boat.png",
  "DJ Nights & Parties": "/images/exp-dj.png",
  "Floating Bridge Experience": "/images/exp-bridge.png",
  "Family Garden Staycation": "/images/exp-family.png",
}

const EXPERIENCE_ICONS = [Ship, Music, Waves, Users]

const STATS = [
  { value: "5★", label: "Guest Rating" },
  { value: "4+", label: "Experiences" },
  { value: "100+", label: "Events / Year" },
  { value: "Daily", label: "Open 8AM–11PM" },
]

const BOOKING_CATEGORIES = [
  {
    icon: UtensilsCrossed,
    title: "Chill & Dine",
    description: "Lakeside table, fresh food, cold drinks — your own corner of paradise.",
    href: "/booking?category=chill_dine",
    color: "bg-gradient-to-br from-orange-100 to-amber-100 text-orange-700",
  },
  {
    icon: Music,
    title: "Party / Event",
    description: "Host your event lakeside with DJ, full bar, and catering.",
    href: "/booking?category=party",
    color: "bg-gradient-to-br from-rose-100 to-red-100 text-red-700",
  },
  {
    icon: Users,
    title: "Family Day",
    description: "A full-day escape — gardens, games, BBQ, and a kids menu.",
    href: "/booking?category=family_day",
    color: "bg-gradient-to-br from-cyan-100 to-blue-100 text-cyan-700",
  },
  {
    icon: Ship,
    title: "Boat Ride",
    description: "Sunset or morning cruise across Lake Victoria with drinks.",
    href: "/booking?category=boat_ride",
    color: "bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-700",
  },
]

export default async function HomePage() {
  const { experiences, events, heroTagline, heroSubtitle } = await getHomeData()

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-lake.png"
            alt="Attela Beach Resort on Lake Victoria"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
          <Badge className="mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-gray-900 border-0 px-6 py-2 text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow">
            ✨ Lake Victoria · Kisumu, Kenya
          </Badge>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight text-balance mb-6 drop-shadow-lg">
            {heroTagline.includes("<br") ? (
              <span dangerouslySetInnerHTML={{ __html: heroTagline }} />
            ) : (
              heroTagline
            )}
          </h1>
          <p className="text-white/90 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10 text-pretty drop-shadow-md">
            {heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full px-8 text-base h-12 font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Link href="/booking">Book Your Experience</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur rounded-full px-8 text-base h-12 font-semibold transition-all"
            >
              <Link href="/experiences">Explore Experiences</Link>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1.5">
            <div className="w-1 h-2.5 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center hover:transform hover:scale-105 transition-all duration-300">
                <p className="font-serif font-bold text-4xl text-white drop-shadow-md">{stat.value}</p>
                <p className="text-white/80 text-sm mt-2 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Your Experience */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-orange-600 font-semibold text-sm uppercase tracking-widest mb-3">
              Make a Reservation
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4 text-balance">
              Choose Your Experience
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto leading-relaxed font-medium">
              Whether you&apos;re coming to unwind, celebrate, or explore the lake — we have the perfect setup for you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BOOKING_CATEGORIES.map((cat) => {
              const Icon = cat.icon
              return (
                <Link key={cat.title} href={cat.href}>
                  <Card className="h-full hover:shadow-2xl transition-all hover:-translate-y-2 hover:scale-105 cursor-pointer border-0 bg-white">
                    <CardContent className="p-7 flex flex-col gap-4">
                      <div className={`size-14 rounded-3xl flex items-center justify-center font-bold text-lg ${cat.color}`}>
                        <Icon className="size-7" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-xl text-gray-900 mb-2">{cat.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed font-medium">{cat.description}</p>
                      </div>
                      <div className="mt-auto flex items-center gap-1 text-orange-600 text-sm font-bold hover:gap-2 transition-all">
                        <span>Reserve</span>
                        <ArrowRight className="size-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Experiences */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-orange-600 font-bold text-sm uppercase tracking-wider mb-3">
                ✨ What We Offer
              </p>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 text-balance">
                Unforgettable Experiences
              </h2>
            </div>
            <Link
              href="/experiences"
              className="flex items-center gap-2 text-orange-600 font-bold text-sm hover:gap-3 transition-all shrink-0 hover:text-orange-700"
            >
              <span>View all</span>
              <ArrowRight className="size-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(experiences as Experience[]).map((exp, i) => {
              const Icon = EXPERIENCE_ICONS[i % EXPERIENCE_ICONS.length]
              const imgSrc = exp.image_url ?? EXPERIENCE_IMAGES[exp.title] ?? "/images/hero-lake.png"
              return (
                <div
                  key={exp.id}
                  className="group relative rounded-3xl overflow-hidden aspect-[4/3] cursor-pointer"
                >
                  <Image
                    src={imgSrc}
                    alt={exp.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="size-8 rounded-full bg-primary/90 flex items-center justify-center">
                        <Icon className="size-4 text-white" />
                      </div>
                    </div>
                    <h3 className="font-serif font-bold text-2xl text-white mb-1">{exp.title}</h3>
                    <p className="text-white/75 text-sm leading-relaxed line-clamp-2">{exp.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Dining teaser */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
              <Image
                src="/images/dining.png"
                alt="Lakeside dining at Attela Beach Resort"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div>
              <p className="text-orange-600 font-bold text-sm uppercase tracking-wider mb-3">
                🍽️ Fresh from the Lake
              </p>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-6 text-balance">
                Taste the Lakeside Life
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4 font-medium">
                Our menu celebrates Kenya&apos;s rich flavours — fresh Lake Victoria tilapia,
                slow-roasted nyama choma, and vibrant kachumbari — served with your feet in the sand and the lake breeze in the air.
              </p>
              <p className="text-gray-700 leading-relaxed mb-8 font-medium">
                Pair your meal with a lakeside cocktail, cold local beer, or a freshly pressed mango juice.
                Every plate, every sip — made for the moment.
              </p>
              <Button asChild className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full px-8 font-bold shadow-lg hover:shadow-xl transition-all">
                <Link href="/menu">View the Menu</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <p className="text-orange-600 font-bold text-sm uppercase tracking-wider mb-3">
                  🎉 What&apos;s On
                </p>
                <h2 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 text-balance">
                  Upcoming Events
                </h2>
              </div>
              <Link
                href="/events"
                className="flex items-center gap-2 text-orange-600 font-bold text-sm hover:gap-3 transition-all shrink-0 hover:text-orange-700"
              >
                <span>All events</span>
                <ArrowRight className="size-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(events as Event[]).map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all border-0 bg-white">
                  <div className="bg-gradient-to-r from-orange-100 to-red-100 px-6 py-4 flex items-center gap-4 border-b border-orange-200">
                    <div className="size-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shrink-0">
                      <CalendarDays className="size-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-700 font-bold">
                        {new Date(event.event_date).toLocaleDateString("en-KE", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </p>
                      <p className="text-xs text-gray-600 font-medium">
                        {new Date(event.event_date).toLocaleTimeString("en-KE", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-serif font-bold text-lg text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 font-medium">
                      {event.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WhatsApp CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 size-32 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-10 right-10 size-40 rounded-full bg-white blur-3xl"></div>
        </div>
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Sunset className="size-12 mx-auto mb-6 text-yellow-300" />
          <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4 text-balance text-white drop-shadow-lg">
            Ready for a Lake Victoria Escape?
          </h2>
          <p className="text-white/90 text-lg leading-relaxed mb-12 font-medium">
            Book online in minutes or chat with us on WhatsApp. We&apos;re open every day from 8 AM to 11 PM.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full px-10 h-12 text-base font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <Link href="/booking">Book Now</Link>
            </Button>
            <a
              href="https://wa.me/254700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 h-12 rounded-full border-2 border-white text-white hover:bg-white hover:text-teal-600 transition-all text-base font-bold shadow-lg hover:shadow-xl"
            >
              <Phone className="size-5" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
