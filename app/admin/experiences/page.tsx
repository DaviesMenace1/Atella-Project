import { createClient } from "@/lib/supabase/server"
import { Experience } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExperienceActions } from "./experience-actions"
import { ImageIcon } from "lucide-react"

export default async function AdminExperiencesPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("experiences")
    .select("*")
    .order("sort_order", { ascending: true })

  const experiences = (data ?? []) as Experience[]

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Experiences</h1>
          <p className="text-muted-foreground mt-1">
            Manage signature experience cards shown on the homepage and Experiences page
          </p>
        </div>
        <ExperienceActions mode="create" />
      </div>

      {experiences.length === 0 && (
        <div className="bg-muted rounded-2xl p-12 text-center text-muted-foreground">
          No experiences yet. Click "Add Experience" to create your first signature offering.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {experiences.map((exp) => (
          <Card key={exp.id} className="overflow-hidden">
            <div className="relative h-48 bg-muted">
              {exp.image_url ? (
                <img
                  src={exp.image_url}
                  alt={exp.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="size-12 text-muted-foreground/40" />
                </div>
              )}
              <div className="absolute top-3 right-3">
                <Badge className={exp.is_active ? "bg-green-600 text-white" : "bg-muted text-muted-foreground"}>
                  {exp.is_active ? "Active" : "Hidden"}
                </Badge>
              </div>
            </div>

            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-serif font-bold text-xl text-foreground leading-tight">{exp.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Sort order: {exp.sort_order}</p>
                </div>
                <ExperienceActions mode="manage" experience={exp} />
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                {exp.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-xs text-muted-foreground">
        Tip: Lower sort order appears first. Use the edit dialog to upload/replace images via Supabase Storage URLs.
      </div>
    </div>
  )
}
