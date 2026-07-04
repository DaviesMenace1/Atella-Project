import { createClient } from "@/lib/supabase/server"
import { SiteSetting } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SettingsForm } from "./settings-form"

const SETTING_GROUPS = [
  {
    title: "Contact Information",
    description: "Phone numbers, email and address displayed on the website.",
    keys: ["phone_primary", "phone_secondary", "whatsapp_number", "email", "address"],
  },
  {
    title: "Social Media",
    description: "Links to the resort social media pages.",
    keys: ["instagram_url", "facebook_url"],
  },
  {
    title: "Opening Hours",
    description: "Opening hours shown on the website.",
    keys: ["opening_hours"],
  },
  {
    title: "Hero Content",
    description: "Tagline and subtitle shown on the homepage hero.",
    keys: ["hero_tagline", "hero_subtitle"],
  },
]

const SETTING_LABELS: Record<string, string> = {
  phone_primary: "Primary Phone",
  phone_secondary: "Secondary Phone",
  whatsapp_number: "WhatsApp Number",
  email: "Email Address",
  address: "Physical Address",
  instagram_url: "Instagram URL",
  facebook_url: "Facebook URL",
  opening_hours: "Opening Hours",
  hero_tagline: "Hero Tagline",
  hero_subtitle: "Hero Subtitle",
}

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from("site_settings").select("*")
  const settings = (data ?? []) as SiteSetting[]
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value ?? ""]))

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage resort website content and contact info</p>
      </div>

      <div className="max-w-2xl flex flex-col gap-6">
        {SETTING_GROUPS.map((group) => (
          <Card key={group.title}>
            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-xl">{group.title}</CardTitle>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm
                fields={group.keys.map((key) => ({
                  key,
                  label: SETTING_LABELS[key] ?? key,
                  value: settingsMap[key] ?? "",
                  multiline: key === "address" || key === "hero_subtitle" || key === "opening_hours",
                }))}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
