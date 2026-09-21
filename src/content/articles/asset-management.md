---
slug: asset-management
source: authored
intro: >-
  Fixed asset accounting tracks capitalised items from acquisition through depreciation to disposal, and keeps the asset register agreeing to the general ledger.
  It is low-volume, high-value, and easy to get quietly wrong for years.
---

## The asset lifecycle

```steps
Acquisition :: Asset purchased or constructed, with costs accumulated against a capital project or work order.
Capitalisation :: Costs meeting the policy threshold are capitalised; the rest are expensed. The asset is placed in service.
Depreciation :: Cost allocated over useful life on the chosen method, run and posted each period.
Revaluation or impairment :: Carrying value adjusted where the accounting framework requires it.
Transfer :: Asset moves cost centre, location or entity, with the register updated.
Disposal :: Asset sold, scrapped or written off, with gain or loss recognised and the register retired.
```

## Decisions that shape the design

```qa
Capitalisation policy :: What is the threshold, and does it apply per item or per group? :: Set a documented threshold with clear treatment for bulk purchases of individually low-value items, and configure it in the system rather than relying on judgement.
Asset categories and useful lives :: How granular are categories, and what default life and method does each carry? :: Define categories that align to how the business reports and to tax requirements, each with a default method and life that can be overridden with approval.
Multiple books :: Do you need separate accounting, tax and possibly regulatory depreciation? :: Configure parallel books early. Retrofitting a tax book across an existing register is expensive and error-prone.
Work in progress :: How do costs accumulate before an asset is placed in service? :: Use a capital work-in-progress account fed from projects, with a defined trigger and approval for capitalisation.
Componentisation :: Are major components with different lives tracked separately? :: Split components where the framework requires it — common for infrastructure and property — and accept the added register volume.
Physical verification :: How often is the register checked against reality? :: Schedule counts by category and value, and define how discrepancies are investigated and written off.
```

> The register drifting from physical reality is the classic failure. Assets scrapped but never retired keep depreciating, and assets in service but never capitalised understate the balance sheet. Neither shows up in a ledger reconciliation, because both sides are internally consistent.

## Reconciliation to the ledger

- **Cost**: Register gross cost agrees to the asset control accounts.
- **Accumulated depreciation**: Register accumulated depreciation agrees to the contra accounts.
- **Depreciation expense**: Period depreciation posted matches the register's calculated charge.
- **Additions and disposals**: Movements in the period reconcile to capital spend and disposal proceeds.

## Metrics and KPIs to track

```metrics
Register to ledger variance :: Difference between asset register and control accounts at period end.
Work in progress ageing :: Value sitting in capital WIP beyond a defined age without capitalisation.
Fully depreciated assets still in use :: A signal that useful lives no longer reflect reality.
Physical verification coverage :: Share of asset value verified in the last cycle.
Disposal processing time :: Days from physical disposal to retirement in the register.
```
