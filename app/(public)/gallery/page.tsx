import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { GalleryItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gallery | Attela Beach Resort",
  description: "Photos and videos from Attela Beach Resort — lakeside life, sunsets, events, and good vibes on Lake Victoria, Kisumu, Kenya.",
}

// Fallback images from our generated assets
const FALLBACK_IMAGES = [
  { url: "/images/hero-lake.png", caption: "Lake Victoria sunset view" },
  { url: "/images/exp-boat.png", caption: "Sunset boat cruise" },
  { url: "/images/exp-dj.png", caption: "Lakeside DJ night" },
  { url: "/images/exp-family.png", caption: "Family day at the resort" },
  { url: "/images/exp-bridge.png", caption: "The floating bridge experience" },
  { url: "/images/dining.png", caption: "Fresh lakeside dining" },
]

export default async function GalleryPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from("gallery_items")
    .select("*")
    .order("sort_order", { ascending: true })

  const galleryItems = (items ?? []) as GalleryItem[]

  // Use fallback images if no gallery items exist yet
  const displayItems =
    galleryItems.length > 0
      ? galleryItems.map((item) => ({ url: item.media_url, caption: item.caption }))
      : FALLBACK_IMAGES

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-foreground">
        <div className="absolute inset-0 opacity-25">
          <Image src="/images/hero-lake.png" alt="" fill className="object-cover" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-4">
            Visual Diary
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-white mb-6 text-balance">
            Life at Attela
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
            Golden sunsets, dancing on the dock, fresh fish off the grill — a glimpse into the Attela experience.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {displayItems.map((item, i) => (
              <div
                key={i}
                className="break-inside-avoid relative overflow-hidden rounded-2xl group cursor-pointer"
              >
                <Image
                  src={item.url}
                  alt={item.caption ?? `Gallery photo ${i + 1}`}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {item.caption && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm">{item.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center bg-muted rounded-3xl p-12">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Follow Us on Instagram</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Stay up to date with the latest photos, events, and lake vibes.
            Tag us in your photos for a chance to be featured.
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-full px-8">
            <Link href="https://www.instagram.com/attelabeachresort" target="_blank" rel="noopener noreferrer">
              @attelabeachresort
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
