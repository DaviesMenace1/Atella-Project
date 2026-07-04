"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  CalendarDays,
  UtensilsCrossed,
  Image as ImageIcon,
  Music,
  LogOut,
  Settings,
  Users,
  Menu,
  X,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Profile } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/experiences", label: "Experiences", icon: UtensilsCrossed },
  { href: "/admin/availability", label: "Availability", icon: CalendarDays },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/events", label: "Events", icon: Music },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

const ADMIN_NAV_ITEMS = [
  { href: "/admin/staff", label: "Staff", icon: Users },
]

export function AdminSidebar({ profile }: { profile: any }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isAdmin = profile.role === "admin" || profile.role === "super_admin"

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  function isActive(href: string, exact = false) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <div className="relative size-9 rounded-xl overflow-hidden shrink-0">
          <Image src="/images/logo.png" alt="Attela" fill className="object-cover" />
        </div>
        <div>
          <p className="font-serif font-bold text-sm text-sidebar-foreground leading-tight">Attela Resort</p>
          <p className="text-xs text-sidebar-foreground/50">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        <p className="text-xs text-sidebar-foreground/40 font-semibold uppercase tracking-widest px-3 mb-2">
          Main
        </p>
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
              isActive(href, exact)
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
            onClick={() => setMobileOpen(false)}
          >
            <Icon className="size-4 shrink-0" />
            <span>{label}</span>
            {isActive(href, exact) && <ChevronRight className="size-3 ml-auto" />}
          </Link>
        ))}

        {isAdmin && (
          <>
            <p className="text-xs text-sidebar-foreground/40 font-semibold uppercase tracking-widest px-3 mt-4 mb-2">
              Admin
            </p>
            {ADMIN_NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive(href)
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                onClick={() => setMobileOpen(false)}
              >
                <Icon className="size-4 shrink-0" />
                <span>{label}</span>
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
            {profile.full_name?.charAt(0)?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {profile.full_name ?? "Admin User"}
            </p>
            <Badge className="text-xs capitalize bg-sidebar-accent text-sidebar-accent-foreground border-0 px-2 py-0">
              {profile.role.replace("_", " ")}
            </Badge>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors w-full"
        >
          <LogOut className="size-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-sidebar min-h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-50 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          <div className="relative size-8 rounded-xl overflow-hidden">
            <Image src="/images/logo.png" alt="Attela" fill className="object-cover" />
          </div>
          <span className="font-serif font-bold text-sidebar-foreground text-sm">Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="text-sidebar-foreground p-1"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-64 bg-sidebar h-full shadow-xl pt-14">
            {sidebarContent}
          </div>
          <div
            className="flex-1 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        </div>
      )}

      {/* Mobile content spacer */}
      <div className="lg:hidden h-14 w-full absolute" aria-hidden="true" />
    </>
  )
}
