---
slug: cutover-and-go-live
source: authored
intro: >-
  Cutover is the execution of the switch: a sequenced plan run against the clock, with checkpoints, a command structure and a defined point beyond which there is no going back.
  It is a logistics exercise more than a technical one.
---

## Why it matters

Most cutover failures are not technical. They are a task that took three times as long, a dependency nobody sequenced, a person who was unreachable, or a decision nobody had the authority to make at 3am on a Sunday.

- **Sequence is the whole design**: Data cannot load before configuration, interfaces cannot run before data, users cannot be released before validation.
- **The window is fixed**: Contingency has to be in the plan, not in hope.
- **People are the constraint**: A forty-hour weekend needs shifts, handovers and someone awake.

## The workflow

```steps
Freeze :: Changes to the legacy system stop; the cut-off is communicated and enforced.
Final extract :: Data taken from source at a known point, with counts and control totals.
Load and reconcile :: Data loaded to target and reconciled against those totals before proceeding.
Configuration and access :: Production configuration confirmed and access provisioned from the position data.
Interface enablement :: Feeds switched to the new system in dependency order.
Business validation :: Scripted transactions run by the business, and signed.
Release :: Users given access, legacy access removed, hypercare begins.
```

> Set the point of no return explicitly, with a time and an owner. The worst position in a cutover is discovering a problem when rollback is no longer viable and nobody had decided that it had passed.

## What you need in place

- **A minute-level plan for the critical path**: Everything else can be hourly.
- **Control totals agreed before extract**: Reconciliation needs a number both sides accept.
- **A command centre and a contact tree**: Including escalation to someone who can decide.
- **Shift cover**: Nobody makes good decisions at hour thirty.
- **Legacy access removal**: Dual running by accident is how two ledgers diverge.
- **A communication plan**: Users told what is unavailable, when, and what to do instead.

## Questions to ask

```qa
Critical path :: What is on it, and what is the contingency? :: If contingency is zero, the plan is a forecast.
Reconciliation :: What totals must agree before we proceed? :: Agreed beforehand, or the argument happens at 2am.
Point of no return :: When is it, and who declares it? :: It should be a scheduled decision, not a realisation.
Authority :: Who can make a call during cutover without convening anything? :: Someone must, and everyone must know who.
Legacy :: When does legacy access stop? :: Leaving it open guarantees transactions in the wrong system.
Failure :: What is the plan if a load fails halfway? :: Restart points should be designed into the sequence.
```

## Metrics and KPIs to track

```metrics
Plan adherence :: Tasks completed within their planned window.
Critical path slip :: Cumulative variance against the window.
Reconciliation exceptions :: Items not agreeing between source and target, and their value.
Defects at go-live :: By severity, raised during the cutover window.
Time to first transaction :: Release to first successful business transaction.
```
