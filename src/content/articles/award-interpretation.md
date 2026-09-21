---
slug: award-interpretation
source: authored
intro: >-
  Award interpretation turns a roster and a set of timesheets into correct pay under an instrument written in plain English and applied by a machine.
  It is where Australian payroll goes wrong at scale, and where underpayment claims come from.
---

## Why it matters

Modern awards and enterprise agreements are dense, conditional and amended regularly. Encoding them is a translation exercise, and translation errors repeat every pay cycle until someone notices.

- **It applies to many employers who think it does not**: Award coverage follows the work, not the job title or the contract.
- **It is conditional**: Penalty rates, overtime, allowances and breaks depend on time of day, day of week, consecutive hours, and what happened earlier in the roster.
- **It is retrospective when wrong**: Underpayments are recovered for the whole period they occurred, not from when they were found.

> Better off overall is a test, not a defence. Paying above the base rate does not discharge award obligations if the conditions — loadings, breaks, allowances — were not met.

## The workflow

```steps
Instrument identification :: Establish which award or agreement covers each role, and record the reasoning.
Rule encoding :: Translate the clauses into rules the system applies — rates, conditions, thresholds.
Classification mapping :: Map each employee to a classification level and pay point.
Interpretation :: Apply the rules to actual worked time, producing pay components.
Exception review :: Unusual results are reviewed before the pay run, not after.
Maintenance :: Rules are updated when the instrument changes, including the annual wage review.
```

## What you need in place

- **Coverage assessment**: Documented, per role, with the reasoning. This is the foundation and it is frequently assumed rather than established.
- **Encoded rules with provenance**: Each rule linked to the clause it came from, so it can be re-checked when the clause changes.
- **Accurate time capture**: Interpretation is only as good as the times it runs on.
- **Annual wage review handling**: Rates change from the first full pay period on or after 1 July; the system has to apply the change at the right boundary.
- **Independent verification**: Someone who did not encode the rules testing them against worked examples.

## Questions to ask

```qa
Coverage :: Which instrument covers each role, and who determined that? :: If it was assumed at implementation and never revisited, treat it as unverified.
Provenance :: Can we trace each pay rule back to a clause? :: Without this, no one can safely change a rule when the award changes.
Testing :: How do we prove the interpretation is right? :: Worked scenarios with known correct outcomes, run before go-live and after every rule change.
Change :: What happens when the award is varied? :: A named owner, a review cycle, and a testing pass — not an email nobody actions.
History :: Can we reproduce how someone was paid two years ago? :: Underpayment claims reach back. Rule versioning matters.
```

## Metrics and KPIs to track

```metrics
Interpretation exceptions :: Pay results flagged for review per cycle.
Manual adjustments :: Corrections applied outside the rules, a measure of where encoding is incomplete.
Rule changes per period :: How often the instrument moves, and whether the system keeps up.
Underpayment remediation value :: Value identified and repaid, with the period it covered.
```
