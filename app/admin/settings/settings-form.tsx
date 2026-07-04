"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { updateSettings } from "./actions"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2 } from "lucide-react"

interface Field {
  key: string
  label: string
  value: string
  multiline?: boolean
}

export function SettingsForm({ fields }: { fields: Field[] }) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.key, f.value]))
  )
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaved(false)
    startTransition(async () => {
      const result = await updateSettings(values)
      if (result?.error) {
        setError(result.error)
      } else {
        setSaved(true)
        router.refresh()
        setTimeout(() => setSaved(false), 3000)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {fields.map((field) => (
        <div key={field.key} className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-foreground">{field.label}</label>
          {field.multiline ? (
            <Textarea
              value={values[field.key]}
              onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
              rows={3}
              className="rounded-xl resize-none"
            />
          ) : (
            <Input
              value={values[field.key]}
              onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
              className="rounded-xl"
            />
          )}
        </div>
      ))}

      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
          {isPending ? <Loader2 className="size-4 animate-spin" /> : "Save Changes"}
        </Button>
        {saved && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle2 className="size-4" />
            Saved!
          </div>
        )}
      </div>
    </form>
  )
}
