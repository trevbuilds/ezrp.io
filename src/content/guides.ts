/**
 * EZRP guide corpus, copied from the "DX Guides" wiki.
 *
 * Every field here mirrors the source record. Where the source has no
 * definition, workflow or URL, the field is null — never invented.
 *
 * The one exception is `workflow`, which is being re-modelled against
 * published value streams (Lead-to-Cash, Issue-to-Resolution, and so on)
 * rather than the ad-hoc sequence a wiki record happened to carry. Every
 * such departure is marked with a comment naming the stream and the reason.
 * Definitions are still never invented.
 */

import {
  allBands,
  bandByModule,
  streamBySlug,
  streamsInBand,
  subModuleBySlug,
  type Band,
  type Consideration,
  type Level,
  type Scope,
} from "./model";
import { considerationsBySlug, scopeBySlug, streamsBySlug } from "./tagging";

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
  valueStream: ValueStream | null;
  domain: BusinessDomain | null;
  /** Where this sits in the structural or flow hierarchy. */
  level: Level | null;
  /** Top-level module this belongs to. */
  module: string | null;
  /** Nearest sub-module at or above this topic. */
  subModule: string | null;
  /** Stream slugs this topic sits in. */
  streams: string[];
  /** Tagged on leaves only; use considerationsOf() for the roll-up. */
  considerations: Consideration[];
  scope: Scope[];
};

/**
 * Bands and the module→band map live in ./model, which holds the structural
 * model (Band → Module → Sub-module → Component crossed with the stream
 * hierarchy). Re-exported here so existing imports keep working.
 */
export type BusinessDomain = Band;

/**
 * The field guide's named value streams. A module owns several; a topic is
 * tagged with the one it belongs to. Topics with no stream stay null rather
 * than being forced into one.
 */
/**
 * Display name of a stream. Stream identity lives in ./model; this is the
 * label the UI shows.
 */
export type ValueStream = string;

const raw: Array<
  Omit<
    Guide,
    | "workflow"
    | "valueStream"
    | "domain"
    | "level"
    | "module"
    | "subModule"
    | "streams"
    | "considerations"
    | "scope"
  > & { workflow?: string | null }
> = [
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
    definition: "Sales force automation, customer support, marketing, and field service.",
    // Value stream: Lead-to-Cash, using SAP's five published stages. The wiki
    // carried an ad-hoc sequence ending at "Feedback & Improvement"; L2C runs
    // through to cash, handing off to order-processing and accounts-receivable.
    workflow:
      "Contact to Lead → Lead to Opportunity → Opportunity to Quote → Quote to Order → Order to Cash",
    sourceUrl: "https://ezrp.io/crm/",
  },
  {
    slug: "data-services",
    topic: "Data & Analytics",
    parent: null,
    categories: ["Concept", "Module"],
    definition: "Reporting, analytics, data warehousing, and business intelligence.",
    workflow:
      "Data Collection → Data Cleansing → Data Analysis → Data Reporting → Decision Making Support",
    sourceUrl: null,
  },
  {
    slug: "enterprise-asset-management",
    topic: "Enterprise Asset Management",
    parent: null,
    categories: ["Concept", "Module"],
    definition: "Maintenance scheduling, asset lifecycle management, and energy management.",
    workflow:
      "Asset Tracking → Preventive Maintenance Scheduling → Work Order Management → Asset Performance Monitoring → Replacement Planning",
    sourceUrl: "https://ezrp.io/asset-management/",
  },
  {
    slug: "project-management",
    topic: "Project & Portfolio Management",
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
    definition:
      "Core employee records, payroll, time and attendance, talent, learning, benefits and compliance.",
    workflow:
      "Hire → Employee Record → Pay and Entitlements → Time and Attendance → Performance and Development → Exit",
    sourceUrl: null,
  },
  {
    slug: "governance",
    topic: "Programme Governance",
    parent: "pmo",
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
    topic: "Security & Identity",
    parent: null,
    categories: ["Technology", "Process"],
    definition: null,
    workflow: null,
    sourceUrl: null,
  },
  {
    slug: "pmo",
    topic: "PMO & Programme Governance",
    parent: null,
    categories: ["Project Management", "Process"],
    definition: null,
    workflow: null,
    sourceUrl: null,
  },
  {
    slug: "go-live-toolkit",
    topic: "Cutover & Go-Live",
    parent: "pmo",
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
    parent: "accounts-payable",
    categories: ["Solution"],
    definition: null,
    workflow: null,
    sourceUrl: null,
  },

  {
    slug: "supply-chain-management",
    topic: "Supply Chain Management",
    parent: null,
    categories: ["Concept", "Module"],
    definition: "Inventory management, order processing, procurement, and logistics.",
    workflow:
      "Supplier Management → Purchase Ordering → Goods Receiving → Inventory Control → Order Fulfilment → Logistics Management",
    sourceUrl: "https://ezrp.io/scm/",
  },
  {
    slug: "manufacturing",
    topic: "Manufacturing",
    parent: null,
    categories: ["Concept", "Module"],
    definition:
      "Production planning, materials management, product lifecycle management, and quality control.",
    workflow:
      "Product Design → Bill of Materials Setup → Production Planning → Manufacturing → Quality Control → Product Delivery",
    sourceUrl: "https://ezrp.io/manufacturing/",
  },
  {
    slug: "change-people-and-adoption",
    topic: "Change, People & Adoption",
    parent: null,
    categories: ["Concept", "Module", "Process"],
    definition: null,
    workflow: null,
    sourceUrl: null,
  },

  // ----------------------------------------------------- manufacturing
  {
    slug: "production-planning",
    topic: "Production Planning",
    parent: "manufacturing",
    categories: ["Component", "Process"],
    definition: "Scheduling manufacturing processes.",
    workflow:
      "Sales Forecasting → Production Scheduling → Work Order Release → Production Monitoring",
    sourceUrl: null,
  },
  {
    slug: "materials-management",
    topic: "Materials Management",
    parent: "manufacturing",
    categories: ["Component", "Process"],
    definition: "Overseeing materials use and procurement.",
    workflow:
      "Requisition Creation → Purchase Order Management → Inventory Receipt → Inventory Replenishment",
    sourceUrl: null,
  },
  {
    slug: "product-lifecycle-management",
    topic: "Product Lifecycle Management",
    parent: "manufacturing",
    categories: ["Component", "Process"],
    definition: "Managing product development from inception to discontinuation.",
    workflow:
      "Concept Development → Design Engineering → Prototype Testing → Product Launch",
    sourceUrl: null,
  },
  {
    slug: "quality-control",
    topic: "Quality Control",
    parent: "manufacturing",
    categories: ["Component", "Process"],
    definition: "Ensuring product quality standards.",
    workflow:
      "Inspection Planning → Quality Inspection → Non-Conformance Handling → Quality Reporting",
    sourceUrl: null,
  },

  // ------------------------------------------------- financial accounting
  {
    slug: "accounts-payable",
    topic: "Accounts Payable",
    parent: "financial-accounting",
    categories: ["Component", "Process"],
    definition: null,
    workflow: "Invoice Receipt → 3-Way Match → Payment Approval → Payment Disbursement",
    sourceUrl: "https://ezrp.io/accounts-payable/",
  },
  {
    slug: "accounts-receivable",
    topic: "Accounts Receivable",
    parent: "financial-accounting",
    categories: ["Component", "Process"],
    definition: null,
    workflow: "Billing Creation → Payment Tracking → Collections Management → Revenue Recognition",
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
    workflow: "Cash Forecasting → Daily Cash Update → Cash Positioning → Funds Transfer",
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
    workflow: "Asset Acquisition → Depreciation Calculation → Asset Maintenance → Asset Disposal",
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
    workflow: "Query Formulation → Data Visualization → Trend Identification → Decision Support",
    sourceUrl: null,
  },
  {
    slug: "data-models",
    topic: "Data Models",
    parent: "data-services",
    categories: ["Component", "Process"],
    definition: "Applying statistical analysis to business data.",
    workflow: "Data Collection → Model Building → Data Analysis → Insight Generation",
    sourceUrl: "https://ezrp.io/data-models/",
  },
  {
    slug: "data-warehousing",
    topic: "Data Warehousing",
    parent: "data-services",
    categories: ["Component", "Process"],
    definition: "Consolidating data from various sources.",
    workflow: "Data Extraction → Data Transformation → Data Loading → Data Maintenance",
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
  // Lead-to-Cash stages. Modelled on the published five-stage process and
  // its Order to Cash decomposition; described generically rather than
  // against any one vendor's product set.
  {
    slug: "contact-to-lead",
    topic: "Contact to Lead",
    parent: "customer-relationship-management",
    categories: ["Process"],
    definition: "Turning interest captured across channels into a scored, qualified lead.",
    workflow:
      "Channel Capture → Consent and Contact Creation → Interaction Tracking → Lead Scoring → Lead Qualification",
    sourceUrl: null,
  },
  {
    slug: "lead-to-opportunity",
    topic: "Lead to Opportunity",
    parent: "customer-relationship-management",
    categories: ["Process"],
    definition:
      "Qualifying a lead, handing it to sales, and converting it into a tracked opportunity.",
    workflow:
      "Lead Review → Qualification Assessment → Sales Handover → Opportunity Creation → Pipeline Entry",
    sourceUrl: null,
  },
  {
    slug: "opportunity-to-quote",
    topic: "Opportunity to Quote",
    parent: "customer-relationship-management",
    categories: ["Process"],
    definition: "Assessing whether an opportunity is ready to be priced, and issuing a quote.",
    workflow:
      "Opportunity Assessment → Needs Confirmation → Solution Configuration → Pricing → Quote Issue",
    sourceUrl: null,
  },
  {
    slug: "quote-to-order",
    topic: "Quote to Order",
    parent: "customer-relationship-management",
    categories: ["Process"],
    definition: "Negotiating the quote to agreement and converting it into an order.",
    workflow: "Quote Presentation → Negotiation → Approval → Acceptance → Order Creation",
    sourceUrl: null,
  },
  {
    slug: "order-to-cash",
    topic: "Order to Cash",
    // Field guide places Order-to-Cash in Financial Accounting: CRM ends at
    // the order (Lead-to-Order), finance owns order through to cash.
    parent: "financial-accounting",
    categories: ["Process"],
    definition: "Executing the order, invoicing it, and collecting the cash.",
    workflow: "Order to Fulfil → Fulfil to Invoice → Invoice to Cash",
    sourceUrl: null,
  },
  {
    slug: "order-to-fulfil",
    topic: "Order to Fulfil",
    parent: "order-to-cash",
    categories: ["Process"],
    definition: "Order entry through to goods or services delivered.",
    workflow:
      "Order Entry → Availability Check → Inventory Allocation → Picking and Packing → Shipping and Delivery",
    sourceUrl: null,
  },
  {
    slug: "fulfil-to-invoice",
    topic: "Fulfil to Invoice",
    parent: "order-to-cash",
    categories: ["Process"],
    definition: "Turning a completed delivery into a billing document and recorded revenue.",
    workflow:
      "Delivery Confirmation → Billing Document Creation → Invoice Generation → Revenue Recording",
    sourceUrl: null,
  },
  {
    slug: "invoice-to-cash",
    topic: "Invoice to Cash",
    parent: "order-to-cash",
    categories: ["Process"],
    definition: "Getting the invoice to the customer and the money into the bank.",
    workflow:
      "Invoice Transmission → Payment Tracking → Receipt Application → Collections → Receivables Clearing",
    sourceUrl: null,
  },
  {
    slug: "marketing-automation",
    topic: "Marketing Automation",
    parent: "customer-relationship-management",
    categories: ["Component", "Process"],
    definition: "Planning and executing marketing campaigns.",
    // Lead-to-Cash stage 1 — Contact to Lead.
    workflow:
      "Campaign Creation → Audience Targeting → Interaction Capture → Lead Identification → Lead Scoring",
    sourceUrl: null,
  },
  {
    slug: "sales-force-automation",
    topic: "Sales Force Automation",
    parent: "customer-relationship-management",
    categories: ["Component", "Process"],
    definition: "Streamlining sales processes.",
    // Lead-to-Cash stages 2-4 — Lead to Opportunity, Opportunity to Quote,
    // Quote to Order.
    workflow:
      "Lead Qualification → Opportunity Conversion → Quote Creation → Quote Negotiation → Order Creation",
    sourceUrl: null,
  },
  {
    slug: "customer-support",
    topic: "Customer Support",
    parent: "customer-relationship-management",
    categories: ["Component", "Process"],
    definition: "Managing customer service operations.",
    // Value stream: Issue-to-Resolution, taken from this topic's own wiki body.
    // The wiki's Workflow field had the Sales Force Automation sequence
    // duplicated onto it; support starts at a case, not a lead.
    workflow:
      "Inquiry Initiation → Ticket Generation → Assignment and Notification → Issue Resolution → Follow-up and Feedback",
    sourceUrl: null,
  },
  {
    slug: "field-service",
    topic: "Field Service",
    parent: "customer-relationship-management",
    categories: ["Component", "Process"],
    definition: "Managing field service operations.",
    // Issue-to-Resolution, on-site. Extended to billing per the wiki body:
    // confirming the job is not the end of the stream, capturing the
    // parts and labour that make it billable is.
    workflow:
      "Service Request Creation → Service Order Management → Dispatching → Service Execution → Billing and Payment",
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
  {
    slug: "core-hr",
    topic: "Core HR",
    parent: "human-capital-management",
    categories: ["Component", "Process"],
    definition:
      "The system of record for people: the employee master, the position and reporting structure, and the effective-dated history every other process reads from.",
    workflow:
      "Position Approval → Hire → Employee Record Created → Assignment and Reporting Line → Effective-Dated Changes → Termination",
    sourceUrl: null,
  },
  {
    slug: "org-and-position-management",
    topic: "Org and Position Management",
    parent: "core-hr",
    categories: ["Component", "Process"],
    definition:
      "Legal entities, business units, cost centres, positions and the reporting lines that hang off them.",
    workflow:
      "Org Design → Position Creation → Funding and Grade → Reporting Line → Vacancy Release",
    sourceUrl: null,
  },
  {
    slug: "employee-self-service",
    topic: "Employee Self Service",
    parent: "core-hr",
    categories: ["Component", "Technology"],
    definition:
      "The employee and manager front door to HR transactions, with approval routing behind it.",
    workflow: "Request Raised → Validation → Approval → Record Updated → Notification",
    sourceUrl: null,
  },
  {
    slug: "onboarding",
    topic: "Onboarding",
    parent: "core-hr",
    categories: ["Process"],
    definition: "Turning an accepted offer into a provisioned, paid, productive employee.",
    workflow: "Offer Acceptance → Pre-boarding → Day One → Provisioning → Probation Review",
    sourceUrl: null,
  },
  {
    slug: "offboarding",
    topic: "Offboarding",
    parent: "core-hr",
    categories: ["Process"],
    definition:
      "Ending employment cleanly: final pay, access revocation, asset return and records retention.",
    workflow:
      "Notice → Final Pay Calculation → Access Revocation → Asset Return → Records Retention",
    sourceUrl: null,
  },
  {
    slug: "payroll",
    topic: "Payroll",
    parent: "human-capital-management",
    categories: ["Component", "Process"],
    definition:
      "Calculating, approving, paying and reporting employee pay, deductions and statutory obligations.",
    workflow:
      "Input Cut-off → Calculation → Validation → Approval → Disbursement → Posting and Reporting",
    sourceUrl: null,
  },
  {
    slug: "payroll-automation",
    topic: "Payroll Automation",
    parent: "payroll",
    categories: ["Solution", "Technology"],
    definition:
      "The layer that removes the handling between time capture, pay calculation, payment and statutory reporting.",
    workflow: null,
    sourceUrl: null,
  },
  {
    slug: "superannuation",
    topic: "Superannuation",
    parent: "payroll",
    categories: ["Component", "Local-AU"],
    definition:
      "Employer retirement contributions calculated on ordinary time earnings and paid to employee-nominated funds.",
    workflow:
      "Contribution Calculation → Fund Validation → Clearing House Submission → Reconciliation",
    sourceUrl: null,
  },
  {
    slug: "single-touch-payroll",
    topic: "Single Touch Payroll",
    parent: "payroll",
    categories: ["Process", "Local-AU"],
    definition:
      "Reporting salary, withholding and superannuation to the ATO each time employees are paid.",
    workflow:
      "Pay Run Finalised → Pay Event Assembled → ATO Lodgement → Response Handling → EOFY Finalisation",
    sourceUrl: null,
  },
  {
    slug: "time-and-attendance",
    topic: "Time and Attendance",
    parent: "human-capital-management",
    categories: ["Component", "Process"],
    definition: "Capturing worked time and converting it into pay, cost and compliance outcomes.",
    workflow:
      "Roster Published → Time Captured → Exceptions Cleared → Manager Approval → Interpretation → Payroll Input",
    sourceUrl: null,
  },
  {
    slug: "rostering-and-scheduling",
    topic: "Rostering and Scheduling",
    parent: "time-and-attendance",
    categories: ["Component", "Process"],
    definition:
      "Planning who works when, against demand, skills, availability and rule constraints.",
    workflow:
      "Demand Forecast → Shift Build → Availability and Skills Match → Publish → Shift Swaps",
    sourceUrl: null,
  },
  {
    slug: "leave-management",
    topic: "Leave Management",
    parent: "time-and-attendance",
    categories: ["Component", "Process"],
    definition: "Accruing, requesting, approving and paying absence.",
    workflow: "Accrual → Request → Approval → Balance Update → Payroll Input",
    sourceUrl: null,
  },
  {
    slug: "award-interpretation",
    topic: "Award Interpretation",
    parent: "time-and-attendance",
    categories: ["Process", "Local-AU"],
    definition:
      "Applying award, agreement and policy rules to raw worked time to produce payable hours.",
    workflow: "Raw Time → Rule Set Applied → Overtime and Penalties → Allowances → Payable Hours",
    sourceUrl: null,
  },
  {
    slug: "talent-acquisition",
    topic: "Talent Acquisition",
    parent: "human-capital-management",
    categories: ["Component", "Process"],
    definition: "Attracting, assessing and hiring people into approved positions.",
    workflow: "Vacancy Approval → Sourcing → Screening → Interview → Offer → Acceptance",
    sourceUrl: null,
  },
  {
    slug: "performance-management",
    topic: "Performance Management",
    parent: "human-capital-management",
    categories: ["Component", "Process"],
    definition: "Setting expectations, reviewing delivery and acting on the outcome.",
    workflow: "Goal Setting → Check-ins → Review → Calibration → Outcome and Development Plan",
    sourceUrl: null,
  },
  {
    slug: "learning-and-development",
    topic: "Learning and Development",
    parent: "human-capital-management",
    categories: ["Component", "Process"],
    definition:
      "Assigning, delivering and evidencing training, including mandatory compliance training.",
    workflow:
      "Needs Analysis → Curriculum Assignment → Delivery → Completion Evidence → Compliance Reporting",
    sourceUrl: null,
  },
  {
    slug: "workforce-analytics",
    topic: "Workforce Analytics",
    parent: "human-capital-management",
    categories: ["Component", "Process"],
    definition:
      "Headcount, turnover, cost and capability reporting drawn from the HR system of record.",
    workflow: "Data Consolidation → Measure Definition → Reporting → Workforce Planning",
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

/** Walk `raw` to the top-level module a topic belongs to. */
const rootModuleOf = (slug: string): string => {
  let current = slug;
  for (let hops = 0; hops < 10; hops += 1) {
    const node = raw.find((r) => r.slug === current);
    if (!node?.parent) return current;
    current = node.parent;
  }
  return current;
};

export const domainOf = (slug: string): BusinessDomain | null =>
  bandByModule[rootModuleOf(slug)] ?? null;

/** Nearest sub-module at or above this topic. */
const subModuleOf = (slug: string): string | null => {
  let current: string | null = slug;
  for (let hops = 0; hops < 10 && current; hops += 1) {
    if (subModuleBySlug.has(current)) return current;
    current = raw.find((r) => r.slug === current)?.parent ?? null;
  }
  return null;
};

/** Level is derived, never restated: a slug that is a module, sub-module or
 * stream says so by being one. Editorial collections are not model nodes. */
const levelOf = (slug: string): Level | null => {
  if (bandByModule[slug]) return "Module";
  if (subModuleBySlug.has(slug)) return "Sub-module";
  const stream = streamBySlug.get(slug);
  if (stream) return stream.parent === null ? "Value stream" : "Sub-stream";
  return bandByModule[rootModuleOf(slug)] ? "Process" : null;
};

export const guides: Guide[] = raw.map((g) => {
  const root = rootModuleOf(g.slug);
  const module = bandByModule[root] ? root : null;
  const streamSlugs = streamsBySlug[g.slug] ?? [];
  const primary = streamSlugs[0];
  return {
    ...g,
    level: levelOf(g.slug),
    module,
    subModule: subModuleOf(g.slug),
    streams: streamSlugs,
    considerations: considerationsBySlug[g.slug] ?? [],
    scope: scopeBySlug[g.slug] ?? (module ? (["Global"] as Scope[]) : []),
    valueStream: primary ? (streamBySlug.get(primary)?.name ?? null) : null,
    domain: domainOf(g.slug),
    workflow: g.workflow
      ? g.workflow
          .split("→")
          .map((step) => step.trim())
          .filter((step) => step.length > 0 && !/no article found/i.test(step))
      : [],
  };
});

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

export const allBusinessDomains: BusinessDomain[] = allBands;

/** L1 stream display names, in band order. */
export const allValueStreams: ValueStream[] = allBands.flatMap((band) =>
  streamsInBand(band).map((stream) => stream.name),
);

export const streamsInDomain = (domain: BusinessDomain): ValueStream[] =>
  streamsInBand(domain).map((stream) => stream.name);

export const guidesInStream = (stream: ValueStream) =>
  guides.filter((g) => g.valueStream === stream);

/** Considerations a topic raises, including every topic beneath it. */
export const considerationsOf = (slug: string): Consideration[] => {
  const seen = new Set<Consideration>();
  const walk = (s: string) => {
    (considerationsBySlug[s] ?? []).forEach((c) => seen.add(c));
    guides.filter((g) => g.parent === s).forEach((child) => walk(child.slug));
  };
  walk(slug);
  return Array.from(seen);
};

export const allCategories = Array.from(new Set(guides.flatMap((g) => g.categories))).sort();
