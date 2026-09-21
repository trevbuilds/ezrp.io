---
slug: time-and-attendance
source: authored
intro: >-
  Time and attendance is the bridge between what people actually did and what the organisation pays and books for it.
  In award-driven environments it is also where most payroll error, and most underpayment exposure, originates.
---

## Why it matters

- **Pay accuracy**: Almost every payroll defect traces back to a time or interpretation defect.
- **Compliance**: Award and agreement conditions are applied here, at shift level, thousands of times a period.
- **Cost control**: Overtime, penalties and agency use are visible before they are paid, not after.
- **Coverage and safety**: Fatigue rules, minimum breaks and skill coverage are enforceable only if time is captured.
- **Costing**: Worked time is how labour reaches projects, work orders and assets.
- **Evidence**: A defensible record of hours worked is the first thing asked for in a dispute.

## The basic time and attendance workflow

The chain runs from planned demand to payable hours. Each hand-off is a place where accuracy is either preserved or lost.

```steps
Roster built and published :: Shifts are planned against demand, availability, skills and rule constraints, then published to employees.
Time captured :: Actual attendance is recorded at the point of work rather than reconstructed later.
  - Clock, kiosk or biometric terminal on site.
  - Mobile capture, often with geofencing, for field work.
  - Timesheet entry for salaried and project-based populations.
Exceptions raised :: Missed punches, unplanned absence, early and late starts and unapproved overtime are flagged automatically.
Correction :: The employee or manager resolves exceptions against the roster and the actual event.
Manager approval :: The person accountable for the cost approves the time before it becomes payable.
Award interpretation :: Approved raw time is converted into payable hours under the applicable rule set.
  - Ordinary hours separated from overtime.
  - Penalties applied by day, time of day and shift pattern.
  - Allowances, higher duties and on-call applied.
Leave reconciled :: Absence is matched to approved leave and offset against balances.
Payroll export :: Payable hours are transferred to payroll before the input cut-off, with a reconciliation of what was sent.
Cost allocation and reporting :: Hours and cost are allocated to cost centres, projects or work orders and reported.
```

## How a business implements it

### For small businesses

- **Simple capture**: Use a mobile or kiosk app that feeds payroll directly rather than paper timesheets.
- **One rule set**: Configure the single applicable award properly before adding anything else.
- **Approve weekly**: Keep approval close to the work so memory is still reliable.

### For medium-sized enterprises

- **Rostering and time together**: Plan and capture in the same system so variance to roster is visible.
- **Exception-based management**: Only differences should reach a manager's queue.
- **Interface to payroll**: Automate the export and reconcile it every cycle.

### For large enterprises

- **Multiple instruments**: Support several awards, agreements and local policies with versioned effective dates.
- **Fatigue and safety rules**: Enforce break, rest and maximum-hours constraints at roster and approval time.
- **Costing integration**: Allocate time to projects, work orders and assets, not just cost centres.
- **Assurance**: Re-test interpretation against real historical shifts whenever rules change.

> Treat interpretation as a controlled asset. Rules are configuration that determines legal payment outcomes, so they need version control, a named owner and regression tests against known shift patterns — the same discipline as any other financial calculation.

## What solutions are out there?

Solutions range from lightweight capture apps to full workforce management platforms that roster, interpret and cost.

- **UKG (Kronos) Dimensions**: Enterprise workforce management with deep rule and rostering capability.
- **Humanforce**: Australian workforce management strong in shift-based and award-driven industries.
- **Deputy**: Rostering and time capture for small to mid-size shift workforces.
- **Tanda**: Australian time, rostering and award interpretation feeding payroll.
- **WorkForce Software**: Complex time, absence and fatigue rules at enterprise scale.
- **Oracle Time and Labor**: Native time capture and interpretation inside Fusion HCM.
- **SAP Time Management**: Time evaluation integrated with SuccessFactors and payroll.
- **Ceridian Dayforce**: Time and pay calculated continuously on one record.

Selection depends on how complex the rules are, whether the workforce is shift-based, and what the payroll engine can already consume.

## Configuring the solution

Each step has questions to answer and a rough plan that follows from the answers.

```qa
Confirm the population and capture method :: Who must capture time, and where are they physically when they work? :: Segment the workforce by work location and employment type, and choose a capture method per segment rather than one for all.
Define the rule set :: Which awards, agreements and policies apply, and who owns each interpretation? :: Document every rule with a worked example and a named owner, and version each rule set by effective date.
Design rosters against demand :: What drives demand, and what constrains who can fill a shift? :: Model demand drivers, then configure skill, availability, fatigue and cost constraints into the roster build.
Set exception tolerances :: What variance is acceptable without a manager decision? :: Configure rounding and grace tolerances explicitly, and confirm they are lawful under the applicable instrument.
Design approval :: Who approves time, and what happens when they do not? :: Route approval to the cost owner, with escalation and a defined default that never silently pays unapproved hours.
Configure interpretation :: How are ordinary hours, overtime, penalties and allowances derived? :: Build and test the rule engine against real historical shifts, including edge cases like shift crossing midnight and public holidays.
Handle the leave interaction :: How does absence interact with rostered hours and accrual? :: Define how each leave type consumes rostered time and accrues, and test part-day and part-time cases.
Map cost allocation :: Where must hours land beyond the cost centre? :: Configure allocation to projects, work orders or assets and confirm the receiving system can accept it.
Integrate with payroll and HR :: What is the interface contract and the cut-off? :: Define the export format, timing, reconciliation report and reprocessing path for late or corrected time.
Test with real pay scenarios :: Have the hardest shift patterns been tested end to end into a payslip? :: Build a scenario library from actual rosters and verify the payslip outcome, not just the interpreted hours.
Monitor and optimise :: Which exceptions recur, and why? :: Report exceptions by cause and site each period, and fix the roster, the rule or the behaviour that generates them.
```

## Metrics and KPIs to track

```metrics
Timesheet on-time rate :: Time submitted and approved before the payroll cut-off.
Exception rate :: Shifts requiring manual intervention before they can be paid.
Manual edit rate :: Captured records changed after the fact, by reason.
Interpretation defect rate :: Shifts paid incorrectly under the applicable rule set.
Approval cycle time :: Shift end to manager approval.
Roster-to-actual variance :: Hours worked against hours rostered.
Overtime ratio :: Overtime hours as a share of ordinary hours.
Unplanned absence rate :: Rostered shifts lost to unplanned absence.
Agency and backfill cost :: Cost of covering unfilled shifts.
```
