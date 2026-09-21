// Content for the /resources SEO pages: one per trade x state combination
// decided in the Sept 2026 strategic review. Kept as plain data (no MDX/CMS
// dependency) so the pages are ordinary statically-generated Next.js routes.
//
// Trades and states match the exact values in INDUSTRY_TYPES / STATES
// (src/lib/types.ts) so links from these pages into the signup flow can
// pre-fill the right onboarding fields later if that's ever wired up.

export type ResourcePage = {
  slug: string
  industryValue: string
  tradeLabel: string
  tradeSearchTerm: string
  state: string
  stateLabel: string
  regulator: string
  painPoint: string
  scenario: string
  marketNote: string
}

const TRADES = [
  {
    industryValue: 'electrical',
    tradeLabel: 'Electricians',
    tradeSearchTerm: 'electrician',
    painPoint:
      "Most electrical contractors quote jobs from memory or a half-finished spreadsheet, so pricing looks different from one job to the next and clients have nothing professional to compare against a bigger competitor's quote.",
    scenario:
      "the second an apprentice or a subbie joins the van, there's nothing written down about how call-outs get logged, how variations get approved, or what the client actually signed up for.",
  },
  {
    industryValue: 'plumbing_gasfitting',
    tradeLabel: 'Plumbers',
    tradeSearchTerm: 'plumber',
    painPoint:
      'Emergency call-outs mean quotes often happen verbally on-site or scrawled on the back of an invoice book, which makes it hard to invoice consistently and impossible to hand the business to anyone else to run for a week.',
    scenario:
      'bringing on a second crew for overflow work usually means two different ways of doing the same job, because nothing about job intake, scheduling, or invoicing was ever written down in the first place.',
  },
  {
    industryValue: 'general_construction',
    tradeLabel: 'Builders',
    tradeSearchTerm: 'builder',
    painPoint:
      'Bigger jobs mean more subcontractors on site at once, and without a standard welcome pack each one gets a different verbal briefing on site rules, payment terms, and what happens if a variation comes up.',
    scenario:
      "a client comparing three builders for a renovation notices immediately which one turned up with a proper proposal document and which one text messaged a price.",
  },
] as const

const STATES = [
  {
    state: 'NSW',
    stateLabel: 'New South Wales',
    regulator: 'NSW Fair Trading',
    marketNote:
      "NSW is the country's largest trade market, which cuts both ways: more work, but more businesses for a client to compare you against.",
  },
  {
    state: 'VIC',
    stateLabel: 'Victoria',
    regulator: 'the Victorian Building Authority',
    marketNote:
      "Melbourne's outer growth corridors keep new-build and renovation work steady, and a lot of that work goes to whichever business looks the most organised on paper.",
  },
  {
    state: 'WA',
    stateLabel: 'Western Australia',
    regulator: 'Building and Energy WA',
    marketNote:
      "Perth's building boom has plenty of small trade businesses running lean with no office staff at all, which is exactly where paperwork this fast saves the most relative time.",
  },
] as const

// WA's regulator (Building and Energy, under DMIRS) covers plumbing licensing
// too post-merger; electricians and builders in WA share the same reference.
// Kept as a single override so the loop below doesn't need per-trade branching.
const WA_PLUMBING_REGULATOR = 'Building and Energy WA'

export const RESOURCE_PAGES: ResourcePage[] = TRADES.flatMap((trade) =>
  STATES.map((s) => ({
    slug: `${trade.tradeSearchTerm}-templates-${s.state.toLowerCase()}`,
    industryValue: trade.industryValue,
    tradeLabel: trade.tradeLabel,
    tradeSearchTerm: trade.tradeSearchTerm,
    state: s.state,
    stateLabel: s.stateLabel,
    regulator:
      s.state === 'WA' && trade.industryValue === 'plumbing_gasfitting'
        ? WA_PLUMBING_REGULATOR
        : s.regulator,
    painPoint: trade.painPoint,
    scenario: trade.scenario,
    marketNote: s.marketNote,
  }))
)

export function getResourcePage(slug: string): ResourcePage | undefined {
  return RESOURCE_PAGES.find((p) => p.slug === slug)
}
