---
slug: integration
source: authored
intro: >-
  Integration is the spine that decides which system owns which data and how the rest find out about it.
  It is an architectural commitment, not a technical preference, and it outlives every application it connects.
---

## Why it matters

Integration architecture is one of the decisions that compounds. Point-to-point connections are quick and become an estate nobody can change; a pattern is slower to establish and keeps being cheap.

- **It encodes ownership**: Which system is the source of truth for each data class.
- **It determines changeability**: Replacing a system is easy or impossible depending on how it was connected.
- **Its failures are silent**: An interface that stops running usually announces itself through a business consequence, not an alert.

## The workflow

```steps
Data ownership :: Each data class assigned a single owning system.
Pattern selection :: Batch, event, API or file chosen per interface with a reason.
Specification :: Payload, frequency, volumes, error handling and reprocessing agreed.
Build and test :: Including the failure cases, not only the happy path.
Monitoring :: Every interface observed, with alerting on failure and on silence.
Change management :: Versioning, so a change at one end does not break the other.
```

> Alert on silence, not only on failure. An interface that stops running produces no errors at all, and that is the failure mode that runs longest before anyone notices.

## What you need in place

- **A catalogue**: Every interface, its owner, and what depends on it.
- **A data ownership model**: Agreed, and enforced through the patterns.
- **Standard patterns**: So the twentieth interface is like the first.
- **Error handling and reprocessing**: Defined per interface, including who works the queue.
- **Environment parity**: Testing an interface against a non-representative environment proves little.

## Questions to ask

```qa
Ownership :: Which system owns each data class? :: Without this, integration is negotiation each time.
Silence :: Would we know if an interface simply stopped? :: Most estates would not.
Reprocessing :: What happens to a failed message? :: A queue with no owner accumulates quietly.
Versioning :: How do we change a payload without breaking consumers? :: Decide before the first change, not during.
Point-to-point :: How many direct connections do we have? :: The count is the measure of how hard the next replacement will be.
```

## Metrics and KPIs to track

```metrics
Interface success rate :: Scheduled runs completing without intervention.
Time to detect failure :: Failure to someone knowing.
Error queue age :: Unprocessed messages, by interface.
Point-to-point count :: Direct connections, as a complexity measure.
Interfaces without an owner :: The number that should be zero.
```
