import { createClient } from "@/lib/supabase/server"
import { GalleryItem } from "@/lib/types"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GalleryActions } from "./gallery-actions"

export default async function AdminGalleryPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("gallery_items")
    .select("*")
    .order("sort_order", { ascending: true })

  const items = (data ?? []) as GalleryItem[]

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Gallery</h1>
          <p className="text-muted-foreground mt-1">Manage resort photos and videos</p>
        </div>
        <GalleryActions mode="create" />
      </div>

      {items.length === 0 ? (
        <div className="bg-muted rounded-2xl p-12 text-center text-muted-foreground">
          No gallery items yet. Add your first photo or video above.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <div className="relative aspect-square bg-muted">
                <Image
                  src={item.media_url}
                  alt={item.caption ?? "Gallery image"}
                  fill
                  className="object-cover"
                />
                {item.media_type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="size-10 rounded-full bg-black/60 flex items-center justify-center">
                      <span className="text-white text-xs ml-0.5">▶</span>
                    </div>
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    {item.caption && (
                      <p className="text-xs text-foreground truncate">{item.caption}</p>
                    )}
                    <Badge variant="secondary" className="text-xs mt-1 capitalize">{item.media_type}</Badge>
                  </div>
                  <GalleryActions mode="manage" item={item} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
