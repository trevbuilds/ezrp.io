---
slug: production-planning
source: dx-guides
intro: >-
  Production planning schedules, coordinates and optimises materials and production so goods are made on time and within budget.
  It sits directly on inventory levels, production efficiency and customer satisfaction — get it wrong and every one of those moves at once.
---

## Why it matters in an ERP context

Planning inside the ERP gives real-time visibility into operations, which is what makes decisions defensible and responses to demand quick. Planned outside it — in a spreadsheet beside the system — the plan and the stock position drift apart within days.

## The workflow

```steps
Demand forecasting :: Estimate future demand from historical data and predictive analysis.
Material requirements planning :: Determine the materials and components needed to meet the schedule.
Capacity planning :: Assess the production capacity needed to hit the goals in the timeframe available.
Scheduling :: Schedule production tasks in detail against available resources and constraints.
Execution :: Initiate and monitor production, holding to schedule and specification.
Review and adjustment :: Evaluate performance against plan and adjust schedules, capacity or material plans.
```

> The review step is the one most often skipped, and it is the one that makes the next forecast better. A plan nobody reviews is a guess that repeats.

## What you need in place

- **Demand management**: Capturing and analysing demand signals to build forecasts worth acting on.
- **Resource allocation**: Assigning machines, labour and lines to production optimally rather than by habit.
- **Production order management**: Creating and managing production orders.
- **Product data management**: Products defined, including structures, components and the bill of materials.
- **Resource master data**: Machine, labour and production line information held as data.
- **Inventory parameters**: Stock levels, safety stock and reorder points set deliberately.

## Implementing it

```steps
Define objectives :: Identify what the module is for — shorter lead times, lower inventory cost, or both.
Process mapping :: Document current production processes to find the gaps worth closing.
Configuration :: Tailor the system to the planning approach and integrate it with existing workflows.
Data migration :: Move product, inventory and resource data across.
Training and testing :: Train staff and test that planning behaves as intended.
Go-live and monitoring :: Launch, watch performance closely, and adjust.
```

## Questions to ask

```qa
Scale :: Can the system scale with the business? :: Test against realistic order and SKU volumes, not the demo dataset.
Integration :: How well does planning integrate with the rest of the ERP and external systems? :: Confirm it reads live inventory and capacity.
Customisation :: What customisation is available for our requirements? :: Separate configuration from code before committing.
Support :: What support and training is offered? :: Pin down what is included and what is billable.
```

## Metrics and KPIs to track

```metrics
Production efficiency :: Actual output against standard output for the period.
Order fulfilment time :: Time from order placement to delivery.
Inventory levels :: Raw materials, work-in-progress and finished goods held.
Quality rate :: Share of products meeting quality standards.
```
