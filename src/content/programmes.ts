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
];

export const programmeBySlug = new Map(programmes.map((p) => [p.slug, p]));

export const dispositionLabel: Record<Disposition, string> = {
  rebuild: "Rebuild",
  carry: "Carry as-is",
  retire: "Retire",
  decide: "Not decided",
};
