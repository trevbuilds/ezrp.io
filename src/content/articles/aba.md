---
slug: aba
source: authored
intro: >-
  The ABA file is how an Australian organisation actually pays anyone at volume — a fixed-width text file, lodged with the bank, that moves money out the door.
  It is the last step of Procure-to-Pay and of payroll, and the point at which a configuration error becomes a real payment to a real stranger.
---

## Why it matters

The format is unglamorous and the stakes are not. An ABA file is the instruction to move money; once the bank accepts it, recovery depends on the goodwill of whoever received the funds.

- **It is the fraud surface**: Invoice fraud rarely defeats the matching engine. It changes the bank account on a legitimate supplier and lets the file pay it correctly.
- **It is unforgiving**: Fixed-width, positionally parsed. A misplaced character shifts every field after it.
- **It is bank-specific**: The standard is a convention rather than a specification, and each bank varies it.
- **It is the point of no return**: Approval workflow is reversible. A lodged file is not.

## What the file is

The Australian Bankers Association format — universally called ABA, sometimes Direct Entry or Cemtex — is a plain text file of fixed-width records.

```steps
Descriptive record :: One line per file. Names the originating organisation, the user identification number issued by the bank, and the processing date.
Detail records :: One line per payment. BSB, account number, amount in cents, account title, lodgement reference, and the trace record for the debit side.
Total record :: One line per file. Net, credit and debit totals, and the count of detail records. The bank rejects the file if these do not reconcile.
```

> Amounts are in cents with no decimal point, right-justified and zero-filled. A dollar value that reaches the file with a decimal point becomes a payment a hundred times too large or too small.

## What you need in place

- **Vendor master control**: Creating or amending bank details is the highest-risk transaction in the finance system. It needs dual authorisation and callback verification against a number you already held.
- **BSB validation**: Checked against the current BSB directory, not just for length. BSBs are retired and reissued.
- **A user identification number**: Issued by your bank, specific to the account the file debits. It is not interchangeable between banks.
- **Balanced or unbalanced convention**: Some banks require a matching debit trace record, some do not. Getting this wrong produces silent rejection.
- **Segregation of duties**: Whoever creates the file cannot be the person who lodges it.
- **A retained copy**: The exact file lodged, kept as evidence, because the bank's copy is the one that will be cited in a dispute.

## Where it goes wrong

```qa
Bank variation :: Have we tested against this bank's ABA specification, not a generic one? :: Get the bank's own documentation and test a file end to end before go-live, including a rejection case.
Vendor master :: Who can change a supplier's BSB and account number, and who checks? :: Dual authorisation with callback verification to a number already on file. Not the number on the invoice.
File handling :: Where does the file sit between generation and lodgement? :: A file written to a shared drive is editable by anyone with access. Generate straight into the banking channel.
Duplicate lodgement :: What stops the same file being lodged twice? :: Sequence numbering and reconciliation against the bank statement the next day.
Remittance :: How do suppliers know what was paid? :: Remittance advice from the same run that produced the file, not a separate manual process.
```

## Metrics and KPIs to track

```metrics
File rejection rate :: Files rejected by the bank, and the reason for each.
Payment run cycle time :: Elapsed time from approved payment proposal to funds released.
Vendor bank detail changes :: Count per period, with the proportion verified by callback.
Duplicate payment value :: Value of duplicates detected, and of those recovered after payment.
Unreconciled payments :: Payments in the file not matched to a bank statement line.
```

## Australian specifics

- The format predates modern payment rails and persists because it is universally accepted by Australian banks.
- The **New Payments Platform** and PayTo are steadily taking volume, particularly for real-time and consumer payments, but ABA remains the default for bulk supplier and payroll disbursement.
- **Superannuation** contributions use SuperStream rather than ABA — a separate obligation with its own format and gateway.
- Lodgement cut-off times are bank-specific and shift around public holidays. A payment run scheduled without reference to the Victorian public holiday calendar will sit unprocessed.
