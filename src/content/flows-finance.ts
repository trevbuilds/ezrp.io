/**
 * End-to-end flows — Finance / supply-chain batch.
 * Same Flow shape as flows.ts.
 */
import type { Flow } from "./flows";

/**
 * Procure-to-Pay, owned by the procurement guide. Complements the existing
 * AP automation flow (which starts once the invoice exists) by showing the
 * commitment side that makes three-way match possible.
 *
 * Lanes mirror the AP / payroll pattern: upstream need, sourcing, commitment,
 * the payable path, the automation layer that removes handling, then the
 * cash / ledger / AU banking tail.
 */
const procureToPayFlow: Flow = {
  slug: "procurement",
  title: "Need → Source → Commit → Pay → Automate → and beyond",
  summary:
    "Where a purchase actually travels: the organisation raises an approved need, sourcing turns it into a supplier and a contract, procurement commits the spend and records receipt, finance turns that evidence into an approved payable, automation removes the handling between those steps, and the tail end is cash, reconciliation, Australian bank files and spend reporting.",
  lanes: [
    {
      id: "need",
      layer: "Need",
      blurb: "What has to be true before anyone can buy.",
      slug: "supply-chain-management",
      callout:
        "In Australian public entities, procurement policy and probity obligations attach here — before a catalogue item is clicked — and Locales names the state frameworks without embedding rates.",
      steps: [
        {
          label: "Demand signal",
          note: "A stockout, a project buy, a service request, or a planned replenishment.",
        },
        {
          label: "Budget check",
          note: "Cost centre, available funds and the period the spend belongs to.",
          slug: "financial-accounting",
        },
        {
          label: "Category and policy",
          note: "What may be bought, preferred channels, and what must go to tender.",
          slug: "procurement",
        },
        {
          label: "Delegation of authority",
          note: "Who may raise the need and who may approve it.",
          slug: "sod-and-rbac",
        },
        {
          label: "Requisition",
          note: "The need is raised, costed, coded and routed for approval.",
          slug: "procurement",
        },
      ],
    },
    {
      id: "source",
      layer: "Source",
      blurb: "Choosing who will supply, under what terms — and verifying who they are.",
      slug: "procurement",
      callout:
        "Vendor master bank-detail changes are the usual invoice-fraud surface; dual authorisation and callback verification belong here, not only in AP.",
      steps: [
        {
          label: "Supplier master",
          note: "Vendor record with terms, tax registration, bank details and contacts.",
          slug: "procurement",
        },
        {
          label: "Catalogue or RFQ",
          note: "Call off a preferred item, or run a competitive process at the depth the spend warrants.",
        },
        {
          label: "Evaluation and award",
          note: "Value, risk and probity evidenced — especially where government purchasing policy applies.",
        },
        {
          label: "Contract or agreement",
          note: "Price, SLA, variation rules and local-content obligations locked where they apply.",
        },
        {
          label: "Preferred supplier",
          note: "Ready for call-off without re-tendering every requisition.",
        },
      ],
    },
    {
      id: "commit",
      layer: "Commit",
      blurb: "Turning an approved need into the commitment and receipt the invoice will be matched to.",
      slug: "procurement",
      steps: [
        {
          label: "Purchase order",
          note: "The commitment finance and AP will recognise — scope, price and terms.",
          slug: "procurement",
        },
        {
          label: "Acknowledgement",
          note: "Supplier confirms quantity, price and promised date.",
        },
        {
          label: "Goods / service receipt",
          note: "Proof the thing actually arrived — unreceipted orders are the usual cause of blocked invoices.",
          slug: "procurement",
        },
        {
          label: "Inventory update",
          note: "Stock and valuation where goods are held, not just a paper receipt.",
          slug: "inventory-management",
        },
        {
          label: "Commitment reserve",
          note: "Budget consumed before the invoice lands, so spend is visible early.",
          slug: "financial-accounting",
        },
      ],
    },
    {
      id: "pay",
      layer: "Pay",
      blurb: "The recorded AP path — where the commitment becomes a payable and then cash.",
      slug: "accounts-payable",
      steps: [
        {
          label: "Invoice receipt",
          note: "Email, EDI, e-invoicing or supplier portal — captured once, not rekeyed.",
          slug: "accounts-payable",
        },
        {
          label: "3-way match",
          note: "Invoice against purchase order and receipt before anyone approves payment.",
          slug: "3-way-matching",
        },
        {
          label: "Exception handling",
          note: "Only mismatches reach a person; price, quantity and coding route differently.",
          slug: "ap-automation",
        },
        {
          label: "Payment approval",
          note: "Routed by value, cost centre and policy, separate from the preparer.",
          slug: "sod-and-rbac",
        },
        {
          label: "Payment disbursement",
          note: "Scheduled against vendor terms into the payment run.",
          slug: "payments",
        },
      ],
    },
    {
      id: "automation",
      layer: "AP automation",
      blurb: "The layer that removes the handling between capture, match and payment prep.",
      slug: "ap-automation",
      steps: [
        {
          label: "Capture / OCR",
          note: "Read the invoice instead of keying it from a PDF or inbox.",
          slug: "ap-automation",
        },
        {
          label: "Auto-match",
          note: "Match without a human where tolerances allow — only when PO and receipt exist.",
          slug: "3-way-matching",
        },
        {
          label: "Rules-based routing",
          note: "Straight-through unless a rule trips; exceptions named by type.",
        },
        {
          label: "Supplier portal",
          note: "Status and remittance without chasing AP for every invoice.",
        },
        {
          label: "Digital audit trail",
          note: "Every capture, match, exception and approval retained and retrievable.",
          slug: "compliance",
        },
      ],
    },
    {
      id: "beyond",
      layer: "And beyond",
      blurb: "What the payable turns into once it leaves AP.",
      callout:
        "In Australia the payment run usually becomes an ABA file — fixed-width text the bank lodges. Treat bank-file format and dual-control release as design constraints, not a go-live afterthought.",
      steps: [
        {
          label: "General ledger",
          note: "Expense, liability and accrual postings at the grain reporting needs.",
          slug: "general-ledger",
        },
        {
          label: "Cash management",
          note: "Forecasting and funding the payment run before it is released.",
          slug: "cash-management",
        },
        {
          label: "EFT files",
          note: "The batch payment instruction in the format the receiving bank expects.",
          slug: "eft-files",
        },
        {
          label: "ABA",
          note: "The Australian bulk payment file — where a config error becomes a real payment.",
          slug: "aba",
        },
        {
          label: "Bank reconciliation",
          note: "Payments matched back to statements once the file has cleared.",
          slug: "bank-reconciliation",
        },
        {
          label: "Spend analytics",
          note: "Category, supplier, cycle time, exception rate and non-PO share.",
          slug: "business-intelligence",
        },
      ],
    },
  ],
};

export const financeFlows: Flow[] = [procureToPayFlow];
