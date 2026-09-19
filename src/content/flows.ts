/**
 * End-to-end flows: how a process crosses layers, from the ERP platform
 * through finance and the process itself and out the other side.
 *
 * Steps point at guide slugs where a guide exists; otherwise they are plain
 * steps taken from the recorded workflow.
 */

export type FlowStep = {
  label: string;
  note: string;
  slug?: string;
};

export type FlowLane = {
  id: string;
  layer: string;
  blurb: string;
  slug?: string;
  steps: FlowStep[];
};

export type Flow = {
  slug: string;
  title: string;
  summary: string;
  lanes: FlowLane[];
};

const apAutomationFlow: Flow = {
  slug: "ap-automation",
  title: "ERP → Finance → AP → and beyond",
  summary:
    "Where an invoice actually travels: the ERP raises the commitment, finance owns the ledger it lands in, AP turns it into an approved payable, automation removes the handling, and the tail end is cash, reconciliation and reporting.",
  lanes: [
    {
      id: "erp",
      layer: "ERP platform",
      blurb: "The commitment is created before AP ever sees an invoice.",
      steps: [
        { label: "Vendor master", note: "Supplier records, terms, bank details." },
        { label: "Purchase requisition", note: "The need is raised and approved." },
        { label: "Purchase order", note: "The commitment the invoice will be matched to." },
        { label: "Goods / service receipt", note: "Proof the thing actually arrived." },
        {
          label: "Integration layer",
          note: "How the AP solution and the ERP exchange data.",
          slug: "integration",
        },
      ],
    },
    {
      id: "finance",
      layer: "Finance",
      blurb: "The ledger, the controls, and the cash position the payable hits.",
      slug: "financial-accounting",
      steps: [
        {
          label: "General ledger",
          note: "Where the expense and liability post.",
          slug: "general-ledger",
        },
        {
          label: "Accounts payable",
          note: "The sub-ledger holding what you owe.",
          slug: "accounts-payable",
        },
        {
          label: "Cash management",
          note: "Forecasting and funding the payment run.",
          slug: "cash-management",
        },
        {
          label: "SoD and approval limits",
          note: "Who may approve what, and who may pay.",
          slug: "sod-and-rbac",
        },
      ],
    },
    {
      id: "ap",
      layer: "Accounts payable",
      blurb: "The recorded AP workflow — the process automation is applied to.",
      slug: "accounts-payable",
      steps: [
        { label: "Invoice receipt", note: "Email, EDI or supplier portal." },
        {
          label: "3-way match",
          note: "Invoice against purchase order and receipt.",
          slug: "3-way-matching",
        },
        { label: "Payment approval", note: "Routed by value, cost centre and policy." },
        { label: "Payment disbursement", note: "Scheduled against vendor terms." },
      ],
    },
    {
      id: "automation",
      layer: "AP automation",
      blurb: "The layer that removes the handling between those steps.",
      slug: "ap-automation",
      steps: [
        { label: "Capture / OCR", note: "Read the invoice instead of keying it." },
        { label: "Auto-match", note: "Match without a human where tolerances allow." },
        { label: "Rules-based routing", note: "Straight-through unless a rule trips." },
        { label: "Exception handling", note: "Only the failures reach a person." },
        { label: "Digital audit trail", note: "Every approval retained and retrievable." },
      ],
    },
    {
      id: "beyond",
      layer: "And beyond",
      blurb: "What the payable turns into once it leaves AP.",
      steps: [
        { label: "Payments", note: "The disbursement channel.", slug: "payments" },
        { label: "EFT files", note: "The bank file format.", slug: "eft-files" },
        { label: "ABA", note: "The Australian bank file.", slug: "aba" },
        {
          label: "Bank reconciliation",
          note: "Payments matched back to statements.",
          slug: "bank-reconciliation",
        },
        {
          label: "Business intelligence",
          note: "Cost per invoice, cycle time, exception rate.",
          slug: "business-intelligence",
        },
      ],
    },
  ],
};

export const flows: Flow[] = [apAutomationFlow];

export const flowBySlug = new Map(flows.map((f) => [f.slug, f]));
