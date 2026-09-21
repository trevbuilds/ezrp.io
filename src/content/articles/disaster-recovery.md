---
slug: disaster-recovery
source: authored
intro: >-
  Disaster recovery is the technical half of continuity: restoring systems and data after a failure, within a time and to a point the business has agreed.
  Those two numbers are business decisions that are usually made by default.
---

## Why it matters

Recovery time and recovery point objectives determine architecture and cost. Set without the business, they are assumptions; set with it, they are a commitment that can be tested.

- **The objectives are business decisions**: How long can this be down, and how much data can be lost.
- **Untested recovery is a hope**: A backup that has never been restored is unverified.
- **It has to cover integrations**: Restoring the ERP without its interfaces restores an island.

## The workflow

```steps
Impact analysis :: What each system supports and what an outage costs.
Objectives :: Recovery time and recovery point agreed per system, by the business.
Architecture :: Backup, replication and standby designed to meet them.
Runbooks :: Written so someone who is not the architect can execute them.
Testing :: Recovery exercised on a schedule, with results recorded.
Review :: Objectives revisited as the business changes.
```

> Test the restore, not the backup. Backup success tells you a job completed; only a restore tells you the data is usable and the time achievable.

## What you need in place

- **Agreed objectives per system**: Signed off by the business owner.
- **Runbooks for non-experts**: The person available at 3am may not be the person who built it.
- **Dependency mapping**: Recovery order across systems and interfaces.
- **Regular testing**: Including a full failover, not only component restores.
- **Offsite and immutable copies**: Ransomware makes immutability a recovery requirement.

## Questions to ask

```qa
Objectives :: What are our RTO and RPO, and who agreed them? :: If IT set them alone, they are assumptions.
Testing :: When did we last restore from backup? :: Not run a backup — restore from one.
Order :: In what order do systems come back, and who decides? :: Dependencies determine this, not importance.
Integrations :: Does the plan cover interfaces? :: An ERP with no feeds is not recovered.
Immutability :: Could ransomware reach our backups? :: If yes, they are not backups.
```

## Metrics and KPIs to track

```metrics
Recovery test currency :: Time since last successful restore test.
Achieved against target :: Tested recovery time against RTO.
Backup success rate :: Jobs completing.
Coverage :: Systems with agreed, signed objectives.
```
