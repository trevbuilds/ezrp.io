---
slug: single-touch-payroll
source: authored
intro: >-
  Single Touch Payroll reports payroll to the ATO on or before each pay day, replacing the annual payment summary with an event that fires every cycle.
  It moves payroll compliance from a yearly reconciliation to something that has to be right forty times a year.
---

## Why it matters

Under STP the ATO sees what an employer pays as it happens, and employees see it in their income statement. There is no longer a year-end window in which to quietly correct things.

- **It is per pay run**: On or before pay day, not at year end.
- **It is visible to employees**: Income statements populate from what was reported, so an error becomes a question from staff.
- **It is cumulative**: Each submission reports year-to-date figures, so a correction restates rather than appends.

## The workflow

```steps
Pay run completion :: The pay run is finalised and net pay released.
Event construction :: A pay event is assembled — employee year-to-date gross, tax withheld, super liability, and the disaggregated components.
Submission :: The event is lodged through a compliant channel, on or before pay day.
Acknowledgement :: The ATO response is checked, not assumed.
Correction :: Errors are fixed by restating year-to-date figures in the next event, or with an update event.
Finalisation :: Year-end finalisation declaration marks the data as complete for income statements.
```

> An unacknowledged submission is an unlodged one. The failure mode is silent: the pay run worked, people were paid, and nothing tells the payroll team the event never landed.

## What you need in place

- **Disaggregated reporting**: STP Phase 2 requires gross to be broken into components — bonuses, allowances, overtime, paid leave — rather than a single figure.
- **Employment and income type coding**: Each employee classified correctly, which affects how the ATO treats their income.
- **A compliant channel**: Through the payroll system or an intermediary.
- **Acknowledgement monitoring**: Someone checking that each event was accepted.
- **A correction process**: Understood before it is needed, because the first correction always happens under time pressure.

## Questions to ask

```qa
Phase 2 :: Are we reporting disaggregated gross, or still a single figure? :: Phase 2 is not optional and the component split has to match how pay codes are configured.
Acknowledgements :: Who confirms each event was accepted? :: If the answer is nobody, assume some were not.
Corrections :: How do we restate a prior period? :: Year-to-date restatement, not an adjusting entry. Know which before you need it.
Terminations :: Does a final pay report correctly, including the reason code? :: Termination reporting drives what the employee can claim and when.
Closely held payees :: Do we have any, and are they reported on the right cycle? :: Concessional reporting exists but has to be elected deliberately.
```

## Metrics and KPIs to track

```metrics
On-time lodgement rate :: Pay events lodged on or before pay day.
Acknowledgement failures :: Events rejected or unacknowledged, by cause.
Correction events :: Update events per period, a measure of first-time accuracy.
Finalisation timeliness :: Days from year end to finalisation declaration.
```
