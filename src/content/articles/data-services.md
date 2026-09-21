---
slug: data-services
source: authored
intro: >-
  Data and analytics is where operational activity becomes evidence someone decides on.
  Its defining problem is not technology — it is that two reports of the same measure disagree, and nobody owns which one is right.
---

## Why it matters

Every other module produces data. This one decides what it means. Without ownership and definitions, an organisation ends up with several versions of its own performance and an argument at every meeting.

- **Definitions are the product**: A metric without an agreed calculation is a source of dispute.
- **Trust is binary**: Once a report is caught being wrong, it stops being used regardless of later fixes.
- **It outlives projects**: Data investment pays back across programmes; it is also the first thing cut.

## The workflow

```steps
Source contract :: Owner, meaning, frequency and quality promise agreed for each source.
Ingestion :: Data received on a controlled cycle, with failures visible.
Quality rules :: Completeness and validity tested, with failures going to a worked queue.
Modelling :: A shared representation the business recognises.
Metric definition :: Calculation and meaning agreed and recorded.
Publication :: Presented where the decision happens, with the as-at date visible.
```

> Put the as-at date on every report. Most disputes about whether a number is wrong turn out to be disputes about when it was taken.

## What you need in place

- **Domain ownership**: A named owner per data domain, accountable for quality.
- **A metric register**: Definition, calculation and owner, visible to anyone using the number.
- **A worked exception queue**: Quality failures that someone actually resolves.
- **Reconciliation to source**: Particularly finance, where the ledger is the arbiter.
- **Access control**: Especially for person and customer data.

## Questions to ask

```qa
Ownership :: Who owns each data domain? :: If the answer is IT, nobody owns meaning.
Definitions :: Where is the metric register, and who maintains it? :: Without one, every report is a new negotiation.
Reconciliation :: Does reporting reconcile to the ledger? :: If not, two numbers circulate and one is wrong.
Quality :: What happens when a quality rule fails? :: A queue nobody works is a rule that does not exist.
Timeliness :: How stale is the data when decisions are made on it? :: Daily reporting on a weekly feed is a trap.
```

## Metrics and KPIs to track

```metrics
Quality rule pass rate :: By domain and source.
Exception queue age :: How long failures wait to be resolved.
Metric register coverage :: Reported measures with an agreed definition and owner.
Reconciliation variance :: Reporting against the ledger.
Report usage :: Which reports are actually opened.
```
