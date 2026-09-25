import { ClipboardList, HardHat, Receipt, BookText, type LucideIcon } from 'lucide-react'

export interface DocumentType {
  icon: LucideIcon
  name: string
  shortName: string
  desc: string
}

// The four document types Docs Rok generates, with one icon each shared
// between the homepage and every /resources/<trade>-<state> page, so the
// icon-to-document mapping can't drift between pages the way copy-pasted
// emoji did.
export const DOCUMENT_TYPES: DocumentType[] = [
  {
    icon: ClipboardList,
    shortName: 'SOPs',
    name: 'Standard Operating Procedures',
    desc: 'For the processes that keep your business running the same way every time — job intake and quoting, scheduling, quality control, invoicing, complaint handling, and more.',
  },
  {
    icon: HardHat,
    shortName: 'Welcome packs',
    name: 'Subcontractor & New-Hire Welcome Packs',
    desc: 'A clear welcome pack covering expectations, site protocols, communication, and payment terms — so new subbies and staff get up to speed faster.',
  },
  {
    icon: Receipt,
    shortName: 'Quote templates',
    name: 'Quote & Proposal Templates',
    desc: 'A polished, reusable quote structure for each type of job you do — scope, inclusions/exclusions, pricing table, terms, and acceptance block.',
  },
  {
    icon: BookText,
    shortName: 'Policies',
    name: 'Business Policy Documents',
    desc: 'Customer service policy, complaints handling, terms of trade, cancellation and refund policy, and code of conduct — all in plain business English.',
  },
]
