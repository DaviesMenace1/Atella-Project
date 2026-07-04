// lib/types.ts
// Core types for Attela Beach Resort platform
// Aligned with spec Section 8 Database Design + observed usage

export type BookingCategory = "chill_dine" | "party" | "family_day" | "boat_ride"

export const BOOKING_CATEGORY_LABELS: Record<BookingCategory, string> = {
  chill_dine: "Chill & Dine",
  party: "Party / Event",
  family_day: "Family Day",
  boat_ride: "Boat Ride",
}

export const BOOKING_STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
}

export interface Booking {
  id: string
  category: BookingCategory
  date: string
  time: string
  party_size: number
  customer_name: string
  phone: string
  email?: string | null
  notes?: string | null
  status: "pending" | "confirmed" | "completed" | "cancelled"
  created_at: string
  updated_at?: string
}

export interface Experience {
  id: string
  title: string
  description: string
  image_url: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface Event {
  id: string
  title: string
  description: string
  event_date: string
  poster_url?: string | null
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface GalleryItem {
  id: string
  media_url: string
  media_type: "photo" | "video"
  caption?: string | null
  sort_order: number
  created_at: string
}

export interface MenuItem {
  id: string
  category: "Food" | "Drinks" | "Boat Rides"
  name: string
  description?: string | null
  price: number
  currency: string
  is_available: boolean
  sort_order?: number
  created_at: string
}

export interface SiteSetting {
  id: string
  key: string
  value: string
  created_at?: string
  updated_at?: string
}

export interface Profile {
  id: string
  full_name: string | null
  role: "staff" | "admin" | "super_admin"
  email?: string
}

export interface AvailabilityBlock {
  id: string
  category: BookingCategory | "all"
  blocked_date: string
  blocked_time_range?: string | null
  reason?: string | null
  created_at: string
}

// Helper for experience images fallback (can be removed once all have image_url)
export const EXPERIENCE_FALLBACK_IMAGES: Record<string, string> = {
  "Sunset Boat Cruise": "/images/exp-boat.png",
  "DJ Nights & Parties": "/images/exp-dj.png",
  "Floating Bridge Experience": "/images/exp-bridge.png",
  "Family Garden Staycation": "/images/exp-family.png",
}
