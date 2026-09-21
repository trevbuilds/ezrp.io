/**
 * Lead-to-Cash stage articles.
 *
 * Authored for EZRP, not copied from the DX Guides wiki. The process model
 * follows the published five-stage Lead-to-Cash definition and its Order to
 * Cash decomposition (Order to Fulfil, Fulfil to Invoice, Invoice to Cash).
 *
 * Deliberately vendor-neutral: capabilities are named generically — configure,
 * price and quote; order management; subscription billing — rather than by any
 * one vendor's product names, so the guidance holds whichever ERP is in play.
 *
 * Structure follows the house article template: why it matters, the workflow,
 * what you need in place, questions to ask, and the metrics that tell you
 * whether the stage is healthy.
 */

import type { Article } from "./articles";

const contactToLead: Article = {
  slug: "contact-to-lead",
  intro:
    "The first stage of Lead-to-Cash turns scattered interest into something sales can act on. It ends the moment a contact has enough signal behind it to be called a qualified lead — not before.",
  blocks: [
    { kind: "h", text: "Why it matters" },
    {
      kind: "p",
      text: "Everything downstream inherits the quality of this stage. A pipeline full of unqualified leads does not just waste sales time, it corrupts the forecast that operations and finance are planning against.",
    },
    {
      kind: "bullets",
      items: [
        {
          term: "Channel coverage",
          text: "Interest arrives by web, event, referral, campaign and inbound call. If one channel bypasses the system, its leads are invisible.",
        },
        {
          term: "Consent",
          text: "Capturing consent at the point of contact is what makes later marketing lawful, and in Australia that obligation sits with the sender.",
        },
        {
          term: "Scoring discipline",
          text: "A scoring model agreed with sales is the difference between qualification and guesswork.",
        },
      ],
    },

    { kind: "h", text: "The workflow" },
    {
      kind: "steps",
      items: [
        {
          title: "Channel capture",
          text: "Interest is collected from every channel into one place, with its source recorded.",
        },
        {
          title: "Consent and contact creation",
          text: "A contact record is created, carrying what the person agreed to be sent.",
        },
        {
          title: "Interaction tracking",
          text: "Subsequent behaviour is logged against that contact rather than against a campaign in isolation.",
        },
        {
          title: "Lead scoring",
          text: "The contact is scored on engagement and fit using criteria sales has signed off.",
        },
        {
          title: "Lead qualification",
          text: "Above the agreed threshold, the contact becomes a lead and moves on.",
        },
      ],
    },
    {
      kind: "callout",
      text: "Decide what a qualified lead means before you configure scoring. Teams that configure first end up tuning a number nobody agrees on, and sales quietly reverts to its own list.",
    },

    { kind: "h", text: "What you need in place" },
    {
      kind: "bullets",
      items: [
        {
          term: "One contact record",
          text: "Deduplicated, so the same person arriving twice does not become two leads.",
        },
        {
          term: "Source attribution",
          text: "Every lead carries where it came from, or you cannot judge a channel later.",
        },
        {
          term: "Consent management",
          text: "Recorded, timestamped, and honoured on unsubscribe.",
        },
        {
          term: "An agreed scoring model",
          text: "Owned jointly by marketing and sales, and revisited against real conversion data.",
        },
      ],
    },

    { kind: "h", text: "Metrics and KPIs to track" },
    {
      kind: "metrics",
      items: [
        { name: "Lead volume by channel", text: "New leads captured, split by source." },
        {
          name: "Qualification rate",
          text: "Share of captured contacts that reach qualified status.",
        },
        {
          name: "Cost per qualified lead",
          text: "Channel spend divided by qualified leads it produced.",
        },
        {
          name: "Duplicate rate",
          text: "Share of new contacts that were already known.",
        },
      ],
    },
  ],
};

const leadToOpportunity: Article = {
  slug: "lead-to-opportunity",
  intro:
    "The second stage is a handover. The lead moves from marketing to sales, is assessed on whether it is genuinely worth pursuing, and becomes a tracked opportunity with a value and a date against it.",
  blocks: [
    { kind: "h", text: "Why it matters" },
    {
      kind: "p",
      text: "This is where most organisations lose leads without noticing. Nothing breaks and no error is logged — the lead simply sits unactioned until it goes cold, because the handover was a notification rather than an accepted obligation.",
    },

    { kind: "h", text: "The workflow" },
    {
      kind: "steps",
      items: [
        {
          title: "Lead review",
          text: "A named person reviews the lead within an agreed time, not when they get to it.",
        },
        {
          title: "Qualification assessment",
          text: "Budget, authority, need and timing are tested against what is known.",
        },
        {
          title: "Sales handover",
          text: "The lead is accepted or returned with a reason — both outcomes are recorded.",
        },
        {
          title: "Opportunity creation",
          text: "An accepted lead becomes an opportunity with an estimated value, stage and close date.",
        },
        {
          title: "Pipeline entry",
          text: "The opportunity enters the pipeline and starts being forecast.",
        },
      ],
    },
    {
      kind: "callout",
      text: "Make rejection a first-class outcome. A lead returned to marketing with a reason improves the scoring model; a lead silently ignored teaches the business nothing and damages trust between the two teams.",
    },

    { kind: "h", text: "What you need in place" },
    {
      kind: "bullets",
      items: [
        {
          term: "A service level on review",
          text: "An agreed window for first contact, measured and visible.",
        },
        {
          term: "Assignment rules",
          text: "Territory, segment or round-robin — anything but a shared inbox.",
        },
        {
          term: "Rejection reasons",
          text: "A short, fixed list, so the feedback is analysable rather than free text.",
        },
        {
          term: "Stage definitions",
          text: "What each pipeline stage means, written down, so forecasts are comparable between reps.",
        },
      ],
    },

    { kind: "h", text: "Metrics and KPIs to track" },
    {
      kind: "metrics",
      items: [
        {
          name: "Lead acceptance rate",
          text: "Share of handed-over leads that sales accepts.",
        },
        {
          name: "Time to first contact",
          text: "Elapsed time from qualification to a sales approach.",
        },
        {
          name: "Lead-to-opportunity conversion",
          text: "Share of qualified leads that become opportunities.",
        },
        {
          name: "Ageing unactioned leads",
          text: "Leads past the review window, by owner.",
        },
      ],
    },
  ],
};

const opportunityToQuote: Article = {
  slug: "opportunity-to-quote",
  intro:
    "The third stage decides whether an opportunity is ready to be priced, then prices it. It is where the commercial rules of the business — configuration, pricing, discounting, approval — stop being policy and start being system behaviour.",
  blocks: [
    { kind: "h", text: "Why it matters" },
    {
      kind: "p",
      text: "Quoting is the stage most ERP sales configuration actually turns on. Pricing rules, discount authority and approval thresholds all land here, and a quote that the business cannot honour is worse than a slow one.",
    },

    { kind: "h", text: "The workflow" },
    {
      kind: "steps",
      items: [
        {
          title: "Opportunity assessment",
          text: "Sales judge whether the opportunity is ready to be quoted, or needs more work first.",
        },
        {
          title: "Needs confirmation",
          text: "What the customer actually requires is confirmed, not assumed from the original enquiry.",
        },
        {
          title: "Solution configuration",
          text: "Products, services and options are configured into a valid combination.",
        },
        {
          title: "Pricing",
          text: "Price is derived from the configuration, with discount applied inside approval limits.",
        },
        {
          title: "Quote issue",
          text: "The quote is issued — raised by the rep, or self-served by the customer.",
        },
      ],
    },
    {
      kind: "callout",
      text: "Configure, price and quote capability earns its cost when the product set is genuinely configurable. For a simple catalogue it is overhead. Judge it on how many invalid combinations a rep could otherwise sell.",
    },

    { kind: "h", text: "What you need in place" },
    {
      kind: "bullets",
      items: [
        {
          term: "A validated product model",
          text: "Rules about what can be sold with what, so invalid configurations cannot be quoted.",
        },
        {
          term: "Pricing rules",
          text: "Price lists, customer-specific pricing and volume breaks held as data, not in a spreadsheet.",
        },
        {
          term: "Delegation of authority",
          text: "Discount limits configured to mirror the signed authority, with escalation above them.",
        },
        {
          term: "Quote versioning",
          text: "Revisions tracked, so what the customer agreed to is unambiguous later.",
        },
        {
          term: "Margin visibility",
          text: "The rep can see the margin effect of a discount at the point of offering it.",
        },
      ],
    },

    { kind: "h", text: "Questions to ask" },
    {
      kind: "qa",
      items: [
        {
          title: "Configuration",
          question: "Can the system stop a rep quoting a combination we cannot deliver?",
          plan: "Test with a deliberately invalid configuration rather than a clean one.",
        },
        {
          title: "Approvals",
          question: "How are discount approvals enforced and escalated?",
          plan: "Confirm the limits are configuration, not training, and that they match the signed authority.",
        },
        {
          title: "Quote to order fidelity",
          question: "Does the order carry exactly what the quote agreed?",
          plan: "Follow one quote through to a booked order and compare line by line.",
        },
      ],
    },

    { kind: "h", text: "Metrics and KPIs to track" },
    {
      kind: "metrics",
      items: [
        {
          name: "Quote turnaround time",
          text: "Elapsed time from opportunity to issued quote.",
        },
        {
          name: "Quote-to-order conversion",
          text: "Share of quotes that become orders.",
        },
        {
          name: "Average discount",
          text: "Discount given against list, by segment and by rep.",
        },
        {
          name: "Approval cycle time",
          text: "Time quotes spend waiting on an approver.",
        },
        {
          name: "Quote revision count",
          text: "Revisions per won deal — a proxy for how well needs were confirmed.",
        },
      ],
    },
  ],
};

const quoteToOrder: Article = {
  slug: "quote-to-order",
  intro:
    "The fourth stage closes the commercial agreement and turns it into an order the rest of the business can execute. It is the handover point from CRM into supply chain and finance.",
  blocks: [
    { kind: "h", text: "Why it matters" },
    {
      kind: "p",
      text: "This is the single most leak-prone join in Lead-to-Cash. If the order that lands in the ERP does not match the quote the customer signed, the damage surfaces later as a delivery dispute, a credit note, or an argument about revenue.",
    },

    { kind: "h", text: "The workflow" },
    {
      kind: "steps",
      items: [
        {
          title: "Quote presentation",
          text: "The quote is put to the customer through whichever channel they buy in.",
        },
        {
          title: "Negotiation",
          text: "Terms, price and scope are worked until agreed, with each revision tracked.",
        },
        {
          title: "Approval",
          text: "Internal approval is obtained where the final position sits outside standard terms.",
        },
        {
          title: "Acceptance",
          text: "The customer accepts, by signature, portal confirmation or purchase order.",
        },
        {
          title: "Order creation",
          text: "The accepted quote is converted into an order — converted, not rekeyed.",
        },
      ],
    },
    {
      kind: "callout",
      text: "If anyone retypes the quote to create the order, the process has a defect regardless of how careful they are. Conversion should carry the agreed lines, prices and terms across untouched.",
    },

    { kind: "h", text: "What you need in place" },
    {
      kind: "bullets",
      items: [
        {
          term: "Quote-to-order conversion",
          text: "A system path from accepted quote to order with no manual re-entry.",
        },
        {
          term: "Terms and conditions control",
          text: "Which terms applied to this deal, recorded against it.",
        },
        {
          term: "Credit check",
          text: "Customer credit assessed before the order is accepted, not after delivery.",
        },
        {
          term: "Acceptance evidence",
          text: "The signed document or purchase order stored against the order.",
        },
      ],
    },

    { kind: "h", text: "Metrics and KPIs to track" },
    {
      kind: "metrics",
      items: [
        { name: "Win rate", text: "Share of presented quotes accepted." },
        {
          name: "Negotiation cycle time",
          text: "Time from quote issued to customer acceptance.",
        },
        {
          name: "Order accuracy",
          text: "Orders matching their accepted quote without amendment.",
        },
        {
          name: "Credit hold rate",
          text: "Orders stopped at credit check, and why.",
        },
      ],
    },
  ],
};

const orderToCash: Article = {
  slug: "order-to-cash",
  intro:
    "The final stage of Lead-to-Cash executes the order, bills it, and collects the money. It is large enough to be a value stream in its own right, and decomposes into three: Order to Fulfil, Fulfil to Invoice, and Invoice to Cash.",
  blocks: [
    { kind: "h", text: "Why it matters" },
    {
      kind: "p",
      text: "Order to Cash is where a sale becomes revenue. It runs mostly outside CRM — in supply chain, billing and receivables — which is precisely why it gets neglected by projects scoped as CRM implementations.",
    },

    { kind: "h", text: "The three sub-stages" },
    {
      kind: "steps",
      items: [
        {
          title: "Order to Fulfil",
          text: "Order entry, availability, allocation, picking and packing, shipping and delivery.",
        },
        {
          title: "Fulfil to Invoice",
          text: "Delivery confirmation, billing document creation, invoice generation and revenue recording.",
        },
        {
          title: "Invoice to Cash",
          text: "Invoice transmission, payment tracking, receipt application, collections and clearing.",
        },
      ],
    },
    {
      kind: "callout",
      text: "Each boundary between these three is a place where a document can exist in one system and not the other. Delivered but not invoiced, and invoiced but not collected, are the two balances worth watching weekly.",
    },

    { kind: "h", text: "What you need in place" },
    {
      kind: "bullets",
      items: [
        {
          term: "One order record",
          text: "The order the customer placed, visible to sales, warehouse and finance alike.",
        },
        {
          term: "Clean handovers",
          text: "Defined triggers between sub-stages, so nothing waits on someone noticing.",
        },
        {
          term: "Revenue recognition policy",
          text: "When revenue is recognised, agreed with finance and configured accordingly.",
        },
        {
          term: "Exception handling",
          text: "Short shipments, returns and disputes have a defined path rather than an email chain.",
        },
      ],
    },

    { kind: "h", text: "Metrics and KPIs to track" },
    {
      kind: "metrics",
      items: [
        {
          name: "Order-to-cash cycle time",
          text: "Elapsed time from order to cash received.",
        },
        {
          name: "Perfect order rate",
          text: "Orders delivered complete, on time, undamaged and correctly invoiced.",
        },
        {
          name: "Delivered not invoiced",
          text: "Value delivered but not yet billed.",
        },
        {
          name: "Days sales outstanding",
          text: "Average days to collect after invoicing.",
        },
      ],
    },
  ],
};

const orderToFulfil: Article = {
  slug: "order-to-fulfil",
  intro:
    "Order to Fulfil takes an accepted order and makes it real: checking it can be met, reserving the stock, and getting the goods or service to the customer.",
  blocks: [
    { kind: "h", text: "The workflow" },
    {
      kind: "steps",
      items: [
        {
          title: "Order entry",
          text: "The order enters the system, converted from the accepted quote.",
        },
        {
          title: "Availability check",
          text: "Stock or capacity is checked and a promise date established.",
        },
        {
          title: "Inventory allocation",
          text: "Stock is reserved against this order so it cannot be sold twice.",
        },
        {
          title: "Picking and packing",
          text: "The order is assembled and readied for despatch.",
        },
        {
          title: "Shipping and delivery",
          text: "Goods move, tracked, until receipt is confirmed.",
        },
      ],
    },
    {
      kind: "callout",
      text: "The available-to-promise check is the honesty of the whole stream. A confident date the warehouse cannot meet converts a won deal into a service failure.",
    },

    { kind: "h", text: "What you need in place" },
    {
      kind: "bullets",
      items: [
        {
          term: "Accurate inventory",
          text: "System stock that matches physical stock, or every promise is a guess.",
        },
        {
          term: "Allocation rules",
          text: "Who gets the stock when there is not enough — decided by policy, not by whoever calls.",
        },
        {
          term: "Backorder handling",
          text: "A defined path for what happens when the order cannot be met in full.",
        },
        {
          term: "Delivery confirmation",
          text: "Proof of delivery captured, because it triggers billing.",
        },
      ],
    },

    { kind: "h", text: "Metrics and KPIs to track" },
    {
      kind: "metrics",
      items: [
        {
          name: "On-time in-full (OTIF)",
          text: "Orders delivered complete by the promised date.",
        },
        {
          name: "Order cycle time",
          text: "Elapsed time from order entry to delivery.",
        },
        {
          name: "Fill rate",
          text: "Share of demand met from available stock.",
        },
        {
          name: "Backorder value",
          text: "Value of orders waiting on stock.",
        },
      ],
    },
  ],
};

const fulfilToInvoice: Article = {
  slug: "fulfil-to-invoice",
  intro:
    "Fulfil to Invoice converts completed delivery into a billing document and recorded revenue. It is short, largely automatic when configured well, and the source of a surprising amount of leakage when it is not.",
  blocks: [
    { kind: "h", text: "The workflow" },
    {
      kind: "steps",
      items: [
        {
          title: "Delivery confirmation",
          text: "Delivery is confirmed, which is the event that makes the order billable.",
        },
        {
          title: "Billing document creation",
          text: "A billing document is raised from what was actually delivered, not what was ordered.",
        },
        {
          title: "Invoice generation",
          text: "The invoice is produced against agreed terms and tax treatment.",
        },
        {
          title: "Revenue recording",
          text: "Revenue is posted to the ledger under the agreed recognition policy.",
        },
      ],
    },
    {
      kind: "callout",
      text: "Bill from the delivery, not the order. Billing the order is how businesses invoice for goods that were short-shipped, and the credit note costs more to process than the original invoice.",
    },

    { kind: "h", text: "What you need in place" },
    {
      kind: "bullets",
      items: [
        {
          term: "Delivery-based billing",
          text: "The billing trigger is confirmed delivery, with partial deliveries handled.",
        },
        {
          term: "Tax determination",
          text: "GST treatment derived by rule, including exports and exempt supplies.",
        },
        {
          term: "Revenue recognition rules",
          text: "Configured to the accounting policy, especially where delivery and performance differ.",
        },
        {
          term: "Billing exception queue",
          text: "Somewhere blocked billing goes to be worked, visible to a named owner.",
        },
      ],
    },

    { kind: "h", text: "Metrics and KPIs to track" },
    {
      kind: "metrics",
      items: [
        {
          name: "Delivered not invoiced",
          text: "Value delivered but not yet billed, and its age.",
        },
        {
          name: "Billing cycle time",
          text: "Time from delivery confirmation to invoice issued.",
        },
        {
          name: "Credit note rate",
          text: "Credit notes as a share of invoices, split by cause.",
        },
        {
          name: "Touchless billing rate",
          text: "Invoices produced with no manual intervention.",
        },
      ],
    },
  ],
};

const invoiceToCash: Article = {
  slug: "invoice-to-cash",
  intro:
    "Invoice to Cash gets the invoice to the customer and the money into the bank. It is the last stage of Lead-to-Cash, and the one that determines whether all the preceding work converts into working capital.",
  blocks: [
    { kind: "h", text: "The workflow" },
    {
      kind: "steps",
      items: [
        {
          title: "Invoice transmission",
          text: "The invoice reaches the customer in the format and channel they can actually process.",
        },
        {
          title: "Payment tracking",
          text: "Expected receipts are monitored against terms.",
        },
        {
          title: "Receipt application",
          text: "Incoming payments are matched to invoices and applied.",
        },
        {
          title: "Collections",
          text: "Overdue accounts are worked to an agreed escalation path.",
        },
        {
          title: "Receivables clearing",
          text: "The receivable is cleared and the ledger agrees to the bank.",
        },
      ],
    },
    {
      kind: "callout",
      text: "Most late payment is not a collections problem. It is an invoice the customer could not process — wrong purchase order reference, wrong format, wrong recipient — and it is cheaper to fix at transmission than to chase at day sixty.",
    },

    { kind: "h", text: "What you need in place" },
    {
      kind: "bullets",
      items: [
        {
          term: "Customer-ready invoicing",
          text: "Purchase order references and formats that match how the customer's payables team works, including e-invoicing where they use it.",
        },
        {
          term: "Automated matching",
          text: "Receipts matched to invoices by rule, with a clean exception queue for the rest.",
        },
        {
          term: "Dunning and escalation",
          text: "A defined collections path with owners, not ad-hoc chasing.",
        },
        {
          term: "Dispute management",
          text: "Disputed invoices flagged and worked separately, so they do not distort ageing.",
        },
      ],
    },

    { kind: "h", text: "Metrics and KPIs to track" },
    {
      kind: "metrics",
      items: [
        {
          name: "Days sales outstanding",
          text: "Average days to collect after invoicing.",
        },
        {
          name: "Aged receivables over terms",
          text: "Value past due, split by reason.",
        },
        {
          name: "Auto-match rate",
          text: "Receipts applied without manual intervention.",
        },
        {
          name: "Dispute value and age",
          text: "Value under dispute and how long it has been there.",
        },
        {
          name: "Bad debt write-off",
          text: "Value written off as uncollectable.",
        },
      ],
    },
  ],
};

export const crmL2cArticles: Article[] = [
  contactToLead,
  leadToOpportunity,
  opportunityToQuote,
  quoteToOrder,
  orderToCash,
  orderToFulfil,
  fulfilToInvoice,
  invoiceToCash,
];
