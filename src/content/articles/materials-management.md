---
slug: materials-management
source: authored
intro: >-
  Materials management is making sure production has what it needs, when it needs it, without holding more than it should.
  It sits between planning and the shop floor, and it is where planning assumptions meet physical reality.
---

## Why it matters

A production schedule is a plan about materials. If the materials are not there, the schedule is a forecast of disappointment; if there are too many, the working capital is sitting in a warehouse.

- **It gates production**: A missing component stops a line regardless of what else is ready.
- **It ties up cash**: Raw materials and work in progress are working capital with a holding cost.
- **It depends on bill of materials accuracy**: Everything planned is planned from it.

## The workflow

```steps
Requisition creation :: Demand generated from the production plan and the bill of materials, not from observation of empty shelves.
Purchase order management :: Requirements converted to orders against contracted suppliers and lead times.
Inventory receipt :: Materials received, inspected where required, and made available to production.
Inventory replenishment :: Stock levels maintained against consumption, lead time and variability.
```

> Bill of materials accuracy is the input to everything. A BOM that is two revisions behind the shop floor produces shortages that look like supplier failures and are not.

## What you need in place

- **Accurate bills of materials**: Version-controlled and matching what is actually built.
- **Real lead times**: Measured from supplier performance, not quoted at contract signing.
- **Safety stock set on variability**: Calculated from demand and supply variation, not intuition.
- **Consumption recording**: Backflush or issue, but recorded, or stock diverges immediately.
- **Scrap and yield factors**: In the plan, or every run short-picks.
- **Shortage visibility**: Before the run, not at the line.

## Questions to ask

```qa
BOM accuracy :: When was each bill of materials last verified against the build? :: Drift here causes shortages nobody can explain.
Lead times :: Are they measured or quoted? :: Quoted lead times are a negotiating position.
Safety stock :: How was it calculated? :: If nobody can say, it is either too much or too little.
Consumption :: How is material issue recorded? :: Unrecorded consumption makes stock data useless within weeks.
Shortages :: How far ahead do we see a shortage? :: The answer determines whether it is a decision or a crisis.
Yield :: Are scrap and yield in the plan? :: Planning at one hundred percent yield guarantees short runs.
```

## Metrics and KPIs to track

```metrics
Material availability :: Production orders started with all materials available.
Shortage frequency :: Lines stopped for material, and hours lost.
BOM accuracy :: Verified bills against total.
Inventory turns :: Raw material and work in progress.
Supplier lead time variance :: Actual against planned.
Scrap rate :: Against yield assumption.
```
