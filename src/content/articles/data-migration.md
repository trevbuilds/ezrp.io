---
slug: data-migration
source: authored
intro: >-
  Migration moves data from the system being replaced into the one replacing it, and decides what history survives.
  It is consistently under-estimated, consistently on the critical path, and the single most common cause of a delayed go-live.
---

## Why it matters

Migration is where the quality of twenty years of data becomes everyone's problem at once. It is also where the cutover either works or does not.

- **It is the critical path**: Every dress rehearsal depends on it, and it is usually the last thing ready.
- **It exposes quality**: Data that was tolerable in the old system fails validation in the new one.
- **It sets the opening position**: The new ledger opens on these numbers, and they have to reconcile to the old one.

## The workflow

```steps
Scope :: What migrates, what is archived, and what is deliberately left behind.
Profiling :: The real state of source data assessed, not assumed.
Cleansing :: Issues fixed at source where possible, because fixing in transit hides the problem.
Mapping :: Source fields mapped to target, with transformation rules recorded.
Trial loads :: Repeated, timed, with results reconciled.
Reconciliation :: Balances and counts agreed between source and target, signed off.
Cutover load :: The real load, within the cutover window.
```

> Decide what history you are not taking, early and explicitly. The instinct is to take everything; the cost of taking everything is usually discovered too late to reverse.

## What you need in place

- **Profiling before estimating**: Scope set on what the data actually looks like.
- **Cleansing owned by the business**: IT cannot decide which duplicate customer is real.
- **Reconciliation criteria agreed in advance**: What "successfully migrated" means, numerically.
- **Repeatable, timed loads**: The cutover window is finite.
- **A rollback position**: What happens if the load fails at hour six.

## Questions to ask

```qa
History :: How much history are we taking, and why that much? :: The answer should be a decision, not a default.
Profiling :: Have we profiled the actual data, or assumed? :: Assumption is why migration estimates are wrong.
Cleansing :: Who owns fixing data quality? :: If it is IT, it will not get fixed, only transformed.
Reconciliation :: What are the sign-off criteria, and who signs? :: Agree before the first trial load.
Timing :: How long does a full load take, measured? :: It has to fit the window, with contingency.
```

## Metrics and KPIs to track

```metrics
Trial load success :: Loads completing without manual intervention.
Load duration :: Measured against the cutover window.
Reconciliation variance :: Source against target, by object.
Data quality defects :: Open, by severity and owner.
Records rejected :: Per load, with reasons.
```
