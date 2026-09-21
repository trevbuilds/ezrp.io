---
slug: payments
source: authored
intro: >-
  The payment run is where an approved liability becomes money that has left the building.
  Everything upstream — matching, approval, delegation — exists to make this step safe, and everything downstream depends on it having been done accurately.
---

## Why it matters

A payment run is the most consequential routine transaction in the finance system. It is high-volume, largely automated, and irreversible once released, which is an unusual and dangerous combination.

- **Irreversible**: Approval can be withdrawn; a released payment can only be recovered by asking.
- **Concentrated**: One run can carry thousands of payments and millions of dollars on a single release.
- **Routine**: Familiarity erodes scrutiny. The control has to be structural rather than attentional.
- **Terms-sensitive**: Paying early costs working capital; paying late costs supplier relationships and, for some, statutory penalties.

## The workflow

```steps
Payment proposal :: The system selects approved invoices due for payment against agreed terms, grouped by supplier and payment method.
Review :: Someone independent of the approval chain reviews the proposal — totals, outliers, any supplier whose bank details changed recently.
Approval to release :: Authorisation to pay, at a level that matches the signed delegation of authority.
File generation :: The proposal becomes a bank-format file, ABA for domestic bulk payment.
Lodgement :: The file is transmitted to the bank through the banking channel.
Posting and remittance :: Payments post to the ledger, clear the supplier's account, and remittance advice goes out.
Reconciliation :: The payment run is matched against the bank statement.
```

> Review the proposal, not the file. By the time it is a file it is formatted for a machine, and nobody reads a fixed-width text file critically.

## What you need in place

- **Delegation of authority**: Approval limits configured to mirror the signed authority, with escalation above them. Configuration, not training.
- **Segregation of duties**: Create, approve and release are three roles. In a small finance team this is a design problem to solve, not an audit finding to accept later.
- **Payment terms by supplier**: Held as data, so the proposal selects correctly rather than defaulting everything to the same terms.
- **Bank detail change monitoring**: Any supplier whose bank details changed since the last run surfaces on the proposal for explicit attention.
- **Exception handling**: A defined path for held payments, partial payments and disputed invoices, so they do not accumulate as manual workarounds.
- **A dual banking channel**: Somebody other than the usual operator can lodge a run when they are away, without sharing credentials.

## Questions to ask

```qa
Independence :: Who reviews the proposal, and are they outside the approval chain? :: A reviewer who approved the invoices is checking their own work.
Delegation :: Do the release limits match the signed delegation exactly? :: Compare the configuration against the signed instrument line by line, not against what people believe it says.
Bank details :: Does the proposal flag suppliers whose banking changed recently? :: This single control catches most invoice-redirection fraud.
Terms :: Are we paying to terms, or paying everything on the same cycle? :: Paying early is a working-capital decision being made by default.
Recovery :: What happens when a payment goes to the wrong account? :: Know the bank's recall process and its time limits before you need them.
```

## Metrics and KPIs to track

```metrics
Days payable outstanding :: Average days taken to pay suppliers.
On-time payment rate :: Invoices paid on or before due date.
Early payment value :: Value paid before terms required, and the working capital it cost.
Payment run exceptions :: Payments held or failed per run, by reason.
Duplicate payment value :: Value of duplicates detected, and of those recovered after payment.
Unreconciled payments :: Payments not matched to a bank statement line within one day.
```

## Australian context

Domestic bulk payment runs use the ABA file format. Superannuation goes through SuperStream on its own cycle and cannot ride the same run. Public sector and government-owned entities frequently carry supplier payment-time reporting obligations, which makes on-time payment rate a published number rather than an internal one.
