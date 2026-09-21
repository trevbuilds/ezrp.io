---
slug: go-live-toolkit
source: authored
intro: >-
  Cutover and go-live is the sub-module holding everything needed to move from the old system to the new one in a defined window, with a way back.
  It is the most rehearsed part of a programme because it is the least forgiving.
---

## Why it matters

Every other part of the programme can slip a week. Cutover cannot: the window is usually fixed by a period end, a payroll date or a contract expiry, and the organisation has to keep operating through it.

- **It is time-boxed and irreversible in practice**: Rollback is technically possible and organisationally awful.
- **It is where everything converges**: Data, interfaces, access, training and the business calendar all land in the same weekend.
- **It is what users experience**: The programme is judged on the first week, regardless of the eighteen months before it.

## The workflow

```steps
Strategy :: Big bang or phased, decided on risk and on what the business can absorb.
Planning :: Every task, in sequence, with duration, owner and dependency.
Rehearsal :: The plan executed end to end against production-like data, more than once.
Readiness assessment :: Objective criteria assessed at a gate, with a genuine no-go option.
Execution :: The plan run to the clock, with a command structure and fixed checkpoints.
Verification :: Business validation before the system is released to users.
Hypercare :: Elevated support until the first full cycle — including the first period close — has run.
```

> Rehearse until the timings stop changing. The purpose of a dress rehearsal is not to prove it works; it is to find the tasks that take four hours when the plan said one.

## What you need in place

- **A task-level plan**: With durations from rehearsal, not from estimation.
- **Go/no-go criteria agreed in advance**: Set while nobody is under pressure to say yes.
- **A rollback plan with a decision point**: And the last time at which it can still be taken.
- **A command structure**: Who directs, who decides, and how people are contacted.
- **Business validation scripts**: Real transactions the business runs before accepting.
- **Hypercare cover through the first close**: Not through the first week.

## Questions to ask

```qa
Window :: What fixes the date, and what is the cost of moving it? :: Dates set for convenience should move; dates set by a statutory deadline should not.
Rehearsal :: How many full rehearsals, and did the timings converge? :: Diverging timings mean the plan is not ready.
No-go :: Who can say no, and what would make them? :: If nobody can, the gate is decorative.
Rollback :: Until when can we go back, and who decides? :: The point of no return should be on the plan.
Validation :: What must the business confirm before users get access? :: Technical success is not business acceptance.
Hypercare :: Does cover extend through the first period close? :: The first close is where the real defects appear.
```

## Metrics and KPIs to track

```metrics
Rehearsal variance :: Planned against actual task durations, by rehearsal.
Critical path duration :: Against the available window, with contingency.
Readiness criteria met :: At each gate, by workstream.
Data reconciliation :: Balances and counts agreed between source and target.
Hypercare volume :: Tickets per day, by severity, trending.
Business validation pass rate :: Scripts passed before release to users.
```
