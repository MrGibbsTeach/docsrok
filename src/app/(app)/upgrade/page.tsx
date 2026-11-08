import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PROCESS_TYPES, POLICY_TYPES } from '@/lib/types'
import UpgradeClient from './UpgradeClient'

export const dynamic = 'force-dynamic'

// Server wrapper: works out which documents this user's business is still
// missing so the paywall can name them instead of listing generic features.
export default async function UpgradePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: business } = await supabase
    .from('businesses')
    .select('name, work_activities')
    .eq('user_id', user.id)
    .single()

  const { data: docs } = await supabase
    .from('documents')
    .select('type, activity_key')
    .eq('user_id', user.id)
    .eq('is_current', true)

  const have = new Set((docs ?? []).map((d) => `${d.type}::${d.activity_key ?? ''}`))
  const missing = (type: string, key: string) => !have.has(`${type}::${key}`)
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  const activities = ((business?.work_activities as string[] | null) ?? [])

  const groups = [
    {
      group: 'Process SOPs',
      items: PROCESS_TYPES.filter((p) => missing('sop', p.key)).map((p) => p.label),
    },
    {
      group: 'Quote templates',
      items: activities
        .filter((a) => missing('quote_template', a))
        .map((a) => cap(a.replace(/_/g, ' ') + ' quote template')),
    },
    {
      group: 'Business policies',
      items: POLICY_TYPES.filter((p) => missing('business_policy', p.key)).map((p) => p.label),
    },
    {
      group: 'Subcontractor pack',
      items: (docs ?? []).some((d) => d.type === 'subcontractor_pack')
        ? []
        : ['Subcontractor & new-hire welcome pack'],
    },
  ].filter((g) => g.items.length > 0)

  return (
    <UpgradeClient
      businessName={business?.name ?? null}
      locked={groups}
      generatedCount={(docs ?? []).length}
    />
  )
}
