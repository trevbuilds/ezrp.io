/**
 * Build: what the scope turns into once somebody has to deliver it.
 *
 * `/scope` answers what is in — which streams, which modules, what got dragged
 * in, what concerns it raises. That is a diagnostic, and a diagnostic is not a
 * plan. Build answers the next question: given that scope, what has to be
 * written, decided, specified and proved, and in what order.
 *
 * Almost none of it is asserted here. The releases are the model's own phase
 * order over the sub-modules in scope; the interfaces to specify are the data
 * flows whose owning topic falls in that release; the prerequisites are the
 * ones the scope leans on without including. What is written here is the one
 * thing that cannot be derived: for each sub-module, the artefacts a team
 * actually has to produce before it can be called done.
 *
 * Artefacts are named as deliverables rather than activities. "Chart of
 * accounts design" is a thing that either exists or does not; "design the
 * chart of accounts" is a status update.
 */

import { flowsForScope, type DataFlow } from "./integrations";
import { guideBySlug } from "./guides";
import { subModuleBySlug, type SubModule } from "./model";
import { computeScope, type ScopeResult } from "./scope";

export type ArtefactKind = "decision" | "design" | "data" | "control" | "interface" | "capability";

export type Artefact = {
  name: string;
  /** A role, never a person. */
  owner: string;
  kind: ArtefactKind;
  /** The library topic covering how to do it. */
  topic?: string;
};

export const artefactKindLabel: Record<ArtefactKind, string> = {
  decision: "Decision",
  design: "Design",
  data: "Data",
  control: "Control",
  interface: "Interface",
  capability: "Capability",
};

/**
 * Per sub-module, what has to exist. Three or four each: the decision that
 * constrains everything else, the design, and the thing most often skipped.
 */
export const artefactsBySubModule: Record<string, Artefact[]> = {
  // ------------------------------------------------ Financial Accounting
  "general-ledger": [
    {
      name: "Chart of accounts and segment design",
      owner: "Finance",
      kind: "design",
      topic: "general-ledger",
    },
    {
      name: "Cost allocation and reporting dimension model",
      owner: "Finance",
      kind: "design",
      topic: "data-models",
    },
    {
      name: "Period close calendar and checklist",
      owner: "Finance",
      kind: "control",
      topic: "general-ledger",
    },
    {
      name: "Journal approval and posting authority matrix",
      owner: "Finance",
      kind: "control",
      topic: "sod-and-rbac",
    },
  ],
  "accounts-payable": [
    {
      name: "Matching tolerances and blocked invoice path",
      owner: "Accounts payable",
      kind: "decision",
      topic: "3-way-matching",
    },
    {
      name: "Non-PO spend policy, with the categories named",
      owner: "Finance",
      kind: "decision",
      topic: "procurement",
    },
    {
      name: "Supplier bank detail verification control",
      owner: "Finance",
      kind: "control",
      topic: "accounts-payable",
    },
    {
      name: "Payment run schedule and file specification",
      owner: "Treasury",
      kind: "interface",
      topic: "aba",
    },
  ],
  "accounts-receivable": [
    {
      name: "Billing trigger and revenue recognition design",
      owner: "Finance",
      kind: "design",
      topic: "accounts-receivable",
    },
    {
      name: "Credit policy and collections escalation path",
      owner: "Credit control",
      kind: "design",
      topic: "accounts-receivable",
    },
    {
      name: "Cash application and unapplied receipts design",
      owner: "Finance",
      kind: "design",
      topic: "bank-reconciliation",
    },
    {
      name: "Invoice and statement output specification",
      owner: "Finance",
      kind: "interface",
      topic: "accounts-receivable",
    },
  ],
  "asset-accounting": [
    {
      name: "Capitalisation policy, including overheads and the WIP boundary",
      owner: "Finance",
      kind: "decision",
      topic: "asset-management",
    },
    {
      name: "Componentisation and useful life schedule",
      owner: "Finance",
      kind: "design",
      topic: "asset-management",
    },
    {
      name: "Register mastership: which system owns which attribute",
      owner: "Finance and asset management",
      kind: "decision",
      topic: "asset-lifecycle-management",
    },
    {
      name: "Physical-to-financial register reconciliation",
      owner: "Finance",
      kind: "control",
      topic: "asset-lifecycle-management",
    },
  ],
  "cash-management": [
    {
      name: "Bank account structure and signatory matrix",
      owner: "Treasury",
      kind: "design",
      topic: "cash-management",
    },
    {
      name: "Statement feed and auto-matching rules",
      owner: "Treasury",
      kind: "interface",
      topic: "bank-reconciliation",
    },
    {
      name: "Cash forecasting model and its inputs",
      owner: "Treasury",
      kind: "design",
      topic: "cash-management",
    },
  ],

  // ----------------------------------------------------------- People/HCM
  "core-hr": [
    {
      name: "Organisation and position structure",
      owner: "HR",
      kind: "design",
      topic: "org-and-position-management",
    },
    {
      name: "Employee master data model and ownership",
      owner: "HR",
      kind: "data",
      topic: "core-hr",
    },
    {
      name: "Joiner, mover, leaver process with access triggers",
      owner: "HR and technology",
      kind: "control",
      topic: "sod-and-rbac",
    },
  ],
  payroll: [
    {
      name: "Pay component catalogue mapped to the ledger",
      owner: "Payroll",
      kind: "design",
      topic: "payroll",
    },
    {
      name: "Pay calendar, cut-offs and off-cycle policy",
      owner: "Payroll",
      kind: "decision",
      topic: "payroll",
    },
    {
      name: "Parallel run plan and acceptance criteria",
      owner: "Payroll",
      kind: "capability",
      topic: "payroll",
    },
    {
      name: "Statutory reporting setup: STP, super, payroll tax",
      owner: "Payroll",
      kind: "control",
      topic: "single-touch-payroll",
    },
    {
      name: "Long service leave rules per jurisdiction",
      owner: "Payroll",
      kind: "design",
      topic: "long-service-leave",
    },
  ],
  "time-and-attendance": [
    {
      name: "Award and agreement interpretation rule set",
      owner: "Payroll and HR",
      kind: "design",
      topic: "award-interpretation",
    },
    {
      name: "Roster patterns and approval hierarchy",
      owner: "Operations",
      kind: "design",
      topic: "rostering-and-scheduling",
    },
    {
      name: "Leave types, accrual rules and balances migration",
      owner: "Payroll",
      kind: "data",
      topic: "leave-management",
    },
  ],
  "talent-acquisition": [
    {
      name: "Requisition approval and position linkage",
      owner: "HR",
      kind: "design",
      topic: "talent-acquisition",
    },
    {
      name: "Candidate privacy and retention position",
      owner: "HR",
      kind: "control",
      topic: "talent-acquisition",
    },
    { name: "Offer to onboarding hand-off", owner: "HR", kind: "interface", topic: "onboarding" },
  ],
  "learning-and-development": [
    {
      name: "Competency and compliance training matrix",
      owner: "HR",
      kind: "design",
      topic: "learning-and-development",
    },
    {
      name: "Mandatory training evidence and expiry tracking",
      owner: "HR",
      kind: "control",
      topic: "compliance",
    },
  ],
  benefits: [
    {
      name: "Benefit catalogue and eligibility rules",
      owner: "HR",
      kind: "design",
      topic: "benefits",
    },
    {
      name: "Workers compensation declaration basis per jurisdiction",
      owner: "Payroll and risk",
      kind: "control",
      topic: "workers-compensation",
    },
  ],

  // ---------------------------------------------------- Customer & Revenue
  sales: [
    {
      name: "Pipeline stages with evidence-based exit criteria",
      owner: "Sales",
      kind: "design",
      topic: "sales-force-automation",
    },
    {
      name: "Customer master model and deduplication rules",
      owner: "Sales and finance",
      kind: "data",
      topic: "customer-data-management",
    },
    {
      name: "Quote approval and discount authority matrix",
      owner: "Sales",
      kind: "control",
      topic: "sales-force-automation",
    },
  ],
  "customer-support": [
    {
      name: "Case priority and service level definitions",
      owner: "Service",
      kind: "decision",
      topic: "customer-service-management",
    },
    {
      name: "Channel design and routing rules",
      owner: "Service",
      kind: "design",
      topic: "customer-service-management",
    },
    {
      name: "Knowledge base ownership and review cycle",
      owner: "Service",
      kind: "capability",
      topic: "customer-service-management",
    },
  ],
  "marketing-automation": [
    {
      name: "Consent and preference model",
      owner: "Marketing",
      kind: "control",
      topic: "marketing-automation",
    },
    {
      name: "Lead qualification and hand-off definition",
      owner: "Marketing and sales",
      kind: "decision",
      topic: "marketing-automation",
    },
  ],
  "field-service": [
    {
      name: "Work type catalogue and scheduling rules",
      owner: "Service",
      kind: "design",
      topic: "field-service-management",
    },
    {
      name: "Mobile offline behaviour and sync design",
      owner: "Technology",
      kind: "design",
      topic: "field-service-management",
    },
    {
      name: "Parts consumption and return-to-store path",
      owner: "Operations",
      kind: "interface",
      topic: "inventory-management",
    },
  ],

  // -------------------------------------------------------- Supply Chain
  procurement: [
    {
      name: "Delegation of authority mapped to approval limits",
      owner: "Finance",
      kind: "control",
      topic: "procurement",
    },
    {
      name: "Supplier master creation and verification control",
      owner: "Procurement",
      kind: "control",
      topic: "procurement",
    },
    {
      name: "Catalogue and contract pricing as data",
      owner: "Procurement",
      kind: "data",
      topic: "procurement",
    },
    {
      name: "Receipting accountability by category",
      owner: "Operations",
      kind: "decision",
      topic: "procurement",
    },
  ],
  "inventory-management": [
    {
      name: "Location hierarchy and valuation method",
      owner: "Operations",
      kind: "decision",
      topic: "inventory-management",
    },
    {
      name: "Cycle count programme by value class",
      owner: "Operations",
      kind: "control",
      topic: "inventory-management",
    },
    {
      name: "Adjustment authority and review",
      owner: "Finance",
      kind: "control",
      topic: "sod-and-rbac",
    },
  ],
  "order-processing": [
    {
      name: "Available-to-promise and allocation policy",
      owner: "Operations",
      kind: "decision",
      topic: "order-processing",
    },
    {
      name: "Credit check and order release rules",
      owner: "Credit control",
      kind: "control",
      topic: "order-processing",
    },
    {
      name: "Backorder and partial shipment handling",
      owner: "Operations",
      kind: "design",
      topic: "order-processing",
    },
  ],
  logistics: [
    {
      name: "Carrier rates and freight cost allocation",
      owner: "Logistics",
      kind: "data",
      topic: "logistics",
    },
    {
      name: "Proof of delivery capture, wired to billing",
      owner: "Logistics",
      kind: "interface",
      topic: "logistics",
    },
    { name: "Returns disposition rules", owner: "Operations", kind: "design", topic: "logistics" },
  ],

  // --------------------------------------------------------- Operations
  "production-planning": [
    {
      name: "Planning horizon, buckets and firming rules",
      owner: "Operations",
      kind: "decision",
      topic: "production-planning",
    },
    {
      name: "Capacity model and constraint definition",
      owner: "Operations",
      kind: "design",
      topic: "production-planning",
    },
    {
      name: "Shop floor confirmation method",
      owner: "Operations",
      kind: "design",
      topic: "production-planning",
    },
  ],
  "materials-management": [
    {
      name: "Bill of materials verification and revision control",
      owner: "Engineering",
      kind: "data",
      topic: "materials-management",
    },
    {
      name: "Safety stock and lead time basis",
      owner: "Operations",
      kind: "decision",
      topic: "materials-management",
    },
    {
      name: "Consumption recording method",
      owner: "Operations",
      kind: "design",
      topic: "materials-management",
    },
  ],
  "product-lifecycle-management": [
    {
      name: "Engineering change process with cut-in rules",
      owner: "Engineering",
      kind: "control",
      topic: "product-lifecycle-management",
    },
    {
      name: "Product costing at design stage",
      owner: "Finance and engineering",
      kind: "design",
      topic: "product-lifecycle-management",
    },
  ],
  "quality-control": [
    {
      name: "Inspection plans attached to material and operation",
      owner: "Quality",
      kind: "design",
      topic: "quality-control",
    },
    {
      name: "Quarantine and disposition design",
      owner: "Quality",
      kind: "control",
      topic: "quality-control",
    },
    {
      name: "Batch and lot traceability depth",
      owner: "Quality",
      kind: "decision",
      topic: "quality-control",
    },
  ],

  // ------------------------------------------------------------- Assets
  "maintenance-scheduling": [
    {
      name: "Criticality assessment and maintenance strategy per class",
      owner: "Asset management",
      kind: "decision",
      topic: "maintenance-scheduling",
    },
    {
      name: "Work order types and actuals capture design",
      owner: "Asset management",
      kind: "design",
      topic: "maintenance-scheduling",
    },
    {
      name: "Compliance inspection regimes and evidence",
      owner: "Asset management",
      kind: "control",
      topic: "enterprise-asset-management",
    },
  ],
  "asset-lifecycle-management": [
    {
      name: "Functional location and asset hierarchy",
      owner: "Asset management",
      kind: "design",
      topic: "asset-lifecycle-management",
    },
    {
      name: "Capital project to asset register hand-off",
      owner: "Finance and asset management",
      kind: "interface",
      topic: "asset-lifecycle-management",
    },
    {
      name: "Condition assessment scale and cycle",
      owner: "Asset management",
      kind: "capability",
      topic: "asset-lifecycle-management",
    },
  ],
  "energy-management": [
    {
      name: "Metering granularity and attribution model",
      owner: "Asset management",
      kind: "design",
      topic: "energy-management",
    },
    {
      name: "Normalised consumption baseline",
      owner: "Asset management",
      kind: "data",
      topic: "energy-management",
    },
  ],

  // -------------------------------------------------- Projects & Portfolio
  "project-planning": [
    {
      name: "Project and WBS structure, aligned to the ledger",
      owner: "PMO and finance",
      kind: "design",
      topic: "project-planning",
    },
    {
      name: "Stage gate definitions and approval authority",
      owner: "PMO",
      kind: "control",
      topic: "project-management",
    },
  ],
  "resource-planning": [
    {
      name: "Role, rate and capacity model",
      owner: "Resource management",
      kind: "design",
      topic: "resource-management",
    },
    {
      name: "Timesheet policy and approval path",
      owner: "Operations",
      kind: "control",
      topic: "time-and-attendance",
    },
  ],
  "project-costing": [
    {
      name: "Cost capture design: labour, plant, materials, overhead",
      owner: "Finance",
      kind: "design",
      topic: "project-costing",
    },
    {
      name: "Capitalisation trigger and WIP ageing rules",
      owner: "Finance",
      kind: "decision",
      topic: "asset-management",
    },
    {
      name: "Project to general ledger posting model",
      owner: "Finance",
      kind: "interface",
      topic: "general-ledger",
    },
  ],
  billing: [
    {
      name: "Contract billing rules and revenue recognition basis",
      owner: "Finance",
      kind: "design",
      topic: "billing",
    },
    {
      name: "Unbilled and accrued revenue treatment",
      owner: "Finance",
      kind: "control",
      topic: "billing",
    },
  ],

  // -------------------------------------------------- Data & Technology
  "business-intelligence": [
    {
      name: "Report inventory, with an owner and a decision each supports",
      owner: "Finance and technology",
      kind: "design",
      topic: "business-intelligence",
    },
    {
      name: "Single-source definitions for contested measures",
      owner: "Data",
      kind: "decision",
      topic: "data-models",
    },
  ],
  "data-warehousing": [
    {
      name: "Dimensional model and conformed dimensions",
      owner: "Data",
      kind: "design",
      topic: "data-warehousing",
    },
    {
      name: "Refresh cadence and latency expectations",
      owner: "Data",
      kind: "decision",
      topic: "data-warehousing",
    },
  ],
  "data-migration": [
    {
      name: "Migration strategy: what moves, what is archived, what is left",
      owner: "Data",
      kind: "decision",
      topic: "data-migration",
    },
    {
      name: "Reconciliation totals, agreed before the first load",
      owner: "Finance and data",
      kind: "control",
      topic: "data-migration",
    },
    {
      name: "Cleansing plan with an owner per data domain",
      owner: "Business data owners",
      kind: "data",
      topic: "data-migration",
    },
    {
      name: "Trial load results and defect log",
      owner: "Data",
      kind: "capability",
      topic: "data-migration",
    },
  ],
  "integration-catalogue": [
    {
      name: "Interface catalogue, with an owner on both sides of each",
      owner: "Technology",
      kind: "design",
      topic: "integration-catalogue",
    },
    {
      name: "Error handling, restart and reconciliation pattern",
      owner: "Technology",
      kind: "design",
      topic: "technical-specifications",
    },
  ],
  middleware: [
    {
      name: "Integration pattern standard and when to use each",
      owner: "Technology",
      kind: "decision",
      topic: "integration",
    },
    {
      name: "Monitoring and alerting for every interface",
      owner: "Technology",
      kind: "control",
      topic: "integration",
    },
  ],
  "sod-and-rbac": [
    {
      name: "Conflict matrix in business language",
      owner: "Finance and risk",
      kind: "decision",
      topic: "sod-and-rbac",
    },
    {
      name: "Role design built against the matrix",
      owner: "Technology and business",
      kind: "design",
      topic: "security",
    },
    {
      name: "Recertification cycle and privileged access controls",
      owner: "Risk",
      kind: "control",
      topic: "security",
    },
  ],
  "disaster-recovery": [
    {
      name: "Recovery time and recovery point objectives, business-signed",
      owner: "Business owners",
      kind: "decision",
      topic: "disaster-recovery",
    },
    {
      name: "Runbooks written for someone who did not build it",
      owner: "Technology",
      kind: "capability",
      topic: "disaster-recovery",
    },
    {
      name: "Manual workarounds for processes that must continue",
      owner: "Business owners",
      kind: "capability",
      topic: "bcp",
    },
  ],

  // ----------------------------------------------------------- Delivery
  governance: [
    {
      name: "Terms of reference per forum, with decision rights",
      owner: "Delivery",
      kind: "decision",
      topic: "governance",
    },
    {
      name: "One integrated plan across workstreams",
      owner: "Delivery",
      kind: "design",
      topic: "pmo",
    },
    {
      name: "Decision and action register",
      owner: "Delivery",
      kind: "control",
      topic: "actions-and-decisions",
    },
    {
      name: "Change control route and approval thresholds",
      owner: "Delivery",
      kind: "control",
      topic: "change-requests",
    },
    {
      name: "Budget including internal effort, backfill and the year after",
      owner: "Delivery and finance",
      kind: "decision",
      topic: "erp-project-budgeting",
    },
  ],
  "go-live-toolkit": [
    {
      name: "Cutover plan at task level, with owners and durations",
      owner: "Delivery",
      kind: "design",
      topic: "cutover-and-go-live",
    },
    {
      name: "Go/no-go criteria, agreed before the pressure",
      owner: "Delivery and business",
      kind: "decision",
      topic: "go-live-toolkit",
    },
    {
      name: "Rollback plan and the point of no return",
      owner: "Delivery",
      kind: "control",
      topic: "cutover-checklist",
    },
    {
      name: "Business validation scripts, run by the business",
      owner: "Business owners",
      kind: "capability",
      topic: "functional-module-implementation",
    },
    {
      name: "Hypercare model covering the first period close",
      owner: "Delivery",
      kind: "capability",
      topic: "go-live-toolkit",
    },
  ],
  "change-people-and-adoption": [
    {
      name: "Change impact assessment, role by role",
      owner: "Change",
      kind: "design",
      topic: "change-people-and-adoption",
    },
    {
      name: "Named business owner accountable for adoption",
      owner: "Business sponsor",
      kind: "decision",
      topic: "change-is-the-word",
    },
    {
      name: "Training on the process, in a realistic environment",
      owner: "Change",
      kind: "capability",
      topic: "change-people-and-adoption",
    },
    {
      name: "Adoption measures, tracked after go-live",
      owner: "Change",
      kind: "control",
      topic: "change-people-and-adoption",
    },
  ],
};

/**
 * The gates. Not a methodology — five questions a programme has to be able to
 * answer, in order, with evidence rather than confidence.
 */
export type Gate = {
  name: string;
  question: string;
  criteria: string[];
};

export const gates: Gate[] = [
  {
    name: "Mobilise",
    question: "Is this fundable, resourced and governed?",
    criteria: [
      "Scope baselined, with the exclusions written down rather than assumed.",
      "Named people released at named percentages, with backfill funded.",
      "Budget covering internal effort and the twelve months after go-live.",
      "Governance forums standing, with decision rights and a tested decision route.",
      "Data quality measured and cleansing already under way.",
    ],
  },
  {
    name: "Design signed off",
    question: "Do we know what we are building, in enough detail to test it?",
    criteria: [
      "Every design artefact for the sub-modules in this release produced and accepted.",
      "Standard-first: each departure from standard behaviour justified in writing.",
      "Interfaces specified on both sides, including error handling and reconciliation.",
      "Acceptance criteria testable — nothing that two people could read differently.",
      "Segregation of duties conflict matrix agreed before role design begins.",
    ],
  },
  {
    name: "Built and tested",
    question: "Does it work end to end, not just module by module?",
    criteria: [
      "Integration testing owned by the programme, with its own scenarios and data.",
      "Business acceptance by people who will use it, running their own work.",
      "Open defects inside the agreed threshold, by severity.",
      "Parallel or trial runs completed where the process demands it.",
      "Configuration documented as built, not reconstructed later.",
    ],
  },
  {
    name: "Ready to cut over",
    question: "Can we go — and if it turns, can we come back?",
    criteria: [
      "Cutover rehearsed end to end, with timings that have stopped changing.",
      "Reconciliation totals agreed between source and target in advance.",
      "Go/no-go criteria assessed objectively, with a real no-go option.",
      "Rollback tested, with the point of no return on the plan.",
      "Access provisioned from position data; legacy access removal scheduled.",
      "Hypercare rostered through the first period close.",
    ],
  },
  {
    name: "Benefits owned",
    question: "Has anybody accepted responsibility for the result?",
    criteria: [
      "Each benefit has a named owner outside the programme and a measured baseline.",
      "Adoption measured on what people do in the system, not on survey sentiment.",
      "Workarounds found in the first quarter and their causes closed.",
      "Deferred scope either funded or formally dropped.",
      "The programme actually stood down, with support owning the estate.",
    ],
  },
];

export type ReleasePlan = {
  /** One-based, matching the model's phase order. */
  index: number;
  subModules: SubModule[];
  artefacts: Array<Artefact & { subModule: string }>;
  /** Flows whose owning topic falls in this release — specify them here. */
  interfaces: DataFlow[];
};

export type BuildPlan = {
  scope: ScopeResult;
  releases: ReleasePlan[];
  /** Artefacts for sub-modules the scope depends on but does not include. */
  prerequisites: Array<{ subModule: SubModule; artefacts: Artefact[] }>;
  /** Sub-modules in scope with no artefacts recorded yet. */
  uncovered: SubModule[];
  gates: Gate[];
  /** Everything counted, for the summary line. */
  totals: { artefacts: number; interfaces: number; decisions: number };
};

const withSubModule = (slug: string) =>
  (artefactsBySubModule[slug] ?? []).map((artefact) => ({ ...artefact, subModule: slug }));

/** The sub-module a flow belongs to, via the topic that owns it. */
const subModuleOfFlow = (flow: DataFlow) => guideBySlug.get(flow.topic)?.subModule ?? null;

export function buildPlan(picks: string[]): BuildPlan {
  const scope = computeScope(picks);
  const flows = flowsForScope(scope.topics.map((guide) => guide.slug));
  // External and straddling flows are the ones that need specifying: an
  // internal flow with both ends in scope is a design decision, not an
  // interface anyone has to negotiate.
  const toSpecify = [...flows.straddling, ...flows.external];
  const assigned = new Set<DataFlow>();

  const releases: ReleasePlan[] = scope.phases.map((phase, index) => {
    const slugs = new Set(phase.map((sub) => sub.slug));
    const interfaces = toSpecify.filter((flow) => {
      if (assigned.has(flow)) return false;
      const sub = subModuleOfFlow(flow);
      if (!sub || !slugs.has(sub)) return false;
      assigned.add(flow);
      return true;
    });
    return {
      index: index + 1,
      subModules: phase,
      artefacts: phase.flatMap((sub) => withSubModule(sub.slug)),
      interfaces,
    };
  });

  // Anything left over belongs to a topic outside the phased sub-modules —
  // usually a straddling flow whose other end is the part not being changed.
  const orphaned = toSpecify.filter((flow) => !assigned.has(flow));
  const last = releases[releases.length - 1];
  if (last && orphaned.length > 0) last.interfaces.push(...orphaned);

  const prerequisites = scope.prerequisites
    .map((sub) => ({ subModule: sub, artefacts: artefactsBySubModule[sub.slug] ?? [] }))
    .filter((entry) => entry.artefacts.length > 0);

  const uncovered = scope.phases
    .flat()
    .filter((sub) => (artefactsBySubModule[sub.slug] ?? []).length === 0);

  const allArtefacts = releases.flatMap((release) => release.artefacts);
  return {
    scope,
    releases,
    prerequisites,
    uncovered,
    gates,
    totals: {
      artefacts: allArtefacts.length,
      interfaces: releases.reduce((sum, release) => sum + release.interfaces.length, 0),
      decisions: allArtefacts.filter((artefact) => artefact.kind === "decision").length,
    },
  };
}

export const subModuleName = (slug: string) => subModuleBySlug.get(slug)?.name ?? slug;
