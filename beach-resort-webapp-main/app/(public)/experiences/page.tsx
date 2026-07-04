import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Experience } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowRight, Ship, Music, Waves, Users } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Experiences | Attela Beach Resort",
  description:
    "Sunset boat cruises, DJ party nights, family days, and the floating bridge experience. Discover everything Attela Beach Resort on Lake Victoria has to offer.",
}

const EXPERIENCE_IMAGES: Record<string, string> = {
  "Sunset Boat Cruise": "/images/exp-boat.png",
  "DJ Nights & Parties": "/images/exp-dj.png",
  "Floating Bridge Experience": "/images/exp-bridge.png",
  "Family Garden Staycation": "/images/exp-family.png",
}

const EXPERIENCE_ICONS = [Ship, Music, Waves, Users]

const EXPERIENCE_DETAILS = [
  {
    highlights: ["Private & group options", "Drinks included", "Golden hour timing"],
    cta_category: "boat_ride",
  },
  {
    highlights: ["Resident & guest DJs", "Full bar", "Every weekend"],
    cta_category: "party",
  },
  {
    highlights: ["Unique lakeside walk", "Photo-worthy views", "Guided tours available"],
    cta_category: "chill_dine",
  },
  {
    highlights: ["All-day package", "Kids menu", "Swimming & games"],
    cta_category: "family_day",
  },
]

export default async function ExperiencesPage() {
  const supabase = await createClient()
  const { data: experiences } = await supabase
    .from("experiences")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  const items = (experiences ?? []) as Experience[]

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-foreground">
        <div className="absolute inset-0 opacity-25">
          <Image src="/images/hero-lake.png" alt="" fill className="object-cover" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-4">
            Attela Beach Resort
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-white mb-6 text-balance">
            Our Experiences
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
            From tranquil sunset cruises to electric lakeside DJ nights — every visit to Attela is a story worth telling.
          </p>
        </div>
      </section>

      {/* Experiences list */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-20">
          {items.map((exp, i) => {
            const Icon = EXPERIENCE_ICONS[i % EXPERIENCE_ICONS.length]
            const imgSrc = exp.image_url ?? EXPERIENCE_IMAGES[exp.title] ?? "/images/hero-lake.png"
            const detail = EXPERIENCE_DETAILS[i] ?? EXPERIENCE_DETAILS[0]
            const isReverse = i % 2 !== 0

            return (
              <div
                key={exp.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${isReverse ? "lg:flex-row-reverse" : ""}`}
              >
                <div className={`relative aspect-[4/3] rounded-3xl overflow-hidden ${isReverse ? "lg:order-2" : ""}`}>
                  <Image
                    src={imgSrc}
                    alt={exp.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className={isReverse ? "lg:order-1" : ""}>
                  <div className="size-14 rounded-2xl bg-primary/15 flex items-center justify-center mb-6">
                    <Icon className="size-7 text-primary" />
                  </div>
                  <h2 className="font-serif text-4xl font-bold text-foreground mb-4">{exp.title}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">{exp.description}</p>

                  {detail.highlights && (
                    <ul className="flex flex-col gap-2 mb-8">
                      {detail.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-3 text-foreground text-sm">
                          <span className="size-2 rounded-full bg-primary shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}

                  <Button
                    asChild
                    className="bg-primary hover:bg-primary/90 text-white rounded-full px-8"
                  >
                    <Link href={`/booking?category=${detail.cta_category}`}>
                      Book This Experience <ArrowRight className="size-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
