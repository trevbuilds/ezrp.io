---
slug: business-intelligence
source: authored
intro: >-
  Business intelligence is the layer people actually see: the dashboards, the reports, the numbers quoted in meetings.
  Its quality is judged by whether the numbers are believed, which depends far more on definitions than on visualisation.
---

## Why it matters

BI is where data either earns trust or loses it. It is also where the same measure most often appears with different values, because each report was built by someone solving their own problem.

- **It is the visible surface**: Everything upstream is judged by it.
- **Duplication is the failure mode**: Six dashboards with five definitions of revenue.
- **Adoption is the measure**: An unopened report is an unrealised cost.

## The workflow

```steps
Question definition :: What decision the report supports, and who makes it.
Measure selection :: Metrics chosen from the register rather than invented.
Build :: The report or dashboard constructed against the shared model.
Validation :: Numbers checked against the source of truth before release.
Publication :: Released with owner, definitions and as-at date visible.
Review :: Usage monitored; unused reports retired rather than accumulated.
```

> Retire reports. A BI estate that only grows becomes a maintenance burden where nobody knows which of the four similar dashboards is current.

## What you need in place

- **Definitions from the register**: Not re-derived per report.
- **A certified layer**: Reports that have been validated, distinguished from ad hoc exploration.
- **Self-service with guard rails**: People can explore, but certified numbers stay certified.
- **Usage telemetry**: So retirement is evidence-based.
- **An owner per report**: Named, and asked annually whether it is still needed.

## Questions to ask

```qa
Certification :: Can a user tell a validated report from someone's experiment? :: If not, all of them get quoted as fact.
Duplication :: How many reports show revenue, and do they agree? :: Check before trusting any.
Usage :: Which reports are opened, and by whom? :: Most estates have a long tail nobody uses.
Definitions :: Do report measures come from the register? :: Otherwise the register is decorative.
Performance :: How fresh is the data behind the dashboard? :: Users assume live unless told otherwise.
```

## Metrics and KPIs to track

```metrics
Certified coverage :: Key measures available in a validated report.
Report usage :: Opens per report, with the unused tail identified.
Definition conformance :: Reports using register definitions.
Data freshness :: Lag between event and availability.
```
