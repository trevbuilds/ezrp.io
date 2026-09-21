---
slug: order-to-cash
source: authored
intro: >-
  The final stage of Lead-to-Cash executes the order, bills it, and collects the money.
  It is large enough to be a value stream in its own right, and decomposes into three: Order to Fulfil, Fulfil to Invoice, and Invoice to Cash.
---

## Why it matters

Order to Cash is where a sale becomes revenue. It runs mostly outside CRM — in supply chain, billing and receivables — which is precisely why it gets neglected by projects scoped as CRM implementations.

## The three sub-stages

```steps
Order to Fulfil :: Order entry, availability, allocation, picking and packing, shipping and delivery.
Fulfil to Invoice :: Delivery confirmation, billing document creation, invoice generation and revenue recording.
Invoice to Cash :: Invoice transmission, payment tracking, receipt application, collections and clearing.
```

> Each boundary between these three is a place where a document can exist in one system and not the other. Delivered but not invoiced, and invoiced but not collected, are the two balances worth watching weekly.

## What you need in place

- **One order record**: The order the customer placed, visible to sales, warehouse and finance alike.
- **Clean handovers**: Defined triggers between sub-stages, so nothing waits on someone noticing.
- **Revenue recognition policy**: When revenue is recognised, agreed with finance and configured accordingly.
- **Exception handling**: Short shipments, returns and disputes have a defined path rather than an email chain.

## Metrics and KPIs to track

```metrics
Order-to-cash cycle time :: Elapsed time from order to cash received.
Perfect order rate :: Orders delivered complete, on time, undamaged and correctly invoiced.
Delivered not invoiced :: Value delivered but not yet billed.
Days sales outstanding :: Average days to collect after invoicing.
```
