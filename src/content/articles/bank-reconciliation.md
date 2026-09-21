---
slug: bank-reconciliation
source: authored
intro: >-
  Bank reconciliation proves that what the ledger says about cash agrees with what the bank says, and explains every difference.
  It is the most basic financial control there is, and a surprising number of organisations do it in a spreadsheet.
---

## How matching works

```steps
Import the statement :: Load the bank statement for the period, automatically and on a schedule.
Automatic matching :: System matches statement lines to ledger entries on reference, amount and date within tolerance.
Rules-based matching :: Configured rules handle recurring patterns — bank fees, interest, merchant settlements, direct debits.
Suggested matches :: Near-misses presented for a human to confirm or reject, and the decision teaches future matching.
Manual matching :: Whatever remains is matched by hand, and each one is a candidate for a new rule.
Review and sign-off :: The reconciliation is reviewed by someone who did not prepare it, and retained as evidence.
```

## Reconciling items

- **Unpresented payments**: Issued but not yet cleared. Legitimate, but should age out quickly.
- **Deposits in transit**: Received and recorded, not yet credited by the bank.
- **Bank-originated entries**: Fees, interest and charges the bank applied that the ledger does not know about.
- **Unidentified receipts**: Money arrived with no remittance advice. A receivables problem surfacing in cash.
- **Errors**: Keying mistakes on either side. The only category that should be zero over time.

> An ageing unreconciled item is the warning sign. A stale unpresented payment may be a payment that never actually went out, and an old unidentified receipt is cash the business owns but cannot attribute.

## Controls

- **Independence**: The reconciler must not also process payments or receipts.
- **Frequency**: Daily for high-volume operating accounts, monthly at absolute minimum.
- **Evidence of review**: Reviewer sign-off captured in the system, not as an email saying it looks fine.
- **Ageing thresholds**: Items past a defined age escalate automatically rather than rolling forward.

## Metrics and KPIs to track

```metrics
Auto-match rate :: Statement lines matched without human intervention.
Reconciliation completion time :: Days after period end to a signed-off reconciliation.
Unreconciled items aged over 30 days :: Count and value of stale differences.
Unidentified receipts :: Value of cash received that cannot be allocated.
Adjusting entries raised :: Corrections arising from reconciliation, by cause.
```
