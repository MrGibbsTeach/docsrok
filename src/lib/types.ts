// Docs Rok — Core TypeScript types and constants

export type State = 'QLD' | 'NSW'

export type Plan = 'trial' | 'core' | 'plus' | 'team'
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete'

export type DocumentType =
  | 'whs_policy'
  | 'swms'
  | 'hazard_register'
  | 'incident_report'
  | 'emergency_procedures'

export type IndustryType =
  | 'residential_construction'
  | 'commercial_construction'
  | 'civil_earthworks'
  | 'electrical'
  | 'plumbing_gasfitting'
  | 'roofing'
  | 'concrete_formwork'
  | 'general_construction'

export type EmployeeRange = '1-4' | '5-10' | '11-20' | '21-50' | '50+'

// ── Constants ──────────────────────────────────────────────────

export const WORK_ACTIVITIES = [
  { key: 'working_at_heights', label: 'Working at heights' },
  { key: 'manual_handling', label: 'Manual handling and lifting operations' },
  { key: 'electrical_work', label: 'Electrical work (including switchboard work)' },
  { key: 'excavation', label: 'Excavation and trenching' },
  { key: 'concrete_cutting', label: 'Concrete cutting, coring or grinding' },
  { key: 'scaffolding', label: 'Scaffolding erection and dismantling' },
  { key: 'confined_spaces', label: 'Confined space entry' },
  { key: 'hot_work', label: 'Hot work (welding, cutting, grinding)' },
  { key: 'crane_rigging', label: 'Crane and rigging operations' },
  { key: 'demolition', label: 'Demolition work' },
] as const

export const INDUSTRY_TYPES: { value: IndustryType; label: string }[] = [
  { value: 'residential_construction', label: 'Residential construction' },
  { value: 'commercial_construction', label: 'Commercial construction / fitouts' },
  { value: 'civil_earthworks', label: 'Civil / earthworks' },
  { value: 'electrical', label: 'Electrical contracting' },
  { value: 'plumbing_gasfitting', label: 'Plumbing / gas fitting' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'concrete_formwork', label: 'Concrete / formwork' },
  { value: 'general_construction', label: 'General construction' },
]

export const EMPLOYEE_RANGES: { value: EmployeeRange; label: string }[] = [
  { value: '1-4', label: '1–4 employees' },
  { value: '5-10', label: '5–10 employees' },
  { value: '11-20', label: '11–20 employees' },
  { value: '21-50', label: '21–50 employees' },
  { value: '50+', label: '50+ employees' },
]

export const STATE_LABELS: Record<State, string> = {
  QLD: 'Queensland',
  NSW: 'New South Wales',
}

export const STATE_WHS_ACT: Record<State, string> = {
  QLD: 'Work Health and Safety Act 2011 (Qld)',
  NSW: 'Work Health and Safety Act 2011 (NSW)',
}

export const PLAN_LABELS: Record<Plan, string> = {
  trial: 'Free Trial',
  core: 'Core',
  plus: 'Plus',
  team: 'Team',
}

export const PLAN_PRICES: Record<Exclude<Plan, 'trial'>, number> = {
  core: 89,
  plus: 149,
  team: 249,
}

// Documents included in each plan
export const DOCUMENT_LABELS: Record<DocumentType, string> = {
  whs_policy: 'WHS Policy',
  swms: 'Safe Work Method Statement (SWMS)',
  hazard_register: 'Hazard Register',
  incident_report: 'Incident Report Form',
  emergency_procedures: 'Emergency Procedures',
}

// ── Database types ──────────────────────────────────────────────

export interface Profile {
  id: string
  email: string
  full_name: string | null
  created_at: string
  updated_at: string
}

export interface Business {
  id: string
  user_id: string
  name: string
  abn: string | null
  address: string | null
  state: State
  industry_type: IndustryType
  employee_count_range: EmployeeRange
  whs_responsible_name: string | null
  whs_responsible_role: string | null
  work_activities: string[]
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan: Plan
  status: SubscriptionStatus
  trial_ends_at: string | null
  current_period_end: string | null
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  business_id: string
  user_id: string
  type: DocumentType
  title: string
  content: Record<string, unknown>
  activity_key: string | null
  state: State
  regulatory_citation: string
  pdf_storage_path: string | null
  version: number
  is_current: boolean
  created_at: string
}

// ── Form types ──────────────────────────────────────────────────

export interface OnboardingFormData {
  // Step 1: Business details
  businessName: string
  abn: string
  address: string
  // Step 2: State & industry
  state: State | ''
  industryType: IndustryType | ''
  // Step 3: Size & WHS contact
  employeeRange: EmployeeRange | ''
  whsResponsibleName: string
  whsResponsibleRole: string
  // Step 4: Work activities
  workActivities: string[]
}

export const INITIAL_ONBOARDING_DATA: OnboardingFormData = {
  businessName: '',
  abn: '',
  address: '',
  state: '',
  industryType: '',
  employeeRange: '',
  whsResponsibleName: '',
  whsResponsibleRole: '',
  workActivities: [],
}
