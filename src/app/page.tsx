import type { Metadata } from 'next'
import Link from 'next/link'
import { Inbox, FileWarning, Banknote, Check, Plus, ArrowRight } from 'lucide-react'
import { SITE_NAME, SITE_URL } from '@/lib/site'
import { DOCUMENT_TYPES } from '@/lib/document-types'
import { SiteNav } from '@/components/SiteNav'
import { SiteFooter } from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Docs Rok — Business Paperwork for Australian Trades',
  description:
    'Generate SOPs, subcontractor packs, quote templates, and business policies for your trade business. Customised to your business in minutes.',
}

const SERVICES = [
  'Job intake and quoting',
  'Scheduling and dispatch',
  'On-site quality control',
  'Customer handover',
  'Invoicing and payment',
  'Complaint handling',
  'Subcontractor onboarding',
  'Equipment and vehicle care',
]

const PROBLEMS = [
  {
    num: '01',
    icon: Inbox,
    title: 'It never gets written',
    desc: 'You know your quoting process should be written down somewhere. It lives in your head instead, which is fine until you\'re not the one answering the phone.',
  },
  {
    num: '02',
    icon: FileWarning,
    title: 'Generic templates don\'t fit',
    desc: 'A Word template from Google doesn\'t know what trade you\'re in, what services you offer, or how your business actually runs a job.',
  },
  {
    num: '03',
    icon: Banknote,
    title: 'Consultants are overkill',
    desc: 'Paying a business consultant to write internal SOPs and policy documents is real money for paperwork you could generate and adapt yourself in minutes.',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Tell us about your business',
    desc: 'Enter your business name, ABN, state, trade type, number of employees, and the services you offer. Takes about 3 minutes.',
  },
  {
    step: '02',
    title: 'Documents generate automatically',
    desc: 'Our AI generates every document customised to your business and your trade — typically in under 60 seconds.',
  },
  {
    step: '03',
    title: 'Review, print, and download',
    desc: 'Open each document in your browser, review it, edit anything you want to change, and save as PDF. Regenerate any time your business changes.',
  },
]

const PLANS = [
  {
    name: 'Free',
    price: 0,
    priceNote: 'forever',
    desc: 'See the real thing before you pay anything.',
    features: [
      'One Standard Operating Procedure',
      'One quote / proposal template',
      'Customised to your trade and state',
      'Print-to-PDF download',
      'No credit card, no time limit',
    ],
    cta: 'Start free',
    highlight: false,
  },
  {
    name: 'Full Access',
    price: 149,
    priceNote: 'one-time',
    desc: 'Your complete document set. Pay once, keep it.',
    features: [
      'All 8 core-process SOPs',
      'Quote templates for every service you offer',
      'Subcontractor and new-hire welcome pack',
      'All 5 business policy documents',
      'Regenerate any document, any time',
      'No subscription, no monthly fee',
      'Email support',
    ],
    cta: 'Get full access',
    highlight: true,
  },
]

const FAQS = [
  {
    q: 'What documents can I generate?',
    a: 'Standard Operating Procedures for your key business processes (quoting, scheduling, quality control, invoicing, complaint handling, and more), subcontractor and new-hire welcome packs, reusable quote/proposal templates for the job types you do, and business policy documents (customer service, complaints, terms of trade, cancellation/refund, code of conduct).',
  },
  {
    q: 'Which trades and states is this for?',
    a: 'Any Australian trade or service business — building, plumbing, electrical, landscaping, carpentry, painting, cleaning, and more — in any state. Documents are tailored to your trade and business size, not tied to any specific state legislation.',
  },
  {
    q: 'Is this legal or compliance advice?',
    a: 'No. These are internal business-operations documents and templates — the kind you\'d normally write yourself or ask a business consultant to help with. They are not legal, safety, or compliance advice, and should be reviewed and adapted to your business before use, the same as any business document.',
  },
  {
    q: 'Can I edit the documents?',
    a: 'Yes — that\'s expected. Save as PDF and edit in any editor, or use the content as a starting point and rewrite sections to match exactly how your business operates. Quote templates use placeholders you fill in for each job.',
  },
  {
    q: 'How is this different from a generic template site or Notion doc?',
    a: 'Generic SOP tools don\'t know anything about your trade. Docs Rok generates SOPs, subcontractor packs, quotes, and policies together, tailored to your specific trade and the services you actually offer — not a one-size-fits-all template.',
  },
  {
    q: 'What do I get for free?',
    a: 'One Standard Operating Procedure and one quote/proposal template, both fully generated and customised to your business. No credit card, and no time limit on them. You only pay if you want the rest of the set.',
  },
  {
    q: 'Is it a subscription?',
    a: 'No. Full Access is a single $149 payment for your complete document set. There is no monthly fee, no contract, and nothing to cancel. Your documents stay in your account and you can regenerate any of them whenever your business changes.',
  },
]

// Built from the same constants the page renders below, so the structured data
// cannot drift away from what a visitor actually sees — which is exactly what
// Google penalises FAQ markup for.
function structuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        description: 'Business paperwork for Australian trade businesses.',
        areaServed: { '@type': 'Country', name: 'Australia' },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en-AU',
      },
      {
        // SoftwareApplication rather than Product. Product markup put this page
        // into Google's Merchant listings validation, which demands image,
        // shippingDetails and hasMerchantReturnPolicy: fields that mean nothing
        // for a web app and would sit there as a permanent red error.
        // SoftwareApplication is what this actually is, and still carries price.
        '@type': 'SoftwareApplication',
        name: 'Docs Rok',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: SITE_URL,
        image: `${SITE_URL}/opengraph-image`,
        description:
          'Generates the complete business document set for an Australian trade business: standard operating procedures, quote and proposal templates, a subcontractor and new-hire welcome pack, and business policy documents, all customised to the trade and state.',
        publisher: { '@id': `${SITE_URL}/#organization` },
        offers: {
          '@type': 'Offer',
          price: '149.00',
          priceCurrency: 'AUD',
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}/#pricing`,
          description: 'One-time purchase. Two documents are free with no charge.',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
      },
    ],
  }
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
      />

      <SiteNav />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="bp-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-3xl px-4 pb-16 pt-20 text-center sm:px-6">
          <div className="mb-6 inline-flex items-center gap-2 border-l-2 border-brand bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink-2">
            Any Australian trade, any state
          </div>
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            The paperwork your trade business never gets around to.{' '}
            <span className="text-brand">Done in minutes.</span>
          </h1>
          <p className="mx-auto mb-8 mt-6 max-w-2xl text-lg text-muted">
            Docs Rok generates your SOPs, subcontractor welcome packs, quote templates, and
            business policies — customised to your trade and your business, so you can stop
            starting from a blank page.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-md bg-brand px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Start free
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-md border border-line bg-white px-8 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-paper-dim"
            >
              See how it works
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted">
            Two documents free, no credit card. Full set is a one-time $149.
          </p>
        </div>

        {/* Trust bar */}
        <div className="relative border-t border-line bg-paper-dim/70 py-4">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 text-sm text-ink-2">
            {['Any Australian trade', 'All states', '4 document types', 'Fully editable', '2 documents free'].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-brand" strokeWidth={2.5} />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Pain section — left-aligned editorial list, not a centered 3-card grid */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Every trade business needs this paperwork. Almost none of them have time to write it.
            </h2>
            <p className="mt-4 text-muted">
              SOPs, subcontractor packs, quote templates, business policies — everyone agrees you
              should have them. Here&apos;s what actually happens instead.
            </p>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {PROBLEMS.map((p) => (
              <div key={p.title} className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-[auto_auto_1fr] sm:items-start sm:gap-8">
                <span className="font-display text-4xl font-bold text-line sm:text-5xl">{p.num}</span>
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md bg-brand-light text-brand">
                  <p.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">{p.title}</h3>
                  <p className="mt-1 max-w-xl text-sm text-muted">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="bg-paper-dim px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Every document your trade business needs
            </h2>
            <p className="mt-4 text-muted">
              All customised to your business name, ABN, trade type, and the specific services you offer.
            </p>
          </div>
          <div className="mb-8 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
            {DOCUMENT_TYPES.map((d) => (
              <div key={d.name} className="bg-paper p-6">
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-brand-light text-brand">
                  <d.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="font-display text-lg font-bold text-ink">{d.name}</h3>
                <p className="mt-1 text-sm text-muted">{d.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-line bg-paper p-6">
            <h3 className="font-display text-lg font-bold text-ink">
              SOPs — 8 core business processes covered
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {SERVICES.map((a) => (
                <div key={a} className="flex items-center gap-2 text-sm text-ink-2">
                  <Check className="h-4 w-4 flex-shrink-0 text-brand" strokeWidth={2.5} />
                  {a}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">How it works</h2>
            <p className="mt-4 text-muted">From signup to print-ready documents in under 5 minutes.</p>
          </div>
          <div className="grid gap-10 sm:grid-cols-3">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} className="border-t-2 border-ink pt-4">
                <span className="font-display text-sm font-bold text-brand">{s.step}</span>
                <h3 className="mt-2 font-display text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-1 text-sm text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-md bg-brand px-8 py-3.5 font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Start free, no credit card
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-paper-dim px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Pay once. Keep your documents.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              Start with two documents free. Unlock the full set for a single payment.
              No subscription, no contract.
            </p>
          </div>
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-lg bg-paper p-6 ${
                  plan.highlight ? 'border-2 border-ink' : 'border border-line'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-6 bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    Most popular
                  </div>
                )}
                <div className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {plan.name}
                </div>
                <div className="mt-1 font-display text-4xl font-extrabold text-ink">
                  ${plan.price}
                  <span className="font-sans text-base font-normal text-muted">
                    {' '}{plan.priceNote} {plan.price > 0 ? 'AUD' : ''}
                  </span>
                </div>
                <div className="mb-5 mt-2 text-sm text-muted">{plan.desc}</div>
                <ul className="mb-6 flex-1 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-ink-2">
                      <Check className="h-4 w-4 flex-shrink-0 text-brand" strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`rounded-md px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                    plan.highlight
                      ? 'bg-ink text-white hover:bg-ink-2'
                      : 'bg-brand text-white hover:bg-brand-dark'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted">
            Price in AUD, ex-GST. One payment, not a subscription.
          </p>
        </div>
      </section>

      {/* FAQ — native <details>, so it's a working accordion with no client JS */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Common questions
          </h2>
          <div className="divide-y divide-line border-y border-line">
            {FAQS.map((faq) => (
              <details key={faq.q} className="faq group py-5">
                <summary className="flex items-center justify-between gap-4">
                  <span className="font-display font-bold text-ink">{faq.q}</span>
                  <Plus className="faq-icon h-5 w-5 flex-shrink-0 text-brand transition-transform" strokeWidth={2.5} />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-ink px-4 py-20 text-center sm:px-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Get your business paperwork sorted today
          </h2>
          <p className="mb-8 mt-4 text-lg text-white/70">
            Start with two documents free, no credit card. Unlock the full set
            whenever you are ready, for a one-time $149.
          </p>
          <Link
            href="/signup"
            className="inline-block rounded-md bg-brand px-10 py-4 text-base font-bold text-white transition-colors hover:bg-brand-dark"
          >
            Start free
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
