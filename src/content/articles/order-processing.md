---
slug: order-processing
source: authored
intro: >-
  Order processing turns an accepted customer order into something delivered and billable.
  It sits between the commercial agreement and the receivable, which makes it the step that decides whether revenue is recognised on time and whether the customer gets what they agreed to.
---

## Why it matters

Order processing is where a promise made by sales becomes an obligation carried by operations. The finance consequences are immediate: an order that cannot be fulfilled is deferred revenue, and an order fulfilled but not confirmed is revenue nobody has invoiced.

- **It gates revenue**: Nothing bills until delivery is confirmed.
- **It carries the promise**: The date given at quoting is honoured or broken here.
- **It feeds the receivable**: Order accuracy determines invoice accuracy, and invoice accuracy determines whether a customer pays on time or disputes.

## The workflow

```steps
Order receipt :: The accepted quote or customer instruction enters as an order — converted, not rekeyed.
Order confirmation :: Availability and credit are checked, and a promise date is confirmed to the customer.
Allocation :: Stock or capacity is reserved against the order so it cannot be committed twice.
Picking and packing :: The order is assembled and readied.
Shipping and delivery :: Goods move, tracked, until receipt is confirmed.
Delivery confirmation :: Proof of delivery is captured — the event that makes the order billable.
```

> Bill from the delivery, not from the order. Billing the order is how organisations invoice for what was short-shipped, and the credit note costs more to process than the original invoice earned.

## What you need in place

- **Order conversion**: A system path from accepted quote to order with no manual re-entry. Any rekeying is a defect regardless of how careful the person is.
- **Available-to-promise**: A real availability check behind the promise date, or the date is a guess that becomes a service failure.
- **Credit check**: Customer credit assessed before acceptance, not after delivery.
- **Allocation rules**: Who gets the stock when there is not enough, decided by policy rather than by whoever calls.
- **Backorder handling**: A defined path for orders that cannot be met in full.
- **Proof of delivery**: Captured in a form that triggers billing automatically.

## Questions to ask

```qa
Conversion :: Does an accepted quote become an order without anyone retyping it? :: Rekeying introduces a variance between what the customer agreed and what the business will deliver.
Promise dates :: What is behind the date we give the customer? :: An availability check, or optimism. Only one of them survives contact with the warehouse.
Short shipment :: What happens when we deliver part of an order? :: Partial billing and backorder handling need to exist before the first one occurs.
Billing trigger :: What event causes an invoice? :: Delivery confirmation. If it is order entry, expect credit notes.
Returns :: How does a return reverse the revenue and the stock? :: Reverse logistics quietly erodes reported margin when it is handled manually.
```

## Metrics and KPIs to track

```metrics
On-time in-full (OTIF) :: Orders delivered complete by the promised date.
Order cycle time :: Elapsed time from order entry to delivery.
Delivered not invoiced :: Value delivered but not yet billed, and its age.
Order accuracy :: Orders fulfilled without amendment to what was accepted.
Credit note rate :: Credit notes as a share of invoices, split by cause.
Backorder value :: Value of orders waiting on stock or capacity.
```
