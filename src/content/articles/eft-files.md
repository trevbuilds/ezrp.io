---
slug: eft-files
source: authored
intro: >-
  An EFT file is a batch payment instruction in whatever format the receiving bank expects.
  Most organisations treat the format as a technical detail and discover during testing that it is a design constraint with a long tail.
---

## Why it matters

The file format sits at the boundary between the finance system and the bank, and that boundary is where assumptions go to die. The system produces what it was configured to produce; the bank accepts what its specification says; nobody owns the gap between them until a run fails.

- **Format is bank-specific**: Two banks accepting "the standard format" will differ in practice.
- **Failures are late**: A malformed file is usually discovered at lodgement, when the payment is already due.
- **It constrains the banking relationship**: Changing banks means re-testing every payment path, which is why the cost of switching is always under-estimated.

## Formats in use

- **ABA / Direct Entry**: The Australian domestic standard for bulk supplier and payroll payments. Fixed-width, lodged in batch.
- **ISO 20022 (pain.001)**: XML, richer data, increasingly required for international payment and progressively adopted domestically.
- **BECS**: The underlying Bulk Electronic Clearing System that ABA files feed.
- **NPP / PayTo**: Real-time rails, used for immediate and consumer payment rather than bulk disbursement.
- **SWIFT MT101**: Cross-border payment instruction where an offshore account is involved.

> One organisation usually runs several of these at once — ABA for domestic suppliers, SuperStream for superannuation, a card platform for expenses, and something else again for international. The reconciliation burden comes from the number of channels, not the volume in any one of them.

## What you need in place

- **The bank's own specification**: Not a generic description of the format. The version the bank will validate against.
- **A test path**: A way to lodge a test file and see a rejection, before go-live rather than during it.
- **File integrity**: Generated straight into the banking channel. A file that rests on a shared drive is editable by anyone with access to that drive.
- **Sequence control**: Numbering that makes a duplicate lodgement detectable.
- **Retention**: The exact file lodged, kept as evidence.
- **A named owner**: Somebody accountable for the format when the bank changes its specification, which happens without much notice.

## Questions to ask

```qa
Specification :: Which bank specification and version are we building to? :: Get it in writing from the bank, and record the version alongside the configuration.
Rejection :: How do we find out a file was rejected, and how quickly? :: A rejection discovered on the due date is a late payment; the alert has to be active rather than checked.
Multiple banks :: Do we produce files for more than one bank? :: Each is a separate format, a separate test path and a separate failure mode.
Change :: What happens when the bank updates its specification? :: Name the owner now. This is the control that quietly lapses.
Encryption :: How is the file protected in transit and at rest? :: It is a set of instructions to move money; treat it accordingly.
```

## Metrics and KPIs to track

```metrics
File rejection rate :: Files rejected at lodgement, and the reason for each.
Time to detect rejection :: Elapsed time between lodgement and someone knowing it failed.
Channels in use :: Distinct payment formats maintained, a proxy for reconciliation burden.
Specification drift :: Time since each format was last tested against the bank's current specification.
```
