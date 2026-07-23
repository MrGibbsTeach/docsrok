import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DOCUMENT_LABELS, PROCESS_TYPES, POLICY_TYPES, type DocumentType } from '@/lib/types'
import GenerateDocButton from '@/components/documents/GenerateDocButton'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'My Documents — Docs Rok',
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!business?.onboarding_completed) {
    redirect('/onboarding')
  }

  const { data: rawDocuments } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_current', true)
    .order('created_at', { ascending: false })

  // Deduplicate — keep only the most recent doc per (type + activity_key)
  const seen = new Set<string>()
  const documents = (rawDocuments ?? []).filter((doc) => {
    const key = `${doc.type}::${doc.activity_key ?? ''}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }).sort((a, b) => a.type.localeCompare(b.type))

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Trial calculations
  const now = Date.now()
  const trialEnd = subscription?.trial_ends_at
    ? new Date(subscription.trial_ends_at).getTime()
    : null
  const trialDaysLeft = trialEnd
    ? Math.max(0, Math.ceil((trialEnd - now) / 86_400_000))
    : null
  const isTrialing = subscription?.status === 'trialing'
  const trialExpired = isTrialing && trialDaysLeft === 0
  const isActive = subscription?.status === 'active'
  const isPastDue = subscription?.status === 'past_due'

  return (
    <div className="space-y-6">

      {/* Payment success banner */}
      {params.success && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded-lg">
          ✓ Payment confirmed — you&apos;re now on the {subscription?.plan} plan.
        </div>
      )}

      {/* Past due banner */}
      {isPastDue && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center justify-between gap-4">
          <p className="text-sm text-red-800 font-medium">
            ⚠ Your last payment failed. Please update your payment method to continue.
          </p>
          <a
            href="/api/stripe/portal"
            className="shrink-0 text-sm font-semibold text-red-700 underline"
          >
            Fix payment →
          </a>
        </div>
      )}

      {/* Trial expired banner */}
      {trialExpired && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center justify-between gap-4">
          <p className="text-sm text-red-800 font-medium">
            Your free trial has ended. Upgrade to keep accessing your documents.
          </p>
          <a
            href="/upgrade"
            className="shrink-0 bg-red-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-red-800 transition-colors"
          >
            Upgrade now
          </a>
        </div>
      )}

      {/* Trial running banner */}
      {isTrialing && !trialExpired && trialDaysLeft !== null && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center justify-between gap-4">
          <p className="text-sm text-amber-800">
            <span className="font-semibold">{trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} left</span> in your free trial.
          </p>
          <a
            href="/upgrade"
            className="shrink-0 text-sm font-semibold text-amber-800 underline hover:text-amber-900"
          >
            Upgrade →
          </a>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{business.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {business.state} · {business.industry_type.replace(/_/g, ' ')}
          </p>
        </div>

        {isActive && (
          <form action="/api/stripe/portal" method="post">
            <button
              type="submit"
              className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
            >
              Manage billing
            </button>
          </form>
        )}
      </div>

      {/* Documents */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Your documents</h2>

        {documents && documents.length > 0 ? (
          <div className="grid gap-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 text-sm">
                    {DOCUMENT_LABELS[doc.type as DocumentType]}
                    {doc.activity_key && (
                      <span className="font-normal text-gray-500"> — {doc.activity_key.replace(/_/g, ' ')}</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-3">
                    <span>Generated {new Date(doc.created_at).toLocaleDateString('en-AU')}</span>
                    <GenerateDocButton
                      activityKey={doc.activity_key ?? undefined}
                      docType={doc.type}
                      label={DOCUMENT_LABELS[doc.type as DocumentType]}
                      variant="regenerate"
                    />
                  </div>
                </div>

                <a
                  href={`/documents/${doc.id}`}
                  className="shrink-0 text-sm bg-orange-600 text-white px-4 py-1.5 rounded-md hover:bg-orange-700 transition-colors font-medium"
                >
                  View &amp; Download
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Generating your documents…
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Your SOPs, subcontractor pack, quote templates, and business policies are being
              generated by AI. This usually takes 30–60 seconds.
            </p>
            <div className="flex items-center justify-center gap-3">
              <a
                href="/dashboard"
                className="inline-block bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Refresh to check
              </a>
              <GenerateDocButton label="your documents" variant="add" />
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Still nothing after refreshing? Click "+ Generate" to retry — the first attempt can
              occasionally fail (for example, if our AI provider is briefly unavailable).
            </p>
          </div>
        )}
      </div>

      {/* SOP library — 8 core business processes */}
      {documents && documents.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-1">SOP library</h2>
          <p className="text-xs text-gray-500 mb-4">
            Generate a Standard Operating Procedure for any core business process.
          </p>
          <div className="grid gap-2">
            {PROCESS_TYPES.map((process) => {
              const existingDoc = documents.find(
                (d) => d.type === 'sop' && d.activity_key === process.key
              )
              return (
                <div
                  key={process.key}
                  className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="text-sm text-gray-800">{process.label}</div>
                    {existingDoc && (
                      <div className="text-xs text-gray-400 mt-0.5">
                        Generated {new Date(existingDoc.created_at).toLocaleDateString('en-AU')}
                      </div>
                    )}
                  </div>
                  {existingDoc ? (
                    <div className="flex items-center gap-3 shrink-0">
                      <GenerateDocButton
                        activityKey={process.key}
                        docType="sop"
                        label={process.label}
                        variant="regenerate"
                      />
                      <a
                        href={`/documents/${existingDoc.id}`}
                        className="text-sm bg-orange-600 text-white px-4 py-1.5 rounded-md hover:bg-orange-700 transition-colors font-medium"
                      >
                        View
                      </a>
                    </div>
                  ) : (
                    <GenerateDocButton
                      activityKey={process.key}
                      docType="sop"
                      label={process.label}
                      variant="add"
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Quote template library — one per service the business offers */}
      {documents && documents.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-1">Quote template library</h2>
          <p className="text-xs text-gray-500 mb-4">
            Generate a reusable quote/proposal template for any service you offer.
          </p>
          <div className="grid gap-2">
            {(business.work_activities as string[]).map((jobKey) => {
              const label = jobKey.replace(/_/g, ' ')
              const existingDoc = documents.find(
                (d) => d.type === 'quote_template' && d.activity_key === jobKey
              )
              return (
                <div
                  key={jobKey}
                  className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="text-sm text-gray-800 capitalize">{label}</div>
                    {existingDoc && (
                      <div className="text-xs text-gray-400 mt-0.5">
                        Generated {new Date(existingDoc.created_at).toLocaleDateString('en-AU')}
                      </div>
                    )}
                  </div>
                  {existingDoc ? (
                    <div className="flex items-center gap-3 shrink-0">
                      <GenerateDocButton
                        activityKey={jobKey}
                        docType="quote_template"
                        label={label}
                        variant="regenerate"
                      />
                      <a
                        href={`/documents/${existingDoc.id}`}
                        className="text-sm bg-orange-600 text-white px-4 py-1.5 rounded-md hover:bg-orange-700 transition-colors font-medium"
                      >
                        View
                      </a>
                    </div>
                  ) : (
                    <GenerateDocButton
                      activityKey={jobKey}
                      docType="quote_template"
                      label={label}
                      variant="add"
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Business policy library — 5 standard policies */}
      {documents && documents.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-1">Business policy library</h2>
          <p className="text-xs text-gray-500 mb-4">
            Generate any standard business policy document.
          </p>
          <div className="grid gap-2">
            {POLICY_TYPES.map((policy) => {
              const existingDoc = documents.find(
                (d) => d.type === 'business_policy' && d.activity_key === policy.key
              )
              return (
                <div
                  key={policy.key}
                  className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="text-sm text-gray-800">{policy.label}</div>
                    {existingDoc && (
                      <div className="text-xs text-gray-400 mt-0.5">
                        Generated {new Date(existingDoc.created_at).toLocaleDateString('en-AU')}
                      </div>
                    )}
                  </div>
                  {existingDoc ? (
                    <div className="flex items-center gap-3 shrink-0">
                      <GenerateDocButton
                        activityKey={policy.key}
                        docType="business_policy"
                        label={policy.label}
                        variant="regenerate"
                      />
                      <a
                        href={`/documents/${existingDoc.id}`}
                        className="text-sm bg-orange-600 text-white px-4 py-1.5 rounded-md hover:bg-orange-700 transition-colors font-medium"
                      >
                        View
                      </a>
                    </div>
                  ) : (
                    <GenerateDocButton
                      activityKey={policy.key}
                      docType="business_policy"
                      label={policy.label}
                      variant="add"
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
