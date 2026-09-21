---
slug: manufacturing
source: dx-guides
intro: >-
  The manufacturing module supports discrete, process and lean production, automating the work from planning and scheduling through to execution and analysis.
  It only earns its keep when it is integrated with supply chain, inventory and finance rather than run as a shop-floor island.
---

## Why it matters

- **Real-time visibility**: Production status is visible as it happens rather than reconstructed from paperwork at the end of a shift.
- **Cost control**: Materials, labour and overheads are tracked against the order, so profitability is measurable per product rather than per month.
- **Quality**: Inspection and compliance are built into the process instead of bolted on at the end.
- **Integration**: Production data flows into the rest of the business, which is what makes planning and costing credible.

## The workflow

```steps
Production planning :: Demand forecasts and sales orders become a plan: what to produce, how much, and by when.
Material requirement planning :: The system calculates the raw materials and components needed, against current inventory.
Scheduling :: Production is scheduled to optimise machinery, labour and materials.
Execution :: Production is initiated, monitored and controlled, with progress, quality and issues captured live.
Quality control :: Integrated quality management confirms products meet standards and compliance requirements.
Costing :: Production costs are tracked across materials, labour and overheads to analyse profitability.
```

> Material requirement planning is only as good as inventory accuracy. If system stock does not match physical stock, MRP will confidently order the wrong things.

## What you need in place

- **Bill of materials management**: The list of raw materials, components and instructions required to produce a product.
- **Work centre and routing management**: Work centres and production lines defined, with the sequence of operations for each product.
- **Production order management**: Issuing, tracking and closing production orders.
- **Inventory management**: Raw materials, work-in-progress and finished goods tracked in real time.
- **Quality management**: Quality standards and inspection procedures defined before go-live, not after the first recall.

## Implementing it

```steps
Requirements gathering :: Understand the specific manufacturing processes and requirements this business runs.
Module customisation :: Tailor the module to the workflows and rules the business actually uses.
Integration :: Ensure data flows between manufacturing and the other ERP components.
User training :: Train staff on the new functionality and workflows.
Data migration :: Move existing production and inventory data across.
Testing and go-live :: Test thoroughly, then go live.
```

## Questions to ask

```qa
Process fit :: How does our current manufacturing process align with the module's functionality? :: Walk a real production order end to end rather than accepting a demo product.
Strategy :: What manufacturing strategies do we run — make-to-stock, make-to-order, or both? :: The answer changes how planning and scheduling are configured.
Planning integration :: How will material requirement planning integrate with supply chain? :: Confirm MRP reads live inventory, not a nightly snapshot.
Customisation :: What customisation is needed for our processes? :: Establish what is configuration, what is code, and what breaks on upgrade.
Improvement :: How will production data be used for decision-making? :: Decide which reports someone will actually read before building them.
```

## Metrics and KPIs to track

```metrics
Production efficiency :: Efficiency of the production process against standard.
On-time delivery :: Share of orders delivered by the promised date.
Product quality rate :: Share of products meeting quality standards.
Inventory turnover :: How quickly inventory is sold and replaced over a period.
```

## Where it connects

- **Supply chain management**: Material sourcing and inventory.
- **Sales and distribution**: Customer orders and demand planning.
- **Finance and accounting**: Production costs and financial analysis.
