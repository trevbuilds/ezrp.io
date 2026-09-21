---
slug: financial-accounting
source: authored
intro: >-
  Financial accounting is the part of the ERP that produces the numbers the business is legally accountable for.
  Everything else in the system eventually posts here.
---

## How the pieces fit

The general ledger is the destination. The subledgers — payables, receivables, cash, assets — are where transactions originate, carry their own detail, and then summarise into the ledger. Getting this relationship right is most of what financial accounting design actually is.

- **General ledger**: The single chart of accounts, the periods, and the balances that feed statutory reporting.
- **Accounts payable**: What the business owes suppliers, and the controls around approving and paying it.
- **Accounts receivable**: What customers owe, and the discipline of collecting it.
- **Cash management**: Where the money actually is, and what it will be tomorrow.
- **Asset management**: Capitalised items, their depreciation, and their eventual disposal.

> A useful test during design: for any number on the face of the financial statements, can someone trace it back to the source transaction without leaving the system? If not, the subledger-to-ledger design has a gap in it.

## The month-end close

Close is where financial accounting design is judged. A well-designed system closes because the controls ran during the month; a poorly designed one closes because people worked a weekend.

```steps
Cut off the subledgers :: Stop new transactions posting into the period being closed, in a defined order.
Complete subledger processing :: Finish invoice entry, receipting, depreciation runs and bank reconciliation.
Post subledgers to the ledger :: Transfer and confirm that subledger control accounts agree to the ledger balances.
Process adjusting journals :: Accruals, prepayments, provisions, reclassifications and intercompany entries.
Reconcile balance sheet accounts :: Evidence each balance against a supporting schedule, not just against last month.
  - Reconciliations should be prepared and reviewed by different people.
  - Unexplained differences get aged, not written off quietly.
Review and close the period :: Management review of the result, then hard-close so the period cannot be reopened casually.
Report :: Statutory, management and regulatory reporting from the closed position.
```

## Where implementations go wrong

- **The chart of accounts carries too much**: Dimensions that belong in cost centres, projects or analysis codes get built as accounts, and the chart becomes unmaintainable.
- **Subledger detail is duplicated in the ledger**: Posting at invoice-line granularity bloats the ledger and slows every report that touches it.
- **Periods are left open**: Soft-closing forever means the prior month's numbers keep moving after they have been reported.
- **Reconciliations are manual by design**: If nobody configured automated matching, the close will always be a headcount problem.
- **Segregation of duties is retrofitted**: Roles designed for convenience during UAT become the production security model.

## Metrics and KPIs to track

```metrics
Days to close :: Working days from period end to reported result.
Manual journal volume :: Journals entered by hand as a share of all postings — a proxy for process gaps.
Reconciling items aged over 90 days :: Unresolved differences sitting in balance sheet reconciliations.
Post-close adjustments :: Entries made after the period was reported.
Audit findings :: Control deficiencies raised by internal or external audit.
```
