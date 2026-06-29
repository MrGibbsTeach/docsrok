import { REGULATORY, type StateCode } from './regulatory'

interface BusinessContext {
  name: string
  abn: string | null
  address: string | null
  state: StateCode
  industry_type: string
  employee_count_range: string
  whs_responsible_name: string | null
  whs_responsible_role: string | null
  work_activities: string[]
}

function fmt(str: string) {
  return str.replace(/_/g, ' ')
}

function currentMonth() {
  return new Date().toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })
}

function nextYear() {
  return new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-AU', {
    month: 'long',
    year: 'numeric',
  })
}

function whsPerson(b: BusinessContext) {
  if (b.whs_responsible_name) {
    return b.whs_responsible_role
      ? `${b.whs_responsible_name} (${b.whs_responsible_role})`
      : b.whs_responsible_name
  }
  return 'The designated WHS officer'
}

// ── WHS Policy ────────────────────────────────────────────────

export function buildWhsPolicyPrompt(b: BusinessContext): string {
  const reg = REGULATORY[b.state]
  return `You are a professional WHS consultant in Australia with deep expertise in construction safety law. Generate a complete, formal WHS Policy document.

BUSINESS DETAILS:
- Name: ${b.name}
- ABN: ${b.abn ?? 'Not provided'}
- Address: ${b.address ?? 'Not provided'}
- Industry: ${fmt(b.industry_type)}
- Employees: ${b.employee_count_range}
- WHS responsible person: ${whsPerson(b)}
- State: ${b.state}
- Legislation: ${reg.act} and ${reg.regulation}
- Regulator: ${reg.regulator} — ${reg.regulator_phone}

Generate a professional WHS Policy in markdown. Include every section below — write real content, not placeholders.

# Work Health and Safety Policy
## ${b.name}
**Version:** 1.0 | **Date:** ${currentMonth()} | **Review date:** ${nextYear()} | **Document owner:** ${whsPerson(b)}

### 1. Policy Statement
Formal commitment from ${b.name} management to health and safety. Reference ${reg.act}. Specific to ${fmt(b.industry_type)} risks.

### 2. Scope
Who this policy covers: employees, subcontractors, labour hire, visitors, on all work sites and premises operated by ${b.name}.

### 3. Legislative Framework
The primary duty of care under s.19 of ${reg.act} — what a PCBU must do so far as is reasonably practicable. s.18 definition of reasonably practicable. The WHS Regulation specifies duties for particular hazards (Part 3.1 WHS management plans, Part 6 construction work, and activity-specific duties).

Safe Work Australia Codes of Practice have legal status — although not law, courts treat compliance with a Code as evidence of meeting the WHS duty of care. ${b.name} operates under the following relevant Codes of Practice: Construction Work · Managing the Risk of Falls at Workplaces · Work in Confined Spaces · Hazardous Manual Tasks · Managing Noise and Preventing Hearing Loss at Work · Labelling of Workplace Hazardous Chemicals · First Aid in the Workplace · Managing Psychosocial Hazards at Work.

### 4. Management Responsibilities
Specific duties of ${whsPerson(b)} and all managers: providing safe plant and systems, hazard-free workplaces, adequate information/training/instruction/supervision, consultation obligations. Reference specific Act sections.

### 5. Worker Responsibilities
Duties under the Act: take reasonable care of own health and safety and others, comply with lawful instructions, not interfere with or misuse safety equipment, report hazards and incidents.

### 6. Consultation and Participation
How ${b.name} meets consultation obligations — toolbox talks, pre-start meetings, hazard reporting channels, health and safety representative (HSR) rights, issue resolution procedure under the Act.

### 7. Hazard Identification and Risk Management
Systematic four-step process: identify → assess → control → review. Hierarchy of controls (eliminate, substitute, isolate, engineer, administrative, PPE) applied to ${fmt(b.industry_type)} hazards. Reference risk register.

### 8. Training and Competency
Site induction requirements, White Card (General Construction Induction), trade licences, plant operator licences, WHS induction for visitors and subcontractors, records of training.

### 9. Incident Reporting and Investigation
How to report: near misses, first aid, medical treatment, lost time, dangerous incidents. Notifiable incidents — obligation to notify ${reg.regulator} at ${reg.regulator_phone} immediately and preserve the scene. Root cause investigation within 48 hours.

### 10. Emergency Preparedness
Reference to Emergency Procedures document. Evacuation assembly points, emergency warden roles, first aid officers, testing frequency.

### 11. Subcontractor and Visitor Management
Pre-qualification of subcontractors, site induction requirements, ongoing monitoring, SWMS review and sign-off.

### 12. Psychosocial Hazard Management
${b.name} recognises its duty under ${reg.act} to manage psychosocial hazards — risks arising from work design, work environment, or workplace interactions that can cause psychological harm.

Psychosocial hazards include: excessive workload or work demands, lack of role clarity, poor support from supervisors or colleagues, low job control, workplace bullying, harassment, and violence, exposure to traumatic events, and poor workplace relationships.

In ${b.state}, this obligation is reinforced by specific psychosocial risk regulations${b.state === 'NSW' ? ' (WHS Regulation 2025 (NSW) Part 3.7A, in effect since September 2022)' : b.state === 'QLD' ? ' (WHS Regulation 2011 (Qld) Part 5.1A, effective April 2023)' : ''}.

${whsPerson(b)} is responsible for: conducting psychosocial risk assessments, implementing controls using the hierarchy of controls, establishing a reporting pathway for psychological health concerns, and reviewing controls after any reported incident.

Workers experiencing psychological harm at work should report to ${whsPerson(b)} without fear of reprisal. External support: Employee Assistance Program (EAP) [to be arranged] and Beyond Blue: 1300 22 4636.

### 13. Document Control and Review
Annual review by ${whsPerson(b)}, earlier review triggers (legislative change, significant incident, business change). Version control. Document storage location.

### 14. Authorisation
This policy is endorsed by ${b.name} management.

| Role | Name | Signature | Date |
|------|------|-----------|------|
| ${b.whs_responsible_role ?? 'Director / Owner'} | ${b.whs_responsible_name ?? '_______________'} | | ${currentMonth()} |
| Worker Representative | _______________ | | ${currentMonth()} |

---
*${b.name} is committed to continuous improvement in work health and safety. This policy should be read in conjunction with all SWMS, the Hazard Register, and Emergency Procedures.*

Write 1,100–1,500 words. Professional Australian English. Do not use placeholder text — all content must be complete and usable.`
}

// ── SWMS ─────────────────────────────────────────────────────

// Keys must match WORK_ACTIVITIES keys in src/lib/types.ts exactly
const ACTIVITY_GUIDANCE: Record<string, string> = {
  working_at_heights:
    'Falls from height are the #1 cause of construction fatalities. The WHS Regulation (s.78, both QLD and NSW) requires fall prevention for any work at a height of 2 metres or more. Work involving a fall risk >2m is High Risk Construction Work (HRCW) — a SWMS is mandatory. Hierarchy of fall controls: (1) carry out work at ground level; (2) work from solid construction (fixed platforms/stairways/walkways — AS 1657:2018); (3) fall prevention devices (passive collective controls — edge protection, roof safety mesh, covers); (4) harness-based systems (fall arrest is last resort). Edge protection: comply with AS/NZS 4994.1:2023 (general requirements) and AS/NZS 4994.2:2023 (installation and dismantling); maintain minimum 3-metre no-go zone from any unprotected edge on flat trafficable roofs. Covers over penetrations/openings/skylights: must withstand 2 kN concentrated load; securely fixed; visually distinctive from surrounding materials. Roof safety mesh: AS/NZS 4389:2015; prefer full-length gutter-to-gutter mesh (avoids failure at lap joints); competent person must inspect existing mesh before relying on it as a control measure. Scaffolding: erect/alter/dismantle requires HRW scaffolding licence (SB/SI/SA); scaffolds where fall risk >4m must be inspected and have a written handover certificate from a competent person before non-scaffolders access; duty ratings must not be exceeded. EWPs: operator competency required; rescue plan in place. Harness-based systems — use only when it is not reasonably practicable to prevent falls with passive controls: equipment must comply with AS/NZS 1891.1:2020 and AS/NZS 1891.4:2025; limited free fall ≤600mm; free fall arrest ≤2m (AS standards not designed for >2m free fall); anchor points verified by competent person as capable of withstanding fall-arrest loads; anchor level with or above harness attachment point to minimise free fall distance. Self-retracting lifelines (SRLs): standard SRLs are anchored above user; Leading Edge (LE) SRLs required for horizontal/foot-level applications. Horizontal lifelines: AS/NZS 1891.2:2001. Catch platforms: extend ≥2m beyond unprotected edges; position ≤1m below unprotected edge. Safety nets: position ≤2m below working area. Emergency rescue: rescue plan is mandatory before harness-based systems are used; at least one other trained person on site must be able to rescue a suspended worker; tested procedures in place. Ladder safety: ladders are access only — not a working platform for sustained tasks. Roof inspections: for existing roofs, a competent person must inspect before work commences — assess mesh integrity, structural condition, fragility, asbestos, skylights, and other hazards. NSW roof work (commercial and industrial buildings only): Code of Practice: Work on Roofs — commercial and industrial buildings (May 2026) under WHS Regulation 2025 (NSW). NOTE: this CoP does not apply to residential housing — for residential, apply Code of Practice: Managing the risk of falls in housing construction. General reference: Code of Practice: Managing the Risk of Falls at Workplaces (QLD 2021; NSW Aug 2019). Also reference Construction Work CoP for SWMS requirements and scaffold handover certificates.',
  manual_handling:
    'Cover: pre-task risk assessment of each manual task (force required, posture, duration, environment) — there is no legal weight limit under Australian WHS law; the obligation is to assess and control the risk for each task. Use of mechanical aids (pallet jacks, hoists, trolleys, forklifts) as the preferred control. Team lifts when mechanical aids unavailable. Ergonomic posture, WMSD (work-related musculoskeletal disorder) prevention, push/pull risk assessment. Reference Safe Work Australia Code of Practice: Hazardous Manual Tasks.',
  electrical_work:
    'Cover: isolation and lockout/tagout (LOTO) procedures, test-before-touch, working near live parts (exclusion zones), licensed electrician requirements, RCDs (residual current devices), underground/overhead service identification, electrical licence classes.',
  excavation:
    'Cover: Dial Before You Dig, shoring/battering/benching requirements for trench depth, engulfment/burial risks, gas and utility detection, trench entry/exit points, ground conditions, surcharge loads, water ingress, confined space overlap.',
  concrete_cutting:
    'Cover: crystalline silica dust controls — any material containing ≥1% crystalline silica is a Crystalline Silica Substance (CSS). The workplace exposure standard for respirable crystalline silica (RCS) is 0.05 mg/m³ as an 8-hour TWA (reduced from 0.1 mg/m³ in 2020). From 1 December 2026 this WES is renamed to Workplace Exposure Limit (WEL) — value unchanged. Controlled processing of a CSS must implement at least one of: (1) isolation of workers from dust exposure, (2) enclosed operator cabin with HEPA air filtration, (3) effective wet dust suppression — water delivered to the cutting point, (4) effective on-tool extraction, (5) effective local exhaust ventilation (LEV). Where none of these is reasonably practicable, P2 RPE alone may satisfy controlled processing — must be documented. Wet cutting: slurry is wet waste — contain and dispose as hazardous waste, do not dry-sweep or wash to stormwater/drains. Dry cutting/grinding: must use M-class or H-class industrial vacuum cleaner (compliant with AS/NZS 60335.2.69:2017) — standard vacuums recirculate fine RCS particles. Inverted cutting (overhead work): must NOT use handheld electric saws — only IP-rated hydraulic, pneumatic or petrol-powered saws are permitted (electric saw cooling fans draw dust into motor and expel it into the operator\'s breathing zone). RPE: P2 particulate filter minimum; AS/NZS 1716:2012 and AS/NZS 1715:2009; fit testing required for all close-fitting half-facepiece and full-facepiece respirators — bearded workers cannot use close-fitting RPE and must use PAPR or loose-fitting hood. Silica worker register: from 1 October 2025, PCBUs must register workers performing high-risk CSS processing with their state regulator (SafeWork NSW or WHSQ) within 28 days of commencing such work (Part 8A.4 WHS Regulation 2025 NSW; equivalent QLD duty). High-risk CSS processing determination: assess 7 factors — specific processing, forms of silica, silica proportion, frequency/duration, whether RCS is reasonably likely to exceed half the WES (0.025 mg/m³), previous air monitoring results, previous incidents/illnesses. If high risk: requires (1) Silica risk control plan, or SWMS covering all plan content for HRCW; (2) nationally accredited crystalline silica training; (3) air monitoring; (4) health monitoring; (5) silica worker register. Engineered stone ban: from 1 July 2024, benchtops, slabs and panels containing ≥1% crystalline silica are banned from supply, installation or importation. Noise: exposure standard 85 dB(A) TWA / 140 dB(C) peak. HAVS: hand-arm vibration action value 2.5 m/s² A(8). Blade safety: correct blade for material, guards fitted, speed ratings matched. NSW references: Code of Practice: Working safely when cutting, drilling and grinding concrete (May 2026) under WHS Regulation 2025 (NSW); Code of Practice: Managing risks of respirable crystalline silica in the workplace (February 2026). QLD reference: Code of Practice: Managing respirable crystalline silica dust (construction) (May 2023) under WHS Regulation 2011 (Qld).',
  scaffolding:
    'Cover: High Risk Work (HRW) scaffolding licence requirements — Basic scaffolding (SB licence, systems/tube and coupler ≤4m), Intermediate scaffolding (SI licence, including suspended, cantilevered), Advanced scaffolding (SA licence, complex structures). Load limits — design load vs working load, never exceed design. Bracing and tying to structure at specified intervals. Working platforms minimum 450 mm width (AS/NZS 4576), planks secured, no gaps >25 mm. Handover inspection by competent person before use — green tag system. Exclusion zones during erection/dismantling (1.5× height or falling object distance, whichever greater). Reference Safe Work Australia Code of Practice: Construction Work.',
  confined_spaces:
    'Cover: confined space register and entry permit system, atmospheric testing (O2 ≥19.5% and ≤23.5%, LEL <10%, CO <25 ppm, H2S <1 ppm — specify these values), standby person requirements (trained, stationed outside, in constant communication), rescue plan and equipment (non-entry rescue preferred — describe tripod/harness retrieval), isolation of all services (LOTO — lock, tag, and test zero energy), forced ventilation (continuous monitoring, not just initial test), competency requirements for entry controller and entrants. Reference Safe Work Australia Code of Practice: Work in Confined Spaces.',
  hot_work:
    'Cover: hot work permit system, 10-metre combustible material clearance, fire watch (during and 30 minutes post), fire extinguisher types and placement, UV/IR eye protection, fume and gas controls (LEV, RPE selection), spontaneous combustion risk.',
  crane_rigging:
    'Cover: High Risk Work (HRW) licence classes — DG (Dogging), RI/RB/RA (Rigging Basic/Intermediate/Advanced), CN/CO/CB/CA/CV (Crane operator classes). Design registration: cranes with rated capacity >10 tonnes must be registered (WHS Reg s.243 QLD; equivalent NSW requirement) — verify registration currency and design registration before each use. Lift planning — site-specific comprehensive documented lifting procedures are required (not generic) for: tilt-up or spin-up panel jobs; plant recovery (overturned plant); multiple crane lifts (more than one crane lifting a load simultaneously); lifting workboxes with personnel; bridge beam installation; working near live overhead powerlines; lifting large pressure vessels or tanks; crane used for demolition; complex rigging arrangements (e.g. chain blocks to rotate suspended load); mobile cranes on barges; erection of tower cranes; heavy lifts where load is 50 tonnes or more. Site-specific plans must include: max load radius for each crane; spotter duties; load start/destination positions; max wind speed for the lift configuration; geotechnical bearing capacity verification; proximity hazard map. Load charts: gross rated capacity must be reduced by the mass of the hook block and all lifting gear to give net usable capacity. Load charts must comply with AS 1418.5 — some overseas standards (US) use less conservative factors. Rated capacity limiters: must prevent hoisting >110% of rated capacity; verify function during pre-start. Free fall feature: must be permanently de-activated on mobile cranes. Geotechnical certification: required from a geotechnical engineer before performing bridge beams (≥10t), tilt-up panels, or heavy lifts (load ≥50t); principal contractor must engage and provide results to crane crew. Ground bearing pressures: hard rock 200 t/m², compacted gravel 40 t/m², asphalt/compacted sand/stiff clay (dry) 20 t/m², loose sand/soft clay 10 t/m², wet clay <10 t/m². Outrigger timbers: minimum 200mm wide × 75mm thick; gap between timbers ≤25mm (top and bottom layers). Crane proximity to excavations: compact ground — crane support timbers must be ≥1× excavation depth from edge (1H:1V); loose or backfilled ground — ≥2× depth (2H:1V). Wind: maximum 10 m/s (36 km/h) typical — loads with large surface area (tilt-up, pressure vessels) may require lower limits calculated by engineer; anemometers required on all slewing cranes ≥45t (mandatory from 2 September 2025); cease all lifts immediately if wind exceeds limit. Communication: analog radio preferred over digital (avoids cut-off/delay risk); mobile phones must NOT be used to direct crane operations; radio loss = stop all operations; hand signals per AS 2550.1 if radio not used. Powerlines: preferred control is de-energise or re-route (arrange with electricity entity early — can take time; get written confirmation); if not practicable, maintain exclusion zone ≥3m from any part of crane/load to powerlines for voltages up to 132kV (greater distances for higher voltages); safety observer/spotter must be dedicated (no concurrent dogging duties) — spotter training unit RIIRTM203E; tiger tails are visual aids only, not insulation. Crane operator has final say on whether lift proceeds. Dogger cannot supervise trainee doggers while also operating as crane operator. SWL: weakest link in the lifting assembly governs — document WLL for every item (crane, chain blocks, slings, shackles, spreader bars). Daily pre-use inspection records required. References: QLD — Code of Practice: Mobile Crane (September 2024) under WHS Regulation 2011 (Qld). NSW — Code of Practice: Tower Cranes (July 2025) and Code of Practice: Moving Plant on Construction Sites (December 2025) under WHS Regulation 2025 (NSW).',
  demolition:
    'Cover: structural engineer\'s demolition methodology report required before commencement (mandatory for buildings >3 storeys or of complex construction). Asbestos identification and management — all pre-1990 structures assumed to contain asbestos until surveyed; Class B asbestos removal licence required for bonded asbestos (e.g., fibro sheeting) areas >10m²; Class A licence for friable asbestos — no exemption. Sequential demolition order specified by structural engineer — never deviate. Silica and dust controls (0.05 mg/m³ TWA for RCS). Falling object exclusion zones — fully enclosed scaffold or equivalent. Utility isolation sequence — gas, electricity, water, telecommunications before commencement (confirm written sign-off from each authority). Waste classification — asbestos, contaminated materials, recyclables to be segregated and disposed of per EPA requirements. Reference Safe Work Australia Code of Practice: Demolition Work.',
}

export function buildSwmsPrompt(b: BusinessContext, activityKey: string): string {
  const reg = REGULATORY[b.state]
  const activityName = fmt(activityKey)
  const guidance =
    ACTIVITY_GUIDANCE[activityKey] ??
    'Cover all relevant hazards, apply hierarchy of controls, include emergency procedures specific to this activity.'

  return `You are a professional WHS consultant in Australia. Generate a complete Safe Work Method Statement (SWMS) that would pass WorkSafe/SafeWork inspection.

BUSINESS DETAILS:
- Name: ${b.name}
- ABN: ${b.abn ?? 'Not provided'}
- State: ${b.state}
- Industry: ${fmt(b.industry_type)}
- Employees: ${b.employee_count_range}
- Legislation: ${reg.act} · ${reg.regulation}
- Regulator: ${reg.regulator} — ${reg.regulator_phone}
- WHS officer / Site supervisor: ${whsPerson(b)}
- Date: ${currentMonth()}

WORK ACTIVITY: ${activityName.toUpperCase()}
Activity guidance: ${guidance}

This SWMS is required documentation for High Risk Construction Work (HRCW) under ${reg.regulation}. A SWMS must be prepared before HRCW commences, be kept at the workplace, and be available to workers performing the work.

Generate a professional, site-ready SWMS in markdown. Every section must be complete — no placeholders.

# Safe Work Method Statement
## ${activityName.charAt(0).toUpperCase() + activityName.slice(1)}

| Field | Detail |
|-------|--------|
| Business | ${b.name} |
| Activity | ${activityName} |
| Date prepared | ${currentMonth()} |
| Version | 1.0 |
| Prepared by | ${whsPerson(b)} |
| Legislation | ${reg.citation} |
| Review date | ${nextYear()} |

---

### 1. Scope and Application
What this SWMS covers, which sites/tasks it applies to, and when it must be reviewed.

### 2. Roles and Responsibilities
Person conducting business or undertaking (PCBU), site supervisor (${b.whs_responsible_name ?? 'Site Supervisor'}), workers, subcontractors — specific WHS duties for this activity under ${reg.act}.

### 3. Plant, Equipment, Materials and PPE Required
Detailed list of all tools, plant, equipment, substances, and PPE. Include licence/ticket requirements for plant operation.

### 4. Pre-Task Requirements and Permits
Checklist of conditions that must be satisfied before work starts (permits, site inspection, weather, briefing, equipment inspection).

### 5. Hazard Identification and Risk Controls

| # | Hazard | Risk | L (1–5) | C (1–5) | Risk Rating | Control Measures (Hierarchy) | Control Type | Residual Risk |
|---|--------|------|---------|---------|-------------|------------------------------|--------------|---------------|

Include at least 8 rows. L = Likelihood, C = Consequence, Risk Rating = L×C (1–8 Low, 9–16 Med, 17–25 High).
Control type: E=Eliminate, S=Substitute, I=Isolate, Eng=Engineer, A=Admin, P=PPE.
Apply the hierarchy — elimination first, PPE only as last resort.

### 6. Step-by-Step Safe Work Procedure
Numbered steps for the complete work activity. Each step includes the safety action/check required at that stage.

### 7. Emergency Procedures
Specific response for likely emergencies during this activity (injury, fire, collapse, etc.).
Notifiable incidents: notify ${reg.regulator} immediately on ${reg.regulator_phone}.
Nearest hospital: [to be confirmed per site].
Muster point: [to be designated per site].

### 8. Review Triggers
This SWMS must be reviewed when: incident or near miss occurs, work method changes, new plant/equipment introduced, legislative change, at scheduled review date.

### 9. Worker Acknowledgement
By signing below, workers confirm they have read, understood, and will comply with this SWMS.

| Name | Role / Trade | Date | Signature |
|------|-------------|------|-----------|
| | | | |
| | | | |
| | | | |
| | | | |

---
*This SWMS was prepared in accordance with ${reg.act} and ${reg.regulation}.*

Write in clear, direct professional Australian English. Suitable for use on a real ${b.state} construction site.`
}

// ── Hazard Register ───────────────────────────────────────────

export function buildHazardRegisterPrompt(b: BusinessContext): string {
  const reg = REGULATORY[b.state]

  return `You are a professional WHS consultant in Australia. Generate a complete Hazard Register for a ${fmt(b.industry_type)} business in ${b.state}.

BUSINESS DETAILS:
- Name: ${b.name}
- Industry: ${fmt(b.industry_type)}
- Employees: ${b.employee_count_range}
- State: ${b.state}
- Legislation: ${reg.act}
- Date: ${currentMonth()}

Generate a professional Hazard Register in markdown. All content must be complete and specific — no placeholders.

# Hazard Register
## ${b.name}

| Field | Detail |
|-------|--------|
| Date | ${currentMonth()} |
| Review date | ${nextYear()} |
| Document owner | ${whsPerson(b)} |
| Legislation | ${reg.citation} |

### How to Use This Register
Brief instructions: report new hazards to ${whsPerson(b)}, update controls when actioned, review after any incident.

### Risk Matrix

| | **Low consequence (1)** | **Moderate consequence (2)** | **High consequence (3)** |
|---|---|---|---|
| **Unlikely (1)** | Low (1) | Low (2) | Medium (3) |
| **Possible (2)** | Low (2) | Medium (4) | High (6) |
| **Likely (3)** | Medium (3) | High (6) | Critical (9) |

Risk ratings: Low 1–2 (monitor), Medium 3–4 (action within 30 days), High 6 (action within 7 days), Critical 9 (stop work, immediate action).

### Hazard Register

| Ref | Hazard | Location / Task | Persons at Risk | L (1–3) | C (1–3) | Risk Rating | Control Measures | Control Type | Responsible Person | Date Identified | Review Date | Status |
|-----|--------|-----------------|-----------------|---------|---------|-------------|------------------|--------------|-------------------|-----------------|-------------|--------|

Include at least 18 rows of real, specific hazards for ${fmt(b.industry_type)} in ${b.state}. Cover:
1. Working at heights — falls from scaffolding, ladders, elevated structures
2. Plant and mobile equipment — forklifts, excavators, cranes, trucks
3. Electrical hazards — overhead power lines, underground services, temporary site wiring
4. Manual tasks — heavy lifting, repetitive work, awkward postures
5. Slips, trips and falls — uneven ground, wet surfaces, housekeeping
6. Hazardous chemicals and substances — concrete dust (silica), solvents, adhesives, fuels
7. Noise — power tools, compressors, heavy machinery (${b.state} heat and outdoor conditions)
8. UV and heat stress — outdoor work, sun exposure, hot conditions (especially relevant for ${b.state})
9. Traffic management — vehicles and pedestrians on site
10. Subcontractor management — uncontrolled work activities
11. Power tools — angle grinders, nail guns, circular saws
12. Struck by falling objects — overhead work, material storage
13. Asbestos — older structures (pre-1990 buildings)
14. Trenching and excavation — ground collapse, services
15. Fire and explosion — hot work, fuel storage, LPG
16. Fatigue — extended hours, shift work, travel
17. Psychological health — workplace pressure, bullying/harassment
18. Emergency situations — first aid, evacuation readiness

Control types: E=Eliminate, S=Substitute, I=Isolate, Eng=Engineer, A=Admin, P=PPE

### Corrective Actions Log

| Ref # | Action Required | Person Responsible | Due Date | Completed Date | Verified By |
|-------|----------------|-------------------|----------|----------------|-------------|
| | | | | | |
| | | | | | |
| | | | | | |

### Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Document owner | ${b.whs_responsible_name ?? '_______________'} | | ${currentMonth()} |

Write in professional Australian English. All hazards, controls, and ratings must be realistic and specific to ${fmt(b.industry_type)}.`
}

// ── Incident Report Form ──────────────────────────────────────

export function buildIncidentReportPrompt(b: BusinessContext): string {
  const reg = REGULATORY[b.state]

  return `You are a professional WHS consultant in Australia. Generate a complete Incident Report Form for a construction business in ${b.state}.

BUSINESS DETAILS:
- Name: ${b.name}
- ABN: ${b.abn ?? 'Not provided'}
- State: ${b.state}
- Regulator: ${reg.regulator} — ${reg.regulator_phone}
- WHS officer: ${whsPerson(b)}
- Legislation: ${reg.act}
- Date: ${currentMonth()}

Generate a professional Incident / Near Miss / Injury Report Form in markdown. This form covers accidents, near misses, injuries, illnesses, and property damage. All fields must be real — no placeholders.

# Incident / Near Miss Report Form
## ${b.name}

| Field | Detail |
|-------|--------|
| Version | 1.0 |
| Date | ${currentMonth()} |
| Document owner | ${whsPerson(b)} |
| Legislation | ${reg.citation} |

---

> **⚠️ IMMEDIATE ACTION: If life-threatening — call 000 first.**
> **Notifiable incidents must be reported to ${reg.regulator}: ${reg.regulator_phone}**

---

### Part A — Incident Classification

**Type of event** (tick one):
- [ ] Injury / illness
- [ ] Near miss / dangerous incident
- [ ] Property / plant damage
- [ ] Environmental incident
- [ ] Security incident

**Severity** (tick one):
- [ ] First aid treatment only
- [ ] Medical treatment (GP/specialist, no time off)
- [ ] Lost time injury (time off work required)
- [ ] Dangerous incident (as defined in ${reg.act})
- [ ] Notifiable incident — STOP and call ${reg.regulator} ${reg.regulator_phone}

---

### Part B — Incident Details

- **Date of incident:** ___/___/______
- **Time of incident:** _______ AM / PM
- **Date reported:** ___/___/______
- **Exact location / site address:**
- **Task or activity being performed at time of incident:**
- **Description of what happened** (factual, chronological):

*(space for narrative)*

- **Immediate cause (the direct action or condition):**
- **Underlying causes / contributing factors:**

---

### Part C — Person(s) Involved

*(Complete one section per person)*

- **Full name:**
- **Role / trade:**
- **Employer** (if subcontractor — company name):
- **Contact number:**
- **Date of birth:** ___/___/______
- **Years of experience in this trade:**
- **Was person wearing required PPE?** Yes / No — if No, explain:

---

### Part D — Injury / Illness Details *(if applicable)*

- **Nature of injury / illness** (e.g., laceration, fracture, strain):
- **Body part(s) affected:**
- **Treatment provided on site:**
- **Was further medical treatment required?** Yes / No
- **If yes — Doctor / GP / Hospital / Ambulance** (circle):
- **Name and address of treating facility:**
- **Estimated time off work:**

---

### Part E — Witnesses

| Name | Role | Contact Number | Brief statement |
|------|------|---------------|-----------------|
| | | | |
| | | | |

---

### Part F — Notifiable Incident Check

Under ${reg.act}, a notifiable incident includes: death of a person, serious injury or illness, or a dangerous incident. If any apply, ${b.name} must notify ${reg.regulator} **immediately** by phone.

**Is this a notifiable incident?** Yes / No

If Yes:
- Date and time notified to ${reg.regulator}: ___/___/______ at _______
- ${reg.regulator} reference number: _______________
- Name of officer notified: _______________
- Was the scene preserved? Yes / No
- Was written notice submitted within 48 hours? Yes / No

---

### Part G — Immediate Corrective Actions

What steps were taken immediately to make the area safe and prevent recurrence?

| Action taken | By whom | Time / date |
|-------------|---------|-------------|
| | | |
| | | |

---

### Part H — Root Cause Investigation

*(To be completed by ${whsPerson(b)} within 48 hours of the incident)*

**5 Whys Analysis:**

1. Why did the incident happen?
2. Why? (underlying reason for #1)
3. Why? (underlying reason for #2)
4. Why? (underlying reason for #3)
5. Why? (root cause)

**Root cause category** (tick all that apply):
- [ ] Inadequate training / supervision
- [ ] Equipment / plant failure
- [ ] Unsafe work procedure
- [ ] Failure to follow procedure
- [ ] Environmental / site conditions
- [ ] Fatigue / time pressure
- [ ] Other: _______________

---

### Part I — Corrective / Preventive Actions

| # | Action Description | Person Responsible | Due Date | Completed Date | Verified By |
|---|-------------------|-------------------|----------|----------------|-------------|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |

---

### Part J — Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Reported by | | | |
| Site supervisor | | | |
| WHS officer | ${b.whs_responsible_name ?? '_______________'} | | |
| Director / Owner | | | |

---
*Completed forms are to be filed by ${whsPerson(b)} and retained for a minimum of 5 years. Notifiable incident records must be retained for 5 years under ${reg.act}.*

Write in professional Australian English. All section instructions must be clear and actionable.`
}

// ── Emergency Procedures ──────────────────────────────────────

export function buildEmergencyProceduresPrompt(b: BusinessContext): string {
  const reg = REGULATORY[b.state]

  return `You are a professional WHS consultant in Australia. Generate complete Emergency Procedures for a construction business in ${b.state}. This document will be printed and displayed on construction sites.

BUSINESS DETAILS:
- Name: ${b.name}
- ABN: ${b.abn ?? 'Not provided'}
- Address: ${b.address ?? '[Insert site address per project]'}
- State: ${b.state}
- Employees: ${b.employee_count_range}
- WHS officer / Chief Warden: ${whsPerson(b)}
- Regulator: ${reg.regulator} — ${reg.regulator_phone}
- Legislation: ${reg.act}
- Date: ${currentMonth()}

Generate professional Emergency Procedures in markdown. Clear, direct language — this is a safety-critical document. No placeholders — all content must be complete.

# Emergency Procedures
## ${b.name}

| Field | Detail |
|-------|--------|
| Version | 1.0 |
| Date | ${currentMonth()} |
| Review date | ${nextYear()} |
| Chief Warden | ${whsPerson(b)} |
| Legislation | ${reg.citation} |

---

## 🚨 EMERGENCY CONTACTS — POST THIS ON SITE

| Emergency | Contact |
|-----------|---------|
| **Police / Fire / Ambulance** | **000** |
| **${reg.regulator}** | **${reg.regulator_phone}** |
| **Poisons Information Centre** | **13 11 26** |
| **Chief Warden / WHS Officer** | ${b.whs_responsible_name ?? '[Name]'} — [insert phone] |
| **Site Supervisor** | [Name] — [insert phone] |
| **Nearest Hospital** | [Insert per site] |
| **Site Address** | [Insert per project] |
| **Site Assembly Point** | [Insert per site] |

---

## EMERGENCY RESPONSE — THREE STEPS

**1. STOP** work. Alert others in the area.
**2. MAKE SAFE** — if safe to do so without risk to yourself.
**3. CALL** — Emergency Services (000) and Chief Warden.

---

### 1. Medical Emergency / Serious Injury

1. Call 000 immediately. State: construction site, type of injury, site address, number of casualties.
2. Send someone to the site entrance to direct the ambulance.
3. Trained first aider to assess and administer first aid. Do not move the injured person unless in immediate danger.
4. Keep the person calm and conscious. Do not give food or water.
5. Notify Chief Warden (${b.whs_responsible_name ?? 'WHS Officer'}).
6. Preserve the incident scene — do not disturb unless making it safe.
7. If a **notifiable incident** — call ${reg.regulator} immediately: ${reg.regulator_phone}.
8. Complete Incident Report Form within 24 hours.

**CPR reminder:** 30 compressions : 2 breaths. Push hard and fast. AED location: [insert per site].

---

### 2. Fire

1. Raise the alarm — shout "FIRE", activate alarm if available.
2. Evacuate all personnel immediately — do not collect personal belongings.
3. Call 000.
4. Chief Warden to initiate site evacuation.
5. Attempt to extinguish only if: fire is small, you have a clear escape route, you are trained.
6. Assemble at the designated **Assembly Point**: [insert per site].
7. Chief Warden to conduct roll call — account for ALL workers and visitors.
8. Do NOT re-enter until authorised by Fire & Rescue.
9. Notify ${reg.regulator} if fire results in a notifiable incident: ${reg.regulator_phone}.

**Fire extinguisher types on site:**
- Water/foam — wood, paper, fabric (Class A)
- CO₂ — electrical equipment (Class E)
- Dry powder — flammable liquids, gases (Class B/C)

---

### 3. Structural Collapse / Falling Objects

1. Shout warning — evacuate the immediate area.
2. Call 000.
3. Do NOT enter the collapse zone — further collapse risk.
4. Establish an exclusion zone of at least 50 metres (or as directed by emergency services).
5. Notify Chief Warden.
6. This is a **notifiable incident** — call ${reg.regulator}: ${reg.regulator_phone} immediately.
7. Preserve the scene — do not move debris unless directed by emergency services.
8. Account for all personnel at the Assembly Point.

---

### 4. Hazardous Substance Spill

1. Evacuate the immediate area. Avoid breathing vapours.
2. Identify the substance — consult the Safety Data Sheet (SDS).
3. Call 000 if spill is large or people are affected.
4. Call Poisons Information: 13 11 26 if exposure has occurred.
5. Contain the spill if safe — use spill kit appropriate to the substance.
6. Ventilate the area.
7. Do NOT wash spill into drains or waterways.
8. Notify Chief Warden and complete Incident Report.

**SDS location on site:** [Insert per site]

---

### 5. Electrical Incident / Electrocution

1. **DO NOT TOUCH** the injured person until the power supply is confirmed isolated.
2. Isolate the power source — switch off at the main switchboard. Lock out / tag out.
3. Call 000.
4. Once power is confirmed off — trained first aider to assess. Begin CPR if required.
5. Do not use water near electrical equipment.
6. Notify Chief Warden.
7. This is a **notifiable incident** — call ${reg.regulator}: ${reg.regulator_phone}.
8. Preserve the scene.

---

### 6. Trench / Excavation Collapse

1. **DO NOT ENTER** the collapsed trench — risk of secondary collapse.
2. Call 000 immediately.
3. Keep all personnel back — establish an exclusion zone.
4. Provide verbal reassurance to any person trapped.
5. Do not operate plant or vehicles near the collapse.
6. Chief Warden to manage exclusion zone until emergency services arrive.
7. This is a **notifiable incident** — call ${reg.regulator}: ${reg.regulator_phone} immediately.

---

### 7. Evacuation Procedure

**Trigger:** Fire alarm, emergency announcement, or direction from Chief Warden.

1. Stop all work immediately. Turn off plant and equipment where safe.
2. Move calmly to the Assembly Point: **[Insert per site]**.
3. Chief Warden (${b.whs_responsible_name ?? 'WHS Officer'}) conducts roll call using the site attendance register.
4. Account for all workers, subcontractors, and visitors.
5. Report any missing persons to emergency services.
6. No one re-enters the site until the Chief Warden declares it safe and emergency services confirm clearance.

---

### 8. Emergency Warden Responsibilities

**Chief Warden — ${b.whs_responsible_name ?? '[Designate per site]'}:**
- Confirm evacuation is in progress and all areas are clear
- Liaise with emergency services on arrival
- Conduct roll call and report missing persons
- Authorise re-entry once safe
- Notify ${reg.regulator} for notifiable incidents
- Initiate incident report process

---

### 9. First Aid

**First aid kit location:** [Insert per site — minimum one kit per 25 workers]
**First aid officer:** [Insert per site]
**Nearest hospital:** [Insert per site]
**Calling an ambulance:** Dial 000 — state "construction site emergency", give address, describe injury.

*First aid kit must be inspected monthly and replenished after each use.*

---

### 10. Notifiable Incidents — Know Your Obligations

Under ${reg.act}, ${b.name} must notify ${reg.regulator} **immediately** by phone (${reg.regulator_phone}) if a notifiable incident occurs:

- **Death** of any person at the workplace
- **Serious injury or illness** (requires immediate treatment as an in-patient, amputation, serious head/eye/burn injury, spinal damage, loss of bodily function)
- **Dangerous incident** (uncontrolled escape of hazardous substance, explosion, collapse of structure, implosion, fall of excavation wall, failure of plant required to be registered)

The scene must be preserved until an inspector attends or ${reg.regulator} gives clearance.
Written notification must follow within 48 hours.

---

### 11. Emergency Drills

${b.name} will conduct emergency evacuation drills:
- **Frequency:** Minimum annually, or within 3 months of a new project commencing
- **Record:** Date, personnel present, issues identified, corrective actions
- **Review:** Emergency Procedures to be reviewed after each drill and after any actual emergency

### Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Chief Warden / WHS Officer | ${b.whs_responsible_name ?? '_______________'} | | ${currentMonth()} |
| Director | | | ${currentMonth()} |

---
*These Emergency Procedures comply with ${reg.act} and ${reg.regulation}. Post at site entry, crib room, and near all plant.*

Write in clear, direct Australian English. Use bold and call-out boxes for critical actions.`
}
