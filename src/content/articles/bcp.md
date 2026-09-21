---
slug: bcp
source: authored
intro: >-
  Business continuity is the business half of resilience: how the organisation keeps operating when a system, a site or a supplier is unavailable.
  Disaster recovery restores the system; continuity is what people do in the meantime.
---

## Why it matters

Most outages are survivable if someone has decided in advance how the work continues. Most become crises because that decision is being made during the outage.

- **It is about people and process**: Manual workarounds, alternate sites, delegated authority.
- **It has to be practised**: A plan nobody has rehearsed is a document.
- **It covers suppliers too**: A critical supplier's outage is your outage.

## The workflow

```steps
Impact analysis :: Critical processes identified, with maximum tolerable outage for each.
Dependency mapping :: What each process needs — systems, people, sites, suppliers.
Strategy :: How each process continues: manual, alternate site, alternate supplier, or deferral.
Plan documentation :: Written so someone unfamiliar can follow it.
Exercise :: Rehearsed, including the decision-making, not just the logistics.
Review :: Updated as processes and dependencies change.
```

> Rehearse the decision, not only the procedure. Most continuity failures are not people unable to execute — they are people unsure who has authority to invoke the plan.

## What you need in place

- **Criticality assessment**: Agreed by the business, not assumed by IT.
- **Manual workarounds documented**: For processes that must continue regardless.
- **Delegated authority**: Who can invoke, and who decides to return to normal.
- **Communications plan**: Including how to reach people when the usual channel is the thing that is down.
- **Supplier continuity**: For critical dependencies, evidenced rather than assumed.

## Questions to ask

```qa
Invocation :: Who decides to invoke, and does everyone know? :: Ambiguity here costs hours.
Workarounds :: Can payroll run if the system is unavailable? :: For pay and safety-critical processes the answer must be yes.
Exercises :: When did we last rehearse, and what failed? :: An exercise where nothing fails was not an exercise.
Suppliers :: Have critical suppliers evidenced their own continuity? :: Contractual assurance is not evidence.
Communications :: How do we reach people if the usual systems are down? :: Contact lists inside the affected system are useless.
```

## Metrics and KPIs to track

```metrics
Plan coverage :: Critical processes with a current documented plan.
Exercise currency :: Time since the last exercise, by process.
Findings closed :: Actions from exercises completed.
Supplier assurance :: Critical suppliers with evidenced continuity.
```
