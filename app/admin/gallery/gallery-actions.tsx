"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { GalleryItem } from "@/lib/types"
import { createGalleryItem, deleteGalleryItem } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Trash2, Loader2 } from "lucide-react"

export function GalleryActions({
  mode,
  item,
}: {
  mode: "create" | "manage"
  item?: GalleryItem
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
      const result = await createGalleryItem(data)
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
            <Plus className="size-4 mr-1" /> Add Photo
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Add Gallery Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold">Media URL *</label>
              <Input
                name="media_url"
                required
                placeholder="https://example.com/photo.jpg"
                className="rounded-xl"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold">Type *</label>
              <select
                name="media_type"
                required
                defaultValue="image"
                className="flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold">Caption</label>
              <Input name="caption" placeholder="Optional caption" className="rounded-xl" />
            </div>
            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
            <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-white rounded-full">
              {isPending ? <Loader2 className="size-4 animate-spin" /> : "Add to Gallery"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  if (!item) return null

  return (
    <button
      disabled={isPending}
      onClick={() => {
        if (confirm("Remove this item from the gallery?")) {
          startTransition(async () => {
            await deleteGalleryItem(item.id)
            router.refresh()
          })
        }
      }}
      className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-destructive hover:bg-red-50 transition-colors disabled:opacity-50 shrink-0"
      title="Delete"
    >
      <Trash2 className="size-3.5" />
    </button>
  )
}
