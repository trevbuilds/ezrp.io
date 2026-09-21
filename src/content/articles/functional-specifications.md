---
slug: functional-specifications
source: authored
intro: >-
  A functional specification states what the system must do in business terms, and it is the document testing is written against.
  Written badly it becomes the reason a build is delivered exactly as specified and rejected anyway.
---

## Why it matters

The specification is the contract between the people who know the business and the people who will build. Ambiguity in it is not resolved by discussion — it is resolved by whoever builds, according to their assumption.

- **It is what gets tested**: An untestable requirement is an unverifiable delivery.
- **It carries the business rules**: The conditional logic that the process actually runs on.
- **It survives the people**: The analyst who understood the nuance will not be there in year three.

## The workflow

```steps
Requirement gathering :: The business need, with the process it belongs to, not a feature list.
Standard-first assessment :: Whether the product's standard behaviour meets the need, and what changing the process would cost instead.
Specification :: What the system must do, the rules, the data, the exceptions and the acceptance criteria.
Business review :: Signed off by someone who will live with the result.
Technical feasibility :: Reviewed against the product and the development standard.
Baseline :: Version-controlled; changes after this point go through change control.
```

> Specify the exceptions. The happy path is agreed in an hour; the six weeks of build and rework are all in the cases nobody wrote down.

## What you need in place

- **A standard template**: Including data, rules, exceptions, volumes and acceptance criteria.
- **Testable acceptance criteria**: If it cannot be tested, it cannot be accepted.
- **A named business owner**: Who signs and who will be asked at user acceptance testing.
- **Traceability**: Requirement to specification to test case to defect.
- **Standard-first discipline**: Every specification stating why standard behaviour was insufficient.

## Questions to ask

```qa
Testability :: Can each requirement be tested objectively? :: "Must be user-friendly" cannot.
Exceptions :: What happens when the data is wrong or missing? :: The exception path is where the build effort actually is.
Standard :: Why is this not standard functionality? :: Every specification should answer this explicitly.
Volumes :: How many of these per day, at peak? :: Design and performance both depend on it.
Ownership :: Who signs, and will they be at UAT? :: Sign-off by someone who never uses it is a formality.
```

## Metrics and KPIs to track

```metrics
Specification churn :: Changes after baseline, by cause.
Defects traced to specification :: Defects whose root cause is ambiguity rather than build.
Coverage :: Requirements with a linked test case.
Standard-first ratio :: Requirements met by configuration against those requiring build.
Sign-off currency :: Specifications baselined against those still open at build start.
```
