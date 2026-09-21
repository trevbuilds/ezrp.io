/**
 * Client context: the questions that dial the guidance up or down.
 *
 * The thesis and the anatomy are universal. The dial-ups are not — what
 * dominates for a water utility is not what dominates for a consultancy, and
 * an ASX-listed company carries obligations a family business does not.
 *
 * The ten industry dial-ups are migrated from the ERP Field Guide
 * (trevbuilds.github.io/guides/erp), which names for each sector which modules
 * dominate, which controls intensify, which integration patterns are
 * mandatory, and where the operating-model commitments hide.
 *
 * Size, organisation type and country are modifiers on top: they raise
 * considerations rather than change which modules matter.
 */

import type { Consideration, Scope } from "./model";

export type Industry =
  | "Utilities & Water"
  | "Financial Services"
  | "Government & Public Sector"
  | "Manufacturing & Industrial"
  | "Healthcare & Aged Care"
  | "Professional Services & Consulting"
  | "Retail & Wholesale"
  | "Aerospace & Defence"
  | "Oil & Gas"
  | "Mining & Resources";

export type OrgSize = "Under 200" | "200–2,000" | "2,000–10,000" | "10,000+";

export type OrgType = "Private" | "Listed" | "Government" | "Not-for-profit" | "Family-owned";

export type Country = "Australia" | "New Zealand" | "United Kingdom" | "United States" | "Other";

export type DialUp = {
  industry: Industry;
  /** How the sector behaves, in the field guide's words. */
  character: string;
  /** Module slugs that dominate — these seed the scope basket. */
  dominates: string[];
  /** What tightens here, and why. */
  controls: string;
  /** Integration patterns that are not optional in this sector. */
  integrations: string[];
  /** Where the operating-model commitment hides. */
  hides: string;
  /** Considerations this sector raises above the baseline. */
  raises: Consideration[];
};

export const dialUps: DialUp[] = [
  {
    industry: "Utilities & Water",
    character: "Asset-heavy, regulated, customer-facing, capex-intensive.",
    dominates: [
      "enterprise-asset-management",
      "project-management",
      "customer-relationship-management",
      "financial-accounting",
    ],
    controls:
      "Regulator submission integrity — price submissions, performance and safety reports. Field crew safety controls. Capex governance under economic regulation.",
    integrations: ["SCADA", "GIS", "AMI", "Regulator portals"],
    hides:
      "The line between operational technology and information technology: what lives in the EAM versus the OT historian, and how the chart of accounts distinguishes regulated from non-regulated activity.",
    raises: ["Compliance", "Governance", "Data", "Technology"],
  },
  {
    industry: "Financial Services",
    character: "Regulated, audit-intensive, customer-data-rich, integration-heavy.",
    dominates: [
      "customer-relationship-management",
      "financial-accounting",
      "human-capital-management",
    ],
    controls:
      "Segregation of duties across the trade lifecycle. KYC and AML evidence. Regulatory reporting accuracy under APRA, ASIC and Basel III. Records retention and trade reconstruction.",
    integrations: ["Event streams", "Market data", "Regulatory portals", "Identity providers"],
    hides:
      "The boundary between the ERP and the trading or banking platforms. The ERP is rarely the system of record for financial product transactions, but is for the firm's own books — confusing the two is endemic and expensive.",
    raises: ["Compliance", "Governance", "Data", "Technology"],
  },
  {
    industry: "Government & Public Sector",
    character: "Procurement-heavy, citizen-facing, transparency-driven, governance-intensive.",
    dominates: [
      "financial-accounting",
      "supply-chain-management",
      "human-capital-management",
      "project-management",
    ],
    controls:
      "Procurement probity. Appropriation-line accounting. FOI and records retention. Conflict of interest declarations. Auditor-general reporting.",
    integrations: [
      "Whole-of-government identity",
      "Whole-of-government procurement",
      "Treasury reporting",
      "Citizen portals",
    ],
    hides:
      "Appropriation logic does not map naturally onto a commercial general ledger. The chart of accounts has to carry both, and one of them wins — leaving the other as a workaround that stays a problem for a decade.",
    raises: ["Compliance", "Governance", "Process", "People"],
  },
  {
    industry: "Manufacturing & Industrial",
    character: "BOM-driven, capex-heavy, supply-chain-intensive, quality-regulated.",
    dominates: [
      "manufacturing",
      "supply-chain-management",
      "enterprise-asset-management",
      "financial-accounting",
    ],
    controls:
      "Quality compliance under ISO 9001, IATF or HACCP. Engineering change control. Costing accuracy, standard against actual. Inventory accuracy targets.",
    integrations: ["MES", "PLM", "WMS", "Supplier EDI", "Quality systems"],
    hides:
      "Costing method — standard, actual or hybrid — is the long-tail decision. Multi-level BOM management is rarely strong out of the box, so most enterprises end with PLM as the BOM master and the ERP as the costing master.",
    raises: ["Process", "Data", "Compliance", "Technology"],
  },
  {
    industry: "Healthcare & Aged Care",
    character: "Workforce-intensive, regulator-intensive, person-data-sensitive, billing-complex.",
    dominates: [
      "human-capital-management",
      "financial-accounting",
      "supply-chain-management",
      "project-management",
    ],
    controls:
      "Patient and resident data confidentiality. Clinical credentialling. Medication chain of custody. Funding-source accuracy across NDIS, Medicare and private. Aged-care subsidy compliance.",
    integrations: ["EMR", "Rostering", "Medication management", "Funder claims"],
    hides:
      "The contested boundary between clinical and corporate systems. Patient data lives in the EMR but feeds funder claims that live in the ERP, and mistakes leak both ways — under-claimed revenue, or a privacy breach.",
    raises: ["Compliance", "People", "Data", "Governance"],
  },
  {
    industry: "Professional Services & Consulting",
    character: "People-as-product, project-funded, billing-driven, light on physical assets.",
    dominates: [
      "project-management",
      "customer-relationship-management",
      "human-capital-management",
      "financial-accounting",
    ],
    controls:
      "Time-recording integrity — utilisation and billability. Revenue recognition under IFRS 15. Independence and conflict of interest. Client deliverable confidentiality.",
    integrations: ["Time recording", "Expense management", "Document platforms", "Client portals"],
    hides:
      "Resource utilisation is rarely the same number in two systems, and the PPM-to-finance link for WIP and revenue recognition is the long-running pain point. Whoever owns the utilisation number effectively runs the firm.",
    raises: ["People", "Value", "Compliance", "Process"],
  },
  {
    industry: "Retail & Wholesale",
    character: "Margin-thin, multi-channel, inventory-fast, customer-data-rich.",
    dominates: [
      "supply-chain-management",
      "customer-relationship-management",
      "financial-accounting",
      "human-capital-management",
    ],
    controls:
      "Inventory shrinkage and loss prevention. Channel revenue recognition. POS reconciliation. PCI-DSS for payment data. Promotional spend control.",
    integrations: ["POS", "E-commerce", "Payments", "Loyalty", "Marketplaces", "WMS"],
    hides:
      "Channel profitability is rarely the same in two reports, returns quietly erode reported margin, and the product master commonly carries different attributes per channel with nobody owning reconciliation.",
    raises: ["Data", "Process", "Value", "Technology"],
  },
  {
    industry: "Aerospace & Defence",
    character:
      "Program-cost accounting, configuration management, classified delivery, government as customer.",
    dominates: [
      "project-management",
      "manufacturing",
      "financial-accounting",
      "enterprise-asset-management",
    ],
    controls:
      "ITAR and EAR export controls, where data residency, user clearance and vendor citizenship become system-level constraints. Configuration management discipline. Continuous audit posture. Segregation of duties extending to clearance level.",
    integrations: [
      "PLM / CAD",
      "MES",
      "Classified instances",
      "Export-controlled supplier networks",
    ],
    hides:
      "Configuration management drift — as-designed, as-built and as-maintained records diverge silently. Classified environments fall behind their unclassified counterparts because patching is harder, then become the most vulnerable systems in the estate.",
    raises: ["Compliance", "Governance", "Data", "Technology"],
  },
  {
    industry: "Oil & Gas",
    character:
      "Joint venture accounting, lease and well master data, HSE-integrated operations, capital intensity.",
    dominates: [
      "financial-accounting",
      "enterprise-asset-management",
      "project-management",
      "supply-chain-management",
    ],
    controls:
      "Health, safety and environment integrated into every transaction. Production allocation across lease holders. Royalty calculations to government, traditional owners and mineral rights holders. SOX or equivalent.",
    integrations: [
      "SCADA",
      "CTRM",
      "JV partner systems",
      "Royalty gateways",
      "Marine and aviation logistics",
    ],
    hides:
      "Joint venture accounting is consistently under-estimated, lease and well master data carries decades of historical accidents, and the hand-off between SCADA-measured and ERP-recorded volumes is where the most expensive reconciliation drift lives.",
    raises: ["Compliance", "Governance", "Data", "Process"],
  },
  {
    industry: "Mining & Resources",
    character:
      "Ore-body master data, FIFO workforce, royalty regimes, fleet maintenance, environmental obligations.",
    dominates: [
      "enterprise-asset-management",
      "supply-chain-management",
      "human-capital-management",
      "financial-accounting",
    ],
    controls:
      "Mine plan reconciliation across scheduled, mined, processed and sold. Royalties varying by commodity, grade and tonnage band. Environmental and rehabilitation obligations tracked across asset life. Permit and licence compliance, where one expiring document stops operations.",
    integrations: ["Fleet management", "Mine planning", "LIMS", "Weighbridge", "Royalty gateways"],
    hides:
      "Each step between mine plan, production, processing and sales carries a variance, and every variance is both a financial impact and a regulatory disclosure. FIFO roster complexity collides with payroll cycles designed for an office workforce.",
    raises: ["Compliance", "Data", "People", "Value"],
  },
];

export const dialUpFor = (industry: Industry) => dialUps.find((dial) => dial.industry === industry);

export const allIndustries = dialUps.map((dial) => dial.industry);
export const allSizes: OrgSize[] = ["Under 200", "200–2,000", "2,000–10,000", "10,000+"];
export const allOrgTypes: OrgType[] = [
  "Private",
  "Listed",
  "Government",
  "Not-for-profit",
  "Family-owned",
];
export const allCountries: Country[] = [
  "Australia",
  "New Zealand",
  "United Kingdom",
  "United States",
  "Other",
];

/** What an answer adds on top of the industry dial-up. */
export type Modifier = { note: string; raises: Consideration[] };

export const sizeModifier: Record<OrgSize, Modifier> = {
  "Under 200": {
    note: "At this size the constraint is people, not process. One person usually holds three roles, so segregation of duties is a design problem from day one rather than an audit finding later.",
    raises: ["People", "Delivery"],
  },
  "200–2,000": {
    note: "The size where informal process stops scaling. Most of the value is in making the operating model explicit before the system encodes the informal version.",
    raises: ["Process", "Governance"],
  },
  "2,000–10,000": {
    note: "Multiple business units means the standardise-versus-localise trade-off is the central decision, and it has to be made deliberately rather than settled per rollout.",
    raises: ["Governance", "Data", "Delivery"],
  },
  "10,000+": {
    note: "At enterprise scale the integration spine and master data ownership matter more than any single module. Change capacity, not budget, is the binding constraint.",
    raises: ["Data", "Technology", "Strategy", "Delivery"],
  },
};

export const orgTypeModifier: Record<OrgType, Modifier> = {
  Private: {
    note: "Fewer external reporting obligations, so the discipline has to come from inside. The risk is that controls are treated as optional until an event forces them.",
    raises: ["Governance"],
  },
  Listed: {
    note: "Continuous disclosure and external audit make the controls fabric and the close calendar non-negotiable, and they shape the go-live window.",
    raises: ["Compliance", "Governance", "Value"],
  },
  Government: {
    note: "Procurement probity, appropriation accounting and public scrutiny apply regardless of sector. Transparency obligations shape what the system must be able to evidence.",
    raises: ["Compliance", "Governance", "Process"],
  },
  "Not-for-profit": {
    note: "Funding-source accounting and acquittal reporting drive the chart of accounts, and grant conditions often dictate what has to be separately tracked.",
    raises: ["Compliance", "Value", "Governance"],
  },
  "Family-owned": {
    note: "Decision rights often sit outside the formal structure. Naming who actually owns each operating-model commitment matters more here than the org chart suggests.",
    raises: ["Governance", "People", "Strategy"],
  },
};

export const countryModifier: Record<Country, { note: string; scope: Scope }> = {
  Australia: {
    note: "Single Touch Payroll, superannuation guarantee, modern award interpretation and ABA payment files all apply. These are obligations, not configuration preferences.",
    scope: "Local-AU",
  },
  "New Zealand": {
    note: "Payday filing and KiwiSaver replace the AU payroll obligations; the shape of the problem is similar but the rules are not.",
    scope: "Global",
  },
  "United Kingdom": {
    note: "RTI payroll reporting, auto-enrolment pensions and Making Tax Digital apply.",
    scope: "Global",
  },
  "United States": {
    note: "Multi-state payroll tax, ACA reporting and, for public companies, SOX shape the controls fabric.",
    scope: "Global",
  },
  Other: {
    note: "Local statutory reporting and payroll obligations still apply — worth naming them explicitly before configuration starts.",
    scope: "Global",
  },
};
