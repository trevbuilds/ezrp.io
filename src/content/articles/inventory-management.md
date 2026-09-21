---
slug: inventory-management
source: authored
intro: >-
  Inventory management is knowing what stock exists, where it is and what it is worth.
  It is the least glamorous data in an ERP and the one most other processes silently depend on.
---

## Why it matters

Inventory is the point where the physical world and the ledger are supposed to agree, and the place they most often do not. Every discrepancy is either a control failure or a process failure, and both cost money.

- **It is a balance sheet number**: Stock value flows straight into reported assets and cost of sales.
- **It constrains the promise**: Available-to-promise is only as good as stock on hand.
- **It hides loss**: Shrinkage, damage and obsolescence surface at count time unless something finds them sooner.

## The workflow

```steps
Stock monitoring :: On-hand, allocated and available tracked by location, continuously rather than periodically.
Reorder triggering :: Replenishment raised against min/max, reorder point or planned demand.
Receiving stock :: Goods receipted to location, with quantity and condition recorded.
Inventory auditing :: Cycle counting by value and movement class, with variance investigated.
```

> Cycle count instead of stocktaking. An annual count corrects the record once a year and tells you nothing about why it was wrong; cycle counting by ABC class finds the cause while the cause is still findable.

## What you need in place

- **Location-level tracking**: Knowing you have twelve is useless if nobody can find them.
- **Valuation method decided and consistent**: Standard, average or FIFO, with the accounting consequence understood.
- **Cycle counting programme**: Frequency by value and movement, not uniform.
- **Variance investigation**: With a threshold and an owner, not just an adjustment.
- **Obsolescence policy**: Aged stock provisioned on a rule rather than at year-end.
- **Segregation of duties**: The person who counts should not be the person who adjusts.

## Questions to ask

```qa
Accuracy :: What is our measured count accuracy? :: Measured, not believed.
Locations :: Do we track location, or only quantity? :: Quantity without location produces re-buying.
Valuation :: Which method, and does everyone know the consequence? :: It changes reported margin period to period.
Adjustments :: Who can adjust stock, and who reviews it? :: Unreviewed adjustment is how shrinkage disappears.
Obsolescence :: How is aged stock identified and provisioned? :: If only at year-end, the provision is always a surprise.
Consignment :: Do we hold stock we do not own, or vice versa? :: It is accounted for differently and usually handled the same.
```

## Metrics and KPIs to track

```metrics
Count accuracy :: Cycle count variance, by value and by line.
Stock turns :: By category and location.
Days of inventory :: Against target, trended.
Obsolete and slow-moving :: Value and share of total.
Stockout frequency :: Demand unmet from available stock.
Adjustment value :: Net and absolute, by reason code.
```
