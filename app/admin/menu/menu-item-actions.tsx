"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { MenuItem } from "@/lib/types"
import { createMenuItem, deleteMenuItem, toggleMenuItemAvailable } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Trash2, Eye, EyeOff, Loader2 } from "lucide-react"

export function MenuItemActions({
  mode,
  item,
}: {
  mode: "create" | "manage"
  item?: MenuItem
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const data = new FormData(form)
    startTransition(async () => {
      const result = await createMenuItem(data)
      if (result?.error) {
        setError(result.error)
      } else {
        setOpen(false)
        form.reset()
        router.refresh()
      }
    })
  }

  if (mode === "create") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-full">
            <Plus className="size-4 mr-1" /> Add Item
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Add Menu Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold">Category *</label>
              <Input name="category" required placeholder="e.g. Mains, Drinks, Starters" className="rounded-xl" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold">Name *</label>
              <Input name="name" required placeholder="Item name" className="rounded-xl" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold">Description</label>
              <Textarea name="description" placeholder="Short description" rows={2} className="rounded-xl resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">Price</label>
                <Input name="price" type="number" min="0" step="0.01" placeholder="0.00" className="rounded-xl" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">Currency</label>
                <Input name="currency" defaultValue="KES" className="rounded-xl" />
              </div>
            </div>
            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
            <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-white rounded-full">
              {isPending ? <Loader2 className="size-4 animate-spin" /> : "Add Item"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  if (!item) return null

  return (
    <div className="flex items-center gap-1">
      <button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await toggleMenuItemAvailable(item.id, !item.is_available)
            router.refresh()
          })
        }
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
        title={item.is_available ? "Mark unavailable" : "Mark available"}
      >
        {item.is_available ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
        {item.is_available ? "Hide" : "Show"}
      </button>
      <button
        disabled={isPending}
        onClick={() => {
          if (confirm("Delete this menu item?")) {
            startTransition(async () => {
              await deleteMenuItem(item.id)
              router.refresh()
            })
          }
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-destructive hover:bg-red-50 transition-colors disabled:opacity-50"
        title="Delete item"
      >
        <Trash2 className="size-3.5" />
        Delete
      </button>
    </div>
  )
}
