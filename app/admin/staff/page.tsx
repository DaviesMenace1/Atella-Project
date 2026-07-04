import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Profile } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users } from "lucide-react"

export default async function AdminStaffPage() {
  const supabase = await createClient()

  // Only admins can view this page
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!currentProfile || !["admin", "super_admin"].includes(currentProfile.role)) {
    redirect("/admin")
  }

  const { data: staff } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true })

  const profiles = (staff ?? []) as Profile[]

  const ROLE_COLORS: Record<string, string> = {
    super_admin: "bg-primary/15 text-primary",
    admin: "bg-accent/15 text-accent-foreground",
    staff: "bg-muted text-muted-foreground",
  }

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">Staff</h1>
        <p className="text-muted-foreground mt-1">Team members with portal access</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Users className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-serif text-xl">Team Members</CardTitle>
              <CardDescription>{profiles.length} member{profiles.length !== 1 ? "s" : ""} with portal access</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {profiles.length === 0 ? (
            <div className="px-6 py-12 text-center text-muted-foreground">
              No staff profiles found.
            </div>
          ) : (
            <div className="flex flex-col">
              {profiles.map((profile, idx) => (
                <div
                  key={profile.id}
                  className={`flex items-center gap-4 px-6 py-4 ${idx < profiles.length - 1 ? "border-b border-border" : ""}`}
                >
                  <Avatar className="size-10 shrink-0">
                    <AvatarFallback className="bg-primary/15 text-primary font-bold text-sm">
                      {profile.full_name?.charAt(0)?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">
                      {profile.full_name ?? "Unnamed User"}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Joined {new Date(profile.created_at || Date.now()).toLocaleDateString("en-KE", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge className={`text-xs capitalize border-0 shrink-0 ${ROLE_COLORS[profile.role] ?? "bg-muted text-muted-foreground"}`}>
                    {profile.role.replace("_", " ")}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-muted-foreground text-xs mt-6 max-w-2xl">
        To add or remove staff members, use the Supabase dashboard to manage auth users and update their profile roles directly.
      </p>
    </div>
  )
}
