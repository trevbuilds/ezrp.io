---
slug: order-to-fulfil
source: authored
intro: >-
  Order to Fulfil takes an accepted order and makes it real: checking it can be met, reserving the stock, and getting the goods or service to the customer.
---

## The workflow

```steps
Order entry :: The order enters the system, converted from the accepted quote.
Availability check :: Stock or capacity is checked and a promise date established.
Inventory allocation :: Stock is reserved against this order so it cannot be sold twice.
Picking and packing :: The order is assembled and readied for despatch.
Shipping and delivery :: Goods move, tracked, until receipt is confirmed.
```

> The available-to-promise check is the honesty of the whole stream. A confident date the warehouse cannot meet converts a won deal into a service failure.

## What you need in place

- **Accurate inventory**: System stock that matches physical stock, or every promise is a guess.
- **Allocation rules**: Who gets the stock when there is not enough — decided by policy, not by whoever calls.
- **Backorder handling**: A defined path for what happens when the order cannot be met in full.
- **Delivery confirmation**: Proof of delivery captured, because it triggers billing.

## Metrics and KPIs to track

```metrics
On-time in-full (OTIF) :: Orders delivered complete by the promised date.
Order cycle time :: Elapsed time from order entry to delivery.
Fill rate :: Share of demand met from available stock.
Backorder value :: Value of orders waiting on stock.
```
