---
slug: ap-automation
source: dx-guides
intro: >-
  AP automation, or Accounts Payable automation, refers to the technology used to streamline and automate accounts payable processes, eliminating manual tasks, reducing processing time, and improving accuracy.
---

## Why it matters

- **Efficiency**: Reduces the time required to process invoices.
- **Accuracy**: Minimises human errors in data entry and calculations.
- **Cost savings**: Decreases the cost per invoice by reducing manual efforts.
- **Visibility**: Improves financial oversight and audit trails.
- **Compliance**: Helps ensure adherence to regulatory requirements.
- **Strategic financial management**: Frees up resources for more strategic tasks like cash flow management.

## Basic AP automation workflow

The basic workflow involves several sequential steps designed to minimise manual intervention and streamline the accounts payable process.

```steps
Invoice receipt :: Invoices are received electronically via email, EDI, or uploaded to a portal.
Data capture :: Information is extracted from invoices using OCR or other automated data capture technologies.
  - Oracle, for example, calls it IDR.
  - Don't break the ones that are already working.
  - Make the ones that are failing stop failing.
  - Send the data on to the ERP / finance system.
Invoice matching :: Invoices are matched automatically to corresponding purchase orders and receipts (3-way matching).
Approval workflow :: Invoices that meet set criteria are routed through a digital approval workflow, while exceptions are flagged for review.
Discrepancy resolution :: Any issues identified during matching or by the approver are resolved.
Payment processing :: Once approved, invoices are scheduled for payment according to terms and executed electronically.
Reconciliation :: Payments are reconciled with bank statements, ensuring records are accurate.
Record keeping :: Invoices, approvals and payment records are stored digitally for retrieval and compliance.
Reporting and analytics :: The system generates reports on AP metrics for analysis and strategic planning.
```

## How a business implements it

### For small businesses

- **Needs assessment**: Determine the volume of invoices and the complexity of the current process.
- **Simple tools**: Start with basic AP tools integrated with existing accounting software like QuickBooks or Xero.
- **Incremental automation**: Automate key parts first, such as invoice data capture and approval workflows.
- **Integration**: Ensure the AP system integrates with the company's bank for seamless payments.

### For medium-sized enterprises

- **Comprehensive solutions**: Look for AP solutions that handle larger volumes and offer detailed reporting.
- **Vendor management**: Implement vendor portals to streamline communication and invoicing.
- **Process optimisation**: Map the entire AP process and identify opportunities for efficiency gains.

### For large enterprises

- **ERP integration**: Integrate AP automation with the ERP for centralised financial management.
- **Customisation and scalability**: Invest in solutions that scale with the business and handle complex workflows.
- **Global capabilities**: For multinational operations, handle multiple currencies and tax jurisdictions.
- **Advanced analytics**: Use analytics for strategic decision-making and cash flow optimisation.

> Whatever the size, the key is to start with a clear understanding of the current AP process, identify the bottlenecks, then automate the workflow step by step. Integration with existing systems and the scalability to meet future needs are the crucial factors.

## What solutions are out there?

The best AP automation solutions typically offer invoice processing, workflow automation, fraud detection, and integration with ERP systems.

- **SAP Concur**: Comprehensive, cloud-based invoice management that integrates with ERP systems.
- **Oracle NetSuite**: A unified suite that automates AP and other financial processes.
- **Coupa**: User-friendly platform with strong spend management and AP automation.
- **Tipalti**: Streamlines global payables, including mass payments and currency conversion.
- **Kofax**: Focused on capturing and digitising invoice data.
- **AvidXchange**: Midsize platform for invoice capture, approval workflows and payments.
- **Dynamics 365 for Finance and Operations**: AP automation inside Microsoft's ERP for real-time insight.
- **QuickBooks Online**: Small to mid-size, with built-in AP features and recurring payment automation.

Selection depends on company size, existing software ecosystem, and specific needs in the AP workflow.

## Configuring the solution

Each step has questions to answer and a rough plan that follows from the answers.

```qa
Assess current process :: What are the pain points in your current AP process? Where do delays most often occur? :: Map the current workflow, identifying bottlenecks and inefficiencies. Understand invoice volume and supplier diversity.
Define requirements :: What features are essential? What are your compliance and reporting needs? :: List the essentials — invoice capture, approval workflows, payment processing, reporting — and confirm regulatory compliance is covered.
Select the software :: Does it integrate with your existing ERP or accounting system? Can it scale with the business? :: Choose a solution that integrates seamlessly and grows with the company. Prioritise user-friendliness and vendor support.
Design the workflow :: Who needs to approve what, and at which stages? What are your payment policies? :: Create a digital approval workflow mirroring your hierarchy and payment terms. Configure rules for auto-approvals and escalations.
Integrate with existing systems :: How will the AP solution interact with other business systems? Are there technical constraints? :: Work with IT for smooth integration with minimal disruption, and test the integrations thoroughly.
Configure invoice processing :: What data capture method will you use? How will you handle exceptions? :: Set up OCR or other capture technology and establish an exception process that keeps manual intervention minimal.
Set up payment processing :: Which payment methods will you support? How will you manage schedules and approvals? :: Configure payment gateways and approval protocols, automating scheduling based on vendor terms.
Establish reporting and analytics :: What reports do you need for compliance and performance? How often do you need them? :: Customise dashboards for real-time tracking and regular reporting for decision-making.
Plan training and change management :: What training do staff need? How will you address resistance to change? :: Develop training programs and communicate the benefits of the new system to encourage adoption.
Test and go live :: Have all scenarios been tested? Is there a rollback plan? :: Test extensively with various invoice types and scenarios, and have a contingency plan before going live.
Monitor and optimise :: How is the system performing? Where can improvements be made? :: Review performance regularly and solicit feedback for continuous improvement.
```

## Metrics and KPIs to track

```metrics
Invoice processing time :: Time taken from receipt to payment.
Cost per invoice :: Total AP operation cost divided by invoices processed.
Exception rate :: Share of invoices that cannot be processed without manual intervention.
First-time match rate :: Invoices matched successfully on the first try.
Approval cycle time :: Average time for an invoice to be approved.
Early payment discounts captured :: Discounts taken versus those offered.
E-invoicing adoption rate :: Invoices processed electronically versus on paper.
On-time payment rate :: Payments made by the due date.
AP turnover ratio :: Number of times AP is paid off in a period.
```
