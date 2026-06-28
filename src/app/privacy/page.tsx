import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — Docs Rok',
  description: 'Privacy Policy for Docs Rok — how we collect, use, and protect your information.',
}

const LAST_UPDATED = '28 June 2026'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-orange-600 font-bold text-lg tracking-tight">Docs Rok</Link>
          <Link href="/login" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">Sign in</Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-gray-700">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. About this Policy</h2>
            <p>
              Docs Rok (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates the Docs Rok platform at docsrok.com and docsrok.com.au.
              This Privacy Policy explains how we collect, use, store, and disclose personal information
              when you use our service.
            </p>
            <p className="mt-3">
              We are committed to protecting your privacy in accordance with the{' '}
              <em>Privacy Act 1988</em> (Cth) and the Australian Privacy Principles (APPs).
            </p>
            <p className="mt-3">
              By creating an account or using Docs Rok, you consent to the practices described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. What information we collect</h2>
            <p>We collect the following categories of information:</p>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">Account information</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Email address (used for login and transactional emails)</li>
              <li>Full name (optional, used in document generation)</li>
              <li>Password (stored as a secure hash — we never store your plain text password)</li>
            </ul>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">Business information</h3>
            <p>
              You provide this information during onboarding. It is used to generate your WHS documents:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Business name</li>
              <li>Australian Business Number (ABN)</li>
              <li>Business address</li>
              <li>State of operation (QLD or NSW)</li>
              <li>Industry type</li>
              <li>Number of employees</li>
              <li>WHS responsible person name and role</li>
              <li>Work activities performed by your business</li>
            </ul>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">Payment information</h3>
            <p>
              Payment details (credit card numbers, billing address) are collected and processed
              directly by Stripe, Inc. We do not store your credit card number or CVV. We store
              only a Stripe customer ID and subscription status in our database.
            </p>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">Usage information</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Log data (IP address, browser type, pages visited, timestamps)</li>
              <li>Documents you generate and view</li>
              <li>Subscription and billing history</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. How we use your information</h2>
            <p>We use your information for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li><strong>Providing the service</strong> — generating WHS compliance documents customised to your business</li>
              <li><strong>Account management</strong> — creating and maintaining your account, authentication, and access control</li>
              <li><strong>Billing and payments</strong> — processing subscriptions and managing your billing through Stripe</li>
              <li><strong>Transactional emails</strong> — sending account confirmation, trial reminders, and payment receipts via Resend</li>
              <li><strong>Service improvements</strong> — understanding how users interact with the platform to improve features</li>
              <li><strong>Legal compliance</strong> — meeting our obligations under applicable Australian law</li>
            </ul>
            <p className="mt-3">
              We do not use your business information for marketing, do not sell your data to third parties,
              and do not use it for any purpose other than providing the Docs Rok service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Third-party services we use</h2>
            <p>
              To provide Docs Rok, we share data with the following trusted third-party services.
              Each is bound by its own privacy policy and security standards:
            </p>

            <div className="mt-4 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold text-gray-800">Supabase (Database and Authentication)</div>
                <div className="text-gray-600 mt-1">
                  Your account and business data is stored in a Supabase PostgreSQL database hosted
                  in Sydney, Australia (AWS ap-southeast-2). Supabase provides authentication and
                  enforces row-level security so your data is only accessible to you.
                </div>
                <div className="mt-1"><a href="https://supabase.com/privacy" className="text-orange-600 hover:underline" target="_blank" rel="noopener noreferrer">supabase.com/privacy</a></div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold text-gray-800">Anthropic (Document Generation)</div>
                <div className="text-gray-600 mt-1">
                  Your business information (name, ABN, state, industry, work activities) is sent
                  to Anthropic&rsquo;s Claude API to generate your WHS documents. Anthropic processes
                  this data to generate text and does not retain it for training purposes under
                  its API terms.
                </div>
                <div className="mt-1"><a href="https://www.anthropic.com/privacy" className="text-orange-600 hover:underline" target="_blank" rel="noopener noreferrer">anthropic.com/privacy</a></div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold text-gray-800">Stripe (Payments)</div>
                <div className="text-gray-600 mt-1">
                  Subscription billing is handled by Stripe, Inc. Stripe collects and processes your
                  payment card details directly — we never see or store your card number. Stripe is
                  PCI DSS Level 1 certified.
                </div>
                <div className="mt-1"><a href="https://stripe.com/privacy" className="text-orange-600 hover:underline" target="_blank" rel="noopener noreferrer">stripe.com/privacy</a></div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold text-gray-800">Resend (Transactional Email)</div>
                <div className="text-gray-600 mt-1">
                  We use Resend to send account confirmation, trial expiry, and payment confirmation
                  emails. Your email address is shared with Resend solely for this purpose.
                </div>
                <div className="mt-1"><a href="https://resend.com/privacy" className="text-orange-600 hover:underline" target="_blank" rel="noopener noreferrer">resend.com/privacy</a></div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Data storage and security</h2>
            <p>
              Your data is stored in Australia (Sydney). We implement the following security measures:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-3">
              <li>All data is transmitted over HTTPS/TLS encryption</li>
              <li>Passwords are hashed using bcrypt — never stored in plain text</li>
              <li>Row-level security (RLS) ensures each user can only access their own data</li>
              <li>API keys and secrets are stored as environment variables, never in code</li>
              <li>Database backups are maintained by Supabase</li>
            </ul>
            <p className="mt-3">
              While we take reasonable steps to protect your information, no internet transmission
              is completely secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Data retention</h2>
            <p>
              We retain your personal information and documents for as long as your account is active.
              If you cancel your subscription, we retain your account data for 90 days before deletion,
              in case you choose to return. You may request immediate deletion at any time (see Section 7).
            </p>
            <p className="mt-3">
              Financial records (transaction history) are retained for 7 years as required by Australian
              tax law, even after account deletion.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Your rights</h2>
            <p>Under the Australian Privacy Principles, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li><strong>Access</strong> — request a copy of the personal information we hold about you</li>
              <li><strong>Correction</strong> — request that we correct inaccurate or incomplete information</li>
              <li><strong>Deletion</strong> — request deletion of your account and personal data</li>
              <li><strong>Portability</strong> — request your business information and generated documents in a portable format</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:support@docsrok.com.au" className="text-orange-600 hover:underline">support@docsrok.com.au</a>.
              We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Cookies</h2>
            <p>
              Docs Rok uses session cookies for authentication (to keep you logged in). We do not use
              advertising cookies or third-party tracking cookies. We do not use Google Analytics or
              any advertising pixel on our platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Children</h2>
            <p>
              Docs Rok is a business service and is not directed at individuals under 18 years of age.
              We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. If we make material changes,
              we will notify you by email and update the &ldquo;Last updated&rdquo; date at the top of this page.
              Continued use of Docs Rok after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">11. Contact and complaints</h2>
            <p>
              For privacy questions or concerns, contact us at:{' '}
              <a href="mailto:support@docsrok.com.au" className="text-orange-600 hover:underline">support@docsrok.com.au</a>
            </p>
            <p className="mt-3">
              If you are not satisfied with our response, you may lodge a complaint with the
              Office of the Australian Information Commissioner (OAIC) at{' '}
              <a href="https://www.oaic.gov.au" className="text-orange-600 hover:underline" target="_blank" rel="noopener noreferrer">oaic.gov.au</a>{' '}
              or by calling 1300 363 992.
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t border-gray-100 py-8 px-4 text-center text-xs text-gray-400">
        <Link href="/" className="text-orange-600 font-semibold">Docs Rok</Link>
        {' · '}
        <Link href="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
        {' · '}
        <Link href="/terms" className="hover:text-gray-600">Terms of Service</Link>
      </footer>
    </div>
  )
}
