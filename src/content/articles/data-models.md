---
slug: data-models
source: authored
intro: >-
  The data model is the shape the business is described in — what a customer is, what a product is, what a cost centre means.
  It is agreed once and argued about for a decade, so it is worth agreeing carefully.
---

## Why it matters

Every report, integration and migration depends on the model. It is also the artefact most likely to be produced by technical people alone and then handed to a business that does not recognise itself in it.

- **It encodes meaning**: If the model says a customer is an account, then a household with three accounts is three customers.
- **It constrains reporting**: You can only report what the model can express.
- **It is expensive to change**: Once data exists in a shape, restating it is a migration.

## The workflow

```steps
Concept definition :: The business entities and what each one means, in business language.
Relationships :: How entities relate, including the awkward ones — hierarchies, many-to-many, effective dating.
Attributes :: What is held about each entity, and which attributes are mandatory.
Ownership :: Who owns each entity and can approve a change.
Physical design :: The technical implementation of the agreed model.
Change control :: How the model evolves without breaking what depends on it.
```

> Model the awkward cases first. Hierarchies, effective dating and many-to-many relationships are where models break, and they are always discovered after the simple entities are agreed.

## What you need in place

- **Business-language definitions**: Recognisable to the people who use the terms.
- **An owner per entity**: With authority to settle disputes about meaning.
- **Effective dating where needed**: Structures that change over time.
- **A change process**: Because the model will change.
- **Traceability to reporting**: So the impact of a change is knowable.

## Questions to ask

```qa
Language :: Would the business recognise these definitions? :: If the model is in technical language, it was not agreed, only published.
Hierarchies :: How are org, product and customer hierarchies modelled over time? :: This is where most models fail.
Ownership :: Who settles a dispute about what a term means? :: Without an arbiter, both definitions persist.
Change :: What happens when a definition needs to change? :: If the answer is a project, expect workarounds instead.
Edge cases :: Have we modelled the exceptions, or only the clean cases? :: Exceptions are where the data actually lives.
```

## Metrics and KPIs to track

```metrics
Entity ownership coverage :: Entities with a named owner.
Model change volume :: Changes per period, and time to approve.
Definition disputes :: Raised and resolved, a measure of clarity.
Unmodelled workarounds :: Data held outside the model to work around it.
```
