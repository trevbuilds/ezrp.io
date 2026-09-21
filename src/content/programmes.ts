/**
 * Programmes: a named piece of work, mapped against the model.
 *
 * Everything else in this library is universal — the modules, the streams, the
 * considerations. A programme is the opposite: one organisation, one decision,
 * one set of constraints. It exists to show the model doing the thing it is
 * for, which is turning "we are replacing finance" into a scope somebody can
 * argue with.
 *
 * The important design rule is that a programme asserts as little as possible.
 * It names what is being changed (`picks`) and what is deliberately not
 * (`excluded`), and everything downstream — the streams, the modules dragged
 * in, the phase order, the interfaces that straddle the boundary — is derived
 * by `computeScope` from the same model the rest of the site uses. If the
 * model is wrong, the programme page is wrong in the same way, which is the
 * point.
 *
 * What cannot be derived is the organisation's own situation: the legacy
 * estate, the sector's accounting shape, the decisions that have to be settled
 * before mobilisation. That is what is written here.
 */

import type { Country, Industry, OrgSize, OrgType } from "./context";

/** What happens to an interface the legacy system carries today. */
export type Disposition = "rebuild" | "carry" | "retire" | "decide";

export type BoundaryInterface = {
  name: string;
  /** The system on the other side, in the organisation's own words. */
  counterpart: string;
  payload: string;
  direction: "in" | "out" | "both";
  disposition: Disposition;
  /** Why this one is not routine. */
  note: string;
};

/** A design question that has to be settled before configuration starts. */
export type ProgrammeDecision = {
  question: string;
  /** What turns on it. */
  stake: string;
  /** When it has to be closed, in programme terms. */
  by: string;
  /** The library topic that covers the general case, where one exists. */
  topic?: string;
};

export type ProgrammeRisk = {
  risk: string;
  consequence: string;
  mitigation: string;
};

export type ReadinessItem = {
  item: string;
  state: "ready" | "gap" | "unknown";
  note: string;
};

/** A release, narrated. The order itself comes from the model. */
export type Release = {
  name: string;
  goal: string;
  /** What has to be true at the end of it for the next one to start. */
  proves: string;
};

/** An artefact the programme has to produce, and where the guidance lives. */
export type WorkItem = {
  artefact: string;
  owner: string;
  topic: string;
};

export type Programme = {
  slug: string;
  /** What the programme is called. */
  name: string;
  /** One line, for listings. */
  summary: string;
  /**
   * Context chips. All optional — a worked example that names no sector is
   * still a useful worked example, and naming one it does not have is worse
   * than naming none.
   */
  industry?: Industry;
  orgType?: OrgType;
  size?: OrgSize;
  country?: Country;
  /** How this page was built, stated plainly. */
  provenance: string;
  /** The estate as it stands. */
  situation: string[];
  /** Why this is being done now. */
  drivers: string[];
  /** Guide slugs. Everything derived flows from these. */
  picks: string[];
  /** Named exclusions, each with the reason. Silence here is what causes scope fights. */
  excluded: Array<{ area: string; why: string }>;
  /** What this organisation's shape does to an otherwise generic finance build. */
  contextDesign: Array<{ heading: string; detail: string }>;
  boundary: BoundaryInterface[];
  releases: Release[];
  decisions: ProgrammeDecision[];
  risks: ProgrammeRisk[];
  readiness: ReadinessItem[];
  work: WorkItem[];
};

export const programmes: Programme[] = [
  {
    slug: "legacy-finance-core",
    name: "Replacing the legacy finance core",
    summary:
      "An organisation replacing its legacy finance system as the first step into an ERP — mapped against the model, with the parts it cannot change alone made explicit.",
    orgType: "Government",
    size: "200–2,000",
    country: "Australia",
    provenance:
      "A composite worked example, not a client. It is assembled from patterns that recur in asset-intensive, externally regulated organisations, and from this library's model. No organisation is described. Every derived section — the streams, the modules dragged in, the phase order, the straddling interfaces — is computed from the same model the rest of the site runs on.",

    situation: [
      "The finance core is the oldest system in the estate and the one everything else posts to. It holds the general ledger, payables, receivables control, cash and the fixed asset register, and it has been extended over enough years that nobody can now state its customisations without going to look.",
      "It is not the only place finance happens. Customer billing sits in its own system and reaches the ledger as a summary; work order costs sit in the works and asset system and reach it as a periodic journal; project costs sit partly in both. The finance core is the place those three meet, which is why replacing it is not a finance project.",
      "The reporting layer around it is spreadsheets. Statutory reporting, the regulatory cost allocation and the capital programme position are all assembled outside the system from extracts, and the assembly is held by a small number of people.",
      "Support is thin. The people who know why the customisations exist are fewer each year, and the vendor's support position on the current version is the clock this programme is actually running against.",
    ],

    drivers: [
      "End of support on the current version, which converts a discretionary decision into a dated one.",
      "Regulatory cost allocation is assembled manually each period, which makes the external submission expensive to produce and hard to defend line by line.",
      "The capital programme is the largest thing the organisation does and its financial position is reconstructed rather than reported.",
      "Segregation of duties is maintained by convention in a finance team small enough that several conflicting combinations sit with one person.",
      "Every one of those is a reason to change something. Only the first is a reason to change it this year.",
    ],

    picks: [
      "general-ledger",
      "accounts-payable",
      "accounts-receivable",
      "cash-management",
      "asset-management",
      "procurement",
      "data-migration",
    ],

    excluded: [
      {
        area: "Customer billing",
        why: "A large customer base, its own regulatory obligations and its own release cycle. It stays, and the receivable becomes an interface rather than a sub-ledger. This is the largest single scope decision on the programme and it should be made once, in writing.",
      },
      {
        area: "Works and asset management",
        why: "The maintenance system keeps the work orders and the physical asset register. Finance takes the costs and owns the financial asset register. The reconciliation between the two registers is in scope even though neither system is.",
      },
      {
        area: "Payroll and HR",
        why: "Out of scope for this release, in scope as an interface. The payroll journal and the net pay file both land in the finance core, so 'not changing payroll' still means testing payroll.",
      },
      {
        area: "The operational technology estate",
        why: "No financial transaction originates there. Named here only so that it is named, because it is the assumption most often left unstated.",
      },
      {
        area: "Inventory",
        why: "The model flags it as a prerequisite this scope leans on. If stores are staying where they are, that is a decision; if the ledger will take stock movements from a system nobody is changing, that interface belongs on the list below.",
      },
    ],

    contextDesign: [
      {
        heading: "Regulated and non-regulated activity",
        detail:
          "Where an economic regulator sets prices, cost has to be allocated by regulated service and the allocation has to be defensible line by line rather than reconstructed in a spreadsheet afterwards. That is a chart of accounts and cost allocation design decision, and it is the one that most constrains every other posting decision. Making it after the chart is built is the expensive order.",
      },
      {
        heading: "Two asset registers that are both correct",
        detail:
          "The statutory register carries fair value under the applicable financial reporting standards; a regulatory asset base carries a different valuation on a different roll-forward for price setting. They are not a reconciliation error — they are two answers to two questions. The system has to produce both without either being maintained by hand.",
      },
      {
        heading: "Capital is the main event",
        detail:
          "Most of what an asset-intensive organisation spends is capital. Capitalisation policy, treatment of overheads, work in progress ageing and the point at which a project becomes an asset are finance design decisions with an operational input, and they determine whether the capital programme can be reported at all.",
      },
      {
        heading: "Assets that arrive without an invoice",
        detail:
          "Contributed infrastructure and customer contributions arrive as assets and revenue with no supplier invoice and no cash receipt. They need a designed path in, or they become a year-end journal nobody can evidence.",
      },
      {
        heading: "Public sector reporting obligations",
        detail:
          "Reporting under the jurisdiction's financial management legislation, the model financial report, periodic returns to Treasury and audit by the auditor-general are fixed inputs. They shape the close calendar, the evidence the system must retain, and the go-live window — a cutover that lands across statutory reporting is a cutover that will be moved.",
      },
      {
        heading: "Procurement probity",
        detail:
          "Government purchasing policy, social procurement obligations and the associated disclosure apply to the buying process regardless of what the finance system does. The system has to evidence them, not just permit them.",
      },
      {
        heading: "Australian payroll and banking obligations",
        detail:
          "Single Touch Payroll, superannuation guarantee and ABA payment files apply even where payroll is out of scope, because the files and the journals still land here. Allowances under an enterprise agreement are the part most likely to be assumed rather than tested.",
      },
    ],

    boundary: [
      {
        name: "Billing revenue and receivables",
        counterpart: "Customer billing system",
        payload: "Revenue postings, receivable balances and cash applied",
        direction: "in",
        disposition: "rebuild",
        note: "Today's interface posts a summary the ledger cannot decompose. If it is rebuilt at the same grain, regulatory revenue reporting stays a spreadsheet exercise. This is the interface to design first, not to port.",
      },
      {
        name: "Bank statement and payment files",
        counterpart: "Banking platform",
        payload: "Statements in, ABA and direct entry files out",
        direction: "both",
        disposition: "rebuild",
        note: "Format, testing window and the bank's own change lead time are on the critical path and are outside the programme's control. Book it early.",
      },
      {
        name: "Payroll journal and net pay",
        counterpart: "Payroll system",
        payload: "Period journal in, net pay file out",
        direction: "both",
        disposition: "carry",
        note: "Not changing payroll does not mean not testing payroll. A failed payroll journal is a month that does not close, and a failed pay file is a pay day that does not happen.",
      },
      {
        name: "Work order costs and capitalisation",
        counterpart: "Works and asset management system",
        payload:
          "Labour, plant and materials costs; capitalised project costs; asset register alignment",
        direction: "in",
        disposition: "rebuild",
        note: "The highest-value and highest-risk interface on the programme. It carries most of the capital spend and it is the point where the financial and physical asset registers are supposed to agree.",
      },
      {
        name: "Statutory and Treasury reporting",
        counterpart: "Departmental and regulator reporting",
        payload: "Statutory accounts, periodic returns, regulatory cost allocation",
        direction: "out",
        disposition: "rebuild",
        note: "Currently assembled from extracts by a small number of people. The replacement either fixes this or inherits it, and inheriting it is a choice that should be made deliberately.",
      },
      {
        name: "Supplier invoicing",
        counterpart: "Suppliers, e-invoicing and portals",
        payload: "Supplier invoices in, remittance advice out",
        direction: "both",
        disposition: "rebuild",
        note: "The chance to move non-PO spend onto a purchase order is here, and it closes once the new process is live and the workarounds have set.",
      },
      {
        name: "Stores and inventory movements",
        counterpart: "Stores system",
        payload: "Stock movements and valuation",
        direction: "in",
        disposition: "decide",
        note: "Whether stores moves, stays or is absorbed has not been settled in this scope. Until it is, the ledger has a sub-ledger with no named owner.",
      },
      {
        name: "Reporting extracts",
        counterpart: "Data warehouse and reporting",
        payload: "Trial balance, cash position and dimensional extracts",
        direction: "out",
        disposition: "rebuild",
        note: "Every downstream report is written against the old chart of accounts. Chart changes are reporting changes, and the effort belongs in this programme rather than in the reporting team's backlog.",
      },
    ],

    releases: [
      {
        name: "Foundation",
        goal: "Chart of accounts, cost allocation, the ledger, procurement and the migration route standing, with the cutover plan being rehearsed rather than written.",
        proves:
          "A trial balance in the new chart that reconciles to the old one, and a regulatory allocation produced from the system rather than from a spreadsheet.",
      },
      {
        name: "Sub-ledgers",
        goal: "Payables and receivables live against the new ledger, with three-way matching working from procurement data and billing revenue posting at the grain the regulatory view needs.",
        proves:
          "A full period closed with both sub-ledgers agreeing to their control accounts, and no manual journal carrying the difference.",
      },
      {
        name: "Cash and assets",
        goal: "Cash, treasury and bank reconciliation running daily; both asset registers produced from the system; capital work in progress reported rather than reconstructed.",
        proves:
          "A statutory close and a regulatory position produced from the system, audited, with the first full year-end inside hypercare cover.",
      },
    ],

    decisions: [
      {
        question: "Does the receivable stay in the billing system, or move?",
        stake:
          "It decides the size of the programme. Moving it brings the whole customer base and its regulatory obligations with it; leaving it makes the revenue interface the most important design artefact on the programme.",
        by: "Before scope is baselined — it is not a design decision, it is the scope.",
        topic: "accounts-receivable",
      },
      {
        question:
          "What is the chart of accounts, and does it carry the regulatory allocation natively?",
        stake:
          "Every posting decision, every report and every interface depends on it. A chart designed for statutory reporting alone leaves the regulatory submission where it is now.",
        by: "Before configuration starts. Chart changes after the first sub-ledger posts are the most expensive change a finance programme makes.",
        topic: "general-ledger",
      },
      {
        question: "Which system is master for the asset register, and for which attributes?",
        stake:
          "The financial register and the physical register will not agree unless somebody decides which one is right about what. Left undecided, the reconciliation becomes a permanent manual activity.",
        by: "Before the works interface is specified.",
        topic: "asset-management",
      },
      {
        question: "How far does procurement change?",
        stake:
          "Payables inherits whatever procurement hands it. Three-way matching cannot be delivered without purchase orders and receipts, and a matching engine with no receipting discipline produces blocked invoices and manual workarounds.",
        by: "With scope, because it determines whether supply chain is a stakeholder or a workstream.",
        topic: "procurement",
      },
      {
        question: "Does stores stay where it is?",
        stake:
          "The model flags inventory as a prerequisite this scope depends on without including. Either it is staying and the interface is named, or it is moving and the scope is larger than stated.",
        by: "Before the first release is planned.",
        topic: "inventory-management",
      },
      {
        question: "Where does the cutover sit against the statutory calendar?",
        stake:
          "A cutover landing near a statutory reporting date, a regulatory submission or year-end will be moved, late and expensively. The calendar is fixed; the cutover is not.",
        by: "At mobilisation, because it constrains everything else.",
        topic: "cutover-and-go-live",
      },
      {
        question: "Who backfills the finance team?",
        stake:
          "The subject matter experts this programme needs are the people who close the month. Without funded backfill, the programme runs on evenings and the close slips, and both fail slowly.",
        by: "Before mobilisation, with the budget.",
        topic: "digital-transformation-readiness-checklist",
      },
    ],

    risks: [
      {
        risk: "Revenue posts from billing at a grain the regulatory view cannot use.",
        consequence:
          "The regulatory submission stays a manual assembly, and the largest single benefit of the programme is not delivered.",
        mitigation:
          "Design the revenue interface against the regulatory reporting requirement first, and prove it in the foundation release rather than at user acceptance.",
      },
      {
        risk: "The works and capitalisation interface is treated as a technical build.",
        consequence:
          "Capital work in progress is wrong from go-live, and the capital programme cannot be reported in its first year.",
        mitigation:
          "Own it as a joint finance and asset design, with both register owners named and a reconciliation designed before the interface is specified.",
      },
      {
        risk: "Data migration starts when the programme needs it rather than when it needs to start.",
        consequence:
          "Opening balances that nobody can reconcile to the legacy ledger, discovered at cutover rehearsal.",
        mitigation:
          "Cleansing begins before mobilisation, with quality measured and an owner per data domain; reconciliation totals agreed in advance of the first trial load.",
      },
      {
        risk: "Segregation of duties is designed around the team that exists.",
        consequence:
          "Conflicts are built into the role design and become an audit finding the system now enforces.",
        mitigation:
          "Build the conflict matrix from business risk, then design roles against it; where separation is genuinely impossible, document the compensating control rather than leaving it silent.",
      },
      {
        risk: "Customisation is rebuilt because it exists.",
        consequence: "The estate's unupgradeability is carried into the new system on day one.",
        mitigation:
          "Every customisation carried forward states its business reason and is assessed against standard behaviour; the ones whose reason no longer exists are dropped deliberately.",
      },
      {
        risk: "Change is funded as training.",
        consequence:
          "A technically successful go-live where the finance team runs the old process through the new system and the benefits do not appear.",
        mitigation:
          "Change resourced from mobilisation with an accountable business owner, and adoption measured after go-live rather than assumed.",
      },
    ],

    readiness: [
      {
        item: "Executive sponsorship with tenure",
        state: "unknown",
        note: "An eighteen-month programme needs a sponsor who will still be accountable at the end of it, and a succession position if they will not.",
      },
      {
        item: "Finance capacity released and backfilled",
        state: "gap",
        note: "The most common reason a finance replacement slips. Named people, named percentages, funded backfill — or the programme is resourced on goodwill.",
      },
      {
        item: "Master data quality measured",
        state: "gap",
        note: "Supplier and asset master duplication and completeness, measured rather than estimated, with an owner per domain and cleansing already under way.",
      },
      {
        item: "Interface catalogue",
        state: "gap",
        note: "Including the scheduled extracts and spreadsheets nobody owns. The catalogue is the honest measure of what replacing this system actually costs.",
      },
      {
        item: "Customisation register",
        state: "gap",
        note: "What was changed, and why. Without the why, every customisation is either rebuilt or dropped on a guess.",
      },
      {
        item: "Governance that can decide at programme speed",
        state: "unknown",
        note: "Measure decision latency before mobilisation. A programme needs decisions faster than business as usual, not slower.",
      },
      {
        item: "Statutory calendar mapped against the plan",
        state: "gap",
        note: "Close dates, reporting deadlines, audit and the regulatory submission — plotted before the cutover date is chosen rather than after.",
      },
    ],

    work: [
      {
        artefact: "Chart of accounts and cost allocation design, carrying the regulatory view",
        owner: "Finance",
        topic: "general-ledger",
      },
      {
        artefact: "Revenue and receivable interface specification, at reporting grain",
        owner: "Finance and billing",
        topic: "accounts-receivable",
      },
      {
        artefact: "Procure-to-pay process design, including the non-PO spend position",
        owner: "Finance and procurement",
        topic: "procurement",
      },
      {
        artefact: "Three-way matching tolerances and the blocked invoice path",
        owner: "Accounts payable",
        topic: "3-way-matching",
      },
      {
        artefact: "Capitalisation policy and the works-to-finance costing interface",
        owner: "Finance and asset management",
        topic: "asset-management",
      },
      {
        artefact: "Asset register mastership and reconciliation design",
        owner: "Finance and asset management",
        topic: "asset-lifecycle-management",
      },
      {
        artefact: "Bank file, statement feed and reconciliation design",
        owner: "Treasury",
        topic: "bank-reconciliation",
      },
      {
        artefact: "ABA and direct entry file specification and bank testing plan",
        owner: "Treasury",
        topic: "aba",
      },
      {
        artefact: "Data migration strategy, reconciliation totals and cleansing plan",
        owner: "Finance and data",
        topic: "data-migration",
      },
      {
        artefact: "Interface catalogue, with an owner on both sides of each one",
        owner: "Technology",
        topic: "integration-catalogue",
      },
      {
        artefact: "Segregation of duties conflict matrix and role design",
        owner: "Finance and risk",
        topic: "sod-and-rbac",
      },
      {
        artefact: "Cutover plan, rehearsal schedule and go/no-go criteria",
        owner: "Delivery",
        topic: "cutover-and-go-live",
      },
      {
        artefact: "Programme budget including internal effort, backfill and the year after go-live",
        owner: "Delivery",
        topic: "erp-project-budgeting",
      },
      {
        artefact: "Change impact assessment by role, and the adoption measures",
        owner: "Change",
        topic: "change-is-the-word",
      },
      {
        artefact:
          "Health check of the current estate, to test whether replacement is the right answer",
        owner: "Finance and technology",
        topic: "erp-health-check",
      },
    ],
  },

  // ------------------------------------------------- Core HR and payroll
  {
    slug: "core-hr-and-payroll",
    name: "Replacing HR and payroll",
    summary:
      "An operational organisation with field crews replacing its HR and payroll systems — where the hard part is the enterprise agreement, not the pay run.",
    orgType: "Government",
    size: "200–2,000",
    country: "Australia",
    provenance:
      "A composite worked example, not a client. It is assembled from patterns that recur in operational organisations with a field workforce under an enterprise agreement, and from this library's model. No organisation is described, and every derived section is computed from the same model the rest of the site runs on.",

    situation: [
      "Employee data lives in three places. The payroll system holds what it needs to pay people, a separate HR system holds the establishment, and the org chart that everyone actually uses is a spreadsheet maintained by one person.",
      "The payroll system works, which is the problem. Its award and agreement rules were configured over a decade and modified in place, and nobody now holds a written statement of what they are. The instrument they were built from has been replaced twice since.",
      "Time capture is split. Office staff use a form; field crews record hours on paper or in the works system, and somebody re-keys them before each pay. Allowances — on-call, standby, travel, higher duties — are the part most often corrected after payment.",
      "Leave balances are carried forward rather than calculated. Long service leave in particular is a number nobody can reconstruct, because the service history behind it was migrated as a balance two systems ago.",
      "Statutory reporting works but is fragile. Single Touch Payroll and superannuation submit successfully; the reconciliation behind them is manual and held by one person.",
    ],

    drivers: [
      "The vendor's support position on the current payroll version is the clock this is actually running against.",
      "Nobody can state the current pay rules, which makes every enterprise agreement negotiation a technical risk rather than an industrial one.",
      "Re-keying field hours each cycle is a recurring cost and the largest single source of pay correction.",
      "Long service leave liability is an estimate, and the first person to challenge a payout will expose that.",
      "Only the first of those is a reason to change it this year. The others are reasons to do it properly when you do.",
    ],

    picks: ["core-hr", "payroll", "time-and-attendance", "benefits", "data-migration"],

    excluded: [
      {
        area: "Recruitment and onboarding",
        why: "Deliberately later. It depends on the position structure this release establishes, and adding it now doubles the change load on the same HR team.",
      },
      {
        area: "Learning, performance and talent",
        why: "Out for this release, and the model flags them as dragged in by the hire-to-retire stream. That is worth reading as a warning rather than dismissing: if the new system ships with them switched on, people will start using them unsupported.",
      },
      {
        area: "Finance",
        why: "Out of scope, in scope as an interface. The payroll journal and the net pay file both land in finance, so not changing finance still means testing finance — twice, because a failed journal is a month that does not close and a failed pay file is a pay day that does not happen.",
      },
      {
        area: "The works and rostering system",
        why: "Stays. Field hours and rosters originate there, which makes that interface the difference between this programme removing the re-keying or preserving it.",
      },
    ],

    contextDesign: [
      {
        heading: "The enterprise agreement is the specification",
        detail:
          "Rebuilding pay rules from the old system copies a decade of undocumented modification into a new platform. They have to be rebuilt from the instrument — the current agreement and the award that underpins it — and the gap between the two is the single most valuable output of this programme. Expect that audit to find rules nobody can justify and rules nobody knew existed.",
      },
      {
        heading: "Allowances are where the effort is",
        detail:
          "On-call, standby, callout, travel, higher duties, and the interaction between them on a public holiday. The base rate is configured in an afternoon; the allowance interactions are weeks, and they are what people notice when they are wrong.",
      },
      {
        heading: "Payroll tax is eight obligations, not one",
        detail:
          "A state tax with its own threshold, rate and grouping rules in each jurisdiction, assessed separately in each. The taxable wage base rarely matches gross pay, so the mapping belongs on the wage type as a reportable classification rather than in a spreadsheet at lodgement.",
      },
      {
        heading: "Long service leave rests on service history",
        detail:
          "A state entitlement with a different accrual, qualifying period and pro-rata threshold in each jurisdiction, and in some industries a portable scheme where the entitlement follows the worker. It is calculated from continuous service, which is the data most likely to have been lost in a previous migration.",
      },
      {
        heading: "Workers compensation is its own wage definition",
        detail:
          "A different scheme with a different premium basis in every state, declared on a wage definition that matches neither payroll tax nor superannuation. The industry classification it is rated on is usually set once at registration and never revisited.",
      },
      {
        heading: "Federal obligations do not vary",
        detail:
          "Single Touch Payroll, the superannuation guarantee and the Fair Work modern award system are national. They are not the part that changes at a border, which is exactly why the state obligations above are the ones that get missed.",
      },
      {
        heading: "Public sector workforce reporting",
        detail:
          "Establishment, headcount, executive remuneration and workforce composition are reported externally on definitions set outside the organisation. The position structure has to support those definitions natively, or the reporting becomes another spreadsheet.",
      },
    ],

    boundary: [
      {
        name: "Payroll journal",
        counterpart: "Finance system",
        payload: "Period journal, costed to cost centre, project and activity",
        direction: "out",
        disposition: "rebuild",
        note: "The costing dimensions the journal carries decide whether labour can be reported against work. Getting this at the wrong grain is how an organisation ends up unable to say what a job cost.",
      },
      {
        name: "Net pay and deductions",
        counterpart: "Banking platform",
        payload: "ABA direct entry file",
        direction: "out",
        disposition: "rebuild",
        note: "The bank's own testing window is outside the programme's control and sits on the critical path. Book it before the plan is baselined.",
      },
      {
        name: "Superannuation contributions",
        counterpart: "SuperStream gateway and funds",
        payload: "Contribution data and payments",
        direction: "out",
        disposition: "rebuild",
        note: "Late or failed contributions attract the superannuation guarantee charge, which is not tax deductible. This is not an interface to leave until integration testing.",
      },
      {
        name: "Single Touch Payroll",
        counterpart: "ATO",
        payload: "Pay event, on or before each pay day",
        direction: "out",
        disposition: "rebuild",
        note: "Phase 2 disaggregates gross into components, so the wage type design and the reporting design are the same decision.",
      },
      {
        name: "Field hours and rosters",
        counterpart: "Works and rostering system",
        payload: "Approved time, roster patterns, allowances earned",
        direction: "in",
        disposition: "rebuild",
        note: "The highest-value interface on the programme. Today this is re-keyed, and the re-keying is the largest source of pay correction. If it is carried rather than rebuilt, the business case loses most of its benefit.",
      },
      {
        name: "Employee master to downstream systems",
        counterpart: "Identity, access and operational systems",
        payload: "Starters, movers, leavers and position data",
        direction: "out",
        disposition: "rebuild",
        note: "The model drags security into scope for exactly this reason. Access that is not provisioned and revoked from the HR record accumulates, and mover is the case usually missed.",
      },
      {
        name: "Workers compensation declarations",
        counterpart: "Scheme insurer in each jurisdiction",
        payload: "Declarable wages by jurisdiction and classification",
        direction: "out",
        disposition: "rebuild",
        note: "Its own wage definition, per state. Build it as a mapping on the wage type, not as an annual reconstruction.",
      },
      {
        name: "Portable long service scheme returns",
        counterpart: "State portable scheme, where the industry is covered",
        payload: "Service returns and levies",
        direction: "out",
        disposition: "decide",
        note: "Whether any part of this workforce is covered has not been settled. The obligation exists whether or not anyone has claimed, so it is a question to close before design rather than after.",
      },
    ],

    releases: [
      {
        name: "Establishment",
        goal: "Core HR standing on an agreed organisation and position structure, with employee master data migrated and its ownership named, and cutover being rehearsed rather than written.",
        proves:
          "Headcount and establishment reported from the system and agreed to the current external return, with service history verifiable for the longest-serving employees.",
      },
      {
        name: "Time and entitlements",
        goal: "Time capture live for both office and field, rosters and allowances interpreted from the agreement, and leave — long service included — accruing under the rule for where each employee works.",
        proves:
          "A full cycle of field hours flowing from the works system with no re-keying, and long service leave recalculated from service history rather than carried as a balance.",
      },
      {
        name: "Payroll",
        goal: "Payroll live with statutory reporting, after parallel runs that agree, and hypercare covering the first end of financial year.",
        proves:
          "Consecutive parallel runs agreeing to the cent on gross, net, tax, super and every allowance — with the differences that remain explained and accepted, not averaged away.",
      },
    ],

    decisions: [
      {
        question: "What do the pay rules actually say?",
        stake:
          "Everything. Rebuilding from the old system copies undocumented modification forward; rebuilding from the instrument means an audit that will find rules nobody can justify. One of those is a programme, the other is a migration.",
        by: "Before configuration starts, and resourced as its own piece of work.",
        topic: "award-interpretation",
      },
      {
        question: "Is the establishment position-based or person-based?",
        stake:
          "It determines whether the structure survives people leaving, whether access can be provisioned from a position, and whether workforce reporting works without manual assembly.",
        by: "Before core HR is configured. Changing it later re-levels everything beneath it.",
        topic: "org-and-position-management",
      },
      {
        question: "Where does field time originate?",
        stake:
          "The works system, a new time system, or a form. This is the difference between removing the re-keying and preserving it, and it is most of the benefit in the business case.",
        by: "With scope, because it decides whether operations is a stakeholder or a workstream.",
        topic: "time-and-attendance",
      },
      {
        question: "Who owns the employee master?",
        stake:
          "One system has to be right about each attribute. Left undecided, HR and payroll diverge within a quarter and the reconciliation becomes permanent manual work.",
        by: "Before the first interface is specified.",
        topic: "core-hr",
      },
      {
        question: "How many parallel runs, and what makes one pass?",
        stake:
          "Parallel running is the gate, not a test. Criteria set in advance are the only thing that stops a run with unexplained variances being declared successful because the date is close.",
        by: "At mobilisation, because it sets the length of the tail of the plan.",
        topic: "payroll",
      },
      {
        question: "Which jurisdictions do we employ in, and are any covered by a portable scheme?",
        stake:
          "Payroll tax, long service leave and workers compensation are all assessed per state. An employer over the line in three states has three of each, and a portable scheme adds levies whether or not leave is taken.",
        by: "Before entitlement rules are configured.",
        topic: "long-service-leave",
      },
      {
        question: "Who runs the pays while the programme is running?",
        stake:
          "The people who know the rules are the people who pay everyone every fortnight. Without funded backfill, the programme runs on their evenings and the pay run is what slips.",
        by: "Before mobilisation, with the budget.",
        topic: "digital-transformation-readiness-checklist",
      },
    ],

    risks: [
      {
        risk: "Pay rules are rebuilt from the old system rather than from the agreement.",
        consequence:
          "A decade of undocumented modification is carried into the new platform, and the organisation still cannot state its own rules.",
        mitigation:
          "Fund the interpretation audit as a deliverable in its own right, against the current instrument, and treat every rule with no traceable basis as a decision rather than a fact.",
      },
      {
        risk: "Service history is migrated as balances.",
        consequence:
          "Long service leave cannot be recalculated, audited or defended, and the first contested termination payout exposes it.",
        mitigation:
          "Migrate service, not balances. Verify continuous service for the longest-serving cohort before the first trial load, and reconcile the recalculated entitlement to the ledger provision.",
      },
      {
        risk: "Field allowances are discovered during parallel running.",
        consequence:
          "The tail of the programme extends by months, and the first live pay run corrects people who are already unhappy about the change.",
        mitigation:
          "Work the allowance interactions early with the crews who earn them, using real rosters including public holidays and callouts, before the base pay rules are signed off.",
      },
      {
        risk: "Parallel running is treated as a test rather than a gate.",
        consequence:
          "Go-live on a run with unexplained variances, and every variance becomes a live pay defect affecting a real person.",
        mitigation:
          "Set pass criteria before the first run, require consecutive passes, and make no-go a genuine option at the gate.",
      },
      {
        risk: "Talent, learning and performance arrive switched on but unsupported.",
        consequence:
          "People start using modules nobody has designed, trained or resourced, and the data in them becomes something the organisation later has to trust.",
        mitigation:
          "Decide deliberately what is enabled at go-live. Out of scope has to mean switched off, not merely unmentioned.",
      },
      {
        risk: "Access is not provisioned from the HR record.",
        consequence:
          "Starters wait, leavers keep their access, and movers accumulate the union of every role they have held — which is the audit finding.",
        mitigation:
          "Treat joiner, mover and leaver as one designed process across HR and security, with mover tested explicitly because it is the case usually missed.",
      },
    ],

    readiness: [
      {
        item: "Current industrial instruments collected",
        state: "gap",
        note: "The current enterprise agreement, the underpinning award and any side letters, in one place, as the basis for interpretation.",
      },
      {
        item: "Written statement of existing pay rules",
        state: "gap",
        note: "Almost never exists. Its absence is the largest single unknown on this type of programme, and discovering it during design is the expensive order.",
      },
      {
        item: "Service history verifiable",
        state: "gap",
        note: "Continuous service dates for the longest-serving employees, evidenced rather than carried forward.",
      },
      {
        item: "Organisation and position structure agreed",
        state: "unknown",
        note: "Agreed by the business, not reconstructed from the payroll system's cost centres.",
      },
      {
        item: "Payroll team capacity released and backfilled",
        state: "gap",
        note: "They run the pays. Without funded backfill both the programme and the fortnightly cycle degrade at once.",
      },
      {
        item: "Jurisdictions and scheme coverage confirmed",
        state: "gap",
        note: "Which states employ people, which portable schemes apply, and which workers compensation scheme and classification in each.",
      },
      {
        item: "Field workforce engaged",
        state: "unknown",
        note: "The crews whose allowances and rosters are hardest to model are usually the last consulted and the first affected.",
      },
    ],

    work: [
      {
        artefact:
          "Award and enterprise agreement interpretation rule set, traced to the instrument",
        owner: "Payroll and HR",
        topic: "award-interpretation",
      },
      {
        artefact: "Organisation and position structure design",
        owner: "HR",
        topic: "org-and-position-management",
      },
      {
        artefact: "Employee master data model, with ownership per attribute",
        owner: "HR",
        topic: "core-hr",
      },
      {
        artefact: "Pay component catalogue, mapped to the ledger and to STP Phase 2",
        owner: "Payroll",
        topic: "payroll",
      },
      {
        artefact: "Field time and roster interface specification",
        owner: "Payroll and operations",
        topic: "time-and-attendance",
      },
      {
        artefact: "Leave and long service leave rules per jurisdiction",
        owner: "Payroll",
        topic: "long-service-leave",
      },
      {
        artefact: "Payroll tax registration, wage mapping and grouping position",
        owner: "Payroll and finance",
        topic: "payroll-tax",
      },
      {
        artefact: "Workers compensation declaration basis and classification review",
        owner: "Payroll and risk",
        topic: "workers-compensation",
      },
      {
        artefact: "Superannuation and Single Touch Payroll reporting setup",
        owner: "Payroll",
        topic: "single-touch-payroll",
      },
      {
        artefact: "Service history migration and reconciliation plan",
        owner: "Payroll and data",
        topic: "data-migration",
      },
      {
        artefact: "Parallel run plan, with pass criteria set in advance",
        owner: "Payroll",
        topic: "payroll",
      },
      {
        artefact: "Joiner, mover, leaver process with access triggers",
        owner: "HR and technology",
        topic: "sod-and-rbac",
      },
      {
        artefact: "Change impact assessment, by role and including field crews",
        owner: "Change",
        topic: "change-people-and-adoption",
      },
    ],
  },

  // ---------------------------------------------- Capital programme (PPM)
  {
    slug: "capital-programme-ppm",
    name: "Standing up project and portfolio management",
    summary:
      "A capital-intensive organisation getting control of the largest thing it does — where the problem is not scheduling, it is that the capital programme's financial position is reconstructed rather than reported.",
    orgType: "Government",
    size: "200–2,000",
    country: "Australia",
    provenance:
      "A composite worked example, not a client. It is assembled from patterns that recur in capital-intensive organisations under external funding scrutiny, and from this library's model. No organisation is described, and every derived section is computed from the same model the rest of the site runs on.",

    situation: [
      "Capital is the largest thing the organisation spends and the least visible thing it reports. The programme is planned in one tool, costed in the finance system, delivered through contractors managed in email, and reported in a monthly spreadsheet assembled by hand.",
      "Project costs arrive from three directions: contractor invoices through payables, internal labour through payroll, and materials and plant through the works system. Nothing joins them at the project until somebody does it in a spreadsheet.",
      "Work in progress ages. Projects are practically complete long before they are financially closed, so capital sits in work in progress, depreciation starts late, and the asset register lags the network by months.",
      "Nobody can answer the two questions that matter at once — what has this project cost to date, and what is it forecast to cost — from the same source.",
      "The portfolio is a list, not a portfolio. Projects are approved individually against a funding envelope that is managed centrally, so trade-offs between them are made in conversation rather than against a model.",
    ],

    drivers: [
      "Capital delivery is reported externally against a funding determination, and the reporting is manual enough that its accuracy depends on a small number of people.",
      "Capitalisation lags delivery, which misstates both the asset base and the operating result.",
      "Forecast to complete is produced by asking delivery managers, which means it is optimistic and unauditable.",
      "Contractor spend is committed in email before it is committed in a system, so commitment against budget is known late.",
      "None of those is an end of support date, which makes this the harder kind of business case: there is no clock, only cost.",
    ],

    picks: [
      "project-management",
      "billing",
      "asset-management",
      "asset-lifecycle-management",
      "procurement",
    ],

    excluded: [
      {
        area: "The general ledger",
        why: "Stays. The model flags it as a prerequisite this scope depends on without including — which is correct and is the thing to watch: project costing posts into a chart of accounts nobody is changing, so the project structure has to fit the ledger rather than the reverse.",
      },
      {
        area: "Detailed scheduling and site delivery tools",
        why: "Stay with the delivery teams. The programme needs the cost, commitment and completion signals out of them, not to replace them.",
      },
      {
        area: "Maintenance and works management",
        why: "Out for this release. Renewal work blurs the boundary between maintenance and capital, so the classification rule matters more than which system the work order lives in.",
      },
      {
        area: "Payroll",
        why: "Out of scope, in scope as an interface. Internal labour is a real project cost and it originates in payroll, so timesheet-to-project costing has to be designed even though payroll is not changing.",
      },
    ],

    contextDesign: [
      {
        heading: "Capital versus operating is the decision, not a classification",
        detail:
          "Where the boundary sits — what is renewal and what is maintenance, which overheads are capitalisable, when a project becomes an asset — determines the reported result, the asset base and what can be recovered through prices. It is a finance decision with an operational input, and it has to be written as a rule rather than judged per job.",
      },
      {
        heading: "Work in progress is a balance with an age",
        detail:
          "Capital sitting in work in progress is not neutral: depreciation has not started, the asset is not in the register, and the longer it sits the harder it is to substantiate. Ageing work in progress deliberately, with an owner and a threshold, is the control most often missing.",
      },
      {
        heading: "Project structure has to serve two reports",
        detail:
          "Delivery wants the programme by project and phase; finance and the funder want it by asset class, service and regulated category. One structure has to carry both, which makes the project and work breakdown design a joint artefact rather than a delivery preference.",
      },
      {
        heading: "Commitment matters more than spend",
        detail:
          "A contract awarded is money committed, and in capital delivery the gap between commitment and invoice is months. A programme reported on invoiced spend is reported on the wrong number, and the overrun is already locked in by the time it appears.",
      },
      {
        heading: "Contributed and gifted assets",
        detail:
          "Infrastructure contributed by third parties arrives as an asset with no purchase order, no invoice and no cash movement. It needs a designed path in, or it becomes a year-end journal nobody can evidence.",
      },
      {
        heading: "Government procurement applies to the contractors",
        detail:
          "Most capital spend leaves the organisation through contracts. Government purchasing policy, local content and social procurement obligations and the associated disclosure all attach to that spend, and the system has to evidence them rather than merely permit them.",
      },
      {
        heading: "Funding is determined, not requested",
        detail:
          "Where an external body sets the envelope, capital is reported against a determination on that body's categories. The chart of accounts and the project structure have to produce those categories natively or the submission stays a spreadsheet.",
      },
    ],

    boundary: [
      {
        name: "Contractor commitment and spend",
        counterpart: "Procurement and payables",
        payload: "Contracts, purchase orders, receipts and invoices, against project",
        direction: "in",
        disposition: "rebuild",
        note: "The interface that makes commitment visible before invoice. Without it the programme is reported on spend, which is the number that arrives too late to act on.",
      },
      {
        name: "Internal labour costs",
        counterpart: "Payroll",
        payload: "Timesheet hours costed to project and activity",
        direction: "in",
        disposition: "rebuild",
        note: "Internal effort is a real capital cost and is the one most often left out, which understates project cost and overstates the operating result.",
      },
      {
        name: "Materials and plant",
        counterpart: "Works and stores systems",
        payload: "Issues, plant hire and usage against project",
        direction: "in",
        disposition: "decide",
        note: "Whether these route through the project or straight to the ledger has not been settled. Until it is, project cost is incomplete by an amount nobody has quantified.",
      },
      {
        name: "Capitalisation and the asset register",
        counterpart: "Finance and asset management",
        payload: "Capitalised project costs, componentised, with in-service dates",
        direction: "out",
        disposition: "rebuild",
        note: "The highest-value interface here. It is where the capital programme becomes an asset, where depreciation starts, and where the financial and physical registers are supposed to agree.",
      },
      {
        name: "Project postings to the ledger",
        counterpart: "General ledger",
        payload: "Cost, accrual and capitalisation journals",
        direction: "out",
        disposition: "rebuild",
        note: "Into a chart of accounts nobody is changing. The project structure has to fit it, and that constraint should be established before the structure is designed rather than discovered during build.",
      },
      {
        name: "Capital programme reporting",
        counterpart: "Board, funder and regulator reporting",
        payload: "Delivery and financial position by the funder's categories",
        direction: "out",
        disposition: "rebuild",
        note: "Currently assembled by hand. The replacement either fixes this or inherits it, and inheriting it should be a decision rather than an outcome.",
      },
      {
        name: "Contributed assets",
        counterpart: "Third party contributors",
        payload: "Asset details, valuation and handover documentation",
        direction: "in",
        disposition: "decide",
        note: "No invoice, no cash, and usually no designed path. Decide it before the first one arrives in the new system.",
      },
    ],

    releases: [
      {
        name: "Structure and commitment",
        goal: "Project and work breakdown structure agreed against both the delivery view and the ledger, the asset hierarchy it will capitalise into established, and contractor commitment captured at award rather than at invoice.",
        proves:
          "The capital programme reported from the system on committed cost, in the funder's categories, without a spreadsheet in the middle.",
      },
      {
        name: "Cost to asset",
        goal: "Every cost stream landing on the project, capitalisation running to a written rule, work in progress aged with an owner and a threshold, and forecast to complete produced by a method rather than by asking.",
        proves:
          "A project closed financially within a defined period of practical completion, capitalised and componentised into the register, with depreciation starting on the in-service date rather than the closure date.",
      },
      {
        name: "Recovery and reporting",
        goal: "Recoverable and billable work invoiced from project cost, and the external capital submission produced from the system.",
        proves:
          "The funder submission and the board pack generated from the same source as the ledger, reconciling to it without adjustment.",
      },
    ],

    decisions: [
      {
        question: "Where is the capital and operating boundary, in writing?",
        stake:
          "It moves the reported result, the asset base and what is recoverable. Judged per job it will be inconsistent, and inconsistency is what an auditor tests for.",
        by: "Before the project structure is designed. Everything downstream encodes it.",
        topic: "asset-management",
      },
      {
        question: "What is the project and work breakdown structure?",
        stake:
          "It has to serve delivery reporting and the funder's categories at once. Designing it for one and mapping to the other afterwards is the version that ends in a spreadsheet.",
        by: "Before configuration, jointly between delivery and finance.",
        topic: "project-planning",
      },
      {
        question: "Do materials and plant route through the project?",
        stake:
          "If not, project cost is incomplete and nobody can say by how much. If so, the works and stores interfaces are in scope whether or not those systems are changing.",
        by: "With scope, because it determines the interface list.",
        topic: "project-costing",
      },
      {
        question: "Is internal labour capitalised, and at what rate?",
        stake:
          "It is real cost and it is the one most often omitted. Excluding it understates the asset and overstates the operating result; including it needs a defensible rate and a timesheet discipline that does not exist yet.",
        by: "Before the payroll interface is specified.",
        topic: "project-costing",
      },
      {
        question: "What closes a project?",
        stake:
          "Practical completion and financial closure are different events, and the gap between them is where work in progress ages. Without a rule and an owner, projects stay open for years.",
        by: "Before the first release goes live, with a threshold and an escalation.",
        topic: "asset-lifecycle-management",
      },
      {
        question: "Who owns the forecast?",
        stake:
          "A forecast produced by asking delivery managers is optimistic and unauditable. One produced from commitment, actuals and a method is defensible. The difference is a governance decision, not a system feature.",
        by: "At mobilisation, because it decides what the reporting is built to produce.",
        topic: "project-costing",
      },
    ],

    risks: [
      {
        risk: "The project structure is designed for delivery alone.",
        consequence:
          "Every external report needs a mapping layer, and the mapping layer is a spreadsheet maintained by one person — which is the problem this programme exists to solve.",
        mitigation:
          "Make the structure a joint artefact of delivery and finance, and test it against the funder's actual reporting categories before it is configured.",
      },
      {
        risk: "Capitalisation is treated as a finance month-end task.",
        consequence:
          "Work in progress ages, depreciation starts late, the asset register lags the network, and the asset base reported externally is wrong.",
        mitigation:
          "Design capitalisation as a joint process with asset management, triggered by an in-service event owned by delivery, with work in progress ageing reported every period.",
      },
      {
        risk: "Commitment is not captured until invoice.",
        consequence:
          "Overruns are visible months after they are locked in, and the programme is governed on a number that is always out of date.",
        mitigation:
          "Capture commitment at contract award, report committed against budget as the primary measure, and treat invoiced spend as the lagging indicator it is.",
      },
      {
        risk: "Internal labour stays outside project cost.",
        consequence:
          "Project cost is understated by a material amount, whole-of-life comparisons are wrong, and the operating result carries cost that belongs in the asset.",
        mitigation:
          "Settle the capitalisation position and the rate early, and build the timesheet discipline before the interface, because the interface cannot create data that is not captured.",
      },
      {
        risk: "The programme is scoped as a scheduling tool.",
        consequence:
          "A better plan, reported the same way as before, with the financial position still assembled by hand.",
        mitigation:
          "Hold the business case to the reporting outcome rather than the planning capability, and make producing the external submission from the system a gate criterion.",
      },
      {
        risk: "Delivery managers are asked to become cost accountants.",
        consequence:
          "Data entry resented and done badly, which makes the reporting worse than the spreadsheet it replaced.",
        mitigation:
          "Design for what a delivery manager already knows and can confirm; derive the rest. Where a field needs a finance judgement, route it to finance rather than to site.",
      },
    ],

    readiness: [
      {
        item: "Written capitalisation policy",
        state: "gap",
        note: "Including the treatment of overheads and internal labour, and the renewal versus maintenance boundary. Usually exists as practice rather than as a rule.",
      },
      {
        item: "Work in progress position understood",
        state: "gap",
        note: "The current balance, its age, and how much relates to projects that are practically complete. It is almost always larger and older than expected.",
      },
      {
        item: "Funder reporting categories mapped",
        state: "gap",
        note: "The actual categories the external submission requires, obtained before the project structure is designed rather than after.",
      },
      {
        item: "Chart of accounts constraint accepted",
        state: "unknown",
        note: "The ledger is not changing in this scope. Whether the project structure can fit it, or whether that assumption breaks, should be tested early.",
      },
      {
        item: "Timesheet discipline",
        state: "gap",
        note: "Internal labour cannot be costed to projects that nobody books time against. This is a behaviour change, not a configuration.",
      },
      {
        item: "Asset register condition",
        state: "unknown",
        note: "What the capital programme will be capitalising into, including whether the financial and physical registers currently agree.",
      },
      {
        item: "Delivery and finance sponsorship, jointly",
        state: "gap",
        note: "This programme fails when it has one of the two. The structure, the capitalisation rule and the forecast method all need both.",
      },
    ],

    work: [
      {
        artefact:
          "Capitalisation policy, including overheads, internal labour and the renewal boundary",
        owner: "Finance",
        topic: "asset-management",
      },
      {
        artefact: "Project and work breakdown structure, serving delivery and the funder",
        owner: "Delivery and finance",
        topic: "project-planning",
      },
      {
        artefact: "Cost capture design across contractor, labour, materials and plant",
        owner: "Finance",
        topic: "project-costing",
      },
      {
        artefact: "Commitment capture at contract award",
        owner: "Procurement",
        topic: "procurement",
      },
      {
        artefact: "Capitalisation and in-service trigger, with asset management",
        owner: "Finance and asset management",
        topic: "asset-lifecycle-management",
      },
      {
        artefact: "Work in progress ageing control, with owner and threshold",
        owner: "Finance",
        topic: "asset-management",
      },
      {
        artefact: "Forecast to complete method, and who owns the number",
        owner: "Delivery and finance",
        topic: "project-costing",
      },
      {
        artefact: "Contributed asset recognition path",
        owner: "Finance and asset management",
        topic: "asset-lifecycle-management",
      },
      {
        artefact: "Recoverable and billable work rules",
        owner: "Finance",
        topic: "billing",
      },
      {
        artefact: "Capital programme reporting pack, produced from the system",
        owner: "Finance and delivery",
        topic: "business-intelligence",
      },
      {
        artefact: "Stage gate definitions and approval authority for the portfolio",
        owner: "PMO",
        topic: "project-management",
      },
      {
        artefact: "Change impact assessment for delivery managers and site teams",
        owner: "Change",
        topic: "change-people-and-adoption",
      },
    ],
  },
];

export const programmeBySlug = new Map(programmes.map((p) => [p.slug, p]));

export const dispositionLabel: Record<Disposition, string> = {
  rebuild: "Rebuild",
  carry: "Carry as-is",
  retire: "Retire",
  decide: "Not decided",
};
