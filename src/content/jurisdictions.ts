/**
 * The layer under Local-AU: what changes between states and territories.
 *
 * "Applies in Australia" is not precise enough to configure anything. Payroll
 * tax is a state tax with its own threshold, its own rate and its own grouping
 * rules. Long service leave is a state act, and in several industries a
 * portable scheme sits on top of it. Workers compensation is a different
 * scheme with a different premium basis in every jurisdiction. For a public
 * entity, the financial management legislation it reports under, the
 * auditor-general who audits it and the economic regulator that sets its
 * prices are all state instruments too.
 *
 * What is recorded here is institutional: which body, which act, which scheme.
 * Deliberately not recorded are thresholds, rates and dates — they change at
 * least annually, and a number published here would be wrong before it was
 * useful. Name the source, go and get the current figure.
 *
 * Federal obligations — Single Touch Payroll, superannuation guarantee, the
 * Fair Work modern award system, ABA payment files — do not vary by state.
 * They are tagged Local-AU and carry no jurisdictions, which is the model's
 * way of saying the obligation is national.
 */

import type { Jurisdiction } from "./model";

export type JurisdictionProfile = {
  code: Jurisdiction;
  name: string;
  /** Payroll tax: who administers it. */
  revenueOffice: string;
  /** The long service leave instrument, and any portable scheme on top of it. */
  longServiceLeave: string;
  portableSchemes: string;
  /** The workers compensation scheme and its regulator. */
  workersCompensation: string;
  /** The procurement framework a public entity buys under. */
  procurement: string;
  /** The financial management legislation a public entity reports under. */
  publicFinance: string;
  auditor: string;
  /** The economic regulator, where prices are set rather than charged. */
  economicRegulator: string;
  /** What this jurisdiction does to an ERP build that the others do not. */
  note: string;
};

export const jurisdictions: JurisdictionProfile[] = [
  {
    code: "NSW",
    name: "New South Wales",
    revenueOffice: "Revenue NSW",
    longServiceLeave: "Long Service Leave Act 1955 (NSW)",
    portableSchemes: "Building and construction, through the Long Service Payments Corporation.",
    workersCompensation:
      "icare, with the scheme regulated by the State Insurance Regulatory Authority.",
    procurement:
      "NSW Procurement Board directions, with agency buying through the whole-of-government arrangements.",
    publicFinance: "Government Sector Finance Act 2018 (NSW)",
    auditor: "Audit Office of New South Wales",
    economicRegulator: "Independent Pricing and Regulatory Tribunal (IPART)",
    note: "The Government Sector Finance Act reshaped reporting and delegation for state entities, so a finance build here should be checked against the current GSF requirements rather than against how the entity reported before it.",
  },
  {
    code: "VIC",
    name: "Victoria",
    revenueOffice: "State Revenue Office Victoria",
    longServiceLeave: "Long Service Leave Act 2018 (Vic)",
    portableSchemes:
      "Community services, contract cleaning and security, through the Portable Long Service Authority.",
    workersCompensation: "WorkSafe Victoria.",
    procurement:
      "Victorian Government Purchasing Board policies, with the Social Procurement Framework applying to how spend is directed as well as how it is approved.",
    publicFinance: "Financial Management Act 1994 (Vic), with the Standing Directions under it",
    auditor: "Victorian Auditor-General's Office",
    economicRegulator: "Essential Services Commission",
    note: "The Standing Directions are specific about attestation and internal control, which makes them a design input to access, delegation and evidence retention rather than a reporting afterthought.",
  },
  {
    code: "QLD",
    name: "Queensland",
    revenueOffice: "Queensland Revenue Office",
    longServiceLeave: "Industrial Relations Act 2016 (Qld)",
    portableSchemes: "Building and construction and community services, through QLeave.",
    workersCompensation:
      "WorkCover Queensland, with the scheme overseen by the Office of Industrial Relations.",
    procurement: "Queensland Procurement Policy.",
    publicFinance: "Financial Accountability Act 2009 (Qld)",
    auditor: "Queensland Audit Office",
    economicRegulator: "Queensland Competition Authority",
    note: "Long service leave sits inside the industrial relations act rather than in an act of its own, so entitlement questions here are read against a different instrument than in most other states.",
  },
  {
    code: "WA",
    name: "Western Australia",
    revenueOffice: "RevenueWA",
    longServiceLeave: "Long Service Leave Act 1958 (WA)",
    portableSchemes: "Construction, through MyLeave.",
    workersCompensation: "WorkCover WA, with cover placed through approved insurers.",
    procurement: "Western Australian Procurement Rules, administered by the Department of Finance.",
    publicFinance: "Financial Management Act 2006 (WA)",
    auditor: "Office of the Auditor General Western Australia",
    economicRegulator: "Economic Regulation Authority",
    note: "Western Australia has its own industrial relations system for some employers, so which system an employee sits under is a question to settle before award interpretation is configured, not after.",
  },
  {
    code: "SA",
    name: "South Australia",
    revenueOffice: "RevenueSA",
    longServiceLeave: "Long Service Leave Act 1987 (SA)",
    portableSchemes: "Construction, through the industry long service leave board.",
    workersCompensation: "ReturnToWorkSA.",
    procurement:
      "The South Australian Government procurement framework, administered through Treasury and Finance.",
    publicFinance: "Public Finance and Audit Act 1987 (SA)",
    auditor: "Auditor-General's Department",
    economicRegulator: "Essential Services Commission of South Australia",
    note: "The procurement framework has been restructured in recent years; confirm the current instrument rather than relying on an entity's existing procurement documentation, which often predates it.",
  },
  {
    code: "TAS",
    name: "Tasmania",
    revenueOffice: "State Revenue Office Tasmania",
    longServiceLeave: "Long Service Leave Act 1976 (Tas)",
    portableSchemes: "Construction, through TasBuild.",
    workersCompensation: "WorkCover Tasmania, with cover placed through licensed insurers.",
    procurement: "Treasurer's Instructions covering procurement.",
    publicFinance: "Financial Management Act 2016 (Tas)",
    auditor: "Tasmanian Audit Office",
    economicRegulator: "Office of the Tasmanian Economic Regulator",
    note: "Procurement obligations sit in Treasurer's Instructions rather than in a standalone policy body, so the approval and disclosure rules are read from the instructions directly.",
  },
  {
    code: "ACT",
    name: "Australian Capital Territory",
    revenueOffice: "ACT Revenue Office",
    longServiceLeave: "Long Service Leave Act 1976 (ACT)",
    portableSchemes:
      "The broadest portable coverage in the country — construction, cleaning, security and community sector — through ACT Leave.",
    workersCompensation: "Private insurers under the territory scheme, regulated by WorkSafe ACT.",
    procurement: "Government Procurement Act 2001 (ACT).",
    publicFinance: "Financial Management Act 1996 (ACT)",
    auditor: "ACT Audit Office",
    economicRegulator: "Independent Competition and Regulatory Commission",
    note: "Portable long service leave covers more industries here than anywhere else, so an employer operating across the border can owe portable contributions on ACT work and not on the equivalent work next door.",
  },
  {
    code: "NT",
    name: "Northern Territory",
    revenueOffice: "Territory Revenue Office",
    longServiceLeave: "Long Service Leave Act 1981 (NT)",
    portableSchemes: "Construction, through NT Build.",
    workersCompensation: "The territory return to work scheme, regulated by NT WorkSafe.",
    procurement: "Procurement Act 1995 (NT), with local industry participation obligations.",
    publicFinance: "Financial Management Act 1995 (NT)",
    auditor: "Northern Territory Auditor-General's Office",
    economicRegulator: "Utilities Commission of the Northern Territory",
    note: "Local content obligations attach to territory procurement, which means the supplier record has to carry the attributes those obligations are reported against.",
  },
];

export const jurisdictionByCode = new Map(jurisdictions.map((j) => [j.code, j]));

/** The fields, in the order they are worth reading, with what each one is. */
export const jurisdictionFields: Array<{
  key: keyof Omit<JurisdictionProfile, "code" | "name" | "note">;
  label: string;
  why: string;
}> = [
  {
    key: "revenueOffice",
    label: "Payroll tax",
    why: "A state tax with its own threshold, rate and grouping rules. An employer over the line in more than one state registers, lodges and pays in each of them.",
  },
  {
    key: "longServiceLeave",
    label: "Long service leave",
    why: "A state entitlement. Accrual, qualifying period and what counts as continuous service all vary, and the payroll system has to hold the rule that applies to where the employee works.",
  },
  {
    key: "portableSchemes",
    label: "Portable schemes",
    why: "In some industries the entitlement follows the worker rather than the employer, and the employer owes returns and levies to the scheme regardless of whether anyone has taken leave.",
  },
  {
    key: "workersCompensation",
    label: "Workers compensation",
    why: "A different scheme, a different premium basis and a different declaration in every jurisdiction. The wage definition the premium is calculated on rarely matches the one payroll reports elsewhere.",
  },
  {
    key: "procurement",
    label: "Procurement framework",
    why: "For a public entity this governs approval, disclosure and often what has to be bought locally or from particular suppliers. The system has to evidence it, not just permit it.",
  },
  {
    key: "publicFinance",
    label: "Public finance legislation",
    why: "What a public entity reports under, and where the internal control and attestation obligations come from. It shapes the close calendar and the evidence the system retains.",
  },
  {
    key: "auditor",
    label: "Auditor-general",
    why: "Audits the entity and tests the controls. Access design and segregation of duties will be examined by this office rather than described to it.",
  },
  {
    key: "economicRegulator",
    label: "Economic regulator",
    why: "Where prices are determined rather than charged, cost allocation has to be defensible to this body, which makes it a chart of accounts input.",
  },
];
