---
slug: core-hr
source: authored
intro: >-
  Core HR is the system of record for people — the employee master, the position and reporting structure, and the effective-dated history that payroll, time, access and finance all read from.
  An error entered once here is inherited by every system downstream of it.
---

## Why it matters

- **One record**: Every downstream process reads the same employee, or they disagree in public.
- **Effective dating**: Pay, access and reporting depend on what was true on a date, not what is true today.
- **Cost visibility**: Position, cost centre and assignment are how labour cost reaches the ledger.
- **Access and risk**: Joiner, mover and leaver events drive provisioning and revocation.
- **Compliance**: Right-to-work, qualifications and mandatory training all hang off the master record.
- **Analytics**: Headcount, turnover and capability reporting are only as good as the master.

## The core HR workflow

The sequence below is the joiner-mover-leaver spine. Every HR module is either feeding it or reading from it.

```steps
Position established :: A funded seat exists before anyone is hired into it.
  - Legal entity, business unit and cost centre are set.
  - Grade, job family and delegation limit are attached.
  - The position is released as a vacancy, not invented at offer stage.
Candidate hired :: The accepted offer becomes a hire event with a start date.
Employee record created :: Personal, employment and payment data is captured once, with the source document retained.
Assignment and reporting line set :: The person is attached to the position, the manager and the cost centre.
Access provisioned :: Identity, role-based access and physical access are raised from the hire event, not by email.
Entitlements initialised :: Pay rate, leave accrual rules, benefits eligibility and superannuation are established.
Change events processed :: Promotions, transfers, rate changes and hours changes are recorded as effective-dated changes rather than overwrites.
Organisational change absorbed :: Restructures move positions and reporting lines without breaking history.
Termination and retention :: The leaver event triggers final pay, access revocation, asset return and the retention clock.
```

## How a business implements it

### For small businesses

- **One system**: Keep the employee master inside the payroll platform rather than running a spreadsheet beside it.
- **Minimum viable data**: Capture only the fields that drive pay, leave and compliance.
- **Self-service early**: Let employees maintain their own contact and bank details from day one.

### For medium-sized enterprises

- **Position management**: Move from person-based to position-based structure so vacancies and budgets are visible.
- **Manager self-service**: Push change events to the manager who owns the decision, with approval routing.
- **Integration**: Make HR the upstream source for payroll, time, identity and finance.

### For large enterprises

- **Global core model**: One global template with local extensions for country-specific legal and payroll data.
- **Effective-dated everything**: Support retrospective and future-dated changes across all downstream interfaces.
- **Data governance**: Named ownership per field, with a correction process rather than ad hoc edits.
- **Identity integration**: Drive joiner-mover-leaver into the identity platform automatically.

> Whatever the size, decide first which system is the master for people data and make every other system a subscriber. Most HR failures are not feature gaps — they are two systems both believing they are the source of truth.

## What solutions are out there?

Core HR is usually bought as part of a suite. The real selection criterion is how well it carries effective-dated change out to payroll, time and identity.

- **SAP SuccessFactors Employee Central**: Strong global core model with position management and country extensions.
- **Workday HCM**: Unified worker model with deep effective dating and reporting.
- **Oracle Fusion HCM**: Full suite core HR that sits natively beside Fusion finance.
- **Dynamics 365 Human Resources**: Core HR on Dataverse, typically paired with a partner payroll.
- **Cornerstone**: Talent-led suite with core HR, learning and performance in one record.
- **Ceridian Dayforce**: Single record across HR, time and payroll, calculated continuously.
- **Employment Hero**: Small to mid-market Australian platform combining HR, payroll and onboarding.
- **ELMO**: Australian mid-market suite spanning core HR, recruitment and learning.

Selection depends on headcount complexity, the number of countries and awards in scope, and what the payroll and identity platforms already are.

## Configuring the solution

Each step has questions to answer and a rough plan that follows from the answers.

```qa
Define the organisation model :: What are the legal entities, business units and cost centres, and who owns each level? :: Agree one hierarchy that finance and HR both accept, and confirm it reconciles to the general ledger structure.
Decide the employee data model :: Which fields drive a downstream outcome, and which are being collected out of habit? :: Keep fields that drive pay, entitlement, access or a legal obligation. Retire the rest rather than migrating them.
Set effective dating rules :: How far back may a change be dated, and who may do it? :: Define retrospective and future-dated limits, and confirm each downstream interface can consume both.
Design position management :: Is the structure position-based or person-based, and is a position funded before it is filled? :: Adopt position-based structure where headcount control matters, and link position to budget and delegation.
Map joiner, mover and leaver events :: What must happen automatically on each event, and what genuinely needs a human? :: Document each event end to end, including access, assets, pay and notification, then automate the deterministic parts.
Define security and data access :: Who may see and change which fields, for which population? :: Configure role-based access by population and field sensitivity, and separate the ability to change pay from the ability to approve it.
Design self-service :: Which transactions belong to the employee, the manager and HR? :: Push routine change to the person who owns the fact, with approval routing that matches the delegation of authority.
Plan integrations :: Which systems subscribe to the employee master, and how often? :: Define the interface contract per consumer, including the effective date, the change trigger and the failure path.
Plan data migration :: What history is actually required, and can it be reconciled? :: Migrate current state plus the history that pay, leave and service calculations depend on, and reconcile headcount before cutover.
Test and cut over :: Have hire, change and termination been tested through to payroll and access? :: Test end to end rather than by module, and verify a retrospective change lands correctly downstream.
Govern the data :: Who owns each field after go-live, and how are errors corrected? :: Assign field ownership, publish a correction process, and report on data quality rather than assuming it.
```

## Metrics and KPIs to track

```metrics
Record accuracy :: Share of employee records free of defects on audit.
Time to create a hire record :: Offer acceptance to a complete, payable record.
Access provisioned by day one :: New starters with correct access on their first day.
Effective-dated correction rate :: Retrospective corrections per period, by cause.
Downstream interface failure rate :: Failed employee records per integration run.
Duplicate employee records :: Duplicates found per period.
Manager self-service adoption :: Change events raised by managers versus by HR.
Headcount reconciliation variance :: Difference between HR headcount and payroll and finance.
Terminations processed on time :: Leavers with access revoked and final pay correct by the due date.
```
