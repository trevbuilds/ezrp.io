---
slug: long-service-leave
source: authored
intro: >-
  Long service leave is a state entitlement, not a national one, and in several industries a portable scheme sits on top of it so the entitlement follows the worker rather than the employer.
  It is the provision most often wrong in a migrated payroll.
---

## Why it matters

Long service leave accrues quietly for a decade and then becomes a material liability and a real payment. The rules that govern it differ by state, and the service history that determines it is exactly the data most likely to be damaged in a system migration.

- **The act is state-based**: Qualifying period, accrual rate, pro-rata entitlement on termination and what counts as continuous service all vary.
- **Portable schemes change the model**: In construction and, in some jurisdictions, cleaning, security and community services, the employer owes returns and levies to a scheme regardless of whether anyone takes leave.
- **It rests on service history**: Decades of it, often the least-trusted data in the legacy system.

## The workflow

```steps
Service recognition :: Continuous service established, including transfers, parental leave and any recognised prior service.
Accrual :: Entitlement accrued under the rule of the jurisdiction the employee works in.
Portable scheme return :: Where a scheme applies, service returned and levies paid on the scheme's cycle.
Taking or cashing out :: Leave taken, or paid out where the jurisdiction permits it.
Termination payout :: Pro-rata entitlement calculated on termination, under that jurisdiction's threshold.
```

> Migrate service history before you migrate balances. A balance without the service history behind it cannot be recalculated, audited or defended, and the first termination payout is where that becomes somebody's problem.

## What you need in place

- **Verified service dates**: Reconstructed and checked before migration, not carried across on trust.
- **The jurisdiction rule per employee**: Based on where they work, with a defined rule for people who have moved between states.
- **Continuity rules configured**: What breaks service and what does not — unpaid leave, transfers between related entities, re-employment.
- **Portable scheme registration**: Where the industry is covered, with returns automated rather than remembered.
- **An actuarial or provisioning basis**: Agreed with finance, so the liability in the ledger matches the entitlement in payroll.
- **Pro-rata termination rules**: Per jurisdiction, tested before the first termination rather than during it.

## Questions to ask

```qa
Service history :: Can we evidence continuous service for our longest-serving employees? :: If not, the liability is an estimate.
Movement :: Which rule applies to someone who has worked in three states? :: Decide it, document it, and configure it.
Portable schemes :: Are any of our industries covered by a portable scheme? :: The obligation exists whether or not anyone has claimed.
Continuity :: What breaks continuous service in our configuration? :: The default is usually wrong in at least one direction.
Provision :: Does the ledger provision match the payroll entitlement? :: They drift, and the difference is found at audit.
Migration :: Are we migrating balances or service? :: Balances alone cannot be recalculated later.
```

## Metrics and KPIs to track

```metrics
Service data completeness :: Employees with verified continuous service dates.
Liability against provision :: Payroll entitlement reconciled to the ledger provision.
Portable scheme returns :: Lodged on time, with levies paid.
Termination payout accuracy :: Payouts requiring correction after payment.
Entitlement ageing :: Accrued entitlement by band, and the cash exposure in it.
```
