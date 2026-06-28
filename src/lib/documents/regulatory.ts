export type StateCode = 'QLD' | 'NSW'

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
    regulation: 'Work Health and Safety Regulation 2017 (NSW)',
    citation: 'Work Health and Safety Act 2011 (NSW) · WHS Regulation 2017 (NSW)',
    regulator: 'SafeWork NSW',
    regulator_url: 'safework.nsw.gov.au',
    regulator_phone: '13 10 50',
  },
}
