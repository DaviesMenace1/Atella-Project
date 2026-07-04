import { createClient } from "@/lib/supabase/server"
import { MenuItem } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MenuItemActions } from "./menu-item-actions"

export default async function AdminMenuPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("menu_items")
    .select("*")
    .order("sort_order", { ascending: true })

  const items = (data ?? []) as MenuItem[]
  const categories = [...new Set(items.map((i) => i.category))]

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Menu</h1>
          <p className="text-muted-foreground mt-1">Manage restaurant menu items</p>
        </div>
        <MenuItemActions mode="create" />
      </div>

      {categories.length === 0 && (
        <div className="bg-muted rounded-2xl p-12 text-center text-muted-foreground">
          No menu items yet. Add your first item above.
        </div>
      )}

      <div className="flex flex-col gap-8 max-w-3xl">
        {categories.map((category) => {
          const categoryItems = items.filter((i) => i.category === category)
          return (
            <Card key={category}>
              <CardHeader className="pb-2">
                <CardTitle className="font-serif text-xl">{category}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col">
                  {categoryItems.map((item, idx) => (
                    <div key={item.id}>
                      <div className="flex items-start justify-between px-6 py-4 gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <span className="font-semibold text-foreground text-sm">{item.name}</span>
                            {!item.is_available && (
                              <Badge variant="secondary" className="text-xs">Unavailable</Badge>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-muted-foreground text-xs leading-relaxed">{item.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          {item.price != null && (
                            <span className="font-bold text-primary text-sm">
                              {item.currency} {Number(item.price).toLocaleString()}
                            </span>
                          )}
                          <MenuItemActions mode="manage" item={item} />
                        </div>
                      </div>
                      {idx < categoryItems.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
