export type StateCode = 'QLD' | 'NSW' | 'NZ'

export const REGULATORY: Record<StateCode, {
  act: string
  regulation: string
  citation: string
  regulator: string
  regulator_url: string
  regulator_phone: string
}> = {
  QLD: {
    act: 'Work Health and Safety Act 2011 (Qld)',
    regulation: 'Work Health and Safety Regulation 2011 (Qld)',
    citation: 'Work Health and Safety Act 2011 (Qld) · WHS Regulation 2011 (Qld)',
    regulator: 'Workplace Health and Safety Queensland (WHSQ)',
    regulator_url: 'worksafe.qld.gov.au',
    regulator_phone: '1300 362 128',
  },
  NSW: {
    act: 'Work Health and Safety Act 2011 (NSW)',
    regulation: 'Work Health and Safety Regulation 2025 (NSW)',
    citation: 'Work Health and Safety Act 2011 (NSW) · WHS Regulation 2025 (NSW)',
    regulator: 'SafeWork NSW',
    regulator_url: 'safework.nsw.gov.au',
    regulator_phone: '13 10 50',
  },
  // NZ jurisdiction — not yet exposed in UI (types.ts State / OnboardingForm still QLD|NSW only).
  // NZ prompts also require non-citation changes (000→111, ABN→NZBN, SWMS→Task Analysis/SSSP framing) —
  // see D:\OneDrive\Personal\Work\DocsRok\regulatory-reference\markets\nz-prompt-changes.md
  NZ: {
    act: 'Health and Safety at Work Act 2015 (NZ)',
    regulation: 'Health and Safety at Work (General Risk and Workplace Management) Regulations 2016 (NZ)',
    citation: 'Health and Safety at Work Act 2015 (NZ) · GRWM Regulations 2016 (NZ)',
    regulator: 'WorkSafe New Zealand',
    regulator_url: 'worksafe.govt.nz',
    regulator_phone: '0800 030 040',
  },
}
