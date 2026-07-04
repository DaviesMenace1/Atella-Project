import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "./admin-sidebar"
import { headers } from "next/headers"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get current path
  const headersList = await headers()
  const referer = headersList.get("referer") || ""
  const pathname = headersList.get("x-invoke-path") || ""

  // If we're on the login page, don't redirect
  const isLoginPage = pathname.includes("/admin/login") || referer.includes("/admin/login")

  if (isLoginPage) {
    return <>{children}</>
  }

  // No logged in user → redirect to login
  if (!user) {
    redirect("/admin/login")
  }

  // Check if user has valid role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || !["staff", "admin", "super_admin"].includes(profile.role)) {
    redirect("/admin/login")
  }

  return (
    <div className="flex min-h-screen bg-muted">
      <AdminSidebar profile={profile} />
      <main className="flex-1 min-w-0 overflow-auto p-6">
        {children}
      </main>
    </div>
  )
}
