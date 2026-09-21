---
slug: invoice-to-cash
source: authored
intro: >-
  Invoice to Cash gets the invoice to the customer and the money into the bank.
  It is the last stage of Lead-to-Cash, and the one that determines whether all the preceding work converts into working capital.
---

## The workflow

```steps
Invoice transmission :: The invoice reaches the customer in the format and channel they can actually process.
Payment tracking :: Expected receipts are monitored against terms.
Receipt application :: Incoming payments are matched to invoices and applied.
Collections :: Overdue accounts are worked to an agreed escalation path.
Receivables clearing :: The receivable is cleared and the ledger agrees to the bank.
```

> Most late payment is not a collections problem. It is an invoice the customer could not process — wrong purchase order reference, wrong format, wrong recipient — and it is cheaper to fix at transmission than to chase at day sixty.

## What you need in place

- **Customer-ready invoicing**: Purchase order references and formats that match how the customer's payables team works, including e-invoicing where they use it.
- **Automated matching**: Receipts matched to invoices by rule, with a clean exception queue for the rest.
- **Dunning and escalation**: A defined collections path with owners, not ad-hoc chasing.
- **Dispute management**: Disputed invoices flagged and worked separately, so they do not distort ageing.

## Metrics and KPIs to track

```metrics
Days sales outstanding :: Average days to collect after invoicing.
Aged receivables over terms :: Value past due, split by reason.
Auto-match rate :: Receipts applied without manual intervention.
Dispute value and age :: Value under dispute and how long it has been there.
Bad debt write-off :: Value written off as uncollectable.
```
