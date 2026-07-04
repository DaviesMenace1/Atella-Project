"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Event } from "@/lib/types"
import { createEvent, deleteEvent, toggleEventActive } from "./actions"
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

export function EventActions({
  mode,
  event,
}: {
  mode: "create" | "manage"
  event?: Event
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
      const result = await createEvent(data)
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
            <Plus className="size-4 mr-1" /> New Event
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Create Event</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold">Title *</label>
              <Input name="title" required placeholder="Event title" className="rounded-xl" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold">Description</label>
              <Textarea name="description" placeholder="What's happening?" rows={3} className="rounded-xl resize-none" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold">Date & Time *</label>
              <Input name="event_date" type="datetime-local" required className="rounded-xl" />
            </div>
            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
            <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-white rounded-full">
              {isPending ? <Loader2 className="size-4 animate-spin" /> : "Create Event"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  if (!event) return null

  return (
    <div className="flex items-center gap-2">
      <button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await toggleEventActive(event.id, !event.is_active)
            router.refresh()
          })
        }
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
        title={event.is_active ? "Hide event" : "Show event"}
      >
        {event.is_active ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
        {event.is_active ? "Hide" : "Show"}
      </button>
      <button
        disabled={isPending}
        onClick={() => {
          if (confirm("Delete this event?")) {
            startTransition(async () => {
              await deleteEvent(event.id)
              router.refresh()
            })
          }
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-destructive hover:bg-red-50 transition-colors disabled:opacity-50"
        title="Delete event"
      >
        <Trash2 className="size-3.5" />
        Delete
      </button>
    </div>
  )
}
