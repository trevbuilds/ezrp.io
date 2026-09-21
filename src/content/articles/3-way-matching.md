---
slug: 3-way-matching
source: authored
intro: >-
  Three-way matching compares the purchase order, the goods receipt and the supplier invoice before an invoice is approved for payment.
  It is the single most effective control in accounts payable, and the one most often configured badly.
---

## The three documents

- **Purchase order**: What was ordered, at what price, on what terms. Evidence the spend was authorised.
- **Goods receipt**: What actually arrived, in what quantity, on what date. Evidence the business received value.
- **Supplier invoice**: What is being claimed. Evidence of the liability.

Where all three agree within tolerance, the invoice can pay without a human looking at it. Where they disagree, the mismatch is the useful information — it tells you whether the problem is price, quantity, or timing.

## Two-way and four-way variants

- **Two-way match**: PO to invoice only. Appropriate for services and subscriptions where there is nothing to receipt.
- **Three-way match**: PO, receipt and invoice. The default for goods.
- **Four-way match**: Adds an inspection or quality certificate. Used where acceptance is conditional, common in construction and regulated manufacturing.

## Setting tolerances

Tolerances decide how much variance passes silently. Set them too tight and AP drowns in exceptions; too loose and the control stops controlling anything.

```qa
Price tolerance :: How much can unit price vary from the PO before someone must look at it? :: Set a percentage and an absolute cap, so a small percentage on a very large line still triggers review.
Quantity tolerance :: Will you accept over-delivery, and by how much? Does it differ by category? :: Allow over-receipt only where the commercial terms permit it, and differentiate bulk commodities from discrete items.
Timing and accruals :: What happens when the invoice arrives before the receipt is entered? :: Hold on receipt rather than reject, and report the held population daily so it does not silently age.
Freight, tax and charges :: Are ancillary charges on the PO, or added at invoice? :: Decide whether these match, are separately tolerated, or route for coded approval. Ambiguity here creates most exceptions.
Exception routing :: Who resolves a mismatch — AP, procurement, or the requisitioner? :: Route by mismatch type. Price goes to procurement, quantity to the receiver, coding to the budget holder.
```

> A high exception rate is rarely a matching problem. It is usually late receipting, stale PO prices, or ancillary charges that were never on the order. Fix the cause before loosening the tolerance.

## Metrics and KPIs to track

```metrics
First-time match rate :: Invoices matching on first attempt with no intervention.
Exception rate by type :: Mismatches split into price, quantity, timing and coding.
Exception resolution time :: Average days from mismatch raised to cleared.
Invoices on receipt hold :: Value awaiting a goods receipt that has not been entered.
Tolerance override frequency :: How often a human waves a mismatch through, and by whom.
```
