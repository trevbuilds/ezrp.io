/**
 * Data flows: what comes into a topic, and what leaves it.
 *
 * A module boundary tells you an interface exists. It does not tell you what
 * crosses it, which direction, how often, or what breaks when it stops. That
 * is the difference between "finance and payroll integrate" and "the payroll
 * journal posts to the general ledger each pay run, and if it fails the month
 * does not close".
 *
 * `counterpart` is either another topic's slug — an internal hand-off the
 * model can connect — or the name of a system outside the ERP, which is an
 * interface someone has to build and own.
 *
 * Flows are declared on the topic that owns the data at that moment, so each
 * appears once. The connection is derived: an outbound flow whose counterpart
 * is a topic meets that topic's inbound flow of the same payload.
 */

export type FlowDirection = "in" | "out";

export type DataFlow = {
  /** The topic this flow belongs to. */
  topic: string;
  /** What actually moves. */
  payload: string;
  direction: FlowDirection;
  /** Another topic slug, or an external system. */
  counterpart: string;
  /** True when the counterpart is outside the ERP entirely. */
  external: boolean;
  /** How often it runs. */
  cadence: string;
  /** What it costs when it stops. */
  breaks: string;
};

export const dataFlows: DataFlow[] = [
  // ------------------------------------------------------ General Ledger
  {
    topic: "general-ledger",
    payload: "Payroll journal",
    direction: "in",
    counterpart: "payroll",
    external: false,
    cadence: "Per pay run",
    breaks: "Labour cost is missing from the period and the month cannot close.",
  },
  {
    topic: "general-ledger",
    payload: "Sub-ledger postings",
    direction: "in",
    counterpart: "accounts-payable",
    external: false,
    cadence: "Continuous",
    breaks: "Payables detail and the control account disagree.",
  },
  {
    topic: "general-ledger",
    payload: "Revenue postings",
    direction: "in",
    counterpart: "accounts-receivable",
    external: false,
    cadence: "Continuous",
    breaks: "Revenue is recognised late or not at all.",
  },
  {
    topic: "general-ledger",
    payload: "Depreciation journal",
    direction: "in",
    counterpart: "asset-management",
    external: false,
    cadence: "Monthly",
    breaks: "Asset carrying values drift from the ledger.",
  },
  {
    topic: "general-ledger",
    payload: "Statutory and management reporting",
    direction: "out",
    counterpart: "Regulator and board reporting",
    external: true,
    cadence: "Monthly and annually",
    breaks: "Statutory deadlines are missed.",
  },
  {
    topic: "general-ledger",
    payload: "Trial balance extract",
    direction: "out",
    counterpart: "business-intelligence",
    external: false,
    cadence: "Daily",
    breaks: "Reporting runs on stale numbers.",
  },

  // ---------------------------------------------------- Accounts Payable
  {
    topic: "accounts-payable",
    payload: "Supplier invoices",
    direction: "in",
    counterpart: "Supplier e-invoicing, email and portals",
    external: true,
    cadence: "Continuous",
    breaks: "Invoices arrive by exception and are keyed by hand.",
  },
  {
    topic: "accounts-payable",
    payload: "Purchase orders and goods receipts",
    direction: "in",
    counterpart: "procurement",
    external: false,
    cadence: "Continuous",
    breaks: "Three-way matching has nothing to match against.",
  },
  {
    topic: "accounts-payable",
    payload: "Payment file",
    direction: "out",
    counterpart: "aba",
    external: false,
    cadence: "Per payment run",
    breaks: "Suppliers are not paid.",
  },
  {
    topic: "accounts-payable",
    payload: "Remittance advice",
    direction: "out",
    counterpart: "Suppliers",
    external: true,
    cadence: "Per payment run",
    breaks: "Suppliers cannot reconcile and call the finance team instead.",
  },

  // ------------------------------------------------- Accounts Receivable
  {
    topic: "accounts-receivable",
    payload: "Billing data",
    direction: "in",
    counterpart: "order-processing",
    external: false,
    cadence: "Continuous",
    breaks: "Delivered work is never invoiced.",
  },
  {
    topic: "accounts-receivable",
    payload: "Customer receipts",
    direction: "in",
    counterpart: "Bank statement feed",
    external: true,
    cadence: "Daily",
    breaks: "Cash is unapplied and collections chase customers who have paid.",
  },
  {
    topic: "accounts-receivable",
    payload: "Invoices and statements",
    direction: "out",
    counterpart: "Customers and e-invoicing networks",
    external: true,
    cadence: "Per billing cycle",
    breaks: "Payment terms start late, and days sales outstanding rises.",
  },

  // ------------------------------------------------------ Cash & Treasury
  {
    topic: "cash-management",
    payload: "Bank statements",
    direction: "in",
    counterpart: "Banking platform",
    external: true,
    cadence: "Daily",
    breaks: "The cash position is a guess and reconciliation stalls.",
  },
  {
    topic: "cash-management",
    payload: "Cash position and forecast",
    direction: "out",
    counterpart: "business-intelligence",
    external: false,
    cadence: "Daily",
    breaks: "Treasury decisions are made on yesterday's balance.",
  },
  {
    topic: "bank-reconciliation",
    payload: "Matched and unmatched items",
    direction: "out",
    counterpart: "general-ledger",
    external: false,
    cadence: "Daily",
    breaks: "The ledger and the bank never agree.",
  },

  // ------------------------------------------------------------- Payroll
  {
    topic: "payroll",
    payload: "Approved time and attendance",
    direction: "in",
    counterpart: "time-and-attendance",
    external: false,
    cadence: "Per pay cycle",
    breaks: "People are paid on estimates and corrected afterwards.",
  },
  {
    topic: "payroll",
    payload: "Employee and position master",
    direction: "in",
    counterpart: "core-hr",
    external: false,
    cadence: "Continuous",
    breaks: "Starters are unpaid and leavers keep being paid.",
  },
  {
    topic: "payroll",
    payload: "Payroll journal",
    direction: "out",
    counterpart: "general-ledger",
    external: false,
    cadence: "Per pay run",
    breaks: "Labour cost is missing from the period.",
  },
  {
    topic: "payroll",
    payload: "Net pay file",
    direction: "out",
    counterpart: "aba",
    external: false,
    cadence: "Per pay run",
    breaks: "Staff are not paid.",
  },
  {
    topic: "superannuation",
    payload: "Contributions",
    direction: "out",
    counterpart: "SuperStream gateway and funds",
    external: true,
    cadence: "At least quarterly",
    breaks: "Superannuation guarantee charge, and it is not tax deductible.",
  },
  {
    topic: "single-touch-payroll",
    payload: "STP event",
    direction: "out",
    counterpart: "ATO",
    external: true,
    cadence: "On or before each pay day",
    breaks: "Reporting obligation missed; penalties and employee income statements wrong.",
  },

  // --------------------------------------------------------- Procurement
  {
    topic: "procurement",
    payload: "Purchase orders",
    direction: "out",
    counterpart: "Suppliers, EDI and supplier portals",
    external: true,
    cadence: "Continuous",
    breaks: "Suppliers work from email and there is no commitment record.",
  },
  {
    topic: "procurement",
    payload: "Goods and service receipts",
    direction: "out",
    counterpart: "accounts-payable",
    external: false,
    cadence: "Continuous",
    breaks: "Invoices block and become manual workarounds.",
  },
  {
    topic: "procurement",
    payload: "Supplier master",
    direction: "out",
    counterpart: "accounts-payable",
    external: false,
    cadence: "On change",
    breaks: "Payments go to unverified bank details.",
  },

  // ------------------------------------------------------ Asset accounting
  {
    topic: "asset-management",
    payload: "Capitalised project costs",
    direction: "in",
    counterpart: "project-costing",
    external: false,
    cadence: "Monthly",
    breaks: "Capital work in progress never becomes an asset.",
  },
  {
    topic: "asset-management",
    payload: "Asset register alignment",
    direction: "in",
    counterpart: "asset-lifecycle-management",
    external: false,
    cadence: "Continuous",
    breaks: "The financial register and the physical register describe different assets.",
  },
  {
    topic: "asset-management",
    payload: "Depreciation journal",
    direction: "out",
    counterpart: "general-ledger",
    external: false,
    cadence: "Monthly",
    breaks: "Carrying values drift from the ledger.",
  },

  // ------------------------------------------------- Order and inventory
  {
    topic: "order-processing",
    payload: "Customer orders",
    direction: "in",
    counterpart: "sales-force-automation",
    external: false,
    cadence: "Continuous",
    breaks: "Orders are rekeyed and differ from what was agreed.",
  },
  {
    topic: "order-processing",
    payload: "Delivery confirmation",
    direction: "out",
    counterpart: "accounts-receivable",
    external: false,
    cadence: "Continuous",
    breaks: "Delivered goods are never invoiced.",
  },
  {
    topic: "inventory-management",
    payload: "Stock movements",
    direction: "out",
    counterpart: "general-ledger",
    external: false,
    cadence: "Continuous",
    breaks: "Inventory value in the ledger stops matching the warehouse.",
  },

  // ------------------------------------------------------------- Data
  {
    topic: "data-migration",
    payload: "Opening balances and master data",
    direction: "out",
    counterpart: "general-ledger",
    external: false,
    cadence: "At cutover",
    breaks: "The new ledger opens on numbers nobody can reconcile to the old one.",
  },
  {
    topic: "business-intelligence",
    payload: "Reporting extracts",
    direction: "in",
    counterpart: "general-ledger",
    external: false,
    cadence: "Daily",
    breaks: "Management reporting diverges from the ledger.",
  },
];

export const flowsFor = (slug: string) => dataFlows.filter((flow) => flow.topic === slug);

export const inboundTo = (slug: string) =>
  dataFlows.filter((flow) => flow.direction === "out" && flow.counterpart === slug);

/** Flows touching any topic in a set, with internal ones de-duplicated. */
export function flowsForScope(slugs: string[]) {
  const inScope = new Set(slugs);
  const touching = dataFlows.filter(
    (flow) => inScope.has(flow.topic) || (!flow.external && inScope.has(flow.counterpart)),
  );
  const internal = touching.filter((flow) => !flow.external);
  const external = touching.filter((flow) => flow.external);
  /** Internal flows where only one end is being changed. */
  const straddling = internal.filter(
    (flow) => inScope.has(flow.topic) !== inScope.has(flow.counterpart),
  );
  return { internal, external, straddling };
}
