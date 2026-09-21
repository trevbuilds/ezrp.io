---
slug: technical-specifications
source: authored
intro: >-
  The technical specification translates the functional requirement into how it will be built: objects, data, interfaces, error handling and the operational behaviour nobody thinks about until it fails at 2am.
  It is also the only documentation that will exist in three years.
---

## Why it matters

Functional specifications say what; technical specifications say how, and the how determines whether the thing can be supported, upgraded and recovered.

- **It is the support document**: The person maintaining this will not be the person who built it.
- **It carries the operational design**: Error handling, restart, reconciliation and logging.
- **It determines upgradeability**: Whether the build sits inside a supported extension pattern or modifies core.

## The workflow

```steps
Design :: Approach chosen against the development standard, with the extension pattern named.
Specification :: Objects, data structures, logic, interfaces, error handling and restart behaviour.
Peer review :: A second engineer checks the approach, not just the document.
Security and performance review :: Access, data exposure and expected volumes.
Build :: Against the specification, with the document updated when reality differs.
Handover :: Into the support model, with the specification as the artefact.
```

> Specify what happens when it fails. A specification that covers only the successful path produces a build that stops silently, and silent failure in an interface is how a month closes short.

## What you need in place

- **Conformance to the development standard**: Named pattern, and no core modification without explicit approval.
- **Error handling designed, not improvised**: Including retry, restart and who gets notified.
- **Reconciliation for anything moving data**: Counts and totals that prove completeness.
- **Performance expectations**: Volumes and the window the process must fit inside.
- **Support handover content**: Runbook, monitoring points, known failure modes.

## Questions to ask

```qa
Failure :: What happens when this fails halfway? :: Restart and reconciliation should be designed, not discovered.
Notification :: Who finds out, and how? :: Failures nobody sees are the expensive ones.
Volumes :: What volume was this designed for? :: Designs sized on test data fail on year-end.
Upgrade :: Does this survive a product upgrade? :: If it modifies core, someone should have approved that knowingly.
Support :: Could someone who has never seen this operate it? :: That is the actual test of the document.
```

## Metrics and KPIs to track

```metrics
Specification currency :: Builds whose specification matches what was delivered.
Peer review coverage :: Builds reviewed before deployment.
Standard conformance :: Builds inside an approved extension pattern.
Support handover completeness :: Objects with a runbook and monitoring defined.
Production defects :: Traced to missing error handling or undocumented behaviour.
```
