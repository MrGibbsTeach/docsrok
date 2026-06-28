import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Docs Rok — WHS Compliance Documents for Australian Construction',
  description:
    'Generate state-specific WHS policies, SWMS, hazard registers, and compliance documents for your QLD or NSW construction business. Customised to your business in minutes.',
}

const DOCUMENTS = [
  {
    icon: '📋',
    name: 'WHS Policy',
    desc: 'Your formal commitment to health and safety. Covers legislative framework, management duties, worker responsibilities, consultation, psychosocial hazards, and more.',
  },
  {
    icon: '🔧',
    name: 'Safe Work Method Statements (SWMS)',
    desc: 'For all 10 high-risk construction activities — working at heights, excavation, scaffolding, confined spaces, crane operations, and more. Required by law for HRCW.',
  },
  {
    icon: '⚠️',
    name: 'Hazard Register',
    desc: 'A complete, site-ready hazard register with 18+ hazard categories, risk ratings, controls, and corrective action tracking.',
  },
  {
    icon: '🚑',
    name: 'Incident Report Form',
    desc: 'Covers injuries, near misses, dangerous incidents, and notifiable incidents. Includes 5 Whys root cause investigation and corrective action tracking.',
  },
  {
    icon: '🚒',
    name: 'Emergency Procedures',
    desc: 'Site-ready emergency response for fire, medical emergencies, structural collapse, electrical incidents, chemical spills, and full evacuation procedure.',
  },
]

const ACTIVITIES = [
  'Working at heights',
  'Manual handling',
  'Electrical work',
  'Excavation and trenching',
  'Concrete cutting / grinding',
  'Scaffolding erection',
  'Confined space entry',
  'Hot work (welding / cutting)',
  'Crane and rigging operations',
  'Demolition work',
]

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Tell us about your business',
    desc: 'Enter your business name, ABN, state, industry type, number of employees, and which high-risk activities your workers perform. Takes about 3 minutes.',
  },
  {
    step: '2',
    title: 'Documents generate automatically',
    desc: "Our AI generates every document customised to your business and your state's WHS legislation — typically in under 60 seconds.",
  },
  {
    step: '3',
    title: 'View, print, and download',
    desc: 'Open each document in your browser, review it, and save as PDF. Sign and distribute to your workers. Regenerate any time regulations change.',
  },
]

const PLANS = [
  {
    name: 'Core',
    price: 89,
    desc: 'For sole traders and small crews.',
    features: [
      'All 5 WHS document types',
      'SWMS for your chosen activities',
      'QLD or NSW legislation',
      'Customised to your business',
      'Print-to-PDF download',
      'Email support',
    ],
    cta: 'Start free trial',
    highlight: false,
  },
  {
    name: 'Plus',
    price: 149,
    desc: 'For growing businesses.',
    features: [
      'Everything in Core',
      'All 10 SWMS activity types',
      'Regenerate documents any time',
      'Priority regulatory updates',
      'Priority email support',
    ],
    cta: 'Start free trial',
    highlight: true,
  },
  {
    name: 'Team',
    price: 249,
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
    q: 'Are the documents legally compliant?',
    a: 'Every document is generated specifically for Queensland or New South Wales legislation — the Work Health and Safety Act 2011 and its state-specific Regulations. Documents reference the correct regulator (WHSQ for QLD, SafeWork NSW for NSW), notifiable incident obligations, current Codes of Practice, and current exposure standards (including the 0.05 mg/m³ silica standard). Templates have been reviewed by a WHS consultant. That said, documents are tools to help you comply — they do not replace your duty to implement safe work practices on site.',
  },
  {
    q: 'What states do you cover?',
    a: 'Queensland and New South Wales. Both states operate under the model WHS Act 2011, but there are differences in Regulations and specific requirements — Docs Rok generates documents specific to your state. Additional states are planned for 2025.',
  },
  {
    q: 'What if regulations change?',
    a: 'We monitor Safe Work Australia, Workplace Health and Safety Queensland, and SafeWork NSW for regulatory changes. When something changes that affects your documents, we update our templates and you can regenerate immediately. Plus and Team subscribers get priority notification.',
  },
  {
    q: 'Do I still need a WHS consultant?',
    a: "Docs Rok doesn't replace a consultant for complex projects, incident investigations, or site-specific audits. What it replaces is paying $300–500 per document for standard compliance documentation that every construction business needs. Use the savings on the things that actually need a specialist.",
  },
  {
    q: 'Can I edit the documents?',
    a: 'Yes. Save as PDF and edit in any PDF editor, or print and fill in handwritten notes. Documents include site-specific placeholders (assembly point, site address, nearest hospital) that you complete for each project.',
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
            Queensland &amp; New South Wales
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            WHS compliance documents for construction.{' '}
            <span className="text-orange-600">Done in minutes.</span>
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
            Stop paying $300–500 per document to a consultant. Docs Rok generates your WHS Policy,
            SWMS, Hazard Register, Incident Report Form, and Emergency Procedures — customised to
            your business and your state&apos;s WHS legislation.
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
          <span>✓ WHS Act 2011 (Qld) &amp; (NSW)</span>
          <span>✓ WHSQ &amp; SafeWork NSW compliant</span>
          <span>✓ WHS consultant reviewed</span>
          <span>✓ 5 doc types · 10 SWMS activities</span>
          <span>✓ Under 60 seconds</span>
        </div>
      </div>

      {/* Pain section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            WHS documentation is a legal requirement. It doesn&apos;t have to be a nightmare.
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
            Every construction business in QLD and NSW must have WHS documents in place.
            Here&apos;s what most builders are dealing with right now.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: '💸',
                title: 'Consultants are expensive',
                desc: 'A WHS consultant charges $300–500 per document. Five documents costs $1,500–2,500 — and that\'s before you factor in keeping them updated when regulations change.',
              },
              {
                icon: '📄',
                title: 'Generic templates don\'t hold up',
                desc: 'Free templates reference the wrong legislation, use the wrong regulator details, and have no idea what activities your workers actually perform on site.',
              },
              {
                icon: '📅',
                title: 'Regulations keep changing',
                desc: 'NSW introduced psychosocial hazard regulations in 2022. QLD followed in 2023. Silica exposure standards halved in 2020. Most businesses haven\'t updated their docs.',
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
            Every document your construction business needs
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
            All customised to your business name, ABN, address, state, industry type, and the
            specific high-risk activities your workers perform.
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
              SWMS — 10 high-risk construction activities covered
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ACTIVITIES.map((a) => (
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
            Get your WHS documents sorted today
          </h2>
          <p className="text-orange-100 mb-8 text-lg">
            Start your 14-day free trial. No credit card. No contract.
            QLD and NSW construction businesses — up and running in minutes.
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
            <div className="text-xs">WHS compliance documents for Australian construction</div>
            <div className="text-xs mt-1">Queensland &amp; New South Wales</div>
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
          <p>© {new Date().getFullYear()} Docs Rok. Documents are generated for informational purposes and do not constitute legal advice. Always consult a qualified WHS professional for site-specific guidance.</p>
        </div>
      </footer>

    </div>
  )
}
