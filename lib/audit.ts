import { createClient } from "@/lib/supabase/server"

export async function logAudit(params: {
  userId: string
  action: string
  entity: string
  entityId?: string
  details?: Record<string, any>
}) {
  const supabase = await createClient()

  await supabase.from("audit_log").insert({
    user_id: params.userId,
    action: params.action,
    entity: params.entity,
    entity_id: params.entityId || null,
    details: params.details || null,
    timestamp: new Date().toISOString(),
  })
}
