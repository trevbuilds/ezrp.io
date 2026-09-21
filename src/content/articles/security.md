---
slug: security
source: authored
intro: >-
  Security and identity decides who can do what without supervision.
  In an ERP that is not an IT question — it is the structural answer to segregation of duties, and it is where fraud either is or is not possible.
---

## Why it matters

Access in an ERP is a financial control. Someone who can create a supplier and release a payment can move money, and no policy compensates for a role design that permits it.

- **It is a financial control**: Segregation of duties is enforced through access, or it is not enforced.
- **It is evidence**: Auditors test access design and operation, not intent.
- **It decays**: Access accumulates as people move roles, unless something removes it.

## The workflow

```steps
Role design :: Roles built from business tasks, with conflicting combinations identified.
Provisioning :: Access granted from the HR record, based on position.
Approval :: Requests approved by someone accountable, not by the requester's peer.
Review :: Periodic recertification by managers who understand what the access permits.
Revocation :: Removed on role change and on exit, automatically.
Monitoring :: Privileged activity logged and reviewed.
```

> Access accumulates. Someone who has moved roles three times carries the union of all three unless revocation is tied to the change, and that person is the audit finding.

## What you need in place

- **A segregation of duties matrix**: Which combinations are forbidden, in business terms.
- **Role-based access from position**: Provisioned from HR, not requested ad hoc.
- **Recertification**: On a cycle, by someone who understands the access.
- **Privileged access control**: Elevated rights time-bound and logged.
- **Joiner-mover-leaver automation**: Especially mover, which is the one usually missed.

## Questions to ask

```qa
Conflicts :: Can one person create a supplier and release a payment? :: Test it. Policy answers are not evidence.
Movers :: What happens to access when someone changes role? :: Accumulation is the default unless designed otherwise.
Recertification :: Who reviews access, and do they understand it? :: A manager approving a list of role names is not a control.
Privileged :: Who has elevated access, and for how long? :: Permanent elevated access is standing risk.
Emergency :: How is break-glass access granted and reviewed? :: It should be possible, time-bound and always reviewed.
```

## Metrics and KPIs to track

```metrics
Segregation conflicts :: Users holding conflicting access.
Recertification completion :: Reviews completed within the cycle.
Orphaned accounts :: Active accounts with no current employee.
Access removal time :: Termination to revocation.
Privileged account count :: With time-bound justification.
```
