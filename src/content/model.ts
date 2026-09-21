/**
 * The EZRP structural model.
 *
 * Two hierarchies intersect, which is how tier-1 vendors separate application
 * structure from end-to-end process, and how APQC separates function from
 * process:
 *
 *   Structure   Band → Module → Sub-module → Component
 *   Flow        Value stream (L1) → Sub-stream (L2) → Process → Step
 *
 * They join at the bottom: a process belongs to a sub-module and sits in a
 * sub-stream. That is why a stream can cross modules without anyone wiring it
 * by hand — Procure-to-Pay crosses because its requisition and purchase-order
 * processes live in supply chain sub-modules while its invoice, match and
 * payment processes live in finance. The crossing is derived from where the
 * work actually happens.
 *
 * Considerations are the third axis. They are tagged at the lowest level and
 * roll up, so a compliance obligation on one process surfaces on the stream
 * and the module above it. The set is a working base, not a closed list.
 */

/** Where something sits in the structural or flow hierarchy. */
export type Level =
  "Band" | "Module" | "Sub-module" | "Value stream" | "Sub-stream" | "Process" | "Step";

/**
 * Cross-cutting lenses. Tagged at the lowest level and aggregated upward.
 * Working base from the Clariti model — expected to grow.
 */
export type Consideration =
  "Compliance" | "People" | "Governance" | "Technology" | "Delivery" | "Strategy";

export const allConsiderations: Consideration[] = [
  "Strategy",
  "Governance",
  "Compliance",
  "People",
  "Technology",
  "Delivery",
];

/** Applicability, kept separate from level and from consideration. */
export type Scope = "Global" | "Local-AU" | "Common";

export type Band =
  | "Finance"
  | "People"
  | "Customer & Revenue"
  | "Operations & Assets"
  | "Programmes, Projects & Data";

export const allBands: Band[] = [
  "Finance",
  "People",
  "Customer & Revenue",
  "Operations & Assets",
  "Programmes, Projects & Data",
];

/** Module slug → band. The twelve modules of the ERP Field Guide. */
export const bandByModule: Record<string, Band> = {
  // Finance and People are separate functions and stay separate at the top
  // level, which differs from the field guide's combined "Finance & People".
  "financial-accounting": "Finance",
  "human-capital-management": "People",
  "customer-relationship-management": "Customer & Revenue",
  "supply-chain-management": "Customer & Revenue",
  manufacturing: "Operations & Assets",
  "enterprise-asset-management": "Operations & Assets",
  "project-management": "Programmes, Projects & Data",
  "data-services": "Programmes, Projects & Data",
  integration: "Programmes, Projects & Data",
  security: "Programmes, Projects & Data",
  pmo: "Programmes, Projects & Data",
  "change-people-and-adoption": "Programmes, Projects & Data",
};

/**
 * Sub-modules, named the way tier-1 vendors carve their application
 * components up. These are the things a client actually selects when they say
 * "we are changing our payables" — one level below the module.
 */
export type SubModule = {
  slug: string;
  name: string;
  module: string;
};

export const subModules: SubModule[] = [
  // Financial Accounting
  { slug: "general-ledger", name: "General Ledger", module: "financial-accounting" },
  { slug: "accounts-payable", name: "Accounts Payable", module: "financial-accounting" },
  { slug: "accounts-receivable", name: "Accounts Receivable", module: "financial-accounting" },
  { slug: "asset-accounting", name: "Asset Accounting", module: "financial-accounting" },
  { slug: "cash-management", name: "Cash & Treasury", module: "financial-accounting" },

  // Human Capital Management
  { slug: "core-hr", name: "Core HR", module: "human-capital-management" },
  { slug: "payroll", name: "Payroll", module: "human-capital-management" },
  {
    slug: "time-and-attendance",
    name: "Time & Attendance",
    module: "human-capital-management",
  },
  { slug: "talent-acquisition", name: "Talent Acquisition", module: "human-capital-management" },
  {
    slug: "learning-and-development",
    name: "Learning & Development",
    module: "human-capital-management",
  },
  { slug: "benefits", name: "Benefits", module: "human-capital-management" },

  // Customer Relationship Management
  { slug: "sales", name: "Sales", module: "customer-relationship-management" },
  { slug: "customer-support", name: "Service", module: "customer-relationship-management" },
  { slug: "marketing-automation", name: "Marketing", module: "customer-relationship-management" },
  { slug: "field-service", name: "Field Service", module: "customer-relationship-management" },

  // Supply Chain Management
  { slug: "procurement", name: "Procurement", module: "supply-chain-management" },
  { slug: "inventory-management", name: "Inventory", module: "supply-chain-management" },
  { slug: "order-processing", name: "Order Management", module: "supply-chain-management" },
  { slug: "logistics", name: "Logistics", module: "supply-chain-management" },

  // Manufacturing
  { slug: "production-planning", name: "Production Planning", module: "manufacturing" },
  { slug: "materials-management", name: "Materials Management", module: "manufacturing" },
  {
    slug: "product-lifecycle-management",
    name: "Product Lifecycle Management",
    module: "manufacturing",
  },
  { slug: "quality-control", name: "Quality Control", module: "manufacturing" },

  // Enterprise Asset Management
  {
    slug: "maintenance-scheduling",
    name: "Maintenance Scheduling",
    module: "enterprise-asset-management",
  },
  {
    slug: "asset-lifecycle-management",
    name: "Asset Lifecycle",
    module: "enterprise-asset-management",
  },
  { slug: "energy-management", name: "Energy Management", module: "enterprise-asset-management" },

  // Project & Portfolio Management
  { slug: "project-planning", name: "Project Planning", module: "project-management" },
  { slug: "resource-planning", name: "Resource Planning", module: "project-management" },
  { slug: "project-costing", name: "Project Costing", module: "project-management" },
  { slug: "billing", name: "Project Billing", module: "project-management" },

  // Data & Analytics
  { slug: "business-intelligence", name: "Business Intelligence", module: "data-services" },
  { slug: "data-warehousing", name: "Data Warehousing", module: "data-services" },
  { slug: "data-migration", name: "Data Migration", module: "data-services" },

  // Integration
  { slug: "integration-catalogue", name: "Integration Catalogue", module: "integration" },
  { slug: "middleware", name: "Middleware", module: "integration" },

  // Security & Identity
  { slug: "sod-and-rbac", name: "Access & SoD", module: "security" },
  { slug: "disaster-recovery", name: "Resilience", module: "security" },

  // PMO & Programme Governance
  { slug: "governance", name: "Programme Governance", module: "pmo" },
  { slug: "go-live-toolkit", name: "Cutover & Go-Live", module: "pmo" },

  // Change, People & Adoption
  { slug: "adoption", name: "Adoption", module: "change-people-and-adoption" },
];

export const subModuleBySlug = new Map(subModules.map((s) => [s.slug, s]));
export const subModulesOfModule = (moduleSlug: string) =>
  subModules.filter((s) => s.module === moduleSlug);

/**
 * Value streams. `primaryModule` is where the stream is governed; `modules`
 * is every module it actually crosses. A stream with a `parent` is a
 * sub-stream (L2) of that stream.
 */
export type Stream = {
  slug: string;
  name: string;
  parent: string | null;
  primaryModule: string;
  modules: string[];
};

export const streams: Stream[] = [
  // ---------------------------------------------------------- Finance (L1)
  {
    slug: "record-to-report",
    name: "Record-to-Report",
    parent: null,
    primaryModule: "financial-accounting",
    modules: ["financial-accounting", "data-services"],
  },
  {
    slug: "procure-to-pay",
    name: "Procure-to-Pay",
    parent: null,
    primaryModule: "financial-accounting",
    // Crosses because requisition and PO live in supply chain while invoice,
    // match and payment live in finance.
    modules: ["supply-chain-management", "financial-accounting"],
  },
  {
    slug: "order-to-cash",
    name: "Order-to-Cash",
    parent: null,
    primaryModule: "financial-accounting",
    // Order in CRM, fulfilment in supply chain, invoice and collection in finance.
    modules: [
      "customer-relationship-management",
      "supply-chain-management",
      "financial-accounting",
    ],
  },
  {
    slug: "acquire-to-retire-assets",
    name: "Acquire-to-Retire (Assets)",
    parent: null,
    primaryModule: "financial-accounting",
    modules: ["financial-accounting", "enterprise-asset-management"],
  },
  {
    slug: "cash-and-treasury",
    name: "Cash & Treasury",
    parent: null,
    primaryModule: "financial-accounting",
    modules: ["financial-accounting"],
  },

  // ------------------------------------------------- Procure-to-Pay (L2)
  {
    slug: "source-to-contract",
    name: "Source-to-Contract",
    parent: "procure-to-pay",
    primaryModule: "supply-chain-management",
    modules: ["supply-chain-management"],
  },
  {
    slug: "requisition-to-receipt",
    name: "Requisition-to-Receipt",
    parent: "procure-to-pay",
    primaryModule: "supply-chain-management",
    modules: ["supply-chain-management", "financial-accounting"],
  },
  {
    slug: "invoice-to-pay",
    name: "Invoice-to-Pay",
    parent: "procure-to-pay",
    primaryModule: "financial-accounting",
    modules: ["financial-accounting"],
  },

  // --------------------------------------------------- Order-to-Cash (L2)
  {
    slug: "order-to-fulfil",
    name: "Order-to-Fulfil",
    parent: "order-to-cash",
    primaryModule: "supply-chain-management",
    modules: ["supply-chain-management", "customer-relationship-management"],
  },
  {
    slug: "fulfil-to-invoice",
    name: "Fulfil-to-Invoice",
    parent: "order-to-cash",
    primaryModule: "financial-accounting",
    modules: ["supply-chain-management", "financial-accounting"],
  },
  {
    slug: "invoice-to-cash",
    name: "Invoice-to-Cash",
    parent: "order-to-cash",
    primaryModule: "financial-accounting",
    modules: ["financial-accounting"],
  },

  // -------------------------------------------------------------- HCM (L1)
  {
    slug: "hire-to-retire",
    name: "Hire-to-Retire",
    parent: null,
    primaryModule: "human-capital-management",
    modules: ["human-capital-management"],
  },
  {
    slug: "time-to-pay",
    name: "Time-to-Pay",
    parent: null,
    primaryModule: "human-capital-management",
    modules: ["human-capital-management", "financial-accounting"],
  },
  {
    slug: "performance-and-development",
    name: "Performance & Development",
    parent: null,
    primaryModule: "human-capital-management",
    modules: ["human-capital-management"],
  },
  {
    slug: "benefits-and-compliance",
    name: "Benefits & Compliance",
    parent: null,
    primaryModule: "human-capital-management",
    modules: ["human-capital-management"],
  },

  // --------------------------------------------------- Hire-to-Retire (L2)
  {
    slug: "recruit-to-onboard",
    name: "Recruit-to-Onboard",
    parent: "hire-to-retire",
    primaryModule: "human-capital-management",
    modules: ["human-capital-management"],
  },
  {
    slug: "manage-to-develop",
    name: "Manage-to-Develop",
    parent: "hire-to-retire",
    primaryModule: "human-capital-management",
    modules: ["human-capital-management"],
  },
  {
    slug: "offboard-to-exit",
    name: "Offboard-to-Exit",
    parent: "hire-to-retire",
    primaryModule: "human-capital-management",
    modules: ["human-capital-management", "security"],
  },

  // ------------------------------------------------------ Time-to-Pay (L2)
  {
    slug: "capture-to-approve",
    name: "Capture-to-Approve",
    parent: "time-to-pay",
    primaryModule: "human-capital-management",
    modules: ["human-capital-management"],
  },
  {
    slug: "calculate-to-disburse",
    name: "Calculate-to-Disburse",
    parent: "time-to-pay",
    primaryModule: "human-capital-management",
    modules: ["human-capital-management", "financial-accounting"],
  },
  {
    slug: "report-to-comply",
    name: "Report-to-Comply",
    parent: "time-to-pay",
    primaryModule: "human-capital-management",
    modules: ["human-capital-management", "financial-accounting"],
  },

  // -------------------------------------------------------------- CRM (L1)
  {
    slug: "lead-to-order",
    name: "Lead-to-Order",
    parent: null,
    primaryModule: "customer-relationship-management",
    modules: ["customer-relationship-management"],
  },
  {
    slug: "service-to-resolution",
    name: "Service-to-Resolution",
    parent: null,
    primaryModule: "customer-relationship-management",
    modules: ["customer-relationship-management"],
  },
  {
    slug: "campaign-to-conversion",
    name: "Campaign-to-Conversion",
    parent: null,
    primaryModule: "customer-relationship-management",
    modules: ["customer-relationship-management"],
  },
  {
    slug: "dispatch-to-done",
    name: "Dispatch-to-Done (Field Service)",
    parent: null,
    primaryModule: "customer-relationship-management",
    modules: ["customer-relationship-management", "supply-chain-management"],
  },

  // ---------------------------------------------------- Lead-to-Order (L2)
  {
    slug: "contact-to-lead",
    name: "Contact-to-Lead",
    parent: "lead-to-order",
    primaryModule: "customer-relationship-management",
    modules: ["customer-relationship-management"],
  },
  {
    slug: "lead-to-opportunity",
    name: "Lead-to-Opportunity",
    parent: "lead-to-order",
    primaryModule: "customer-relationship-management",
    modules: ["customer-relationship-management"],
  },
  {
    slug: "opportunity-to-quote",
    name: "Opportunity-to-Quote",
    parent: "lead-to-order",
    primaryModule: "customer-relationship-management",
    modules: ["customer-relationship-management"],
  },
  {
    slug: "quote-to-order",
    name: "Quote-to-Order",
    parent: "lead-to-order",
    primaryModule: "customer-relationship-management",
    modules: ["customer-relationship-management", "supply-chain-management"],
  },

  // -------------------------------------------------------------- SCM (L1)
  {
    slug: "plan-to-replenish",
    name: "Plan-to-Replenish",
    parent: null,
    primaryModule: "supply-chain-management",
    modules: ["supply-chain-management", "manufacturing"],
  },
  {
    slug: "order-to-ship",
    name: "Order-to-Ship",
    parent: null,
    primaryModule: "supply-chain-management",
    modules: ["supply-chain-management"],
  },
  {
    slug: "plan-to-deliver-logistics",
    name: "Plan-to-Deliver (Logistics)",
    parent: null,
    primaryModule: "supply-chain-management",
    modules: ["supply-chain-management"],
  },

  // ---------------------------------------------------- Manufacturing (L1)
  {
    slug: "design-to-production",
    name: "Design-to-Production",
    parent: null,
    primaryModule: "manufacturing",
    modules: ["manufacturing"],
  },
  {
    slug: "plan-to-produce",
    name: "Plan-to-Produce",
    parent: null,
    primaryModule: "manufacturing",
    modules: ["manufacturing", "supply-chain-management"],
  },
  {
    slug: "quality-to-confidence",
    name: "Quality-to-Confidence",
    parent: null,
    primaryModule: "manufacturing",
    modules: ["manufacturing"],
  },

  // -------------------------------------------------------------- EAM (L1)
  {
    slug: "plan-to-maintain",
    name: "Plan-to-Maintain",
    parent: null,
    primaryModule: "enterprise-asset-management",
    modules: ["enterprise-asset-management", "supply-chain-management"],
  },
  {
    slug: "detect-to-respond",
    name: "Detect-to-Respond (Condition)",
    parent: null,
    primaryModule: "enterprise-asset-management",
    modules: ["enterprise-asset-management"],
  },
  {
    slug: "acquire-to-retire-physical",
    name: "Acquire-to-Retire (Physical)",
    parent: null,
    primaryModule: "enterprise-asset-management",
    modules: ["enterprise-asset-management", "financial-accounting"],
  },

  // -------------------------------------------------------------- PPM (L1)
  {
    slug: "idea-to-investment",
    name: "Idea-to-Investment (Portfolio)",
    parent: null,
    primaryModule: "project-management",
    modules: ["project-management", "pmo"],
  },
  {
    slug: "plan-to-deliver-project",
    name: "Plan-to-Deliver (Project)",
    parent: null,
    primaryModule: "project-management",
    modules: ["project-management"],
  },
  {
    slug: "resource-to-utilisation",
    name: "Resource-to-Utilisation",
    parent: null,
    primaryModule: "project-management",
    modules: ["project-management", "human-capital-management"],
  },
  {
    slug: "bill-to-recognise",
    name: "Bill-to-Recognise",
    parent: null,
    primaryModule: "project-management",
    modules: ["project-management", "financial-accounting"],
  },

  // --------------------------------------------------- Data & Analytics (L1)
  {
    slug: "source-to-insight",
    name: "Source-to-Insight",
    parent: null,
    primaryModule: "data-services",
    modules: ["data-services"],
  },
  {
    slug: "migrate-to-steady-state",
    name: "Migrate-to-Steady-State",
    parent: null,
    primaryModule: "data-services",
    modules: ["data-services", "integration"],
  },
  {
    slug: "govern-to-trust",
    name: "Govern-to-Trust",
    parent: null,
    primaryModule: "data-services",
    modules: ["data-services", "security"],
  },

  // ------------------------------------------------------ Integration (L1)
  {
    slug: "specify-to-live",
    name: "Specify-to-Live (Build)",
    parent: null,
    primaryModule: "integration",
    modules: ["integration"],
  },
  {
    slug: "detect-to-recover",
    name: "Detect-to-Recover (Failure)",
    parent: null,
    primaryModule: "integration",
    modules: ["integration", "security"],
  },

  // ------------------------------------------------ Security & Identity (L1)
  {
    slug: "identity-to-access",
    name: "Identity-to-Access",
    parent: null,
    primaryModule: "security",
    modules: ["security", "human-capital-management"],
  },
  {
    slug: "control-to-evidence",
    name: "Control-to-Evidence",
    parent: null,
    primaryModule: "security",
    modules: ["security", "financial-accounting"],
  },
  {
    slug: "detect-to-continue",
    name: "Detect-to-Continue (BCP/DR)",
    parent: null,
    primaryModule: "security",
    modules: ["security", "integration"],
  },

  // -------------------------------------------------------------- PMO (L1)
  {
    slug: "initiate-to-gate",
    name: "Initiate-to-Gate",
    parent: null,
    primaryModule: "pmo",
    modules: ["pmo", "project-management"],
  },
  {
    slug: "track-to-decide",
    name: "Track-to-Decide (Status)",
    parent: null,
    primaryModule: "pmo",
    modules: ["pmo"],
  },
  {
    slug: "plan-to-cutover",
    name: "Plan-to-Cutover (Go-Live)",
    parent: null,
    primaryModule: "pmo",
    modules: ["pmo", "data-services", "integration"],
  },

  // -------------------------------------- Change, People & Adoption (L1)
  {
    slug: "awareness-to-adoption",
    name: "Awareness-to-Adoption",
    parent: null,
    primaryModule: "change-people-and-adoption",
    modules: ["change-people-and-adoption"],
  },
  {
    slug: "impact-to-mitigation",
    name: "Impact-to-Mitigation",
    parent: null,
    primaryModule: "change-people-and-adoption",
    modules: ["change-people-and-adoption"],
  },
  {
    slug: "train-to-capable",
    name: "Train-to-Capable",
    parent: null,
    primaryModule: "change-people-and-adoption",
    modules: ["change-people-and-adoption", "human-capital-management"],
  },
];

export const streamBySlug = new Map(streams.map((s) => [s.slug, s]));

/** L1 streams only — the ones a band shows. */
export const topStreams = streams.filter((s) => s.parent === null);

/** The L2 streams beneath an L1 stream. */
export const subStreamsOf = (streamSlug: string) => streams.filter((s) => s.parent === streamSlug);

/** Every stream that touches a module, whether it owns it or merely crosses it. */
export const streamsTouchingModule = (moduleSlug: string) =>
  streams.filter((s) => s.modules.includes(moduleSlug));

/** Streams governed inside a band, via their primary module. */
export const streamsInBand = (band: Band) =>
  topStreams.filter((s) => bandByModule[s.primaryModule] === band);

/** A stream crosses modules when the work happens in more than one. */
export const isCrossModule = (s: Stream) => s.modules.length > 1;

export const bandOfModule = (moduleSlug: string): Band | null => bandByModule[moduleSlug] ?? null;
