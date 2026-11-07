/**
 * End-to-end flows — Finance / supply-chain batch.
 * Same Flow shape as flows.ts.
 */
import type { Flow } from "./flows";

/**
 * Procure-to-Pay, owned by the procurement guide. Complements the existing
 * AP automation flow (which starts once the invoice exists) by showing the
 * commitment side that makes three-way match possible.
 */
const procureToPayFlow: Flow = {
  slug: "procurement",
  title: "Need → Source → Commit → Pay → and beyond",
  summary:
    "Where a purchase actually travels: the organisation raises a need, sourcing turns it into a supplier and a contract, procurement commits the spend, finance turns the receipt into an approved payable, and the tail end is cash, reconciliation and spend reporting.",
  lanes: [
    {
      id: "need",
      layer: "Need",
      blurb: "What has to be true before anyone can buy.",
      steps: [
        { label: "Demand signal", note: "A stockout, a project, or a service request." },
        { label: "Budget check", note: "Cost centre and available funds confirmed." },
        { label: "Category and policy", note: "What may be bought, and under which rules." },
        { label: "Delegation of authority", note: "Who may raise and who may approve.", slug: "sod-and-rbac" },
        { label: "Requisition", note: "The need is raised, costed and routed." },
      ],
    },
    {
      id: "source",
      layer: "Source",
      blurb: "Choosing who will supply, under what terms.",
      slug: "procurement",
      steps: [
        { label: "Supplier master", note: "Vendor records, terms, bank and tax details." },
        { label: "Catalogue or RFQ", note: "Preferred item, or a competitive process." },
        { label: "Evaluation and award", note: "Value, risk and probity evidenced." },
        { label: "Contract or agreement", note: "Price, SLA and variation rules locked." },
        { label: "Preferred supplier", note: "Ready for call-off without re-tendering." },
      ],
    },
    {
      id: "commit",
      layer: "Commit",
      blurb: "Turning an approved need into a commitment the invoice can be matched to.",
      slug: "procurement",
      steps: [
        { label: "Purchase order", note: "The commitment finance and AP will recognise." },
        { label: "Acknowledgement", note: "Supplier confirms quantity, price and date." },
        { label: "Goods / service receipt", note: "Proof the thing actually arrived." },
        { label: "Inventory update", note: "Stock and valuation where goods are held.", slug: "inventory-management" },
        { label: "Commitment reserve", note: "Budget consumed before the invoice lands." },
      ],
    },
    {
      id: "pay",
      layer: "Pay",
      blurb: "The recorded AP path — where the commitment becomes a payable and then cash.",
      slug: "accounts-payable",
      steps: [
        { label: "Invoice receipt", note: "Email, EDI, e-invoicing or supplier portal." },
        {
          label: "3-way match",
          note: "Invoice against purchase order and receipt.",
          slug: "3-way-matching",
        },
        { label: "Exception handling", note: "Only mismatches reach a person.", slug: "ap-automation" },
        { label: "Payment approval", note: "Routed by value, cost centre and policy." },
        { label: "Payment disbursement", note: "Scheduled against vendor terms.", slug: "payments" },
      ],
    },
    {
      id: "beyond",
      layer: "And beyond",
      blurb: "What the payable turns into once it leaves AP.",
      steps: [
        { label: "General ledger", note: "Expense, liability and accrual postings.", slug: "general-ledger" },
        { label: "Cash management", note: "Forecasting and funding the payment run.", slug: "cash-management" },
        { label: "ABA / EFT files", note: "The bank file that moves the money.", slug: "aba" },
        {
          label: "Bank reconciliation",
          note: "Payments matched back to statements.",
          slug: "bank-reconciliation",
        },
        {
          label: "Spend analytics",
          note: "Category, supplier and cycle-time visibility.",
          slug: "business-intelligence",
        },
      ],
    },
  ],
};

export const financeFlows: Flow[] = [procureToPayFlow];
