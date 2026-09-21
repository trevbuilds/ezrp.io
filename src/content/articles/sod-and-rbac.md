---
slug: sod-and-rbac
source: authored
intro: >-
  Segregation of duties and role-based access are how an ERP prevents one person completing a whole risky transaction alone.
  The design work is business analysis, not technical configuration.
---

## Why it matters

The conflicts that matter are business conflicts: creating a supplier and paying one, raising a purchase order and receipting it, changing a bank account and releasing a payment run. Technology enforces them; it cannot identify them.

- **It is preventive**: The only control that stops the transaction rather than detecting it afterwards.
- **It is testable**: Auditors will run the conflict report themselves.
- **Small teams strain it**: Where separation is impossible, compensating controls must be designed deliberately.

## The workflow

```steps
Risk identification :: The transactions that matter, and which combinations create exposure.
Conflict matrix :: Documented in business language, owned by finance and risk.
Role design :: Roles built so a single role never contains a conflict.
Assignment rules :: Which roles can be held together, and which cannot.
Detection :: Conflict reporting run regularly, not only at audit.
Mitigation :: Where a conflict is unavoidable, a documented compensating control.
```

> In a small finance team some conflicts cannot be separated. That is a legitimate position only if it is identified, documented and compensated — usually by independent review of the specific transaction. Silence is not a mitigation.

## What you need in place

- **A conflict matrix in business language**: Owned by the business, not by IT.
- **Roles designed against it**: Conflicts prevented at design, not detected later.
- **Regular conflict reporting**: With an owner for resolution.
- **Documented mitigations**: Where separation is impossible.
- **Change control on roles**: A role change can introduce a conflict silently.

## Questions to ask

```qa
Matrix :: Do we have a conflict matrix, and who owns it? :: If IT owns it, it describes system objects rather than business risk.
Detection :: How often is conflict reporting run? :: Annually, at audit, is how conflicts persist for a year.
Mitigation :: Where separation is impossible, what compensates? :: It should be specific, documented and evidenced.
Role change :: Can a role change introduce a conflict without review? :: Usually yes, which is the gap.
Privileged :: Do administrators bypass the matrix entirely? :: Almost always. Decide whether that is acceptable.
```

## Metrics and KPIs to track

```metrics
Open conflicts :: Users with unmitigated conflicting access.
Mitigation coverage :: Accepted conflicts with a documented compensating control.
Detection frequency :: Conflict reporting run per period.
New conflicts introduced :: Per role change cycle.
```
