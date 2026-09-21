---
slug: environment-and-deployment-management
source: authored
intro: >-
  Environment management decides whether a test result means anything.
  A test passed in an environment unlike production proves only that it passed there.
---

## Why it matters

Environments are usually treated as infrastructure and behave like a control. Configuration drift between them is what makes cutover unpredictable.

- **It determines test validity**: Representative data and configuration, or the test is theatre.
- **It is the deployment path**: How a change reaches production, and how it is backed out.
- **It carries data risk**: Production data copied into test is production data with weaker controls.

## The workflow

```steps
Environment definition :: What each environment is for, and what it must resemble.
Refresh :: Production-like data and configuration restored on a cycle, with sensitive data masked.
Change promotion :: Changes move through environments in one direction, never sideways.
Release packaging :: What is being deployed, recorded and repeatable.
Deployment :: Executed with a tested rollback.
Verification :: Post-deployment checks confirming what was intended actually happened.
```

> Mask production data on refresh. A full copy of production in a test environment is the same data with fewer controls and more people able to see it.

## What you need in place

- **A defined environment set**: Development, test, training, pre-production and production, each with a purpose.
- **Refresh cadence**: Frequent enough that drift stays small.
- **Data masking**: For anything personal or commercially sensitive.
- **One-way promotion**: Changes never applied directly to production.
- **Rollback tested**: Not documented — tested.

## Questions to ask

```qa
Parity :: How close is pre-production to production, measured? :: Drift is what makes cutover surprising.
Masking :: Is personal data masked in non-production? :: Usually not, and it is usually a privacy breach waiting.
Direct change :: Can anyone change production directly? :: If yes, no other control holds.
Rollback :: When did we last test a rollback? :: Untested rollback is a plan, not a capability.
Refresh :: How long since environments were refreshed? :: Stale environments produce misleading tests.
```

## Metrics and KPIs to track

```metrics
Environment drift :: Configuration differences from production.
Deployment success rate :: Deployments needing no intervention or rollback.
Refresh currency :: Time since last environment refresh.
Emergency changes :: Applied outside the normal path.
Rollback test currency :: Time since rollback was last exercised.
```
