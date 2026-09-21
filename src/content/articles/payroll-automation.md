---
slug: payroll-automation
source: authored
intro: >-
  Payroll automation is the difference between a pay run that is executed and one that is assembled.
  The goal is not fewer people — it is fewer manual interventions, because each one is a place the result can differ from the rules.
---

## Why it matters

Manual intervention in payroll is not a productivity problem first. It is an accuracy and auditability problem: an adjustment keyed by hand has no rule behind it, no provenance, and no guarantee of being applied consistently next cycle.

- **Every manual entry is unrepeatable**: What was done once by judgement will be done differently next time.
- **Volume hides error**: At scale, a wrong rule and a correct one look identical until someone reconciles.
- **Audit needs provenance**: "Why was this person paid this?" has to be answerable from the system.

## The workflow

```steps
Time capture :: Hours arrive from time and attendance rather than from a spreadsheet.
Interpretation :: Award and agreement rules produce pay components automatically.
Pre-run validation :: Automated checks flag outliers — unusual gross, negative net, missing bank details — before release.
Calculation :: Gross to net runs, including tax, super and deductions.
Review :: Exceptions are reviewed; the rest is not re-checked by hand.
Release and reporting :: Net pay file, STP event, journal and super all issue from the same run.
```

> A pay run with a long manual adjustment list is telling you where the rules are incomplete. Treat the list as a backlog, not as normal operations.

## What you need in place

- **Straight-through time capture**: No spreadsheets between the roster and the pay run.
- **Encoded rules with provenance**: Each rule traceable to its clause.
- **Pre-run validation**: Automated, with thresholds agreed by payroll and finance.
- **An exception queue**: Where judgement is genuinely needed, with the reason recorded.
- **Reconciliation**: Payroll to ledger, every run, automatically.

## Questions to ask

```qa
Manual rate :: How many adjustments does a typical run need, and why? :: The reasons are your automation backlog.
Validation :: What is checked before release, automatically? :: Negative net and missing bank details should never reach a file.
Provenance :: Can we show why an individual was paid what they were? :: Required for a dispute, an audit, and any underpayment review.
Reconciliation :: Does the payroll journal reconcile to the ledger without help? :: If it needs a person each cycle, the interface is incomplete.
Off-cycle :: How are out-of-cycle payments handled? :: They are the least controlled path and deserve the most scrutiny.
```

## Metrics and KPIs to track

```metrics
Touchless run rate :: Pay runs completed with no manual adjustment.
Manual adjustments per run :: Count and value, with reasons.
Pre-run exception rate :: Issues caught before release rather than after.
Off-cycle payment share :: Payments made outside the normal run.
Payroll-to-ledger variance :: Difference requiring manual reconciliation.
```
