import { createClient } from "@/lib/supabase/server"
import { BookingCategory, BOOKING_CATEGORY_LABELS } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AvailabilityActions } from "./availability-actions"
import { CalendarX } from "lucide-react"

interface Block {
  id: string
  category: BookingCategory | "all"
  blocked_date: string
  blocked_time_range?: string | null
  reason?: string | null
  created_at: string
}

export default async function AdminAvailabilityPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("availability_blocks")
    .select("*")
    .order("blocked_date", { ascending: true })

  const blocks = (data ?? []) as Block[]
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Availability Blocks</h1>
          <p className="text-muted-foreground mt-1">
            Block specific dates or time ranges so customers cannot book during those periods.
          </p>
        </div>
        <AvailabilityActions mode="create" />
      </div>

      {blocks.length === 0 && (
        <div className="bg-muted rounded-2xl p-12 text-center text-muted-foreground">
          No blocked dates yet. Use the button above to block dates for maintenance, private events, or holidays.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {blocks.map((block) => {
          const isPast = block.blocked_date < today
          return (
            <Card key={block.id} className={isPast ? "opacity-70" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                      <CalendarX className="size-5 text-destructive" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        {new Date(block.blocked_date).toLocaleDateString("en-KE", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">{block.blocked_time_range || "All day"}</p>
                    </div>
                  </div>
                  <AvailabilityActions mode="delete" block={block} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {block.category === "all" ? "All Experiences" : BOOKING_CATEGORY_LABELS[block.category]}
                  </Badge>
                  {isPast && <Badge className="text-xs bg-muted text-muted-foreground">Past</Badge>}
                </div>
                {block.reason && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{block.reason}</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-8 text-xs text-muted-foreground max-w-prose">
        Blocked dates automatically prevent new bookings on the public booking form. Existing bookings are not affected.
      </div>
    </div>
  )
}
