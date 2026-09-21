---
slug: ditch-the-dirty-talk
source: authored
intro: >-
  Jargon is how a programme stops being understood by the people who have to accept it, and it hides disagreement rather than resolving it.
  Two people who both nod at "harmonised master data" often mean different things and will find out at testing.
---

## Why it matters

Language is a control. Requirements written in vendor vocabulary are signed by people who did not understand them, which means the sign-off is worthless and the rework is booked.

- **It conceals disagreement**: Abstraction lets two incompatible positions coexist until the build makes them explicit.
- **It excludes the business**: People stop asking questions when asking reveals they do not follow the terms.
- **It moves cost later**: Every ambiguity is resolved eventually — usually by a developer, according to their assumption.

## Putting it into practice

```steps
Write in the organisation's words :: Requirements in the language the business uses for its own work.
Define the unavoidable terms :: A short glossary for terms that genuinely have no plain equivalent.
Test comprehension :: Have someone outside the workstream read it back.
Use examples :: A worked example settles more ambiguity than a paragraph of definition.
Name products plainly :: Say what the thing does before saying what it is called.
Refuse abstraction in acceptance criteria :: "Seamless", "streamlined" and "robust" cannot be tested.
```

> When everyone in a workshop agrees quickly on an abstract statement, that is the moment to ask for a concrete example. Rapid agreement on abstractions usually means nobody has pictured the same thing.

## What you need in place

- **Plain-language requirements**: With business terminology, not product terminology.
- **A glossary**: Short, owned, and actually referenced.
- **Worked examples in specifications**: Real numbers, real names, real exceptions.
- **A read-back step**: Comprehension tested before sign-off.
- **Translation of vendor terminology**: Mapped to what the organisation calls it.

## Questions to ask

```qa
Comprehension :: Can the person signing this explain it in their own words? :: If not, the sign-off is decorative.
Examples :: Does each rule have a worked example? :: Examples find the exceptions that prose hides.
Testability :: Could someone write a test from this sentence? :: If not, it will be interpreted at build time.
Glossary :: Do we agree what our own terms mean? :: "Customer" and "site" often mean three things in one organisation.
Quick agreement :: Did everyone agree immediately? :: On anything abstract, that is a warning.
```

## Metrics and KPIs to track

```metrics
Defects from ambiguity :: Defects whose root cause is requirement interpretation.
Specification rework :: Changes after sign-off attributable to misunderstanding.
Read-back coverage :: Specifications verified by comprehension check.
Training questions by theme :: Where the language is not landing.
```
