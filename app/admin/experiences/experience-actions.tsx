"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Experience } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface ExperienceActionsProps {
  mode: "create" | "manage"
  experience?: Experience
}

export function ExperienceActions({ mode, experience }: ExperienceActionsProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: experience?.title || "",
    description: experience?.description || "",
    image_url: experience?.image_url || "",
    sort_order: experience?.sort_order || 0,
    is_active: experience?.is_active ?? true,
  })

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === "create") {
        const { error } = await supabase.from("experiences").insert({
          title: formData.title,
          description: formData.description,
          image_url: formData.image_url || null,
          sort_order: formData.sort_order,
          is_active: formData.is_active,
        })
        if (error) throw error
      } else if (experience) {
        const { error } = await supabase
          .from("experiences")
          .update({
            title: formData.title,
            description: formData.description,
            image_url: formData.image_url || null,
            sort_order: formData.sort_order,
            is_active: formData.is_active,
          })
          .eq("id", experience.id)
        if (error) throw error
      }

      setOpen(false)
      router.refresh()
    } catch (err) {
      console.error("Error saving experience:", err)
      alert("Failed to save experience. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!experience || !confirm("Delete this experience card? This cannot be undone.")) return

    setLoading(true)
    try {
      const { error } = await supabase.from("experiences").delete().eq("id", experience.id)
      if (error) throw error
      router.refresh()
    } catch (err) {
      console.error("Delete error:", err)
      alert("Failed to delete.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {mode === "create" ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full gap-2">
              <Plus className="size-4" /> Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle className="font-serif">Create New Experience</DialogTitle>
              <DialogDescription>
                Add a signature experience shown on the homepage and Experiences page.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5 pt-2">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Sunset Boat Cruise"
                  required
                  className="rounded-xl mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Cruise on Lake Victoria at sunset with drinks and light bites..."
                  rows={3}
                  className="rounded-xl mt-1.5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="image_url">Image URL (Supabase Storage or external)</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="/images/exp-boat.png or https://..."
                  className="rounded-xl mt-1.5"
                />
                <p className="text-xs text-muted-foreground mt-1">Upload images via Gallery or paste URL</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    className="rounded-xl mt-1.5"
                  />
                </div>
                <div className="flex items-end gap-3 pb-1">
                  <Label htmlFor="is_active" className="mb-0">Active</Label>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-full">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="rounded-full min-w-[120px]">
                  {loading ? <Loader2 className="size-4 animate-spin" /> : "Create Experience"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      ) : (
        <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full gap-1.5 h-8 px-3">
                <Pencil className="size-3.5" /> Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px]">
              <DialogHeader>
                <DialogTitle className="font-serif">Edit Experience</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                {/* Same form fields as create */}
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="rounded-xl mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="rounded-xl mt-1.5"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="rounded-xl mt-1.5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sort_order">Sort Order</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                      className="rounded-xl mt-1.5"
                    />
                  </div>
                  <div className="flex items-end gap-3 pb-1">
                    <Label htmlFor="is_active" className="mb-0">Active</Label>
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={loading}
                    className="rounded-full gap-2"
                  >
                    <Trash2 className="size-4" /> Delete
                  </Button>
                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-full">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="rounded-full min-w-[100px]">
                      {loading ? <Loader2 className="size-4 animate-spin" /> : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive rounded-full h-8 px-3"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </>
      )}
    </div>
  )
}
