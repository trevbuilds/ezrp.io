/**
 * Financial Accounting branch articles.
 *
 * Unlike articles.ts, these are authored for EZRP rather than copied from the
 * DX Guides wiki. Structure and voice follow the AP Automation article.
 *
 * Covers: financial-accounting, general-ledger, accounts-payable,
 * 3-way-matching, accounts-receivable, cash-management, bank-reconciliation,
 * asset-management. (ap-automation lives in articles.ts.)
 */

import type { Article } from "./articles";

const financialAccounting: Article = {
  slug: "financial-accounting",
  intro:
    "Financial accounting is the part of the ERP that produces the numbers the business is legally accountable for. Everything else in the system eventually posts here.",
  blocks: [
    { kind: "h", text: "How the pieces fit" },
    {
      kind: "p",
      text: "The general ledger is the destination. The subledgers — payables, receivables, cash, assets — are where transactions originate, carry their own detail, and then summarise into the ledger. Getting this relationship right is most of what financial accounting design actually is.",
    },
    {
      kind: "bullets",
      items: [
        {
          term: "General ledger",
          text: "The single chart of accounts, the periods, and the balances that feed statutory reporting.",
        },
        {
          term: "Accounts payable",
          text: "What the business owes suppliers, and the controls around approving and paying it.",
        },
        {
          term: "Accounts receivable",
          text: "What customers owe, and the discipline of collecting it.",
        },
        {
          term: "Cash management",
          text: "Where the money actually is, and what it will be tomorrow.",
        },
        {
          term: "Asset management",
          text: "Capitalised items, their depreciation, and their eventual disposal.",
        },
      ],
    },
    {
      kind: "callout",
      text: "A useful test during design: for any number on the face of the financial statements, can someone trace it back to the source transaction without leaving the system? If not, the subledger-to-ledger design has a gap in it.",
    },

    { kind: "h", text: "The month-end close" },
    {
      kind: "p",
      text: "Close is where financial accounting design is judged. A well-designed system closes because the controls ran during the month; a poorly designed one closes because people worked a weekend.",
    },
    {
      kind: "steps",
      items: [
        {
          title: "Cut off the subledgers",
          text: "Stop new transactions posting into the period being closed, in a defined order.",
        },
        {
          title: "Complete subledger processing",
          text: "Finish invoice entry, receipting, depreciation runs and bank reconciliation.",
        },
        {
          title: "Post subledgers to the ledger",
          text: "Transfer and confirm that subledger control accounts agree to the ledger balances.",
        },
        {
          title: "Process adjusting journals",
          text: "Accruals, prepayments, provisions, reclassifications and intercompany entries.",
        },
        {
          title: "Reconcile balance sheet accounts",
          text: "Evidence each balance against a supporting schedule, not just against last month.",
          sub: [
            "Reconciliations should be prepared and reviewed by different people.",
            "Unexplained differences get aged, not written off quietly.",
          ],
        },
        {
          title: "Review and close the period",
          text: "Management review of the result, then hard-close so the period cannot be reopened casually.",
        },
        {
          title: "Report",
          text: "Statutory, management and regulatory reporting from the closed position.",
        },
      ],
    },

    { kind: "h", text: "Where implementations go wrong" },
    {
      kind: "bullets",
      items: [
        {
          term: "The chart of accounts carries too much",
          text: "Dimensions that belong in cost centres, projects or analysis codes get built as accounts, and the chart becomes unmaintainable.",
        },
        {
          term: "Subledger detail is duplicated in the ledger",
          text: "Posting at invoice-line granularity bloats the ledger and slows every report that touches it.",
        },
        {
          term: "Periods are left open",
          text: "Soft-closing forever means the prior month's numbers keep moving after they have been reported.",
        },
        {
          term: "Reconciliations are manual by design",
          text: "If nobody configured automated matching, the close will always be a headcount problem.",
        },
        {
          term: "Segregation of duties is retrofitted",
          text: "Roles designed for convenience during UAT become the production security model.",
        },
      ],
    },

    { kind: "h", text: "Metrics and KPIs to track" },
    {
      kind: "metrics",
      items: [
        {
          name: "Days to close",
          text: "Working days from period end to reported result.",
        },
        {
          name: "Manual journal volume",
          text: "Journals entered by hand as a share of all postings — a proxy for process gaps.",
        },
        {
          name: "Reconciling items aged over 90 days",
          text: "Unresolved differences sitting in balance sheet reconciliations.",
        },
        {
          name: "Post-close adjustments",
          text: "Entries made after the period was reported.",
        },
        {
          name: "Audit findings",
          text: "Control deficiencies raised by internal or external audit.",
        },
      ],
    },
  ],
};

const generalLedger: Article = {
  slug: "general-ledger",
  intro:
    "The general ledger is the central record of every financial transaction, organised by a chart of accounts and bounded by accounting periods. Its design constrains every report the business will ever run.",
  blocks: [
    { kind: "h", text: "Designing the chart of accounts" },
    {
      kind: "p",
      text: "The chart is the hardest thing to change after go-live, and the thing most often designed in a hurry. The question to keep asking is what belongs in the account code and what belongs in a separate dimension.",
    },
    {
      kind: "bullets",
      items: [
        {
          term: "Natural account",
          text: "What the transaction is — revenue, salaries, depreciation. This is the only thing the account code should carry.",
        },
        {
          term: "Cost centre or department",
          text: "Who is accountable for it. A dimension, not an account.",
        },
        {
          term: "Legal entity",
          text: "Which balance sheet it belongs to, driving statutory reporting and intercompany.",
        },
        {
          term: "Project or activity",
          text: "What initiative consumed it, where project accounting is in scope.",
        },
        {
          term: "Future-use segments",
          text: "Leave room, but do not build segments nobody has a reporting requirement for.",
        },
      ],
    },
    {
      kind: "callout",
      text: "A chart that needs a new account every time the business reorganises is a chart with organisational structure baked into the account code. Move it to a dimension before go-live, not after.",
    },

    { kind: "h", text: "Journals and posting" },
    {
      kind: "steps",
      items: [
        {
          title: "Entry",
          text: "Journals arrive from subledgers, integrations, spreadsheets or manual entry.",
        },
        {
          title: "Validation",
          text: "Balanced debits and credits, valid account and dimension combinations, open period.",
        },
        {
          title: "Approval",
          text: "Manual journals route for review against thresholds, with the preparer unable to approve their own.",
        },
        {
          title: "Posting",
          text: "Balances update and the entry becomes part of the permanent record.",
        },
        {
          title: "Reversal or correction",
          text: "Posted entries are corrected by reversal, never by editing history.",
        },
      ],
    },

    { kind: "h", text: "Period control" },
    {
      kind: "bullets",
      items: [
        {
          term: "Open",
          text: "Normal transaction processing for the current period.",
        },
        {
          term: "Soft close",
          text: "Restricted to finance for adjusting entries while subledgers are shut.",
        },
        {
          term: "Hard close",
          text: "No further postings. Reopening requires explicit approval and leaves a trail.",
        },
        {
          term: "Year end",
          text: "Balances roll forward, income statement accounts clear to retained earnings.",
        },
      ],
    },

    { kind: "h", text: "Metrics and KPIs to track" },
    {
      kind: "metrics",
      items: [
        {
          name: "Manual journal ratio",
          text: "Manual entries as a share of total journal lines.",
        },
        {
          name: "Journal rejection rate",
          text: "Entries failing validation or approval on first submission.",
        },
        {
          name: "Suspense account balance",
          text: "Value sitting in clearing and suspense accounts at period end.",
        },
        {
          name: "Period reopen count",
          text: "How often a closed period was reopened.",
        },
        {
          name: "Chart of accounts growth",
          text: "New accounts created per quarter, as a signal of design drift.",
        },
      ],
    },
  ],
};

const accountsPayable: Article = {
  slug: "accounts-payable",
  intro:
    "Accounts payable is the back half of procure-to-pay: turning a supplier's invoice into an approved, matched, paid and recorded liability without paying twice, paying early, or paying someone who is not the supplier.",
  blocks: [
    { kind: "h", text: "Where AP sits in procure-to-pay" },
    {
      kind: "p",
      text: "AP inherits whatever procurement hands it. Most AP pain is actually upstream: no purchase order, a receipt nobody entered, or a supplier master record with the wrong bank details.",
    },
    {
      kind: "steps",
      items: [
        {
          title: "Supplier onboarding",
          text: "The vendor master is created and verified, including bank details and tax registration.",
        },
        {
          title: "Purchase order raised",
          text: "Commitment is recorded against budget before the spend happens.",
        },
        {
          title: "Goods or services received",
          text: "Receipting confirms what actually arrived, and when.",
        },
        {
          title: "Invoice received",
          text: "Supplier invoice arrives by email, portal, EDI or e-invoicing network.",
        },
        {
          title: "Matching",
          text: "Invoice is matched against the PO and the receipt within tolerance.",
        },
        {
          title: "Approval",
          text: "Exceptions and non-PO invoices route to the delegated approver.",
        },
        {
          title: "Payment",
          text: "Approved invoices are selected into a payment run and disbursed.",
        },
        {
          title: "Reconciliation and reporting",
          text: "Payments clear the bank, the subledger agrees to the ledger, and the aged payables report is credible.",
        },
      ],
    },

    { kind: "h", text: "Controls that matter" },
    {
      kind: "bullets",
      items: [
        {
          term: "Vendor master control",
          text: "Creating and amending supplier bank details is the highest-risk transaction in AP. It needs dual authorisation and callback verification.",
        },
        {
          term: "Segregation of duties",
          text: "The person who can create a supplier must not be able to approve an invoice or release a payment.",
        },
        {
          term: "Duplicate detection",
          text: "Matching on supplier, invoice number, amount and date before posting, not after paying.",
        },
        {
          term: "Delegation of authority",
          text: "Approval limits configured in the system, mirroring the signed DoA rather than an informal understanding.",
        },
        {
          term: "Payment run review",
          text: "Someone independent reviews the proposed payment file before release.",
        },
      ],
    },
    {
      kind: "callout",
      text: "Invoice fraud almost never defeats the matching engine. It changes the bank account on a legitimate supplier and lets the matching engine pay it correctly. Design the vendor master controls accordingly.",
    },

    { kind: "h", text: "Non-PO invoices" },
    {
      kind: "p",
      text: "Every AP implementation discovers a long tail of spend with no purchase order — utilities, rates, legal fees, subscriptions. Pretending it away is why go-live hurts.",
    },
    {
      kind: "bullets",
      items: [
        {
          term: "Categorise it",
          text: "Identify which spend types are legitimately non-PO rather than treating each one as an exception.",
        },
        {
          term: "Route on coding",
          text: "Without a PO there is no commitment, so approval must happen on the account and cost centre coding.",
        },
        {
          term: "Use recurring templates",
          text: "Predictable charges like rent and utilities should post from templates, not be keyed monthly.",
        },
        {
          term: "Measure it",
          text: "Non-PO share is a procurement compliance metric, and it belongs on a report someone reads.",
        },
      ],
    },

    { kind: "h", text: "Metrics and KPIs to track" },
    {
      kind: "metrics",
      items: [
        {
          name: "Days payable outstanding",
          text: "Average days taken to pay suppliers.",
        },
        {
          name: "On-time payment rate",
          text: "Invoices paid on or before due date.",
        },
        {
          name: "Touchless processing rate",
          text: "Invoices from receipt to payment with no human intervention.",
        },
        {
          name: "PO compliance rate",
          text: "Invoices backed by a valid purchase order.",
        },
        {
          name: "Duplicate payment value",
          text: "Value of duplicates detected, and of those recovered after payment.",
        },
        {
          name: "Cost per invoice",
          text: "Total AP operating cost divided by invoices processed.",
        },
        {
          name: "Aged payables over terms",
          text: "Value sitting past due, split by reason.",
        },
      ],
    },
  ],
};

const threeWayMatching: Article = {
  slug: "3-way-matching",
  intro:
    "Three-way matching compares the purchase order, the goods receipt and the supplier invoice before an invoice is approved for payment. It is the single most effective control in accounts payable, and the one most often configured badly.",
  blocks: [
    { kind: "h", text: "The three documents" },
    {
      kind: "bullets",
      items: [
        {
          term: "Purchase order",
          text: "What was ordered, at what price, on what terms. Evidence the spend was authorised.",
        },
        {
          term: "Goods receipt",
          text: "What actually arrived, in what quantity, on what date. Evidence the business received value.",
        },
        {
          term: "Supplier invoice",
          text: "What is being claimed. Evidence of the liability.",
        },
      ],
    },
    {
      kind: "p",
      text: "Where all three agree within tolerance, the invoice can pay without a human looking at it. Where they disagree, the mismatch is the useful information — it tells you whether the problem is price, quantity, or timing.",
    },

    { kind: "h", text: "Two-way and four-way variants" },
    {
      kind: "bullets",
      items: [
        {
          term: "Two-way match",
          text: "PO to invoice only. Appropriate for services and subscriptions where there is nothing to receipt.",
        },
        {
          term: "Three-way match",
          text: "PO, receipt and invoice. The default for goods.",
        },
        {
          term: "Four-way match",
          text: "Adds an inspection or quality certificate. Used where acceptance is conditional, common in construction and regulated manufacturing.",
        },
      ],
    },

    { kind: "h", text: "Setting tolerances" },
    {
      kind: "p",
      text: "Tolerances decide how much variance passes silently. Set them too tight and AP drowns in exceptions; too loose and the control stops controlling anything.",
    },
    {
      kind: "qa",
      items: [
        {
          title: "Price tolerance",
          question:
            "How much can unit price vary from the PO before someone must look at it?",
          plan: "Set a percentage and an absolute cap, so a small percentage on a very large line still triggers review.",
        },
        {
          title: "Quantity tolerance",
          question:
            "Will you accept over-delivery, and by how much? Does it differ by category?",
          plan: "Allow over-receipt only where the commercial terms permit it, and differentiate bulk commodities from discrete items.",
        },
        {
          title: "Timing and accruals",
          question:
            "What happens when the invoice arrives before the receipt is entered?",
          plan: "Hold on receipt rather than reject, and report the held population daily so it does not silently age.",
        },
        {
          title: "Freight, tax and charges",
          question: "Are ancillary charges on the PO, or added at invoice?",
          plan: "Decide whether these match, are separately tolerated, or route for coded approval. Ambiguity here creates most exceptions.",
        },
        {
          title: "Exception routing",
          question: "Who resolves a mismatch — AP, procurement, or the requisitioner?",
          plan: "Route by mismatch type. Price goes to procurement, quantity to the receiver, coding to the budget holder.",
        },
      ],
    },
    {
      kind: "callout",
      text: "A high exception rate is rarely a matching problem. It is usually late receipting, stale PO prices, or ancillary charges that were never on the order. Fix the cause before loosening the tolerance.",
    },

    { kind: "h", text: "Metrics and KPIs to track" },
    {
      kind: "metrics",
      items: [
        {
          name: "First-time match rate",
          text: "Invoices matching on first attempt with no intervention.",
        },
        {
          name: "Exception rate by type",
          text: "Mismatches split into price, quantity, timing and coding.",
        },
        {
          name: "Exception resolution time",
          text: "Average days from mismatch raised to cleared.",
        },
        {
          name: "Invoices on receipt hold",
          text: "Value awaiting a goods receipt that has not been entered.",
        },
        {
          name: "Tolerance override frequency",
          text: "How often a human waves a mismatch through, and by whom.",
        },
      ],
    },
  ],
};

const accountsReceivable: Article = {
  slug: "accounts-receivable",
  intro:
    "Accounts receivable is the back half of order-to-cash: turning a delivered order into an accurate invoice, then into cash in the bank, without losing the customer relationship on the way.",
  blocks: [
    { kind: "h", text: "The receivables cycle" },
    {
      kind: "steps",
      items: [
        {
          title: "Customer setup and credit assessment",
          text: "Credit limit and payment terms established before trading, not after the first default.",
        },
        {
          title: "Billing",
          text: "Invoice raised from the order, contract, meter reading or milestone.",
        },
        {
          title: "Delivery of the invoice",
          text: "Email, portal, e-invoicing network or post — whichever the customer will actually action.",
        },
        {
          title: "Payment receipt",
          text: "Funds arrive by direct debit, card, EFT or BPAY.",
        },
        {
          title: "Cash application",
          text: "Receipts matched to open invoices, ideally automatically by remittance data.",
        },
        {
          title: "Collections",
          text: "Overdue accounts worked through a defined escalation path.",
        },
        {
          title: "Dispute resolution",
          text: "Queried invoices investigated, then credited or upheld with a reason recorded.",
        },
        {
          title: "Revenue recognition and reporting",
          text: "Revenue recognised on the correct basis, and the aged debtors report reconciled to the ledger.",
        },
      ],
    },

    { kind: "h", text: "Invoice accuracy is a collections strategy" },
    {
      kind: "p",
      text: "Most late payment is not refusal to pay. It is a customer waiting on a corrected invoice, a missing purchase order reference, or an invoice sent to the wrong person. These are billing defects wearing a collections costume.",
    },
    {
      kind: "bullets",
      items: [
        {
          term: "Capture their PO reference",
          text: "Many corporate customers cannot pay an invoice that lacks one. Make it a mandatory field at order entry.",
        },
        {
          term: "Bill to the right contact",
          text: "The person who signed the contract is rarely the person who processes invoices.",
        },
        {
          term: "Match their format",
          text: "Large customers often mandate a portal or e-invoicing network. Fighting it delays payment.",
        },
        {
          term: "Invoice promptly",
          text: "The clock starts at issue, not at delivery. Every day of billing lag is a day of DSO.",
        },
      ],
    },

    { kind: "h", text: "Credit and collections" },
    {
      kind: "bullets",
      items: [
        {
          term: "Risk-based credit limits",
          text: "Limits set from credit data and trading history, reviewed rather than set once.",
        },
        {
          term: "Automated dunning",
          text: "Escalating reminders triggered by age, with tone and channel varying by segment.",
        },
        {
          term: "Credit holds",
          text: "System-enforced stops on new orders past a threshold, with a defined release authority.",
        },
        {
          term: "Dispute codes",
          text: "Every held invoice carries a reason code, so the root causes can be reported and fixed.",
        },
        {
          term: "Provisioning and write-off",
          text: "Doubtful debt provisioned on a consistent policy, with write-off requiring approval.",
        },
      ],
    },
    {
      kind: "callout",
      text: "Segment before you automate. Chasing a strategic account with the same automated sequence used for small accounts is how finance systems damage commercial relationships.",
    },

    { kind: "h", text: "Metrics and KPIs to track" },
    {
      kind: "metrics",
      items: [
        {
          name: "Days sales outstanding",
          text: "Average days from invoice to cash received.",
        },
        {
          name: "Billing lag",
          text: "Days from delivery or milestone to invoice issued.",
        },
        {
          name: "Aged debtors profile",
          text: "Balance by ageing bucket, and the trend in the oldest buckets.",
        },
        {
          name: "Cash application auto-match rate",
          text: "Receipts allocated without manual intervention.",
        },
        {
          name: "Dispute rate and value",
          text: "Invoices queried as a share of invoices issued.",
        },
        {
          name: "Bad debt write-off",
          text: "Written off as a percentage of revenue.",
        },
        {
          name: "Collection effectiveness index",
          text: "Cash collected against what was available to collect.",
        },
      ],
    },
  ],
};

const cashManagement: Article = {
  slug: "cash-management",
  intro:
    "Cash management is knowing where the money is, where it will be, and making sure it is in the right account before it is needed. Profitable organisations fail on liquidity, not on margin.",
  blocks: [
    { kind: "h", text: "Position, forecast, and the gap between them" },
    {
      kind: "bullets",
      items: [
        {
          term: "Cash position",
          text: "Actual cleared and available balances across every account, today. A fact.",
        },
        {
          term: "Short-term forecast",
          text: "Days to weeks, built from known payables, receivables and payroll. Mostly arithmetic.",
        },
        {
          term: "Medium-term forecast",
          text: "Weeks to months, built from the order book, billing schedule and capital plan. Part judgement.",
        },
        {
          term: "Long-term forecast",
          text: "Quarters to years, driven by the business plan. Entirely judgement, and treated as such.",
        },
      ],
    },
    {
      kind: "p",
      text: "Forecast accuracy degrades sharply with horizon. The design question is not how to make the long forecast accurate, but how to make the short one reliable enough to act on daily.",
    },

    { kind: "h", text: "Bank connectivity" },
    {
      kind: "steps",
      items: [
        {
          title: "Statement import",
          text: "Prior-day or intraday statements retrieved automatically, not downloaded by hand.",
        },
        {
          title: "Balance consolidation",
          text: "Every account, entity and currency presented as one position.",
        },
        {
          title: "Payment file generation",
          text: "Approved payment runs formatted for the bank's channel.",
        },
        {
          title: "Transmission and acknowledgement",
          text: "Files delivered securely and the bank's acknowledgement matched back.",
        },
        {
          title: "Reconciliation",
          text: "Cleared items matched to the subledger, exceptions reported.",
        },
      ],
    },
    {
      kind: "callout",
      text: "Bank file formats and connectivity are almost always underestimated in ERP programs. Test with the actual bank, in the actual channel, with production-shaped files, well before go-live — not in the last fortnight.",
    },

    { kind: "h", text: "Liquidity management" },
    {
      kind: "bullets",
      items: [
        {
          term: "Concentration and sweeping",
          text: "Moving balances to a main account automatically, so idle cash is not scattered.",
        },
        {
          term: "Target balances",
          text: "Minimum buffers per account, with the surplus invested or the shortfall funded.",
        },
        {
          term: "Facility management",
          text: "Tracking drawn and undrawn facilities against covenants.",
        },
        {
          term: "Currency exposure",
          text: "Knowing net position by currency before deciding whether to hedge it.",
        },
        {
          term: "Payment timing",
          text: "Paying on terms rather than early, unless the discount beats the cost of capital.",
        },
      ],
    },

    { kind: "h", text: "Metrics and KPIs to track" },
    {
      kind: "metrics",
      items: [
        {
          name: "Forecast accuracy",
          text: "Variance of forecast to actual at one, four and thirteen weeks.",
        },
        {
          name: "Cash conversion cycle",
          text: "Days inventory plus days receivable less days payable.",
        },
        {
          name: "Idle cash balance",
          text: "Funds sitting above target balance in non-interest-bearing accounts.",
        },
        {
          name: "Time to produce the position",
          text: "Hours from start of day to a trusted consolidated position.",
        },
        {
          name: "Failed payment rate",
          text: "Payment files or items rejected by the bank.",
        },
      ],
    },
  ],
};

const bankReconciliation: Article = {
  slug: "bank-reconciliation",
  intro:
    "Bank reconciliation proves that what the ledger says about cash agrees with what the bank says, and explains every difference. It is the most basic financial control there is, and a surprising number of organisations do it in a spreadsheet.",
  blocks: [
    { kind: "h", text: "How matching works" },
    {
      kind: "steps",
      items: [
        {
          title: "Import the statement",
          text: "Load the bank statement for the period, automatically and on a schedule.",
        },
        {
          title: "Automatic matching",
          text: "System matches statement lines to ledger entries on reference, amount and date within tolerance.",
        },
        {
          title: "Rules-based matching",
          text: "Configured rules handle recurring patterns — bank fees, interest, merchant settlements, direct debits.",
        },
        {
          title: "Suggested matches",
          text: "Near-misses presented for a human to confirm or reject, and the decision teaches future matching.",
        },
        {
          title: "Manual matching",
          text: "Whatever remains is matched by hand, and each one is a candidate for a new rule.",
        },
        {
          title: "Review and sign-off",
          text: "The reconciliation is reviewed by someone who did not prepare it, and retained as evidence.",
        },
      ],
    },

    { kind: "h", text: "Reconciling items" },
    {
      kind: "bullets",
      items: [
        {
          term: "Unpresented payments",
          text: "Issued but not yet cleared. Legitimate, but should age out quickly.",
        },
        {
          term: "Deposits in transit",
          text: "Received and recorded, not yet credited by the bank.",
        },
        {
          term: "Bank-originated entries",
          text: "Fees, interest and charges the bank applied that the ledger does not know about.",
        },
        {
          term: "Unidentified receipts",
          text: "Money arrived with no remittance advice. A receivables problem surfacing in cash.",
        },
        {
          term: "Errors",
          text: "Keying mistakes on either side. The only category that should be zero over time.",
        },
      ],
    },
    {
      kind: "callout",
      text: "An ageing unreconciled item is the warning sign. A stale unpresented payment may be a payment that never actually went out, and an old unidentified receipt is cash the business owns but cannot attribute.",
    },

    { kind: "h", text: "Controls" },
    {
      kind: "bullets",
      items: [
        {
          term: "Independence",
          text: "The reconciler must not also process payments or receipts.",
        },
        {
          term: "Frequency",
          text: "Daily for high-volume operating accounts, monthly at absolute minimum.",
        },
        {
          term: "Evidence of review",
          text: "Reviewer sign-off captured in the system, not as an email saying it looks fine.",
        },
        {
          term: "Ageing thresholds",
          text: "Items past a defined age escalate automatically rather than rolling forward.",
        },
      ],
    },

    { kind: "h", text: "Metrics and KPIs to track" },
    {
      kind: "metrics",
      items: [
        {
          name: "Auto-match rate",
          text: "Statement lines matched without human intervention.",
        },
        {
          name: "Reconciliation completion time",
          text: "Days after period end to a signed-off reconciliation.",
        },
        {
          name: "Unreconciled items aged over 30 days",
          text: "Count and value of stale differences.",
        },
        {
          name: "Unidentified receipts",
          text: "Value of cash received that cannot be allocated.",
        },
        {
          name: "Adjusting entries raised",
          text: "Corrections arising from reconciliation, by cause.",
        },
      ],
    },
  ],
};

const assetManagement: Article = {
  slug: "asset-management",
  intro:
    "Fixed asset accounting tracks capitalised items from acquisition through depreciation to disposal, and keeps the asset register agreeing to the general ledger. It is low-volume, high-value, and easy to get quietly wrong for years.",
  blocks: [
    { kind: "h", text: "The asset lifecycle" },
    {
      kind: "steps",
      items: [
        {
          title: "Acquisition",
          text: "Asset purchased or constructed, with costs accumulated against a capital project or work order.",
        },
        {
          title: "Capitalisation",
          text: "Costs meeting the policy threshold are capitalised; the rest are expensed. The asset is placed in service.",
        },
        {
          title: "Depreciation",
          text: "Cost allocated over useful life on the chosen method, run and posted each period.",
        },
        {
          title: "Revaluation or impairment",
          text: "Carrying value adjusted where the accounting framework requires it.",
        },
        {
          title: "Transfer",
          text: "Asset moves cost centre, location or entity, with the register updated.",
        },
        {
          title: "Disposal",
          text: "Asset sold, scrapped or written off, with gain or loss recognised and the register retired.",
        },
      ],
    },

    { kind: "h", text: "Decisions that shape the design" },
    {
      kind: "qa",
      items: [
        {
          title: "Capitalisation policy",
          question:
            "What is the threshold, and does it apply per item or per group?",
          plan: "Set a documented threshold with clear treatment for bulk purchases of individually low-value items, and configure it in the system rather than relying on judgement.",
        },
        {
          title: "Asset categories and useful lives",
          question:
            "How granular are categories, and what default life and method does each carry?",
          plan: "Define categories that align to how the business reports and to tax requirements, each with a default method and life that can be overridden with approval.",
        },
        {
          title: "Multiple books",
          question:
            "Do you need separate accounting, tax and possibly regulatory depreciation?",
          plan: "Configure parallel books early. Retrofitting a tax book across an existing register is expensive and error-prone.",
        },
        {
          title: "Work in progress",
          question:
            "How do costs accumulate before an asset is placed in service?",
          plan: "Use a capital work-in-progress account fed from projects, with a defined trigger and approval for capitalisation.",
        },
        {
          title: "Componentisation",
          question:
            "Are major components with different lives tracked separately?",
          plan: "Split components where the framework requires it — common for infrastructure and property — and accept the added register volume.",
        },
        {
          title: "Physical verification",
          question: "How often is the register checked against reality?",
          plan: "Schedule counts by category and value, and define how discrepancies are investigated and written off.",
        },
      ],
    },
    {
      kind: "callout",
      text: "The register drifting from physical reality is the classic failure. Assets scrapped but never retired keep depreciating, and assets in service but never capitalised understate the balance sheet. Neither shows up in a ledger reconciliation, because both sides are internally consistent.",
    },

    { kind: "h", text: "Reconciliation to the ledger" },
    {
      kind: "bullets",
      items: [
        {
          term: "Cost",
          text: "Register gross cost agrees to the asset control accounts.",
        },
        {
          term: "Accumulated depreciation",
          text: "Register accumulated depreciation agrees to the contra accounts.",
        },
        {
          term: "Depreciation expense",
          text: "Period depreciation posted matches the register's calculated charge.",
        },
        {
          term: "Additions and disposals",
          text: "Movements in the period reconcile to capital spend and disposal proceeds.",
        },
      ],
    },

    { kind: "h", text: "Metrics and KPIs to track" },
    {
      kind: "metrics",
      items: [
        {
          name: "Register to ledger variance",
          text: "Difference between asset register and control accounts at period end.",
        },
        {
          name: "Work in progress ageing",
          text: "Value sitting in capital WIP beyond a defined age without capitalisation.",
        },
        {
          name: "Fully depreciated assets still in use",
          text: "A signal that useful lives no longer reflect reality.",
        },
        {
          name: "Physical verification coverage",
          text: "Share of asset value verified in the last cycle.",
        },
        {
          name: "Disposal processing time",
          text: "Days from physical disposal to retirement in the register.",
        },
      ],
    },
  ],
};

export const finaccArticles: Article[] = [
  financialAccounting,
  generalLedger,
  accountsPayable,
  threeWayMatching,
  accountsReceivable,
  cashManagement,
  bankReconciliation,
  assetManagement,
];
