// Docs Rok — Core TypeScript types and constants

// PIVOT (14 July 2026): the market is every Australian state and territory.
// The landing page advertises "any Australian state" in four places; this type,
// STATE_LABELS, the onboarding picker and the database CHECK constraints all
// had to be widened to match, otherwise anyone outside QLD/NSW cannot sign up.
export type State = 'QLD' | 'NSW' | 'VIC' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT'

export type Plan = 'trial' | 'core' | 'plus' | 'team'
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete'

// PIVOT (14 July 2026): retired from the live product — see Business-Plan-Trades-Docs-Pivot.md.
// Kept here (not deleted) in case a future, professionally-gated re-entry into compliance
// documents is ever revisited. Not reachable from the current UI/API.
export type LegacyDocumentType =
  | 'whs_policy'
  | 'swms'
  | 'hazard_register'
  | 'incident_report'
  | 'emergency_procedures'

export type DocumentType =
  | 'sop'
  | 'subcontractor_pack'
  | 'quote_template'
  | 'business_policy'

export type IndustryType =
  | 'residential_construction'
  | 'commercial_construction'
  | 'civil_earthworks'
  | 'electrical'
  | 'plumbing_gasfitting'
  | 'roofing'
  | 'concrete_formwork'
  | 'general_construction'
  | 'carpentry'
  | 'landscaping'
  | 'painting_decorating'
  | 'cleaning_services'
  | 'handyman_general_repairs'

export type EmployeeRange = '1-4' | '5-10' | '11-20' | '21-50' | '50+'

// ── Constants ──────────────────────────────────────────────────

// PIVOT (14 July 2026): this list now describes SERVICES OFFERED (used as descriptive
// context in generated documents), not WHS/SWMS activities. The field name
// `work_activities` is unchanged at the data layer to avoid a database migration.
export const WORK_ACTIVITIES = [
  { key: 'installations', label: 'New installations' },
  { key: 'repairs_and_maintenance', label: 'Repairs and maintenance' },
  { key: 'renovations', label: 'Renovations and fit-outs' },
  { key: 'new_builds', label: 'New builds' },
  { key: 'servicing', label: 'Scheduled servicing' },
  { key: 'emergency_callouts', label: 'Emergency call-outs' },
  { key: 'inspections_and_quotes', label: 'Inspections and quotes' },
  { key: 'design_consultation', label: 'Design and consultation' },
  { key: 'commercial_contracts', label: 'Commercial contracts' },
  { key: 'residential_contracts', label: 'Residential contracts' },
] as const

// New document-type sub-categories (replace the old SWMS-activity selection model).
// A customer picks one of these when generating a specific SOP, quote template, or policy
// from the dashboard — mirrors how SWMS activities used to work, but per new document type.
export const PROCESS_TYPES = [
  { key: 'job_intake_and_quoting', label: 'Job intake and quoting' },
  { key: 'scheduling_and_dispatch', label: 'Scheduling and dispatch' },
  { key: 'on_site_quality_control', label: 'On-site quality control' },
  { key: 'customer_handover', label: 'Customer handover' },
  { key: 'invoicing_and_payment', label: 'Invoicing and payment' },
  { key: 'complaint_handling', label: 'Complaint handling' },
  { key: 'subcontractor_onboarding', label: 'Subcontractor onboarding' },
  { key: 'equipment_and_vehicle_care', label: 'Equipment and vehicle care' },
] as const

export const POLICY_TYPES = [
  { key: 'customer_service_policy', label: 'Customer service policy' },
  { key: 'complaints_handling_procedure', label: 'Complaints handling procedure' },
  { key: 'terms_of_trade', label: 'Terms of trade' },
  { key: 'cancellation_and_refund_policy', label: 'Cancellation and refund policy' },
  { key: 'code_of_conduct', label: 'Code of conduct' },
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
  { value: 'carpentry', label: 'Carpentry' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'painting_decorating', label: 'Painting / decorating' },
  { value: 'cleaning_services', label: 'Cleaning services' },
  { value: 'handyman_general_repairs', label: 'Handyman / general repairs' },
]

export const EMPLOYEE_RANGES: { value: EmployeeRange; label: string }[] = [
  { value: '1-4', label: '1–4 employees' },
  { value: '5-10', label: '5–10 employees' },
  { value: '11-20', label: '11–20 employees' },
  { value: '21-50', label: '21–50 employees' },
  { value: '50+', label: '50+ employees' },
]

export const STATES: State[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']

export const STATE_LABELS: Record<State, string> = {
  NSW: 'New South Wales',
  VIC: 'Victoria',
  QLD: 'Queensland',
  WA: 'Western Australia',
  SA: 'South Australia',
  TAS: 'Tasmania',
  ACT: 'Australian Capital Territory',
  NT: 'Northern Territory',
}

// LEGACY (pre-pivot WHS documents only, unreachable from the current UI).
// Deliberately partial: the live product's documents are not tied to state
// legislation, so there is nothing to add here for the other states.
export const STATE_WHS_ACT: Partial<Record<State, string>> = {
  QLD: 'Work Health and Safety Act 2011 (Qld)',
  NSW: 'Work Health and Safety Act 2011 (NSW)',
}

// PIVOT (7 Sept 2026): moved from a 14-day timed trial + $79/mo subscription to a
// permanent free tier + one-time purchase. 'trial'/'core' are kept as the underlying
// plan values (no DB enum migration needed) but now mean "free" and "paid" respectively.
// A subscription row with status='active' is what "paid" means everywhere in the app —
// see isPaid checks in the dashboard and documents/generate route.
export const PLAN_LABELS: Record<Plan, string> = {
  trial: 'Free',
  core: 'Full Access',
  plus: 'Full Access',
  team: 'Full Access',
}

// core is now a one-time AUD price, not monthly. plus/team are unused by the
// current UI (kept only so this type doesn't need every call site touched).
export const PLAN_PRICES: Record<Exclude<Plan, 'trial'>, number> = {
  core: 149,
  plus: 149,
  team: 149,
}

// The free tier includes exactly one SOP and one quote template, chosen to be
// the single most useful document in each category. Everything else — the
// remaining 7 SOPs, subcontractor pack, other quote templates, and all 5
// policies — is unlocked by the one-time $149 purchase.
export const FREE_SOP_KEY = 'job_intake_and_quoting' as const

// Documents included in each plan
export const DOCUMENT_LABELS: Record<DocumentType, string> = {
  sop: 'Standard Operating Procedure (SOP)',
  subcontractor_pack: 'Subcontractor & New-Hire Welcome Pack',
  quote_template: 'Quote / Proposal Template',
  business_policy: 'Business Policy Document',
}

// Kept for any legacy data — not shown in the active UI.
export const LEGACY_DOCUMENT_LABELS: Record<LegacyDocumentType, string> = {
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
