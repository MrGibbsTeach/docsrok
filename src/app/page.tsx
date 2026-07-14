import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Docs Rok — Business Paperwork for Australian Trades',
  description:
    'Generate SOPs, subcontractor packs, quote templates, and business policies for your trade business. Customised to your business in minutes.',
}

const DOCUMENTS = [
  {
    icon: '📋',
    name: 'Standard Operating Procedures (SOPs)',
    desc: 'For the processes that keep your business running the same way every time — job intake and quoting, scheduling, quality control, invoicing, complaint handling, and more.',
  },
  {
    icon: '🤝',
    name: 'Subcontractor & New-Hire Welcome Packs',
    desc: 'A clear welcome pack covering expectations, site protocols, communication, and payment terms — so new subbies and staff get up to speed faster.',
  },
  {
    icon: '📝',
    name: 'Quote & Proposal Templates',
    desc: 'A polished, reusable quote structure for each type of job you do — scope, inclusions/exclusions, pricing table, terms, and acceptance block.',
  },
  {
    icon: '📄',
    name: 'Business Policy Documents',
    desc: 'Customer service policy, complaints handling, terms of trade, cancellation and refund policy, and code of conduct — all in plain business English.',
  },
]

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

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Tell us about your business',
    desc: 'Enter your business name, ABN, state, trade type, number of employees, and the services you offer. Takes about 3 minutes.',
  },
  {
    step: '2',
    title: 'Documents generate automatically',
    desc: 'Our AI generates every document customised to your business and your trade — typically in under 60 seconds.',
  },
  {
    step: '3',
    title: 'Review, print, and download',
    desc: 'Open each document in your browser, review it, edit anything you want to change, and save as PDF. Regenerate any time your business changes.',
  },
]

const PLANS = [
  {
    name: 'Core',
    price: 79,
    desc: 'For sole traders and small crews.',
    features: [
      'SOPs for your key processes',
      'Quote/proposal templates',
      'Any Australian state',
      'Customised to your trade',
      'Print-to-PDF download',
      'Email support',
    ],
    cta: 'Start free trial',
    highlight: false,
  },
  {
    name: 'Plus',
    price: 129,
    desc: 'For growing businesses.',
    features: [
      'Everything in Core',
      'Subcontractor welcome packs',
      'All business policy documents',
      'Regenerate documents any time',
      'Priority email support',
    ],
    cta: 'Start free trial',
    highlight: true,
  },
  {
    name: 'Team',
    price: 199,
    desc: 'For larger businesses and subcontractors.',
    features: [
      'Everything in Plus',
      'Up to 5 team members',
      'Multiple business profiles',
      'Dedicated support',
    ],
    cta: 'Start free trial',
    highlight: false,
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
    q: 'Is there a contract? Can I cancel?',
    a: 'No contract. Cancel any time from your account settings. Your 14-day free trial requires no credit card.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <span className="text-orange-600 font-bold text-lg tracking-tight">Docs Rok</span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-white pt-20 pb-16 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-orange-50 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
            Any Australian trade, any state
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            The paperwork your trade business never gets around to.{' '}
            <span className="text-orange-600">Done in minutes.</span>
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
            Docs Rok generates your SOPs, subcontractor welcome packs, quote templates, and
            business policies — customised to your trade and your business, so you can stop
            starting from a blank page.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="bg-orange-600 text-white text-base font-semibold px-8 py-3.5 rounded-xl hover:bg-orange-700 transition-colors"
            >
              Start 14-day free trial
            </Link>
            <Link
              href="#how-it-works"
              className="bg-gray-100 text-gray-700 text-base font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-200 transition-colors"
            >
              See how it works
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-4">No credit card required. Cancel any time.</p>
        </div>
      </section>

      {/* Trust bar */}
      <div className="bg-gray-50 border-y border-gray-100 py-4 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-gray-500">
          <span>✓ Any Australian trade</span>
          <span>✓ All states</span>
          <span>✓ 4 document types</span>
          <span>✓ Fully editable</span>
          <span>✓ Under 60 seconds</span>
        </div>
      </div>

      {/* Pain section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Every trade business needs this paperwork. Almost none of them have time to write it.
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
            SOPs, subcontractor packs, quote templates, business policies — everyone agrees you
            should have them. Here&apos;s what actually happens instead.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: '📥',
                title: 'It never gets written',
                desc: 'You know your quoting process should be written down somewhere. It lives in your head instead, which is fine until you\'re not the one answering the phone.',
              },
              {
                icon: '📄',
                title: 'Generic templates don\'t fit',
                desc: 'A Word template from Google doesn\'t know what trade you\'re in, what services you offer, or how your business actually runs a job.',
              },
              {
                icon: '💸',
                title: 'Consultants are overkill',
                desc: 'Paying a business consultant to write internal SOPs and policy documents is real money for paperwork you could generate and adapt yourself in minutes.',
              },
            ].map((p) => (
              <div key={p.title} className="bg-gray-50 rounded-xl p-6">
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-500">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Every document your trade business needs
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
            All customised to your business name, ABN, trade type, and the specific services you offer.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {DOCUMENTS.map((d) => (
              <div key={d.name} className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="text-2xl mb-2">{d.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{d.name}</h3>
                <p className="text-sm text-gray-500">{d.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              SOPs — 8 core business processes covered
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SERVICES.map((a) => (
                <div key={a} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-orange-500 font-bold flex-shrink-0">✓</span>
                  {a}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">How it works</h2>
          <p className="text-gray-500 text-center mb-12">From signup to print-ready documents in under 5 minutes.</p>
          <div className="grid sm:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/signup"
              className="inline-block bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-orange-700 transition-colors"
            >
              Start free trial — no credit card
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Straightforward pricing
          </h2>
          <p className="text-gray-500 text-center mb-12">
            14-day free trial. No credit card required. Cancel any time.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 flex flex-col ${
                  plan.highlight
                    ? 'bg-orange-600 text-white ring-2 ring-orange-600'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {plan.highlight && (
                  <div className="text-xs font-bold uppercase tracking-widest text-orange-200 mb-2">Most popular</div>
                )}
                <div className={`text-xs font-semibold uppercase tracking-wide mb-1 ${plan.highlight ? 'text-orange-100' : 'text-gray-400'}`}>
                  {plan.name}
                </div>
                <div className={`text-3xl font-extrabold mb-1 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                  ${plan.price}
                  <span className={`text-base font-normal ${plan.highlight ? 'text-orange-100' : 'text-gray-400'}`}>/mo AUD</span>
                </div>
                <div className={`text-sm mb-5 ${plan.highlight ? 'text-orange-100' : 'text-gray-500'}`}>
                  {plan.desc}
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${plan.highlight ? 'text-white' : 'text-gray-600'}`}>
                      <span className={`flex-shrink-0 ${plan.highlight ? 'text-orange-200' : 'text-orange-500'}`}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`text-center text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors ${
                    plan.highlight
                      ? 'bg-white text-orange-600 hover:bg-orange-50'
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mt-6">
            All prices in AUD, ex-GST.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Common questions
          </h2>
          <div className="space-y-6">
            {FAQS.map((faq) => (
              <div key={faq.q} className="border-b border-gray-100 pb-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-orange-600 py-20 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Get your business paperwork sorted today
          </h2>
          <p className="text-orange-100 mb-8 text-lg">
            Start your 14-day free trial. No credit card. No contract.
            Australian trade businesses — up and running in minutes.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-orange-600 font-bold text-base px-10 py-4 rounded-xl hover:bg-orange-50 transition-colors"
          >
            Start free trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start justify-between gap-6">
          <div>
            <div className="text-orange-500 font-bold text-lg mb-1">Docs Rok</div>
            <div className="text-xs">Business paperwork for Australian trades</div>
            <div className="text-xs mt-1">Any trade, any state</div>
          </div>
          <div className="flex gap-8 text-sm">
            <div>
              <div className="text-gray-300 font-medium mb-2">Product</div>
              <div className="space-y-1 text-xs">
                <div><Link href="/#how-it-works" className="hover:text-white transition-colors">How it works</Link></div>
                <div><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></div>
                <div><Link href="/signup" className="hover:text-white transition-colors">Start free trial</Link></div>
              </div>
            </div>
            <div>
              <div className="text-gray-300 font-medium mb-2">Account</div>
              <div className="space-y-1 text-xs">
                <div><Link href="/login" className="hover:text-white transition-colors">Sign in</Link></div>
                <div><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></div>
              </div>
            </div>
            <div>
              <div className="text-gray-300 font-medium mb-2">Legal</div>
              <div className="space-y-1 text-xs">
                <div><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></div>
                <div><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto border-t border-gray-800 mt-8 pt-6 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} Docs Rok. Documents are templates and starting points for your business — review and adapt them before use. Not legal, financial, or professional advice.</p>
        </div>
      </footer>

    </div>
  )
}
