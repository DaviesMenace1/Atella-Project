"use client"

import { useState, useEffect, useTransition } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { createBooking } from "./actions"
import { BookingCategory, BOOKING_CATEGORY_LABELS } from "@/lib/types"

interface BlockedDate {
  date: string
  category: string
  timeRange?: string | null
  reason?: string | null
}
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Ship, Music, Users, UtensilsCrossed, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const CATEGORIES: { key: BookingCategory; icon: React.ElementType; description: string }[] = [
  { key: "chill_dine", icon: UtensilsCrossed, description: "Table for dining & relaxing by the lake" },
  { key: "party", icon: Music, description: "Host a party or event with DJ & full bar" },
  { key: "family_day", icon: Users, description: "Full-day family package with activities" },
  { key: "boat_ride", icon: Ship, description: "Cruise on Lake Victoria" },
]

const TIME_SLOTS = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM",
  "08:00 PM", "09:00 PM", "10:00 PM",
]

function todayString() {
  return new Date().toISOString().split("T")[0]
}

export function BookingForm({ blockedDates = [] }: { blockedDates?: BlockedDate[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [category, setCategory] = useState<BookingCategory>(
    (searchParams.get("category") as BookingCategory) ?? "chill_dine"
  )

  useEffect(() => {
    const cat = searchParams.get("category") as BookingCategory
    if (cat && Object.keys(BOOKING_CATEGORY_LABELS).includes(cat)) {
      setCategory(cat)
    }
  }, [searchParams])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const data = new FormData(form)
    data.set("category", category)

    startTransition(async () => {
      const result = await createBooking(data)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        form.reset()
      }
    })
  }

  if (success) {
    return (
      <Card className="text-center py-12">
        <CardContent className="flex flex-col items-center gap-6">
          <div className="size-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="size-10 text-green-600" />
          </div>
          <div>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-2">Booking Received!</h2>
            <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
              Thank you! Our team will confirm your reservation within a few hours via phone or WhatsApp.
              We can&apos;t wait to see you at the lake.
            </p>
          </div>

          <a
            href="https://wa.me/254799096255?text=Hi%20Attela%20Beach%20Resort%2C%20I%20just%20submitted%20a%20booking%20request%20and%20would%20like%20to%20follow%20up."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-sm font-semibold transition-colors"
          >
            Message us on WhatsApp
          </a>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-8"
              onClick={() => setSuccess(false)}
            >
              Make Another Booking
            </Button>
            <Button
              variant="outline"
              className="rounded-full px-8"
              onClick={() => router.push("/")}
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="font-serif text-2xl">Reserve Your Spot</CardTitle>
        <CardDescription>
          Fill in your details and we&apos;ll confirm within a few hours.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Category selector */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">
              Select Experience <span className="text-destructive">*</span>
            </p>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map(({ key, icon: Icon, description }) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => setCategory(key)}
                  className={cn(
                    "flex flex-col gap-2 p-4 rounded-2xl border-2 text-left transition-all",
                    category === key
                      ? "border-primary bg-primary/8"
                      : "border-border hover:border-primary/40 hover:bg-muted"
                  )}
                >
                  <div className={cn(
                    "size-9 rounded-xl flex items-center justify-center",
                    category === key ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                  )}>
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <p className={cn("font-semibold text-sm", category === key ? "text-primary" : "text-foreground")}>
                      {BOOKING_CATEGORY_LABELS[key]}
                    </p>
                    <p className="text-xs text-muted-foreground leading-snug">{description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="date" className="text-sm font-semibold text-foreground">
                Date <span className="text-destructive">*</span>
              </label>
              <Input
                id="date"
                name="date"
                type="date"
                required
                min={todayString()}
                className="rounded-xl"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="time" className="text-sm font-semibold text-foreground">
                Time <span className="text-destructive">*</span>
              </label>
              <select
                id="time"
                name="time"
                required
                className="flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select time</option>
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Party size */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="party_size" className="text-sm font-semibold text-foreground">
              Number of Guests <span className="text-destructive">*</span>
            </label>
            <Input
              id="party_size"
              name="party_size"
              type="number"
              min="1"
              max="500"
              required
              placeholder="How many people?"
              className="rounded-xl"
            />
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="customer_name" className="text-sm font-semibold text-foreground">
              Your Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="customer_name"
              name="customer_name"
              required
              placeholder="Full name"
              className="rounded-xl"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className="text-sm font-semibold text-foreground">
              Phone / WhatsApp <span className="text-destructive">*</span>
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="+254 700 000 000"
              className="rounded-xl"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-foreground">
              Email <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="rounded-xl"
            />
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="notes" className="text-sm font-semibold text-foreground">
              Special Requests <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Dietary requirements, special occasions, preferred seating…"
              rows={3}
              className="rounded-xl resize-none"
            />
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl p-4">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-full h-12 text-base font-semibold"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Submitting…
              </>
            ) : (
              "Confirm Booking Request"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            We&apos;ll confirm via phone or WhatsApp within a few hours. No payment required upfront.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
