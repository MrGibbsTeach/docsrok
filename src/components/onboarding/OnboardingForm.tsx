'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  WORK_ACTIVITIES,
  INDUSTRY_TYPES,
  EMPLOYEE_RANGES,
  STATE_LABELS,
  STATES,
  type OnboardingFormData,
  type IndustryType,
  type EmployeeRange,
  INITIAL_ONBOARDING_DATA,
} from '@/lib/types'

const TOTAL_STEPS = 4

const STEP_TITLES = [
  'Your business',
  'State & trade',
  'Size & main contact',
  'Services offered',
]

// ── Step components ───────────────────────────────────────────

function Step1Business({
  data,
  onChange,
}: {
  data: OnboardingFormData
  onChange: (updates: Partial<OnboardingFormData>) => void
}) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Business name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={data.businessName}
          onChange={(e) => onChange({ businessName: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Smith Building & Construction"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ABN{' '}
          <span className="text-gray-400 font-normal">(optional — appears on document headers)</span>
        </label>
        <input
          type="text"
          value={data.abn}
          onChange={(e) => onChange({ abn: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="12 345 678 901"
          maxLength={14}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Business address{' '}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={data.address}
          onChange={(e) => onChange({ address: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="123 Main St, Brisbane QLD 4000"
        />
      </div>
    </div>
  )
}

function Step2StateIndustry({
  data,
  onChange,
}: {
  data: OnboardingFormData
  onChange: (updates: Partial<OnboardingFormData>) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          State <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Used to personalise your documents to your state.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STATES.map((state) => (
            <button
              key={state}
              type="button"
              onClick={() => onChange({ state })}
              className={`p-3 rounded-lg border-2 text-left transition-colors ${
                data.state === state
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="font-semibold text-gray-900">{state}</div>
              <div className="text-xs text-gray-500 mt-0.5">{STATE_LABELS[state]}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Trade / service type <span className="text-red-500">*</span>
        </label>
        <select
          required
          value={data.industryType}
          onChange={(e) => onChange({ industryType: e.target.value as IndustryType })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
        >
          <option value="">Select your trade / service type…</option>
          {INDUSTRY_TYPES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

function Step3SizeContact({
  data,
  onChange,
}: {
  data: OnboardingFormData
  onChange: (updates: Partial<OnboardingFormData>) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of employees <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {EMPLOYEE_RANGES.map(({ value, label }) => (
            <label
              key={value}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                data.employeeRange === value
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="employeeRange"
                value={value}
                checked={data.employeeRange === value}
                onChange={() => onChange({ employeeRange: value as EmployeeRange })}
                className="text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm font-medium text-gray-900">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">
          Primary contact{' '}
          <span className="text-gray-400 font-normal">(appears on your documents)</span>
        </h3>

        <div>
          <label className="block text-xs text-gray-600 mb-1">Full name</label>
          <input
            type="text"
            value={data.whsResponsibleName}
            onChange={(e) => onChange({ whsResponsibleName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Jane Smith"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1">Role / position</label>
          <input
            type="text"
            value={data.whsResponsibleRole}
            onChange={(e) => onChange({ whsResponsibleRole: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Owner / Director / Site Manager"
          />
        </div>
      </div>
    </div>
  )
}

function Step4Activities({
  data,
  onChange,
}: {
  data: OnboardingFormData
  onChange: (updates: Partial<OnboardingFormData>) => void
}) {
  function toggleActivity(key: string) {
    const current = data.workActivities
    const updated = current.includes(key)
      ? current.filter((k) => k !== key)
      : [...current, key]
    onChange({ workActivities: updated })
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-600">
          Select all services your business regularly offers. This helps us tailor your SOPs,
          quotes, and business documents to your work.
        </p>
        <p className="text-xs text-gray-400 mt-1">Select at least one.</p>
      </div>

      <div className="space-y-2">
        {WORK_ACTIVITIES.map(({ key, label }) => {
          const checked = data.workActivities.includes(key)
          return (
            <label
              key={key}
              className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                checked
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleActivity(key)}
                className="rounded text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-900">{label}</span>
            </label>
          )
        })}
      </div>

      {data.workActivities.length > 0 && (
        <p className="text-xs text-orange-600 font-medium">
          {data.workActivities.length} service{data.workActivities.length === 1 ? '' : 's'} selected
        </p>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────

export default function OnboardingForm({ userId }: { userId: string }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<OnboardingFormData>(INITIAL_ONBOARDING_DATA)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function updateFormData(updates: Partial<OnboardingFormData>) {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  function isStepValid(): boolean {
    switch (step) {
      case 1:
        return formData.businessName.trim().length > 0
      case 2:
        return formData.state !== '' && formData.industryType !== ''
      case 3:
        return formData.employeeRange !== ''
      case 4:
        return formData.workActivities.length > 0
      default:
        return false
    }
  }

  function handleNext() {
    if (isStepValid() && step < TOTAL_STEPS) {
      setStep((s) => s + 1)
    }
  }

  function handleBack() {
    if (step > 1) setStep((s) => s - 1)
  }

  async function handleSubmit() {
    if (!isStepValid()) return
    setSubmitting(true)
    setError(null)

    const supabase = createClient()

    const { error: dbError } = await supabase.from('businesses').insert({
      user_id: userId,
      name: formData.businessName.trim(),
      abn: formData.abn.trim() || null,
      address: formData.address.trim() || null,
      state: formData.state,
      industry_type: formData.industryType,
      employee_count_range: formData.employeeRange,
      whs_responsible_name: formData.whsResponsibleName.trim() || null,
      whs_responsible_role: formData.whsResponsibleRole.trim() || null,
      work_activities: formData.workActivities,
      onboarding_completed: true,
    })

    if (dbError) {
      setError(`Error: ${dbError.message} (code: ${dbError.code})`)
      setSubmitting(false)
      return
    }

    // Fire document generation — don't await, let it run while user sees dashboard
    // keepalive so the request is not cancelled if the user navigates away
    // or closes the tab before generation finishes.
    fetch('/api/documents/generate', { method: 'POST', keepalive: true }).catch(console.error)

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {step} of {TOTAL_STEPS} — {STEP_TITLES[step - 1]}
          </span>
          <span className="text-sm text-gray-400">
            {Math.round((step / TOTAL_STEPS) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {STEP_TITLES[step - 1]}
        </h2>

        {step === 1 && <Step1Business data={formData} onChange={updateFormData} />}
        {step === 2 && <Step2StateIndustry data={formData} onChange={updateFormData} />}
        {step === 3 && <Step3SizeContact data={formData} onChange={updateFormData} />}
        {step === 4 && <Step4Activities data={formData} onChange={updateFormData} />}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-2.5 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex-1 bg-orange-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isStepValid() || submitting}
              className="flex-1 bg-orange-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Saving…' : 'Generate my documents →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
