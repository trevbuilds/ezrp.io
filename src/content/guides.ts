/**
 * EZRP guide corpus, copied from the "DX Guides" wiki.
 *
 * Every field here mirrors the source record. Where the source has no
 * definition, workflow or URL, the field is null — never invented.
 */

export type GuideCategory =
  | "Concept"
  | "Module"
  | "Component"
  | "Process"
  | "Solution"
  | "Technology"
  | "Integration"
  | "Local-AU"
  | "Global"
  | "Common"
  | "Project Management";

export type Guide = {
  slug: string;
  topic: string;
  parent: string | null;
  categories: GuideCategory[];
  definition: string | null;
  workflow: string[];
  sourceUrl: string | null;
};

const raw: Array<Omit<Guide, "workflow"> & { workflow?: string | null }> = [
  // ---------------------------------------------------------------- pillars
  {
    slug: "financial-accounting",
    topic: "Financial Accounting",
    parent: null,
    categories: ["Concept", "Module"],
    definition:
      "General ledger, accounts payable, accounts receivable, asset management, and cash management.",
    workflow:
      "Transaction Entry → General Ledger Posting → Trial Balance → Financial Reporting → Auditing",
    sourceUrl: "https://ezrp.io/finacc/",
  },
  {
    slug: "customer-relationship-management",
    topic: "Customer Relationship Management",
    parent: null,
    categories: ["Concept", "Module"],
    definition:
      "Sales force automation, customer support, marketing, and field service.",
    workflow:
      "Contact Management → Lead Tracking → Opportunity Management → Sales Order Processing → Customer Support → Feedback & Improvement",
    sourceUrl: "https://ezrp.io/crm/",
  },
  {
    slug: "data-services",
    topic: "Data Services",
    parent: null,
    categories: ["Concept", "Module"],
    definition:
      "Reporting, analytics, data warehousing, and business intelligence.",
    workflow:
      "Data Collection → Data Cleansing → Data Analysis → Data Reporting → Decision Making Support",
    sourceUrl: null,
  },
  {
    slug: "enterprise-asset-management",
    topic: "Enterprise Asset Management",
    parent: null,
    categories: ["Concept", "Module"],
    definition:
      "Maintenance scheduling, asset lifecycle management, and energy management.",
    workflow:
      "Asset Tracking → Preventive Maintenance Scheduling → Work Order Management → Asset Performance Monitoring → Replacement Planning",
    sourceUrl: "https://ezrp.io/asset-management/",
  },
  {
    slug: "project-management",
    topic: "Project Management",
    parent: null,
    categories: ["Concept", "Module"],
    definition:
      "Project planning, resource planning, project costing, work breakdown structure, and billing.",
    workflow:
      "Project Setup → Task Assignment → Progress Tracking → Resource Management → Budget Control → Project Reporting",
    sourceUrl: null,
  },
  {
    slug: "human-capital-management",
    topic: "Human Capital Management",
    parent: null,
    categories: ["Concept", "Module"],
    definition: null,
    workflow: null,
    sourceUrl: null,
  },
  {
    slug: "governance",
    topic: "Governance",
    parent: null,
    categories: ["Process", "Project Management"],
    definition: null,
    workflow: null,
    sourceUrl: null,
  },
  {
    slug: "integration",
    topic: "Integration",
    parent: null,
    categories: ["Integration", "Technology"],
    definition: null,
    workflow: null,
    sourceUrl: null,
  },
  {
    slug: "security",
    topic: "Security",
    parent: null,
    categories: ["Technology", "Process"],
    definition: null,
    workflow: null,
    sourceUrl: null,
  },
  {
    slug: "pmo",
    topic: "PMO",
    parent: null,
    categories: ["Project Management", "Process"],
    definition: null,
    workflow: null,
    sourceUrl: null,
  },
  {
    slug: "go-live-toolkit",
    topic: "Go Live Toolkit",
    parent: null,
    categories: ["Process"],
    definition: null,
    workflow: null,
    sourceUrl: null,
  },
  {
    slug: "atlas",
    topic: "Atlas",
    parent: null,
    categories: ["Concept"],
    definition: null,
    workflow: null,
    sourceUrl: null,
  },
  {
    slug: "guides",
    topic: "Guides",
    parent: null,
    categories: ["Concept"],
    definition: null,
    workflow: null,
    sourceUrl: null,
  },
  {
    slug: "payments",
    topic: "Payments",
    parent: null,
    categories: ["Solution"],
    definition: null,
    workflow: null,
    sourceUrl: null,
  },

  // ------------------------------------------------- financial accounting
  {
    slug: "accounts-payable",
    topic: "Accounts Payable",
    parent: "financial-accounting",
    categories: ["Component", "Process"],
    definition: null,
    workflow:
      "Invoice Receipt → 3-Way Match → Payment Approval → Payment Disbursement",
    sourceUrl: "https://ezrp.io/accounts-payable/",
  },
  {
    slug: "accounts-receivable",
    topic: "Accounts Receivable",
    parent: "financial-accounting",
    categories: ["Component", "Process"],
    definition: null,
    workflow:
      "Billing Creation → Payment Tracking → Collections Management → Revenue Recognition",
    sourceUrl: "https://ezrp.io/accounts-receivable-ar/",
  },
  {
    slug: "3-way-matching",
    topic: "3-Way Matching",
    parent: "accounts-payable",
    categories: ["Process"],
    definition: null,
    workflow: null,
    sourceUrl: null,
  },
  {
    slug: "ap-automation",
    topic: "AP Automation",
    parent: "accounts-payable",
    categories: ["Solution", "Technology"],
    definition: null,
    workflow: null,
    sourceUrl: null,
  },
  {
    slug: "general-ledger",
    topic: "General Ledger",
    parent: "financial-accounting",
    categories: ["Component", "Process"],
    definition: "Central repository for accounting data.",
    workflow: "Transactions Entry → Posting → Trial Balance → Financial Reporting",
    sourceUrl: "https://ezrp.io/general-ledger/",
  },
  {
    slug: "cash-management",
    topic: "Cash Management",
    parent: "financial-accounting",
    categories: ["Component", "Process"],
    definition: "Managing cash flow and liquidity.",
    workflow:
      "Cash Forecasting → Daily Cash Update → Cash Positioning → Funds Transfer",
    sourceUrl: "https://ezrp.io/cash-management/",
  },
  {
    slug: "bank-reconciliation",
    topic: "Bank Reconciliation",
    parent: "cash-management",
    categories: ["Process"],
    definition: null,
    workflow: null,
    sourceUrl: null,
  },
  {
    slug: "asset-management",
    topic: "Asset Management",
    parent: "financial-accounting",
    categories: ["Component", "Process"],
    definition: null,
    workflow:
      "Asset Acquisition → Depreciation Calculation → Asset Maintenance → Asset Disposal",
    sourceUrl: "https://ezrp.io/asset-management/",
  },

  // ------------------------------------------------------------- payments
  {
    slug: "eft-files",
    topic: "EFT Files",
    parent: "payments",
    categories: ["Solution", "Common"],
    definition: null,
    workflow: null,
    sourceUrl: null,
  },
  {
    slug: "aba",
    topic: "ABA",
    parent: "payments",
    categories: ["Solution", "Local-AU"],
    definition: null,
    workflow: null,
    sourceUrl: null,
  },

  // -------------------------------------------------------- data services
  {
    slug: "business-intelligence",
    topic: "Business Intelligence",
    parent: "data-services",
    categories: ["Component", "Process"],
    definition: "Using data to inform strategic decisions.",
    workflow:
      "Query Formulation → Data Visualization → Trend Identification → Decision Support",
    sourceUrl: null,
  },
  {
    slug: "data-models",
    topic: "Data Models",
    parent: "data-services",
    categories: ["Component", "Process"],
    definition: "Applying statistical analysis to business data.",
    workflow:
      "Data Collection → Model Building → Data Analysis → Insight Generation",
    sourceUrl: "https://ezrp.io/data-models/",
  },
  {
    slug: "data-warehousing",
    topic: "Data Warehousing",
    parent: "data-services",
    categories: ["Component", "Process"],
    definition: "Consolidating data from various sources.",
    workflow:
      "Data Extraction → Data Transformation → Data Loading → Data Maintenance",
    sourceUrl: null,
  },
  {
    slug: "data-migration",
    topic: "Data Migration",
    parent: "data-services",
    categories: ["Process"],
    definition: null,
    workflow: null,
    sourceUrl: "https://ezrp.io/dm/",
  },

  // ----------------------------------------------------------------- CRM
  {
    slug: "customer-support",
    topic: "Customer Support",
    parent: "customer-relationship-management",
    categories: ["Component", "Process"],
    definition: "Managing customer service operations.",
    workflow:
      "Lead Capture → Lead Assignment → Opportunity Management → Order Closure",
    sourceUrl: null,
  },
  {
    slug: "field-service",
    topic: "Field Service",
    parent: "customer-relationship-management",
    categories: ["Component", "Process"],
    definition: "Managing field service operations.",
    workflow:
      "Service Request Receipt → Technician Dispatch → Service Provision → Service Confirmation",
    sourceUrl: null,
  },

  // --------------------------------------------- enterprise asset mgmt
  {
    slug: "asset-lifecycle-management",
    topic: "Asset Lifecycle Management",
    parent: "enterprise-asset-management",
    categories: ["Component", "Process"],
    definition: null,
    workflow: null,
    sourceUrl: null,
  },
  {
    slug: "energy-management",
    topic: "Energy Management",
    parent: "enterprise-asset-management",
    categories: ["Component", "Process"],
    definition: "Monitoring and managing energy consumption.",
    workflow: null,
    sourceUrl: null,
  },

  // ------------------------------------------- human capital management
  {
    slug: "benefits",
    topic: "Benefits",
    parent: "human-capital-management",
    categories: ["Component", "Process"],
    definition: "Administering employee benefits programs.",
    workflow:
      "Enrollment Processing → Eligibility Verification → Benefits Administration → Reporting",
    sourceUrl: null,
  },
  {
    slug: "compliance",
    topic: "Compliance",
    parent: "human-capital-management",
    categories: ["Component", "Process"],
    definition: "Ensuring adherence to labor laws and regulations.",
    workflow:
      "Policy Dissemination → Compliance Monitoring → Incident Reporting → Corrective Action",
    sourceUrl: null,
  },

  // -------------------------------------------------- project management
  {
    slug: "billing",
    topic: "Billing",
    parent: "project-management",
    categories: ["Component", "Process"],
    definition: "Invoicing clients for project work.",
    workflow:
      "Billable Work Identification → Invoice Generation → Payment Tracking → Revenue Recognition",
    sourceUrl: null,
  },

  // ------------------------------------------------------------ governance
  {
    slug: "actions-and-decisions",
    topic: "Actions and Decisions",
    parent: "governance",
    categories: ["Process", "Project Management"],
    definition: null,
    workflow: null,
    sourceUrl: null,
  },
  {
    slug: "change-requests",
    topic: "Change Requests",
    parent: "governance",
    categories: ["Process", "Project Management"],
    definition: null,
    workflow: null,
    sourceUrl: "https://ezrp.io/cr/",
  },
  {
    slug: "functional-specifications",
    topic: "Functional Specifications",
    parent: "governance",
    categories: ["Process", "Project Management"],
    definition: null,
    workflow: null,
    sourceUrl: "https://ezrp.io/functional-specs/",
  },
  {
    slug: "technical-specifications",
    topic: "Technical Specifications",
    parent: "governance",
    categories: ["Process", "Technology"],
    definition: null,
    workflow: null,
    sourceUrl: null,
  },
  {
    slug: "sod-and-rbac",
    topic: "SoD and RBAC",
    parent: "governance",
    categories: ["Process", "Technology"],
    definition: null,
    workflow: null,
    sourceUrl: null,
  },

  // ----------------------------------------------------------- integration
  {
    slug: "development-standards",
    topic: "Development Standards",
    parent: "integration",
    categories: ["Integration", "Technology"],
    definition: null,
    workflow: null,
    sourceUrl: "https://ezrp.io/integration-dev-standard/",
  },
  {
    slug: "integration-catalogue",
    topic: "Integration Catalogue",
    parent: "integration",
    categories: ["Integration"],
    definition: null,
    workflow: null,
    sourceUrl: null,
  },
  {
    slug: "environment-and-deployment-management",
    topic: "Environment and Deployment Management",
    parent: "integration",
    categories: ["Integration", "Technology"],
    definition: null,
    workflow: null,
    sourceUrl: null,
  },

  // -------------------------------------------------------------- security
  {
    slug: "bcp",
    topic: "BCP",
    parent: "security",
    categories: ["Process"],
    definition: null,
    workflow: null,
    sourceUrl: "https://ezrp.io/bcp/",
  },
  {
    slug: "disaster-recovery",
    topic: "Disaster Recovery",
    parent: "security",
    categories: ["Process", "Technology"],
    definition: null,
    workflow: null,
    sourceUrl: "https://ezrp.io/dr/",
  },

  // ------------------------------------------------------------------ PMO
  {
    slug: "cutover-and-go-live",
    topic: "Cutover and Go Live",
    parent: "pmo",
    categories: ["Process", "Project Management"],
    definition: null,
    workflow: null,
    sourceUrl: "https://ezrp.io/launch/",
  },
  {
    slug: "erp-project-budgeting",
    topic:
      "Comprehensive Guide to ERP Project Budgeting: Ensuring Financial Health Amidst Complexity",
    parent: "pmo",
    categories: ["Process", "Project Management"],
    definition: null,
    workflow: null,
    sourceUrl: "https://ezrp.io/budget",
  },

  // -------------------------------------------------------- go live toolkit
  {
    slug: "cutover-checklist",
    topic: "Cutover Checklist",
    parent: "go-live-toolkit",
    categories: ["Process"],
    definition: null,
    workflow: null,
    sourceUrl: "https://ezrp.io/go-live-checklist/",
  },
  {
    slug: "functional-module-implementation",
    topic: "Functional Module Implementation",
    parent: "go-live-toolkit",
    categories: ["Process"],
    definition: null,
    workflow: null,
    sourceUrl: "https://ezrp.io/functional/",
  },

  // ---------------------------------------------------------------- atlas
  {
    slug: "ask-for-help",
    topic: "Ask for Help",
    parent: "atlas",
    categories: ["Concept"],
    definition: null,
    workflow: null,
    sourceUrl: "https://ezrp.io/ask-for-help/",
  },
  {
    slug: "be-a-hero",
    topic: "Be a Hero",
    parent: "atlas",
    categories: ["Concept"],
    definition: null,
    workflow: null,
    sourceUrl: "https://ezrp.io/hero/",
  },
  {
    slug: "change-is-the-word",
    topic: "Change is the word",
    parent: "atlas",
    categories: ["Concept"],
    definition: null,
    workflow: null,
    sourceUrl: "https://ezrp.io/change/",
  },
  {
    slug: "ditch-the-dirty-talk",
    topic: "Ditch the Dirty Talk",
    parent: "atlas",
    categories: ["Concept"],
    definition: null,
    workflow: null,
    sourceUrl: "https://ezrp.io/dirtytalk/",
  },
  {
    slug: "empower-people",
    topic: "Empower People",
    parent: "atlas",
    categories: ["Concept"],
    definition: null,
    workflow: null,
    sourceUrl: null,
  },

  // --------------------------------------------------------------- guides
  {
    slug: "erp-health-check",
    topic: "ERP Health Check",
    parent: "guides",
    categories: ["Process"],
    definition: null,
    workflow: null,
    sourceUrl:
      "https://ezrp.io/tldr-how-to-conduct-an-erp-system-health-check-a-comprehensive-guide/",
  },
  {
    slug: "digital-transformation-readiness-checklist",
    topic: "Digital Transformation Readiness Checklist",
    parent: "guides",
    categories: ["Process"],
    definition: null,
    workflow: null,
    sourceUrl: null,
  },
  {
    slug: "finding-the-one",
    topic: "Finding the One",
    parent: "guides",
    categories: ["Process"],
    definition: null,
    workflow: null,
    sourceUrl: null,
  },
];

export const guides: Guide[] = raw.map((g) => ({
  ...g,
  workflow: g.workflow
    ? g.workflow
        .split("→")
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !/no article found/i.test(s))
    : [],
}));

export const guideBySlug = new Map(guides.map((g) => [g.slug, g]));

export const pillars = guides.filter((g) => g.parent === null);

export function childrenOf(slug: string): Guide[] {
  return guides.filter((g) => g.parent === slug);
}

export function ancestorsOf(slug: string): Guide[] {
  const chain: Guide[] = [];
  let current = guideBySlug.get(slug)?.parent ?? null;
  while (current) {
    const node = guideBySlug.get(current);
    if (!node) break;
    chain.unshift(node);
    current = node.parent;
  }
  return chain;
}

export function pillarOf(slug: string): Guide | undefined {
  const chain = ancestorsOf(slug);
  return chain[0] ?? guideBySlug.get(slug);
}

export const allCategories = Array.from(
  new Set(guides.flatMap((g) => g.categories)),
).sort();
