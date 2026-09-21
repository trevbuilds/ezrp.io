---
slug: integration-catalogue
source: authored
intro: >-
  The integration catalogue is the list of every interface, what it carries, who owns it, and what depends on it.
  Organisations that cannot produce one cannot safely replace any system.
---

## Why it matters

The catalogue is the thing you need before a replacement, not after. Without it, impact assessment is guesswork and discovery happens during testing.

- **It scopes replacement**: You cannot estimate replacing a system without knowing what connects to it.
- **It locates ownership**: Interfaces without an owner decay.
- **It reveals complexity**: The count itself is the honest measure of how tangled the estate is.

## The workflow

```steps
Discovery :: Interfaces found, including the undocumented and the scheduled scripts nobody claims.
Recording :: Source, target, payload, pattern, frequency, volume and owner captured.
Dependency mapping :: What business process fails when this stops.
Ownership assignment :: A named person per interface, on both sides.
Review :: Revisited on a cycle, and whenever a system changes.
Retirement :: Interfaces decommissioned deliberately when their purpose ends.
```

> The interfaces that hurt are the ones nobody knew existed — a scheduled script on someone's machine, a nightly extract set up years ago for a report that still circulates.

## What you need in place

- **A discovery method**: Network, scheduler, database links and file drops, not just documentation.
- **A consistent record**: The same fields for every interface, so the catalogue is comparable.
- **Business impact per interface**: What breaks, expressed in business terms.
- **Two owners**: Technical and business, on each side.
- **A review cycle**: Catalogues decay faster than the estates they describe.

## Questions to ask

```qa
Completeness :: How confident are we that the catalogue is complete? :: Undocumented interfaces are the ones that surface at cutover.
Impact :: For each interface, what fails if it stops? :: Expressed in business terms, not technical ones.
Ownership :: Does every interface have a named owner on both sides? :: Orphaned interfaces are the ones that break silently.
Shadow integration :: Do we know about spreadsheets and scripts moving data? :: They count, and they are usually excluded.
Currency :: When was the catalogue last verified? :: Documentation drifts; verify rather than trust.
```

## Metrics and KPIs to track

```metrics
Catalogue coverage :: Known interfaces against those discovered in audit.
Ownership coverage :: Interfaces with a named owner both sides.
Catalogue currency :: Time since last verification.
Retirement rate :: Interfaces decommissioned per period.
```
