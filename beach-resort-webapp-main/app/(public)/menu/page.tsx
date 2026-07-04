import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { MenuItem } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Menu | Attela Beach Resort",
  description:
    "Fresh Lake Victoria tilapia, nyama choma, lakeside cocktails, and more. View the full menu at Attela Beach Resort, Kisumu.",
}

export default async function MenuPage() {
  const supabase = await createClient()
  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("*")
    .order("sort_order", { ascending: true })

  const items = (menuItems ?? []) as MenuItem[]
  const categories = [...new Set(items.map((i) => i.category))]

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-foreground">
        <div className="absolute inset-0 opacity-30">
          <Image src="/images/dining.png" alt="" fill className="object-cover" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-4">
            Fresh & Local
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-white mb-6 text-balance">
            Our Menu
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
            Lakeside flavours rooted in Kenyan tradition. Fresh fish from the lake, slow-roasted meats, and drinks made for the sun.
          </p>
        </div>
      </section>

      {/* Menu sections */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-16">
          {categories.map((category) => {
            const categoryItems = items.filter((i) => i.category === category && i.is_available)
            if (categoryItems.length === 0) return null
            return (
              <div key={category}>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="font-serif text-3xl font-bold text-foreground">{category}</h2>
                  <Separator className="flex-1" />
                </div>
                <div className="flex flex-col gap-0">
                  {categoryItems.map((item, idx) => (
                    <div key={item.id}>
                      <div className="flex items-start justify-between py-5 gap-6">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-sans font-semibold text-foreground text-base">{item.name}</h3>
                            {!item.is_available && (
                              <Badge variant="secondary" className="text-xs">Unavailable</Badge>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                          )}
                        </div>
                        {item.price != null && (
                          <div className="shrink-0 text-right">
                            <span className="font-bold text-primary text-lg">
                              {item.currency} {Number(item.price).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                      {idx < categoryItems.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Note */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-muted rounded-2xl p-6 text-center">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Menu items and prices are subject to availability and may change seasonally.
              All prices are in Kenyan Shillings (KES) inclusive of taxes.
              For special dietary requirements or group catering, please{" "}
              <a href="/contact" className="text-primary font-medium hover:underline">contact us</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
