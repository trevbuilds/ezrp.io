---
slug: development-standards
source: authored
intro: >-
  Development standards decide what happens to customisation over a decade: whether it upgrades cleanly or quietly becomes the reason the upgrade is deferred.
  The cost of a standard is paid once; the cost of not having one is paid at every release.
---

## Why it matters

Every ERP is customised. The question is whether customisation is done in a way the vendor's upgrade path survives, and whether the next person can understand it.

- **It determines upgradeability**: Extensions built inside supported patterns survive; modifications to core do not.
- **It is an operating cost**: Undocumented customisation becomes a dependency on individuals.
- **It accumulates**: A standard applied late cannot retrospectively fix what was built before it.

## The workflow

```steps
Standard definition :: What may be extended, what may not be modified, and the approved patterns.
Design review :: Proposed changes assessed against the standard before build.
Build :: Implementation within the pattern, with documentation as part of done.
Code review :: A second person checks conformance as well as correctness.
Test and deploy :: Through environments, with automated checks where possible.
Register :: Every customisation recorded, with its reason and its owner.
```

> Record why, not just what. In three years the question will not be what this extension does — it will be whether the business reason still exists, and that is unanswerable without the reason.

## What you need in place

- **A written standard**: Including what is explicitly forbidden.
- **A customisation register**: Each item with a business reason and an owner.
- **Design review before build**: Cheaper than review after.
- **Environment discipline**: No changes made directly in production.
- **Upgrade impact assessment**: Per customisation, refreshed each release.

## Questions to ask

```qa
Core modification :: Do we modify core objects, and who approved that? :: This is the decision that makes upgrades expensive.
Register :: Can we list every customisation with its reason? :: Without it, upgrade impact is unknowable.
Review :: Is there a design review before build? :: Post-build review finds the same problems more expensively.
Documentation :: Is it part of done, or a follow-up task? :: Follow-up tasks do not happen.
Retirement :: Do we ever remove customisation? :: Estates that only add become unupgradeable.
```

## Metrics and KPIs to track

```metrics
Customisation count :: By type, trending.
Standard conformance :: Changes passing design review first time.
Upgrade impact :: Customisations requiring rework per release.
Documentation completeness :: Register entries with reason and owner.
Undocumented changes :: Found in audit.
```
