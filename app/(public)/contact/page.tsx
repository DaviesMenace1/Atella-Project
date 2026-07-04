import Image from "next/image"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Contact | Attela Beach Resort",
  description: "Get in touch with Attela Beach Resort. Call, WhatsApp, email or visit us on the shores of Lake Victoria, Kisumu, Kenya.",
}

async function getContactData() {
  const supabase = await createClient()
  const { data: settings } = await supabase.from("site_settings").select("*")

  const map: Record<string, string> = {}
  ;(settings ?? []).forEach((s: any) => {
    map[s.key] = s.value
  })

  return {
    phonePrimary: map.phone_primary || "+254 799 096255",
    phoneSecondary: map.phone_secondary || "+254 714 049037",
    whatsapp: map.whatsapp_number || "+254799096255",
    email: map.email || "info@attelabeachresort.com",
    address: map.address || "Attela Beach Resort, Lake Victoria, Kisumu, Kenya (opposite Milimani Beach Resort, towards Dunga)",
    openingHours: map.opening_hours || "Monday – Sunday\n8:00 AM – 11:00 PM",
    instagram: map.instagram_url || "https://www.instagram.com/attela_beach_resort",
    facebook: map.facebook_url || "https://www.facebook.com/AttelaBeachResort",
  }
}

export default async function ContactPage() {
  const contact = await getContactData()

  const CONTACT_INFO = [
    {
      icon: Phone,
      label: "Phone / WhatsApp",
      lines: [contact.phonePrimary, contact.phoneSecondary],
      href: `tel:${contact.phonePrimary.replace(/\s/g, "")}`,
    },
    {
      icon: Phone,
      label: "WhatsApp",
      lines: ["Chat with us instantly"],
      href: `https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}`,
    },
    {
      icon: Mail,
      label: "Email",
      lines: [contact.email],
      href: `mailto:${contact.email}`,
    },
    {
      icon: MapPin,
      label: "Location",
      lines: contact.address.split(", "),
      href: `https://maps.google.com/?q=${encodeURIComponent(contact.address)}`,
    },
    {
      icon: Clock,
      label: "Opening Hours",
      lines: contact.openingHours.split("\n"),
      href: null,
    },
  ]
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-foreground">
        <div className="absolute inset-0 opacity-25">
          <Image src="/images/hero-lake.png" alt="" fill className="object-cover" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-4">
            Get in Touch
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-white mb-6 text-balance">
            Find Us on the Lake
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
            We&apos;re here every day from 8 AM to 11 PM. Call, WhatsApp, or just come down to the water.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {CONTACT_INFO.map((info) => {
              const Icon = info.icon
              const inner = (
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="size-12 rounded-2xl bg-primary/15 flex items-center justify-center">
                    <Icon className="size-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-2">
                      {info.label}
                    </p>
                    {info.lines.map((line) => (
                      <p key={line} className="text-foreground font-medium text-sm leading-relaxed">{line}</p>
                    ))}
                  </div>
                </CardContent>
              )
              return info.href ? (
                <a key={info.label} href={info.href} target={info.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                  <Card className="h-full hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">{inner}</Card>
                </a>
              ) : (
                <Card key={info.label} className="h-full">{inner}</Card>
              )
            })}
          </div>

          <Separator className="mb-16" />

          {/* Map embed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">How to Find Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Attela Beach Resort is located on the shores of Lake Victoria in Kisumu, Kenya.
                We&apos;re easily accessible from the Kisumu city centre and Kisumu International Airport.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Look for our signage along the Kisumu lakefront road. Ample parking is available on-site.
                Tuk-tuks and boda-bodas from town know us well — just ask for Attela!
              </p>
              <a
                href="https://maps.google.com/?q=-0.0917,34.7680"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
              >
                <MapPin className="size-4" />
                Open in Google Maps
              </a>
            </div>

            {/* Placeholder map with link */}
            <a
              href="https://maps.google.com/?q=-0.0917,34.7680"
              target="_blank"
              rel="noopener noreferrer"
              className="block relative aspect-square rounded-3xl overflow-hidden bg-muted border border-border hover:opacity-90 transition-opacity"
            >
              <Image
                src="/images/hero-lake.png"
                alt="Map to Attela Beach Resort, Lake Victoria Kisumu"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-accent/60 flex flex-col items-center justify-center gap-3">
                <div className="size-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <MapPin className="size-7 text-white" />
                </div>
                <p className="text-white font-serif font-bold text-xl text-center px-4">
                  Attela Beach Resort
                </p>
                <p className="text-white/80 text-sm">Lake Victoria, Kisumu</p>
                <span className="mt-2 px-5 py-2 rounded-full bg-white text-accent text-sm font-semibold">
                  Open in Google Maps
                </span>
              </div>
            </a>
          </div>

          <Separator className="my-16" />

          {/* Social */}
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Follow the Vibes</h2>
            <p className="text-muted-foreground mb-8">
              See what&apos;s happening at the resort. Tag us in your photos — we&apos;d love to feature you!
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://www.instagram.com/attelabeachresort"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-foreground text-white hover:bg-primary transition-colors font-medium text-sm"
              >
                <svg className="size-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                Instagram
              </a>
              <a
                href="https://www.facebook.com/attelabeachresort"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-foreground text-white hover:bg-primary transition-colors font-medium text-sm"
              >
                <svg className="size-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
