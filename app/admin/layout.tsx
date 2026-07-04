import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "./admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .single()

  const profile = profileData as any

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