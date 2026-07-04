"use client"

import { useTransition } from "react"
import { updateBookingStatus } from "./actions"
import { BookingStatus } from "@/lib/types"
import { useRouter } from "next/navigation"
import { Check, X, RotateCcw, CheckCheck } from "lucide-react"

const STATUS_TRANSITIONS: Record<BookingStatus, { label: string; next: BookingStatus; icon: React.ElementType; className: string }[]> = {
  pending: [
    { label: "Confirm", next: "confirmed", icon: Check, className: "text-green-700 hover:bg-green-100" },
    { label: "Cancel", next: "cancelled", icon: X, className: "text-red-700 hover:bg-red-100" },
  ],
  confirmed: [
    { label: "Complete", next: "completed", icon: CheckCheck, className: "text-blue-700 hover:bg-blue-100" },
    { label: "Reschedule", next: "rescheduled", icon: RotateCcw, className: "text-purple-700 hover:bg-purple-100" },
    { label: "Cancel", next: "cancelled", icon: X, className: "text-red-700 hover:bg-red-100" },
  ],
  rescheduled: [
    { label: "Confirm", next: "confirmed", icon: Check, className: "text-green-700 hover:bg-green-100" },
    { label: "Cancel", next: "cancelled", icon: X, className: "text-red-700 hover:bg-red-100" },
  ],
  completed: [],
  cancelled: [
    { label: "Re-open", next: "pending", icon: RotateCcw, className: "text-yellow-700 hover:bg-yellow-100" },
  ],
}

export function BookingActions({
  bookingId,
  currentStatus,
}: {
  bookingId: string
  currentStatus: BookingStatus
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const transitions = STATUS_TRANSITIONS[currentStatus] ?? []

  if (transitions.length === 0) return <span className="text-muted-foreground text-xs">—</span>

  return (
    <div className="flex items-center gap-1">
      {transitions.map(({ label, next, icon: Icon, className }) => (
        <button
          key={next}
          disabled={isPending}
          title={label}
          onClick={() =>
            startTransition(async () => {
              await updateBookingStatus(bookingId, next)
              router.refresh()
            })
          }
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${className}`}
        >
          <Icon className="size-3" />
          {label}
        </button>
      ))}
    </div>
  )
}
