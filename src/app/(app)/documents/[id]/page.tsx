import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { markdownToHtml } from '@/lib/documents/markdown-to-html'
import PrintButton from './PrintButton'

export const dynamic = 'force-dynamic'

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: doc } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id) // RLS + belt-and-suspenders
    .single()

  if (!doc) notFound()

  const markdown = (doc.content as { markdown?: string })?.markdown ?? ''
  const html = markdownToHtml(markdown)

  return (
    <>
      {/* Print styles — hides chrome, shows only document */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .doc-body { padding: 0 !important; }
          body { background: white !important; }
        }
        .doc-content h1 { font-size: 1.5rem; font-weight: 700; margin: 1.5rem 0 0.5rem; color: #111827; }
        .doc-content h2 { font-size: 1.2rem; font-weight: 700; margin: 1.25rem 0 0.4rem; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
        .doc-content h3 { font-size: 1rem; font-weight: 700; margin: 1rem 0 0.3rem; color: #374151; }
        .doc-content h4 { font-size: 0.9rem; font-weight: 600; margin: 0.75rem 0 0.25rem; color: #374151; }
        .doc-content p { margin: 0 0 0.75rem; line-height: 1.65; }
        .doc-content ul, .doc-content ol { margin: 0 0 0.75rem 1.5rem; }
        .doc-content li { margin-bottom: 0.25rem; line-height: 1.6; }
        .doc-content hr { border: none; border-top: 1px solid #e5e7eb; margin: 1.5rem 0; }
        .doc-content blockquote { border-left: 4px solid #ea580c; padding: 0.5rem 1rem; margin: 1rem 0; background: #fff7ed; border-radius: 0 6px 6px 0; color: #92400e; font-weight: 500; }
        .doc-content blockquote p { margin: 0; }
        .doc-content code { background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 3px; padding: 1px 5px; font-size: 0.85em; font-family: monospace; }
        .doc-content table { width: 100%; border-collapse: collapse; margin: 0.75rem 0 1.25rem; font-size: 0.85rem; }
        .doc-content th { background: #f3f4f6; font-weight: 600; text-align: left; padding: 8px 10px; border: 1px solid #d1d5db; color: #374151; }
        .doc-content td { padding: 7px 10px; border: 1px solid #d1d5db; vertical-align: top; line-height: 1.5; }
        .doc-content tr:nth-child(even) td { background: #f9fafb; }
        .doc-content .cb { font-size: 1.1em; }
        .doc-content .cb-checked { color: #16a34a; }
        .doc-content a { color: #ea580c; }
      `}</style>

      {/* Toolbar — hidden on print */}
      <div className="no-print flex items-center justify-between mb-6">
        <a
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          ← Back to dashboard
        </a>
        <PrintButton />
      </div>

      {/* Document */}
      <div className="doc-body bg-white rounded-xl border border-gray-200 shadow-sm p-10 max-w-4xl mx-auto">
        {/* Meta header — only visible on screen */}
        <div className="no-print mb-6 pb-6 border-b border-gray-100 flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-medium text-orange-600 uppercase tracking-wider">
              {doc.type.replace(/_/g, ' ')}
            </span>
            <p className="text-xs text-gray-400 mt-1">{doc.regulatory_citation}</p>
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap">
            Generated {new Date(doc.created_at).toLocaleDateString('en-AU')}
          </span>
        </div>

        {/* Rendered document */}
        <div
          className="doc-content text-gray-800 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </>
  )
}
