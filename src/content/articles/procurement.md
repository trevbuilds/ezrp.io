---
slug: procurement
source: authored
intro: >-
  Procurement is the front half of Procure-to-Pay — turning an approved need into a commitment a supplier can act on, and evidence that what was ordered was received.
  Most payables pain originates here, which is why replacing a finance system without touching procurement rarely works.
---

## Why it matters

Accounts payable inherits whatever procurement hands it. An invoice with no purchase order has nothing to match against; a receipt nobody entered leaves the match permanently open; a supplier record created without verification is a fraud waiting for an invoice.

- **It creates the commitment**: A purchase order records spend against budget before the money is spent, which is the only point at which it can still be stopped.
- **It creates the evidence**: The goods receipt is what makes three-way matching possible at all.
- **It creates the supplier**: The vendor master originates here, and it is the highest-risk record in the finance system.

> If you are replacing finance but not procurement, you are inheriting the purchase order and receipt data your matching engine depends on, from a system you are not changing. That dependency has to be named and tested, not assumed.

## The workflow

```steps
Sourcing :: Identify and evaluate suppliers capable of meeting the need, at the depth the spend warrants.
Contract award :: Terms, pricing and obligations agreed and recorded where the buying process can see them.
Supplier onboarding :: The vendor master record is created and verified, including bank details, tax registration and insurances.
Requisition :: The business records a need; approval happens against budget and policy before commitment.
Purchase order :: The commitment is issued to the supplier — scope, price, terms.
Goods or service receipt :: What actually arrived is recorded, and when.
Supplier performance :: Quality, timeliness and value measured against what was agreed.
```

## What you need in place

- **Vendor master control**: Dual authorisation and callback verification for creating or amending bank details. This single control prevents most invoice-redirection fraud.
- **Delegation of authority**: Requisition approval limits configured to mirror the signed instrument.
- **Catalogue and contract pricing**: Held as data, so the order prices itself rather than relying on the buyer to remember.
- **Receipting discipline**: Somebody accountable for recording receipt. Unreceipted orders are the most common cause of blocked invoices.
- **A non-PO policy**: An explicit list of spend categories that legitimately have no purchase order, rather than treating each as an exception.
- **Probity controls**: For government and government-owned entities, procurement probity, conflict declarations and auditor-general reporting apply regardless of sector.

## Questions to ask

```qa
Receipting :: Who records that goods or services arrived, and what happens if they do not? :: Unreceipted orders block invoices, and blocked invoices become manual workarounds that defeat the control.
Non-PO spend :: What share of invoices arrive with no purchase order? :: Measure it before designing the approval path, because the long tail is always larger than expected.
Vendor master :: Who can create a supplier and who verifies the bank details? :: Separation here matters more than any other control in the cycle.
Contract visibility :: Can a buyer see the contracted price at the point of ordering? :: If not, the contract is a document rather than a control.
Tolerances :: What price and quantity variance will we accept without re-approval? :: Set deliberately. Too tight blocks everything; too loose defeats matching.
```

## Metrics and KPIs to track

```metrics
PO compliance rate :: Invoices backed by a valid purchase order.
Unreceipted order value :: Value ordered but not yet receipted, and its age.
Requisition cycle time :: Time from requisition raised to purchase order issued.
Contract coverage :: Share of addressable spend under a current contract.
Supplier master changes :: Bank detail amendments per period, with the share verified by callback.
Maverick spend :: Value bought outside contracted suppliers or agreed catalogues.
```
