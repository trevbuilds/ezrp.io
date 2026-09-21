---
slug: functional-module-implementation
source: authored
intro: >-
  Functional module implementation is the per-module path from design to production: configuration, build, test, data and readiness, done to the same definition of done across every module.
  Modules that implement to different standards fail integration testing in each other's gaps.
---

## Why it matters

Each module can be delivered competently and the programme still fail, because the gaps are between modules. A consistent implementation path is what makes the modules join.

- **It makes readiness comparable**: The same gates for every module, so status means the same thing across the programme.
- **It exposes cross-module dependency early**: Design decisions in one module land in another's build.
- **It defines done**: Configured is not tested; tested is not ready.

## The workflow

```steps
Design :: Process design against the product's standard behaviour, with variations justified.
Configure :: Built in a controlled environment, with configuration documented as it is set.
Build :: Extensions and interfaces to the development standard.
Unit and string test :: The module works internally, including its exception paths.
Integration test :: The module works with the ones it exchanges data with — the real gate.
User acceptance :: The business runs its own scenarios and accepts.
Readiness :: Data, access, training, support model and cutover tasks complete.
```

> Integration testing is not the last phase of module testing; it is the first phase of programme testing. Schedule it as a programme activity with its own environment, data and defect process, or every module will declare itself ready and the programme will not be.

## What you need in place

- **One definition of done**: Applied identically across modules.
- **Configuration documented as built**: Reconstructing it later costs more than recording it now.
- **A cross-module dependency map**: Which design decisions affect other modules.
- **Integration test scenarios owned by the programme**: Not by each module.
- **Business acceptance by real users**: Running their own work, not a scripted demonstration.
- **Readiness criteria beyond the system**: Data, access, training and support.

## Questions to ask

```qa
Definition of done :: Is it the same for every module? :: If not, comparing status across modules is meaningless.
Integration :: Who owns end-to-end test scenarios? :: If no one, they will be built from each module's optimistic view.
Standard :: How much of this module is standard configuration? :: The answer predicts the upgrade cost for the next decade.
Acceptance :: Who from the business accepts, and on what? :: Acceptance by the project team is not acceptance.
Readiness :: Beyond the system, what has to be true? :: Data, access, training and support are usually the late items.
```

## Metrics and KPIs to track

```metrics
Configuration completeness :: Design decisions configured and documented.
Test pass rate :: By cycle, unit through integration through acceptance.
Open defects by severity :: Against the gate criteria for the next phase.
Cross-module defects :: Defects whose cause is in a different module.
Readiness by criterion :: Per module, at each gate.
```
