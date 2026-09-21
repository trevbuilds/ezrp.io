---
slug: general-ledger
source: authored
intro: >-
  The general ledger is the central record of every financial transaction, organised by a chart of accounts and bounded by accounting periods.
  Its design constrains every report the business will ever run.
---

## Designing the chart of accounts

The chart is the hardest thing to change after go-live, and the thing most often designed in a hurry. The question to keep asking is what belongs in the account code and what belongs in a separate dimension.

- **Natural account**: What the transaction is — revenue, salaries, depreciation. This is the only thing the account code should carry.
- **Cost centre or department**: Who is accountable for it. A dimension, not an account.
- **Legal entity**: Which balance sheet it belongs to, driving statutory reporting and intercompany.
- **Project or activity**: What initiative consumed it, where project accounting is in scope.
- **Future-use segments**: Leave room, but do not build segments nobody has a reporting requirement for.

> A chart that needs a new account every time the business reorganises is a chart with organisational structure baked into the account code. Move it to a dimension before go-live, not after.

## Journals and posting

```steps
Entry :: Journals arrive from subledgers, integrations, spreadsheets or manual entry.
Validation :: Balanced debits and credits, valid account and dimension combinations, open period.
Approval :: Manual journals route for review against thresholds, with the preparer unable to approve their own.
Posting :: Balances update and the entry becomes part of the permanent record.
Reversal or correction :: Posted entries are corrected by reversal, never by editing history.
```

## Period control

- **Open**: Normal transaction processing for the current period.
- **Soft close**: Restricted to finance for adjusting entries while subledgers are shut.
- **Hard close**: No further postings. Reopening requires explicit approval and leaves a trail.
- **Year end**: Balances roll forward, income statement accounts clear to retained earnings.

## Metrics and KPIs to track

```metrics
Manual journal ratio :: Manual entries as a share of total journal lines.
Journal rejection rate :: Entries failing validation or approval on first submission.
Suspense account balance :: Value sitting in clearing and suspense accounts at period end.
Period reopen count :: How often a closed period was reopened.
Chart of accounts growth :: New accounts created per quarter, as a signal of design drift.
```
