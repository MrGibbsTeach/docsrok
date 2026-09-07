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

  // PIVOT (7 Sept 2026): permanent free tier (2 documents), not a timed trial.
  // status='active' means the $149 one-time bundle has been purchased.
  const now = Date.now()
  const isActive = subscription?.status === 'active'
  const isPaid = isActive
  const isPastDue = subscription?.status === 'past_due'

  const totalPossibleDocs =
    PROCESS_TYPES.length + 1 /* subcontractor pack */ +
    (business.work_activities as string[]).length +
    POLICY_TYPES.length
  const moreToUnlock = isPaid && documents.length > 0 && documents.length < totalPossibleDocs

  // Document generation is fired and forgotten immediately after onboarding.
  // If it failed (Anthropic outage, exhausted credits, rate limit, function
  // timeout) nothing is recorded anywhere, and the dashboard used to sit on
  // "Generating your documents..." indefinitely. Treat a business that has
  // existed for a few minutes with zero documents as a failure, not progress.
  const businessCreatedAt = business.created_at
    ? new Date(business.created_at).getTime()
    : null
  const minutesSinceOnboarding =
    businessCreatedAt !== null ? (now - businessCreatedAt) / 60_000 : 0
  const generationFailed = documents.length === 0 && minutesSinceOnboarding > 3

  return (
    <div className="space-y-6">

      {/* Payment success banner */}
      {params.success && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded-lg">
          ✓ Payment confirmed — your full document set is unlocked.
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

      {/* Free plan banner — permanent, not a countdown */}
      {!isPaid && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center justify-between gap-4">
          <p className="text-sm text-amber-800">
            You&apos;re on the <span className="font-semibold">Free plan</span> — 2 documents included.
          </p>
          <a
            href="/upgrade"
            className="shrink-0 bg-amber-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-amber-800 transition-colors"
          >
            Unlock all documents — $149 →
          </a>
        </div>
      )}

      {/* Paid but the full set hasn't been generated yet */}
      {moreToUnlock && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 flex items-center justify-between gap-4">
          <p className="text-sm text-orange-800">
            You&apos;re on <span className="font-semibold">Full Access</span> — {documents.length} of {totalPossibleDocs} documents generated so far.
          </p>
          <GenerateDocButton label="the rest of your documents" variant="unlock" />
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
        ) : generationFailed ? (
          <div className="bg-white border border-red-200 rounded-xl p-12 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              We couldn&apos;t generate your documents
            </h3>
            <p className="text-sm text-gray-600 mb-2 max-w-md mx-auto">
              Something went wrong on our side while building your SOPs, subcontractor pack,
              quote templates and policies. Your account and your answers are safe — nothing
              needs to be re-entered.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Press the button below to try again. It takes about a minute.
            </p>
            <div className="flex items-center justify-center gap-3">
              <GenerateDocButton label="your documents" variant="retry" />
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Still failing? Email{' '}
              <a href="mailto:support@docsrok.com" className="underline">
                support@docsrok.com
              </a>{' '}
              and we&apos;ll sort it out for you.
            </p>
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
              Taking longer than a minute? Refresh once more — if it still hasn&apos;t appeared
              we&apos;ll show you a retry button.
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
                  ) : isPaid ? (
                    <GenerateDocButton
                      activityKey={process.key}
                      docType="sop"
                      label={process.label}
                      variant="add"
                    />
                  ) : (
                    <span className="shrink-0 text-xs text-gray-400" title="Unlock all documents for $149">
                      🔒 Unlock to generate
                    </span>
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
                  ) : isPaid ? (
                    <GenerateDocButton
                      activityKey={jobKey}
                      docType="quote_template"
                      label={label}
                      variant="add"
                    />
                  ) : (
                    <span className="shrink-0 text-xs text-gray-400" title="Unlock all documents for $149">
                      🔒 Unlock to generate
                    </span>
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
                  ) : isPaid ? (
                    <GenerateDocButton
                      activityKey={policy.key}
                      docType="business_policy"
                      label={policy.label}
                      variant="add"
                    />
                  ) : (
                    <span className="shrink-0 text-xs text-gray-400" title="Unlock all documents for $149">
                      🔒 Unlock to generate
                    </span>
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
