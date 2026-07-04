"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BookingCategory, BOOKING_CATEGORY_LABELS } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface AvailabilityBlock {
  id: string
  category: BookingCategory | "all"
  blocked_date: string
  blocked_time_range?: string | null
  reason?: string | null
}

interface Props {
  mode: "create" | "delete"
  block?: AvailabilityBlock
}

export function AvailabilityActions({ mode, block }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    category: (block?.category || "all") as BookingCategory | "all",
    blocked_date: block?.blocked_date || "",
    blocked_time_range: block?.blocked_time_range || "",
    reason: block?.reason || "",
  })

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.blocked_date) return alert("Please select a date to block")

    setLoading(true)
    try {
      const { error } = await supabase.from("availability_blocks").insert({
        category: formData.category,
        blocked_date: formData.blocked_date,
        blocked_time_range: formData.blocked_time_range || null,
        reason: formData.reason || null,
      })
      if (error) throw error

      setOpen(false)
      router.refresh()
    } catch (err) {
      console.error(err)
      alert("Failed to create block. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!block) return
    if (!confirm("Remove this availability block?")) return

    setLoading(true)
    try {
      const { error } = await supabase.from("availability_blocks").delete().eq("id", block.id)
      if (error) throw error
      router.refresh()
    } catch (err) {
      alert("Failed to delete block.")
    } finally {
      setLoading(false)
    }
  }

  if (mode === "delete" && block) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={loading}
        className="text-destructive hover:text-destructive rounded-full h-8 px-3"
      >
        {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full gap-2">
          <Plus className="size-4" /> Block Dates / Times
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">Block Availability</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div>
            <Label>Category</Label>
            <Select
              value={formData.category}
              onValueChange={(val) => setFormData({ ...formData, category: val as any })}
            >
              <SelectTrigger className="rounded-xl mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Experiences</SelectItem>
                {Object.entries(BOOKING_CATEGORY_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Date to Block</Label>
            <Input
              type="date"
              value={formData.blocked_date}
              onChange={(e) => setFormData({ ...formData, blocked_date: e.target.value })}
              className="rounded-xl mt-1.5"
              required
            />
          </div>

          <div>
            <Label>Time Range (optional)</Label>
            <Input
              placeholder="e.g. 18:00-22:00 or All Day"
              value={formData.blocked_time_range}
              onChange={(e) => setFormData({ ...formData, blocked_time_range: e.target.value })}
              className="rounded-xl mt-1.5"
            />
          </div>

          <div>
            <Label>Reason (optional)</Label>
            <Textarea
              placeholder="Private event, maintenance, holiday..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="rounded-xl mt-1.5"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-full">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="rounded-full min-w-[140px]">
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Block Dates"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
