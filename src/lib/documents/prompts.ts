import { REGULATORY, type StateCode } from './regulatory'

interface BusinessContext {
  name: string
  abn: string | null
  address: string | null
  // Any Australian state or territory. Only the legacy WHS builders below need a
  // StateCode, and they fall back to QLD if given a state with no regulatory entry.
  state: string
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
  const reg = REGULATORY[b.state as StateCode] ?? REGULATORY.QLD
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
    'Cover: electrical work (energised or de-energised) may only be performed by a person holding an appropriate electrical licence or otherwise authorised under the Electrical Safety Act 2002 (Qld) (ES Act) s.55; the ES Act takes precedence over the WHS Act wherever both apply. "Near" energised electrical equipment is defined as within 3 metres of an exposed energised part (ES Regulation s.12) — work on or near energised equipment is prohibited (ES Regulation s.14(1)) unless it is necessary for health/safety, necessary for the equipment to remain energised for the work to be done properly, necessary for testing to determine energised status, or there is no reasonable alternative — mere convenience is never a valid reason. Core safe work principle: "test for dead before you touch" — test the tester on a known live source, test the equipment, then re-confirm the tester on a known live source; every exposed part is treated as energised until isolated and proven otherwise, and high-voltage exposed parts must be earthed after de-energising. Isolation/lockout-tagout (LOTO): 6-step sequence — consult with the person in control of the workplace, isolate all sources (noting standby generators/PV/auxiliary supplies), secure the isolation (lock the isolating switch or tie back conductors — personal locks preferred where multiple workers are involved), tag the isolation point with a danger tag (durable, dated, signed, removable only by the signatory), test to confirm de-energisation, and re-test on return if the area was left unattended. Energised work additionally requires: a risk assessment by a competent person, recorded, before work starts (ES Regulation s.19/s.22); a SWMS (this is also independently mandatory because construction work on/near energised electrical installations or services is prescribed High Risk Construction Work); and a safety observer present (assessed within the previous 12 months as competent to rescue and resuscitate) unless the work is testing-only with no serious risk identified. Test-and-tag: in-service inspection and testing of electrical equipment and RCDs must follow AS/NZS 3760; construction and demolition sites must additionally comply with AS/NZS 3012 for site electrical installations. RCDs (safety switches): Type I devices trip at ≤10mA within 40ms (used for equipment in direct contact with a person, e.g. medical settings); Type II devices trip at >10mA up to 30mA within 300ms (standard personal-protection safety switches) — classifications per AS/NZS 3190; a safety switch found faulty must be immediately tagged out of service and withdrawn from use. PPE for electrical work: gloves insulated to the highest potential voltage expected; non-conductive footwear; flame-resistant non-synthetic clothing with no metal thread; no metallic personal items (watches, jewellery, metal spectacle frames) worn near exposed energised parts; insulating mats/barriers to AS/NZS IEC 61111; test instruments rated Category III or IV to AS 61010.1, checked immediately before and after use — proximity voltage testers are indicators only, never proof of de-energisation. Overhead powerlines: treat every line as live until proven de-energised, isolated against re-energisation, and (if high voltage) earthed; for insulated low-voltage lines visually verified by an authorised person, a "no-touch zone" applies (approach freely, do not touch); for unverified or bare low-voltage lines, the exclusion zone is 3 metres without consultation with the electricity entity (closer distances only apply with consultation or for authorised/instructed persons); QLD guidance separately bands high-voltage overhead line exclusion zones at 3m for voltages up to 132kV, 6m for 132–330kV, and 8m above 330kV — a dedicated safety observer/spotter is required whenever any part of plant, an EWP occupant, or a load could enter the exclusion zone, unless the line is de-energised/earthed or mechanical limiting devices prevent encroachment; visual markers ("tiger tails") are a warning aid only and provide no insulation. Underground services: before any excavation, trenching, or driving posts/pickets, contact Before You Dig Australia (BYDA) on 1100 or www.byda.com.au plus the relevant electricity entity, local council, and water/telecom authorities; the person with management or control of the workplace must obtain and provide current underground essential services information (location and depth of buried assets) before excavation is authorised, and retain it until the work is complete (or at least 2 years if a notifiable incident occurs). Record keeping: for energised work, retain the risk assessment for at least 28 days after the work is completed and the SWMS until the work is completed; retain both for at least 2 years if a serious electrical incident or dangerous electrical event occurs. QLD reference: Electrical Safety Code of Practice 2021 — Managing Electrical Risks in the Workplace (WorkSafe Qld, varied 1 January 2025) made under s.44 Electrical Safety Act 2002, together with the companion Electrical Safety Code of Practice 2020 — Working Near Overhead and Underground Electric Lines (varied 1 January 2025). NSW reference: Work Health and Safety Regulation 2025 (NSW) Part 4.7 — General electrical safety in workplaces and energised electrical work (covers energised work prohibition/exceptions, RCD requirements in hostile operating environments, and overhead/underground line proximity) — apply equivalent isolation, testing, RCD, and exclusion-zone principles under this Part for NSW sites; note the separate NSW Code of Practice: Work Near Overhead Power Lines takes a written-authority no-go-zone approach with the relevant electricity supply authority rather than a single fixed national distance table — confirm current exclusion distances with the network operator for the specific voltage before work begins. [VERIFY: NSW Part 4.7 content sourced from secondary legal summaries, not an independent primary-text read — confirm before relying on it as precisely as the QLD citations, which were read directly from the source CoP PDFs.]',
  excavation:
    'Cover: excavation work is defined as any trench, shaft or tunnel; any excavation with a depth ≥1.5m where a person could be at risk from collapse or engulfment is High Risk Construction Work (HRCW) under the WHS Regulation — a SWMS is mandatory. Before excavating: contact Dial Before You Dig (1100 / byda.com.au) for underground service plans — treat plans as indicative only, not guaranteed accurate. Locate and identify services (electrical, gas, water, telecommunications) using a physical locating device before mechanical excavation begins. Potholing/exposure of services: maintain a minimum 300mm tolerance (safety) zone between the edge of any identified underground asset and mechanical excavation equipment (bucket, auger, or similar attachment) — within that zone, only non-mechanical methods are permitted (hand digging or non-destructive vacuum excavation, hydro or air). Ground support/collapse prevention — one of three methods required for any excavation ≥1.5m deep where collapse could bury or trap a person: (1) battering — cut back the excavation walls at a safe angle of repose (typically no steeper than 45° from horizontal for uncertified ground conditions; steeper angles require a geotechnical engineer\'s written certification of soil classification and stability); (2) benching — a series of steps, each step no deeper than 1.5m, set back so a collapse of an upper step cannot reach a person on a lower step; (3) shoring — trench shields, boxes, hydraulic shoring or sheet piling engineered for the specific ground and surcharge conditions; shoring/shielding design and installation by a competent person. Spoil and surcharge loads: stockpile excavated material and position plant, vehicles and materials at least 1× the excavation depth back from the edge (greater setback on loose, filled or wet ground) to prevent surcharge-induced collapse. Entry/exit: safe access and egress (ladder, ramp or steps) within 9m of a worker\'s position in any trench excavation, extending the full depth of the trench. Atmospheric and confined space overlap: excavations ≥1.5m deep in contaminated ground, near sewer/gas lines, or of a size/configuration restricting natural ventilation may be a confined space — assess and apply confined space entry controls (atmospheric testing, permit) where applicable. Water ingress: dewatering plan and inspection after any rain event before re-entry — water softens excavation walls and increases collapse risk. Mobile plant and crane proximity to excavation edges: compact ground — outriggers/tracks/wheels must be positioned ≥1× excavation depth back from the edge; loose or backfilled ground — ≥2× depth. Daily inspection by a competent person before each shift and after any event likely to affect stability (rain, vibration, nearby excavation, ground loading) — document in the SWMS. Inspection is also mandatory following any partial collapse before re-entry. Emergency/rescue: a documented rescue plan is required before entry into any excavation ≥1.5m deep — non-entry rescue equipment preferred; entry into a collapsed or partially collapsed trench to rescue a trapped person must not occur until the excavation is made safe. NSW reference: Code of Practice: Excavation Work (SafeWork NSW, August 2019, revised January 2020) under the WHS Regulation 2025 (NSW). QLD reference: excavation work duties are set out in Division 3 (Excavation work) of the WHS Regulation 2011 (Qld), supported by the national Model Code of Practice: Excavation Work (Safe Work Australia, October 2022), which WorkSafe QLD applies as its excavation guidance. Both jurisdictions apply the same 1.5m HRCW depth trigger and hierarchy of ground support controls; confirm current SWMS templates against the applicable state regulator\'s published excavation guidance at the time of use. [VERIFY: primary CoP/model-CoP PDFs could not be fetched in full during research — figures cross-referenced against regulator summary pages and industry SWMS guidance rather than a line-by-line primary read; recommend a WHS professional spot-check the batter/bench/shore figures before relying on them.]',
  concrete_cutting:
    'Cover: crystalline silica dust controls — any material containing ≥1% crystalline silica is a Crystalline Silica Substance (CSS). The workplace exposure standard for respirable crystalline silica (RCS) is 0.05 mg/m³ as an 8-hour TWA (reduced from 0.1 mg/m³ in 2020). From 1 December 2026 this WES is renamed to Workplace Exposure Limit (WEL) — value unchanged. Controlled processing of a CSS must implement at least one of: (1) isolation of workers from dust exposure, (2) enclosed operator cabin with HEPA air filtration, (3) effective wet dust suppression — water delivered to the cutting point, (4) effective on-tool extraction, (5) effective local exhaust ventilation (LEV). Where none of these is reasonably practicable, P2 RPE alone may satisfy controlled processing — must be documented. Wet cutting: slurry is wet waste — contain and dispose as hazardous waste, do not dry-sweep or wash to stormwater/drains. Dry cutting/grinding: must use M-class or H-class industrial vacuum cleaner (compliant with AS/NZS 60335.2.69:2017) — standard vacuums recirculate fine RCS particles. Inverted cutting (overhead work): must NOT use handheld electric saws — only IP-rated hydraulic, pneumatic or petrol-powered saws are permitted (electric saw cooling fans draw dust into motor and expel it into the operator\'s breathing zone). RPE: P2 particulate filter minimum; AS/NZS 1716:2012 and AS/NZS 1715:2009; fit testing required for all close-fitting half-facepiece and full-facepiece respirators — bearded workers cannot use close-fitting RPE and must use PAPR or loose-fitting hood. Silica worker register: from 1 October 2025, PCBUs must register workers performing high-risk CSS processing with their state regulator (SafeWork NSW or WHSQ) within 28 days of commencing such work (Part 8A.4 WHS Regulation 2025 NSW; equivalent QLD duty). High-risk CSS processing determination: assess 7 factors — specific processing, forms of silica, silica proportion, frequency/duration, whether RCS is reasonably likely to exceed half the WES (0.025 mg/m³), previous air monitoring results, previous incidents/illnesses. If high risk: requires (1) Silica risk control plan, or SWMS covering all plan content for HRCW; (2) nationally accredited crystalline silica training; (3) air monitoring; (4) health monitoring; (5) silica worker register. Engineered stone ban: from 1 July 2024, benchtops, slabs and panels containing ≥1% crystalline silica are banned from supply, installation or importation. Noise: exposure standard 85 dB(A) TWA / 140 dB(C) peak. HAVS: hand-arm vibration action value 2.5 m/s² A(8). Blade safety: correct blade for material, guards fitted, speed ratings matched. NSW references: Code of Practice: Working safely when cutting, drilling and grinding concrete (May 2026) under WHS Regulation 2025 (NSW); Code of Practice: Managing risks of respirable crystalline silica in the workplace (February 2026). QLD reference: Code of Practice: Managing respirable crystalline silica dust (construction) (May 2023) under WHS Regulation 2011 (Qld).',
  scaffolding:
    'Cover: High Risk Work (HRW) scaffolding licence requirements — Basic scaffolding (SB licence, systems/tube and coupler ≤4m), Intermediate scaffolding (SI licence, including suspended, cantilevered), Advanced scaffolding (SA licence, complex structures). Load limits — design load vs working load, never exceed design. Bracing and tying to structure at specified intervals. Working platforms minimum 450 mm width (AS/NZS 4576), planks secured, no gaps >25 mm. Handover inspection by competent person before use — green tag system. Exclusion zones during erection/dismantling (1.5× height or falling object distance, whichever greater). Reference Safe Work Australia Code of Practice: Construction Work.',
  confined_spaces:
    'Cover: confined space register and entry permit system, atmospheric testing (O2 ≥19.5% and ≤23.5%, LEL <10%, CO <25 ppm, H2S <1 ppm — specify these values), standby person requirements (trained, stationed outside, in constant communication), rescue plan and equipment (non-entry rescue preferred — describe tripod/harness retrieval), isolation of all services (LOTO — lock, tag, and test zero energy), forced ventilation (continuous monitoring, not just initial test), competency requirements for entry controller and entrants. Reference Safe Work Australia Code of Practice: Work in Confined Spaces.',
  hot_work:
    'Cover: hot work permit system, 10-metre combustible material clearance, fire watch (during and 30 minutes post), fire extinguisher types and placement, UV/IR eye protection, fume and gas controls (LEV, RPE selection), spontaneous combustion risk.',
  crane_rigging:
    'Cover: High Risk Work (HRW) licence classes — DG (Dogging), RI/RB/RA (Rigging Basic/Intermediate/Advanced), CN/CO/CB/CA/CV (Crane operator classes). Design registration: cranes with rated capacity >10 tonnes must be registered as an item of plant (WHS Reg s.243 QLD; equivalent NSW requirement); tower cranes and self-erecting tower cranes require both design AND item registration regardless of capacity — no tonnage exemption applies (NSW Tower Cranes CoP, July 2025, §3.3) — verify registration currency before each use. Lift planning — site-specific comprehensive documented lifting procedures are required (not generic) for: tilt-up or spin-up panel jobs; plant recovery (overturned plant); multiple crane lifts (more than one crane lifting a load simultaneously); lifting workboxes with personnel; bridge beam installation; working near live overhead powerlines; lifting large pressure vessels or tanks; crane used for demolition; complex rigging arrangements (e.g. chain blocks to rotate suspended load); mobile cranes on barges; erection of tower cranes; heavy lifts where load is 50 tonnes or more. Site-specific plans must include: max load radius for each crane; spotter duties; load start/destination positions; max wind speed for the lift configuration; geotechnical bearing capacity verification; proximity hazard map. Load charts: gross rated capacity must be reduced by the mass of the hook block and all lifting gear to give net usable capacity. Load charts must comply with AS 1418.5 — some overseas standards (US) use less conservative factors. Rated capacity limiters: for tower cranes, must not permit hoisting beyond 100% of maximum rated capacity — 100% may only be reached during commissioning (NSW Tower Cranes CoP, July 2025, §3.8); for mobile cranes, verify the manufacturer-specified limiter activation threshold against the crane\'s compliance plate rather than assuming a universal percentage across crane types. Verify limiter function during pre-start regardless of crane type. Free fall feature: must be permanently de-activated on mobile cranes. Geotechnical certification: required from a geotechnical engineer before performing bridge beams (≥10t), tilt-up panels, or heavy lifts (load ≥50t); principal contractor must engage and provide results to crane crew. Ground bearing pressures: hard rock 200 t/m², compacted gravel 40 t/m², asphalt/compacted sand/stiff clay (dry) 20 t/m², loose sand/soft clay 10 t/m², wet clay <10 t/m². Outrigger timbers: minimum 200mm wide × 75mm thick; gap between timbers ≤25mm (top and bottom layers). Crane proximity to excavations: compact ground — crane support timbers must be ≥1× excavation depth from edge (1H:1V); loose or backfilled ground — ≥2× depth (2H:1V). Wind: 10 m/s (36 km/h) is a commonly-applied general industry limit for many mobile crane operations — loads with large surface area (tilt-up, pressure vessels) may require lower limits calculated by engineer; tower-crane-specific operating and out-of-service wind limits are manufacturer- and configuration-specific — always follow the crane\'s load chart and manufacturer wind rating rather than a universal figure. Anemometers should be fitted to slewing cranes and positioned per crane type — top of the A-frame for luffing tower cranes, A-frame or machine deck handrail for non-luffing tower cranes (NSW Tower Cranes CoP, July 2025, §3.8) — treat this as a strongly recommended control rather than an assumed blanket mandate. Cease all lifts immediately if wind exceeds the applicable limit. Communication: analog radio preferred over digital (avoids cut-off/delay risk); mobile phones must NOT be used to direct crane operations; radio loss = stop all operations; hand signals per AS 2550.1 if radio not used. Powerlines: preferred control is de-energise or re-route (arrange with electricity entity early — can take time; get written confirmation); where not practicable, maintain an exclusion zone from any part of crane/load to powerlines — QLD guidance commonly applies 3m for voltages up to 132kV, 6m for 132–330kV, and 8m above 330kV; for NSW tower cranes specifically, the Tower Cranes CoP (July 2025) does not itself set a fixed metre distance and instead defers to the separate Work Near Overhead Powerlines CoP\'s qualitative zone system — Zone A (instructed persons), Zone B (authorised/trained persons, safety observer required), Zone C (no-go, requires electricity authority permit) — confirm current clearance distances with the network operator for NSW tower crane work; safety observer/spotter must be dedicated (no concurrent dogging duties) — spotter training unit RIIRTM203E; tiger tails are visual aids only, not insulation. Self-climbing operations (internal or external climbing) carry a very high risk of crane collapse — the centre of gravity must remain balanced over the climbing equipment throughout, and slew operations must be avoided entirely during climbing (NSW Tower Cranes CoP, July 2025, §3.8). Brake inspection is mandatory before each erection for dry brakes; wet brakes require inspection before each erection or after 5,000 hours (§3.6). Where operator climb exceeds 30 metres, a personnel hoist should be used where reasonably practicable; ladder landings should not exceed 6m vertical spacing (§3.9). Consider providing a secondary, trained crane driver able to make the crane safe if the primary operator becomes incapacitated (§3.11). Crane operator has final say on whether lift proceeds. Dogger cannot supervise trainee doggers while also operating as crane operator. SWL: weakest link in the lifting assembly governs — document WLL for every item (crane, chain blocks, slings, shackles, spreader bars). Daily pre-use inspection records required. References: QLD — Code of Practice: Mobile Crane (September 2024) under WHS Regulation 2011 (Qld). NSW — Code of Practice: Tower Cranes (July 2025) and Code of Practice: Moving Plant on Construction Sites (December 2025) under WHS Regulation 2025 (NSW), plus the separate Work Near Overhead Powerlines CoP for exclusion-zone requirements.',
  plant_and_equipment:
    'Cover: moving plant (excavators, forklifts, skid steers, telehandlers, trucks, light vehicles, EWPs, load-shifting equipment) sharing a site with workers on foot is High Risk Construction Work whenever any powered mobile plant movement occurs in the work area — a SWMS is mandatory regardless of plant size or job cost. Moving plant zones: establish (1) Plant only zones — barriered, workers-on-foot excluded, operations cease if a worker enters; (2) Plant operating and restricted personnel zones — for tasks requiring workers on foot alongside plant (e.g. guiding excavation), restricted to personnel trained on that plant\'s blind spots, pinch/crush/slew hazards; (3) Plant hazardous zones — so far as reasonably practicable no worker should ever be in one; where unavoidable, the operator must cease operating or have positive confirmation the worker is clear. No fixed exclusion-zone distance is prescribed in metres — apply the zone-based risk assessment instead. Barriers: crash-resistant (concrete/water-filled barriers, earth berms) preferred; non-crash-resistant (fencing, boom gates, bunting) only where risk-assessed. Reversing and vision: reversing alarms, cameras and mirrors are critical safety devices — if damaged or non-functional, the plant must be removed from service and locked out until repaired. Workers on foot must obtain positive verbal/radio communication with the operator before approaching operating plant. Spotters: use is a control of last resort, not default — PCBUs must eliminate or minimise the need for them; where used, spotters must be trained and competent, stay in the operator\'s direct visual field (or maintain positive two-way radio contact if not), perform no concurrent duties, be identifiable (hi-vis, distinct hard hat/arm band), understand the plant\'s stopping distance and roll-over/tip envelope, be authorised to stop work, and have their role documented in the SWMS. Operator protection: ROPS/FOPS/Operator Protective Guards plus correctly worn seatbelts are mandatory ejection/crush prevention; plant should have interlocks preventing operation without seatbelt engagement. Quick hitches: semi-automatic and "automatic — detach only" excavator/backhoe quick couplers must not be used on-site under any circumstance; hitches used must comply with AS 13031:2023, with safety pin and lynch pin fitted and maintained on mechanical hitches. Plant maintenance — four-tier regime: pre-operational inspection every shift (brakes, controls, mirrors/cameras, structure — logged, with plant taken out of service and tagged if a safety fault is found); routine maintenance by a competent person per the manufacturer schedule; annual inspection; major inspection for ageing plant/components nearing design life, with a signed competent-person report. Vehicle/traffic management: a Vehicle Management Plan (prepared by a competent person) should cover traffic routes, speed limits, pedestrian/vehicle separation, loading/unloading areas and blind spots; site entry/exit for plant and workers on foot should be physically separated with a dedicated, signposted, self-closing pedestrian gate (lower-volume sites, e.g. standard residential, may combine access where risk-assessed). Licensing: High Risk Work Licences (Schedule 3, WHS Regulation 2025 NSW) commonly apply to forklifts (LF — standard forklift; LO — order-picking forklift) and boom-type EWPs with boom length ≥11 metres (WP), including telehandlers fitted with a personnel box and in-box controls; cranes and concrete placing/boom pump equipment also require specific HRWLs. General earthmoving machinery — excavators, dozers, graders, skid steers, and standard telehandlers without a personnel box — do NOT require a specific HRWL class; competency for this plant is instead established and re-verified through a documented Verification of Competency (VOC) process (RTO certification, supplier training, or competent-person assessment), which must be repeated after any unsafe-operation incident or a significant change in plant or process. A HRWL confirms generic training, not make/model-specific competence — VOC is required regardless of licence held. Roll-away prevention: dedicated level parking areas, wheel chocks, park-brake alarms, and operator competency in the specific braking system\'s limitations. Reference: NSW — Code of Practice: Moving Plant on Construction Sites (December 2025) under WHS Regulation 2025 (NSW).',
  demolition:
    'Cover: structural engineer\'s demolition methodology report required before commencement (mandatory for buildings >3 storeys or of complex construction). Asbestos identification and management — all pre-1990 structures assumed to contain asbestos until surveyed; Class B asbestos removal licence required for bonded asbestos (e.g., fibro sheeting) areas >10m²; Class A licence for friable asbestos — no exemption. Sequential demolition order specified by structural engineer — never deviate. Silica and dust controls (0.05 mg/m³ TWA for RCS). Falling object exclusion zones — fully enclosed scaffold or equivalent. Utility isolation sequence — gas, electricity, water, telecommunications before commencement (confirm written sign-off from each authority). Waste classification — asbestos, contaminated materials, recyclables to be segregated and disposed of per EPA requirements. Reference Safe Work Australia Code of Practice: Demolition Work.',
}

export function buildSwmsPrompt(b: BusinessContext, activityKey: string): string {
  const reg = REGULATORY[b.state as StateCode] ?? REGULATORY.QLD
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
  const reg = REGULATORY[b.state as StateCode] ?? REGULATORY.QLD

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
  const reg = REGULATORY[b.state as StateCode] ?? REGULATORY.QLD

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
  const reg = REGULATORY[b.state as StateCode] ?? REGULATORY.QLD

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

This document satisfies the duty to prepare, maintain and implement an emergency plan (Work Health and Safety Regulation 2025 (NSW) s.43; equivalent duty under WHS Regulation 2011 (Qld)) — it must provide for effective communication, evacuation procedures, testing, and worker training, and must be kept current.

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

// ════════════════════════════════════════════════════════════
// PIVOT (14 July 2026): business-operations documents for AU trades.
// These do not touch WHS/safety law by design — see Business-Plan-Trades-Docs-Pivot.md.
// Reuses the existing BusinessContext shape (industry_type/whs_responsible_name/
// whs_responsible_role/work_activities) rather than renaming fields, to avoid a
// database migration. Read as: industry_type = trade category, whs_responsible_name/
// role = primary contact, work_activities = services offered.
// ════════════════════════════════════════════════════════════

// ── Standard Operating Procedure ──────────────────────────────

// Keys should match a PROCESS_TYPES list in src/lib/types.ts
const PROCESS_GUIDANCE: Record<string, string> = {
  job_intake_and_quoting:
    'Cover the full lifecycle from first enquiry to accepted quote: how enquiries arrive (phone, website form, referral, walk-in), the information that must be captured before a quote can be prepared (site address, scope description, access constraints, photos, preferred timeframe, budget indication), how site visits/measure-ups are scheduled and who attends, how the quote is costed (materials, labour, margin, contingency), turnaround time targets for sending a quote after a site visit, how quotes are presented and followed up, and what happens when a customer accepts, wants changes, or goes quiet. Emphasise consistency — every lead should get the same standard of response regardless of who answers the phone.',
  scheduling_and_dispatch:
    'Cover how confirmed jobs get allocated to a date, crew, and vehicle: the booking/calendar system used, lead time expected between booking and start, how conflicting bookings are resolved, how materials and equipment are confirmed as available/ordered before a job is scheduled, how crews are notified of the day\'s jobs (briefing, job pack, site address, customer contact, access instructions, special requirements), how weather or supply delays are handled and communicated to the customer, and how last-minute cancellations or reschedules are processed and logged.',
  on_site_quality_control:
    'Cover the checks a tradesperson or supervisor performs during and at the end of a job to confirm the work meets the business\'s own quality standard before the customer is asked to sign off: pre-work checks (right materials on site, work area prepared, customer expectations reconfirmed), in-progress checkpoints appropriate to the trade, a final self-inspection checklist (finish quality, functionality testing, site clean-up, waste removal), photo documentation of completed work, and the escalation path when a fault or defect is found before handover.',
  customer_handover:
    'Cover the steps taken when a job is finished and the customer takes possession of the completed work: final walkthrough with the customer, explaining any warranties/guarantees and how to make a claim, providing care/maintenance guidance relevant to the trade, collecting final payment or confirming invoicing terms, requesting a review or referral, filing job photos and paperwork, and closing the job in the business\'s systems.',
  invoicing_and_payment:
    'Cover how and when invoices are issued (on completion, progress claims, deposit requirements), what an invoice must include (job reference, scope completed, GST, payment terms, bank details), accepted payment methods, standard payment terms (e.g. 7/14/30 days), the follow-up process for overdue accounts (reminder cadence, escalation, when work stops on an account), how variations/extra work get quoted and invoiced separately, and record-keeping requirements for accounting/tax purposes.',
  complaint_handling:
    'Cover how a customer complaint is received and logged (phone, email, in person), the target response time for acknowledging a complaint, how the issue is investigated (site revisit, photo review, speaking with the crew involved), the decision-making process for remedy (rework, partial refund, goodwill gesture) and who is authorised to approve each option, how the resolution is communicated to the customer, and how complaints are reviewed periodically to identify recurring issues in the business\'s processes.',
  subcontractor_onboarding:
    'Cover the steps taken before a new subcontractor starts work with the business: sighting their ABN/business registration and insurance certificates, agreeing rates and payment terms in writing, briefing them on the business\'s standard job protocols and communication expectations, providing site/job details and points of contact, setting expectations on quality standards and customer conduct, and the process for reviewing performance after the first few jobs.',
  equipment_and_vehicle_care:
    'Cover day-to-day responsibility for tools, equipment, and vehicles used in the business: pre-use checks before a job (fuel/charge, condition, load security), end-of-day/end-of-job checks (clean-down, return to storage, reporting damage or wear), a basic maintenance schedule (servicing intervals, consumables replacement), how faults or breakages are reported and who arranges repair, keeping equipment/vehicles presentable as they reflect the business\'s brand on the road and on site, and basic record-keeping for asset tracking and insurance purposes.',
}

export function buildSopPrompt(b: BusinessContext, processKey: string): string {
  const processName = fmt(processKey)
  const guidance =
    PROCESS_GUIDANCE[processKey] ??
    'Cover the full process from trigger to completion, who is responsible at each stage, what "done well" looks like, and how to handle common problems.'

  return `You are a professional business operations consultant helping Australian trade and construction small businesses run more consistently. Generate a complete Standard Operating Procedure (SOP) for one internal business process.

BUSINESS DETAILS:
- Name: ${b.name}
- ABN: ${b.abn ?? 'Not provided'}
- Address: ${b.address ?? 'Not provided'}
- Trade/service category: ${fmt(b.industry_type)}
- Employees: ${b.employee_count_range}
- Primary contact: ${whsPerson(b)}
- State: ${b.state}
- Services offered: ${b.work_activities.length > 0 ? b.work_activities.map(fmt).join(', ') : 'General trade services'}
- Date: ${currentMonth()}

PROCESS: ${processName.toUpperCase()}
Process guidance: ${guidance}

This SOP is an internal operations document — it is not a safety or compliance document. Its purpose is to make sure the process is done the same way every time, regardless of who is doing it, so the business runs consistently and customers get a predictable standard of service.

Generate a professional, usable SOP in markdown. Every section must be complete — no placeholders.

# Standard Operating Procedure
## ${processName.charAt(0).toUpperCase() + processName.slice(1)}

| Field | Detail |
|-------|--------|
| Business | ${b.name} |
| Process | ${processName} |
| Date prepared | ${currentMonth()} |
| Version | 1.0 |
| Prepared by | ${whsPerson(b)} |
| Review date | ${nextYear()} |

---

### 1. Purpose & Scope
Why this SOP exists, what it covers, and what it deliberately does not cover. Specific to ${fmt(b.industry_type)} operations at ${b.name}.

### 2. Roles & Responsibilities
Who is responsible for each stage of this process (owner/manager, office/admin, on-site crew, subcontractors as relevant) and what they are each accountable for. Reference ${whsPerson(b)} as the process owner unless a different role makes more sense for this process.

### 3. Step-by-Step Procedure
A clear numbered sequence covering the entire process from trigger to completion. Each step should be specific and actionable enough that a new staff member could follow it without additional explanation. Include realistic detail for a ${fmt(b.industry_type)} business — reference the kind of jobs implied by these services: ${b.work_activities.length > 0 ? b.work_activities.map(fmt).join(', ') : 'general trade work'}.

### 4. Quality Checkpoints
Specific points in the process where someone should stop and verify something before proceeding (a checklist-style list). What "good" looks like at each checkpoint.

### 5. Common Issues & How to Handle Them
At least 5 realistic problems that come up during this process for a business like ${b.name}, and the standard response to each — written so staff know what to do without needing to ask a manager every time.

### 6. Review Schedule
How often this SOP should be reviewed, what would trigger an earlier review (recurring problems, process change, new software/tools, staff feedback), and who is responsible for keeping it up to date.

---
*This SOP is a working document for ${b.name}. It should be updated as the business's processes evolve.*

Write 900–1,300 words. Professional Australian English. Do not use placeholder text — all content must be complete and usable. Do not reference workplace health and safety law, SafeWork, WorkSafe, or safety compliance obligations — this is a business-operations document, not a safety document.`
}

// ── Subcontractor / New-Hire Welcome Pack ─────────────────────

export function buildSubcontractorPackPrompt(b: BusinessContext): string {
  return `You are a professional small business operations consultant helping an Australian trade/construction business create onboarding content. Generate a complete Subcontractor & New Hire Welcome Pack.

BUSINESS DETAILS:
- Name: ${b.name}
- ABN: ${b.abn ?? 'Not provided'}
- Address: ${b.address ?? 'Not provided'}
- Trade/service category: ${fmt(b.industry_type)}
- Employees: ${b.employee_count_range}
- Primary contact: ${whsPerson(b)}
- State: ${b.state}
- Services offered: ${b.work_activities.length > 0 ? b.work_activities.map(fmt).join(', ') : 'General trade services'}
- Date: ${currentMonth()}

IMPORTANT: This is a welcome pack DOCUMENT — content to read and refer to. It is not a compliance-tracking system, not a legal contract, and not a safety induction. Do not reference workplace health and safety law, SafeWork, WorkSafe, or safety compliance obligations.

Generate a professional, warm but clear Welcome Pack in markdown. Every section must be complete — no placeholders.

# Welcome Pack
## ${b.name}

| Field | Detail |
|-------|--------|
| Prepared for | New subcontractors and team members |
| Date | ${currentMonth()} |
| Version | 1.0 |
| Prepared by | ${whsPerson(b)} |

---

### 1. Welcome & Company Overview
A genuine welcome message from ${b.name}. What the business does, the kind of work it takes on (${b.work_activities.length > 0 ? b.work_activities.map(fmt).join(', ') : 'general ' + fmt(b.industry_type) + ' work'}), the area(s) it services, what makes it a good business to work with, and what new subcontractors/team members can expect in their first few weeks.

### 2. Code of Conduct & Expectations
Clear expectations for professional behaviour: punctuality, presentation and uniform/branding, respectful treatment of customers and their property, language and conduct on site, use of phones/personal devices during work hours, punctuality with start times, and consequences of not meeting these standards. Written as a standard a small business would reasonably hold every worker to.

### 3. Standard Site/Job Protocols
Trade-specific expectations for how a job should be approached, tailored to ${fmt(b.industry_type)}: arriving prepared with the right tools/materials, protecting the customer's property (floor protection, drop sheets, dust control as relevant), keeping the work area tidy during the job, cleaning up at the end of each day and at job completion, parking and vehicle etiquette at the customer's property, and how to handle unexpected issues found on site (raise with office before proceeding with unscoped work).

### 4. Communication Expectations
How and when subcontractors/team members should communicate with the office: daily check-ins or job updates, who to contact for scheduling changes, how to report a problem or delay, expected response times, and the preferred channel (phone, text, email, job management app) for different kinds of communication.

### 5. Invoicing/Payment Terms for Subcontractors
How subcontractors submit invoices for completed work, what an invoice needs to include, standard payment terms and timing, how variations or extra work get approved and paid, and who to contact with a payment query.

### 6. Who to Contact for What
A simple reference table.

| Need | Contact |
|------|---------|
| Scheduling / job bookings | ${whsPerson(b)} |
| Payment / invoicing queries | ${whsPerson(b)} |
| Materials or equipment issues | ${whsPerson(b)} |
| General questions | ${whsPerson(b)} |

---
*Welcome to the team. This pack is a reference point — if anything is unclear, ask ${whsPerson(b)} directly.*

Write 900–1,200 words. Professional, welcoming Australian English. Do not use placeholder text — all content must be complete and usable. This is a content document, not a compliance or safety system.`
}

// ── Quote / Proposal Template ─────────────────────────────────

export function buildQuoteTemplatePrompt(b: BusinessContext, jobType: string): string {
  const jobName = fmt(jobType)

  return `You are a professional business consultant helping an Australian trade/construction business present quotes more professionally. Generate a complete, reusable Quote/Proposal Template STRUCTURE for a specific type of job — not a specific dollar quote for a real customer, but a polished template the business can reuse for every job of this type.

BUSINESS DETAILS:
- Name: ${b.name}
- ABN: ${b.abn ?? 'Not provided'}
- Address: ${b.address ?? 'Not provided'}
- Trade/service category: ${fmt(b.industry_type)}
- Employees: ${b.employee_count_range}
- Primary contact: ${whsPerson(b)}
- State: ${b.state}
- Services offered: ${b.work_activities.length > 0 ? b.work_activities.map(fmt).join(', ') : 'General trade services'}
- Date: ${currentMonth()}

JOB TYPE: ${jobName.toUpperCase()}

This is a TEMPLATE — use bracketed placeholders like [Customer Name], [Site Address], [Item description], [$ amount] wherever a real quote would need job-specific or customer-specific detail. Do not invent a specific dollar figure or a specific fictional customer. The value of this document is a ready-to-use structure ${b.name} can fill in for every ${jobName} job.

Generate a professional, branded-feeling quote template in markdown. Every section must be complete — no vague instructions, actual template content with placeholders.

# Quote / Proposal Template
## ${jobName.charAt(0).toUpperCase() + jobName.slice(1)}

| Field | Detail |
|-------|--------|
| Business | ${b.name} |
| ABN | ${b.abn ?? '[Insert ABN]'} |
| Template for | ${jobName} |
| Date prepared | ${currentMonth()} |
| Version | 1.0 |

---

### 1. Cover / Introduction
A professional cover section: business name and logo placeholder, quote reference number format, date, customer name and site address placeholders, and a brief introductory paragraph template thanking the customer for the opportunity to quote and summarising the job at a high level.

### 2. Scope of Work
A structured template for describing exactly what work will be performed for a typical ${jobName} job for a ${fmt(b.industry_type)} business — broken into logical stages or components relevant to this job type, with placeholders for job-specific detail (dimensions, materials, quantities, finish level).

### 3. Inclusions / Exclusions
Two clear lists: what is included in the price (materials, labour, standard items for this job type) and what is explicitly excluded (common exclusions for ${jobName} jobs — e.g. permits, unforeseen conditions, work outside the described scope, supply of items by others). Written so the customer has no ambiguity about what they are and are not paying for.

### 4. Pricing Table Structure
A markdown pricing table template with realistic line-item categories for a ${jobName} job (e.g. materials, labour, equipment hire, disposal/waste as relevant), placeholder amounts, subtotal, GST, and total. Include a note on how variations to scope will be priced separately.

| Item | Description | Qty | Unit Price | Total |
|------|-------------|-----|-----------|-------|
| [Item 1] | [Description] | [Qty] | [$Amount] | [$Amount] |

**Subtotal (ex. GST):** [$Amount]
**GST (10%):** [$Amount]
**Total (inc. GST):** [$Amount]

### 5. Terms
Payment schedule template (e.g. deposit on acceptance, progress payment, balance on completion — with placeholder percentages/amounts), quote validity period (standard practice, e.g. 30 days), and a clear explanation of the variations process — how additional work discovered during the job will be quoted, approved, and invoiced separately from this quote.

### 6. Acceptance / Signature Block
A formal acceptance section where the customer confirms they accept the quote and its terms.

| | |
|---|---|
| Customer name | [Insert] |
| Signature | |
| Date | |
| Accepted total | [$Amount] |
| Deposit paid (if applicable) | [$Amount] |

---
*This quote is valid for [30] days from the date above. All work will be carried out in accordance with the scope described. ${b.name} — ${whsPerson(b)}.*

Write 700–1,000 words. Professional Australian English. Use placeholders in brackets for anything customer/job-specific — do not invent fictional customer details or a fabricated price. All structural and instructional content must be complete and usable, not vague.`
}

// ── Business Policy Documents ─────────────────────────────────

const POLICY_GUIDANCE: Record<string, string> = {
  customer_service_policy:
    'Cover the standard of service customers can expect: response time commitments (enquiries, quotes, on-site arrival windows), communication standards, how appointments and rescheduling are handled, respect for customer property, how feedback is welcomed, and the business\'s general commitment to professionalism and fair dealing.',
  complaints_handling_procedure:
    'Cover how a customer complaint is lodged (channels, information needed), acknowledgement timeframe, investigation process, decision-making authority for remedies, communication of the outcome, timeframe for resolution, and the option to escalate internally if the customer is not satisfied with the initial response.',
  terms_of_trade:
    'Cover the standard commercial terms that apply to every job: quote validity, acceptance of quotes, payment terms and accepted methods, deposits and progress payments, ownership of materials until paid in full (retention of title), variations process and pricing, customer obligations (site access, services connected, obtaining necessary permissions), liability limitations for matters outside the business\'s control (e.g. pre-existing conditions, third-party delays), and dispute resolution approach.',
  cancellation_and_refund_policy:
    'Cover how a customer can cancel a booked job and the notice period required, any cancellation fee structure tied to notice given, how deposits are treated on cancellation, the business\'s approach to refunds where work has already commenced or materials already purchased, how rescheduling differs from cancellation, and the process a customer follows to request a cancellation or refund.',
  code_of_conduct:
    'Cover the standard of conduct expected of everyone representing the business (owners, employees, subcontractors): honesty and transparency with customers, respectful treatment of customers, colleagues, and the public, presentation and professionalism, protection of customer property and privacy, appropriate use of company vehicles/equipment/uniform, conflicts of interest, and the consequences of not upholding these standards.',
}

export function buildBusinessPolicyPrompt(b: BusinessContext, policyType: string): string {
  const policyName = fmt(policyType)
  const guidance =
    POLICY_GUIDANCE[policyType] ??
    'Cover the standard commercial content expected of this policy type for a small trade/service business, written in plain business English.'

  return `You are a professional small business consultant helping an Australian trade/construction business formalise its commercial policies. Generate a complete, usable business policy document.

BUSINESS DETAILS:
- Name: ${b.name}
- ABN: ${b.abn ?? 'Not provided'}
- Address: ${b.address ?? 'Not provided'}
- Trade/service category: ${fmt(b.industry_type)}
- Employees: ${b.employee_count_range}
- Primary contact: ${whsPerson(b)}
- State: ${b.state}
- Services offered: ${b.work_activities.length > 0 ? b.work_activities.map(fmt).join(', ') : 'General trade services'}
- Date: ${currentMonth()}

POLICY TYPE: ${policyName.toUpperCase()}
Policy guidance: ${guidance}

IMPORTANT: This is a general commercial policy document, not legal or safety advice. Do not reference workplace health and safety law, SafeWork, WorkSafe, or safety compliance obligations. Write standard business policy content that a small trade business would reasonably want on file and could hand to a customer or use internally.

Generate a professional policy document in markdown. Every section must be complete — no placeholders.

# ${policyName.charAt(0).toUpperCase() + policyName.slice(1)}
## ${b.name}

| Field | Detail |
|-------|--------|
| Version | 1.0 |
| Date | ${currentMonth()} |
| Review date | ${nextYear()} |
| Document owner | ${whsPerson(b)} |

---

### 1. Purpose
Why this policy exists and what it is intended to achieve for ${b.name} and its customers.

### 2. Scope
Who and what this policy applies to (customers, jobs, employees/subcontractors as relevant to this policy type) and any explicit exclusions.

### 3. Policy Statement
The core commitments and rules that make up this policy, written in clear plain English, specific to a ${fmt(b.industry_type)} business. This should be the most substantial section — cover every element flagged in the policy guidance above in full, usable detail rather than a bullet-point summary.

### 4. Procedure / How This Works in Practice
Step-by-step detail on how this policy is applied day to day — who does what, what timeframes apply, and what a customer or staff member should expect.

### 5. Responsibilities
Who within ${b.name} is responsible for upholding and administering this policy (reference ${whsPerson(b)} as the default owner unless the policy type suggests a different role).

### 6. Review
How often this policy will be reviewed and what would trigger an earlier review (customer feedback, recurring disputes, change in business operations).

---
*This policy is issued by ${b.name} and applies to all work carried out by the business unless otherwise agreed in writing.*

Write 800–1,200 words. Professional, plain Australian business English. Do not use placeholder text — all content must be complete and usable. This is standard commercial policy content, not legal or safety advice.`
}
