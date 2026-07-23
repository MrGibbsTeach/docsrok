import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OnboardingForm from '@/components/onboarding/OnboardingForm'

export const metadata = {
  title: 'Set up your business — Docs Rok',
}

export default async function OnboardingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // If they've already completed onboarding, send to dashboard
  const { data: business } = await supabase
    .from('businesses')
    .select('id, onboarding_completed')
    .eq('user_id', user.id)
    .single()

  if (business?.onboarding_completed) {
    redirect('/dashboard')
  }

  return (
    <div className="py-4">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-gray-900">Set up your business</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Takes about 2 minutes. We'll generate your business documents straight away.
        </p>
      </div>

      <OnboardingForm userId={user.id} />

      <p className="text-center text-xs text-gray-400 mt-8">
        Documents are generated as business templates and starting points only — not legal, financial,
        or professional advice. Always review and adapt them to your business before relying on them.
      </p>
    </div>
  )
}
