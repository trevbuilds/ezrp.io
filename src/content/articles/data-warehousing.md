---
slug: data-warehousing
source: authored
intro: >-
  The warehouse consolidates data from systems that were never designed to agree with each other.
  Its hard problems are conformance and history: making a customer mean one thing everywhere, and keeping what things looked like before they changed.
---

## Why it matters

Operational systems answer what is true now. Reporting needs what was true then, across sources, on consistent definitions. That is a different job and it needs its own structure.

- **Conformance is the work**: The same customer, product and cost centre across every source.
- **History has to be deliberate**: Operational systems overwrite; the warehouse decides what to keep.
- **It is a dependency**: When it is late, every report downstream is stale.

## The workflow

```steps
Extraction :: Data pulled from sources on a defined cycle.
Landing :: Raw data retained as received, before any transformation.
Conformance :: Keys and reference data reconciled to shared dimensions.
Transformation :: Business rules applied to produce the reporting model.
Historisation :: Changes captured so past states are reconstructable.
Publication :: Made available with lineage and an as-at date.
```

> Keep the raw landing layer. When a number is disputed, being able to show exactly what the source sent — before any transformation — resolves it in minutes rather than days.

## What you need in place

- **Conformed dimensions**: Customer, product, employee, cost centre, agreed once.
- **Slowly changing dimension handling**: Decided per dimension, deliberately.
- **Lineage**: Where a number came from and what was applied.
- **Load monitoring**: Failures visible before users notice.
- **Retention policy**: What is kept, how long, and under what obligation.

## Questions to ask

```qa
Conformance :: Does customer mean the same thing across sources? :: If not, cross-source reporting is fiction.
History :: Which dimensions track change, and which overwrite? :: Decide before, because you cannot recover history not kept.
Lineage :: Can we trace a reported number to its source record? :: Required for any dispute.
Failure :: How do we know a load failed? :: Silent failure means confident reporting on stale data.
Retention :: What are we obliged to keep, and for how long? :: Both over- and under-retention carry risk.
```

## Metrics and KPIs to track

```metrics
Load success rate :: Scheduled loads completing without intervention.
Load latency :: Source event to availability.
Conformance rate :: Records matching a conformed dimension.
Reconciliation variance :: Warehouse against source system.
```
