---
slug: fulfil-to-invoice
source: authored
intro: >-
  Fulfil to Invoice converts completed delivery into a billing document and recorded revenue.
  It is short, largely automatic when configured well, and the source of a surprising amount of leakage when it is not.
---

## The workflow

```steps
Delivery confirmation :: Delivery is confirmed, which is the event that makes the order billable.
Billing document creation :: A billing document is raised from what was actually delivered, not what was ordered.
Invoice generation :: The invoice is produced against agreed terms and tax treatment.
Revenue recording :: Revenue is posted to the ledger under the agreed recognition policy.
```

> Bill from the delivery, not the order. Billing the order is how businesses invoice for goods that were short-shipped, and the credit note costs more to process than the original invoice.

## What you need in place

- **Delivery-based billing**: The billing trigger is confirmed delivery, with partial deliveries handled.
- **Tax determination**: GST treatment derived by rule, including exports and exempt supplies.
- **Revenue recognition rules**: Configured to the accounting policy, especially where delivery and performance differ.
- **Billing exception queue**: Somewhere blocked billing goes to be worked, visible to a named owner.

## Metrics and KPIs to track

```metrics
Delivered not invoiced :: Value delivered but not yet billed, and its age.
Billing cycle time :: Time from delivery confirmation to invoice issued.
Credit note rate :: Credit notes as a share of invoices, split by cause.
Touchless billing rate :: Invoices produced with no manual intervention.
```
