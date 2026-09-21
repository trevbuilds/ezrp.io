---
slug: accounts-payable
source: authored
intro: >-
  Accounts payable is the back half of procure-to-pay: turning a supplier's invoice into an approved, matched, paid and recorded liability without paying twice, paying early, or paying someone who is not the supplier.
---

## Where AP sits in procure-to-pay

AP inherits whatever procurement hands it. Most AP pain is actually upstream: no purchase order, a receipt nobody entered, or a supplier master record with the wrong bank details.

```steps
Supplier onboarding :: The vendor master is created and verified, including bank details and tax registration.
Purchase order raised :: Commitment is recorded against budget before the spend happens.
Goods or services received :: Receipting confirms what actually arrived, and when.
Invoice received :: Supplier invoice arrives by email, portal, EDI or e-invoicing network.
Matching :: Invoice is matched against the PO and the receipt within tolerance.
Approval :: Exceptions and non-PO invoices route to the delegated approver.
Payment :: Approved invoices are selected into a payment run and disbursed.
Reconciliation and reporting :: Payments clear the bank, the subledger agrees to the ledger, and the aged payables report is credible.
```

## Controls that matter

- **Vendor master control**: Creating and amending supplier bank details is the highest-risk transaction in AP. It needs dual authorisation and callback verification.
- **Segregation of duties**: The person who can create a supplier must not be able to approve an invoice or release a payment.
- **Duplicate detection**: Matching on supplier, invoice number, amount and date before posting, not after paying.
- **Delegation of authority**: Approval limits configured in the system, mirroring the signed DoA rather than an informal understanding.
- **Payment run review**: Someone independent reviews the proposed payment file before release.

> Invoice fraud almost never defeats the matching engine. It changes the bank account on a legitimate supplier and lets the matching engine pay it correctly. Design the vendor master controls accordingly.

## Non-PO invoices

Every AP implementation discovers a long tail of spend with no purchase order — utilities, rates, legal fees, subscriptions. Pretending it away is why go-live hurts.

- **Categorise it**: Identify which spend types are legitimately non-PO rather than treating each one as an exception.
- **Route on coding**: Without a PO there is no commitment, so approval must happen on the account and cost centre coding.
- **Use recurring templates**: Predictable charges like rent and utilities should post from templates, not be keyed monthly.
- **Measure it**: Non-PO share is a procurement compliance metric, and it belongs on a report someone reads.

## Metrics and KPIs to track

```metrics
Days payable outstanding :: Average days taken to pay suppliers.
On-time payment rate :: Invoices paid on or before due date.
Touchless processing rate :: Invoices from receipt to payment with no human intervention.
PO compliance rate :: Invoices backed by a valid purchase order.
Duplicate payment value :: Value of duplicates detected, and of those recovered after payment.
Cost per invoice :: Total AP operating cost divided by invoices processed.
Aged payables over terms :: Value sitting past due, split by reason.
```
