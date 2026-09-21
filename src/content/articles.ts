/**
 * Long-form guide articles, copied from the DX Guides wiki pages.
 *
 * Only topics whose wiki page actually carries written content appear here.
 * Nothing is invented — if a page is empty, it simply has no article.
 */

export type ArticleBlock =
  | { kind: "h"; text: string }
  | { kind: "sub"; text: string }
  | { kind: "p"; text: string }
  | { kind: "bullets"; items: Array<{ term?: string; text: string }> }
  | { kind: "steps"; items: Array<{ title: string; text?: string; sub?: string[] }> }
  | { kind: "qa"; items: Array<{ title: string; question: string; plan: string }> }
  | { kind: "metrics"; items: Array<{ name: string; text: string }> }
  | { kind: "callout"; text: string };

export type Article = {
  slug: string;
  intro: string;
  blocks: ArticleBlock[];
};

import { hcmArticles } from "./articles-hcm";
import { finaccArticles } from "./articles-finacc";
import { crmArticles } from "./articles-crm";

const apAutomation: Article = {
  slug: "ap-automation",
  intro:
    "AP automation, or Accounts Payable automation, refers to the technology used to streamline and automate accounts payable processes, eliminating manual tasks, reducing processing time, and improving accuracy.",
  blocks: [
    { kind: "h", text: "Why it matters" },
    {
      kind: "bullets",
      items: [
        { term: "Efficiency", text: "Reduces the time required to process invoices." },
        {
          term: "Accuracy",
          text: "Minimises human errors in data entry and calculations.",
        },
        {
          term: "Cost savings",
          text: "Decreases the cost per invoice by reducing manual efforts.",
        },
        { term: "Visibility", text: "Improves financial oversight and audit trails." },
        {
          term: "Compliance",
          text: "Helps ensure adherence to regulatory requirements.",
        },
        {
          term: "Strategic financial management",
          text: "Frees up resources for more strategic tasks like cash flow management.",
        },
      ],
    },

    { kind: "h", text: "Basic AP automation workflow" },
    {
      kind: "p",
      text: "The basic workflow involves several sequential steps designed to minimise manual intervention and streamline the accounts payable process.",
    },
    {
      kind: "steps",
      items: [
        {
          title: "Invoice receipt",
          text: "Invoices are received electronically via email, EDI, or uploaded to a portal.",
        },
        {
          title: "Data capture",
          text: "Information is extracted from invoices using OCR or other automated data capture technologies.",
          sub: [
            "Oracle, for example, calls it IDR.",
            "Don't break the ones that are already working.",
            "Make the ones that are failing stop failing.",
            "Send the data on to the ERP / finance system.",
          ],
        },
        {
          title: "Invoice matching",
          text: "Invoices are matched automatically to corresponding purchase orders and receipts (3-way matching).",
        },
        {
          title: "Approval workflow",
          text: "Invoices that meet set criteria are routed through a digital approval workflow, while exceptions are flagged for review.",
        },
        {
          title: "Discrepancy resolution",
          text: "Any issues identified during matching or by the approver are resolved.",
        },
        {
          title: "Payment processing",
          text: "Once approved, invoices are scheduled for payment according to terms and executed electronically.",
        },
        {
          title: "Reconciliation",
          text: "Payments are reconciled with bank statements, ensuring records are accurate.",
        },
        {
          title: "Record keeping",
          text: "Invoices, approvals and payment records are stored digitally for retrieval and compliance.",
        },
        {
          title: "Reporting and analytics",
          text: "The system generates reports on AP metrics for analysis and strategic planning.",
        },
      ],
    },

    { kind: "h", text: "How a business implements it" },
    { kind: "sub", text: "For small businesses" },
    {
      kind: "bullets",
      items: [
        {
          term: "Needs assessment",
          text: "Determine the volume of invoices and the complexity of the current process.",
        },
        {
          term: "Simple tools",
          text: "Start with basic AP tools integrated with existing accounting software like QuickBooks or Xero.",
        },
        {
          term: "Incremental automation",
          text: "Automate key parts first, such as invoice data capture and approval workflows.",
        },
        {
          term: "Integration",
          text: "Ensure the AP system integrates with the company's bank for seamless payments.",
        },
      ],
    },
    { kind: "sub", text: "For medium-sized enterprises" },
    {
      kind: "bullets",
      items: [
        {
          term: "Comprehensive solutions",
          text: "Look for AP solutions that handle larger volumes and offer detailed reporting.",
        },
        {
          term: "Vendor management",
          text: "Implement vendor portals to streamline communication and invoicing.",
        },
        {
          term: "Process optimisation",
          text: "Map the entire AP process and identify opportunities for efficiency gains.",
        },
      ],
    },
    { kind: "sub", text: "For large enterprises" },
    {
      kind: "bullets",
      items: [
        {
          term: "ERP integration",
          text: "Integrate AP automation with the ERP for centralised financial management.",
        },
        {
          term: "Customisation and scalability",
          text: "Invest in solutions that scale with the business and handle complex workflows.",
        },
        {
          term: "Global capabilities",
          text: "For multinational operations, handle multiple currencies and tax jurisdictions.",
        },
        {
          term: "Advanced analytics",
          text: "Use analytics for strategic decision-making and cash flow optimisation.",
        },
      ],
    },
    {
      kind: "callout",
      text: "Whatever the size, the key is to start with a clear understanding of the current AP process, identify the bottlenecks, then automate the workflow step by step. Integration with existing systems and the scalability to meet future needs are the crucial factors.",
    },

    { kind: "h", text: "What solutions are out there?" },
    {
      kind: "p",
      text: "The best AP automation solutions typically offer invoice processing, workflow automation, fraud detection, and integration with ERP systems.",
    },
    {
      kind: "bullets",
      items: [
        {
          term: "SAP Concur",
          text: "Comprehensive, cloud-based invoice management that integrates with ERP systems.",
        },
        {
          term: "Oracle NetSuite",
          text: "A unified suite that automates AP and other financial processes.",
        },
        {
          term: "Coupa",
          text: "User-friendly platform with strong spend management and AP automation.",
        },
        {
          term: "Tipalti",
          text: "Streamlines global payables, including mass payments and currency conversion.",
        },
        { term: "Kofax", text: "Focused on capturing and digitising invoice data." },
        {
          term: "AvidXchange",
          text: "Midsize platform for invoice capture, approval workflows and payments.",
        },
        {
          term: "Dynamics 365 for Finance and Operations",
          text: "AP automation inside Microsoft's ERP for real-time insight.",
        },
        {
          term: "QuickBooks Online",
          text: "Small to mid-size, with built-in AP features and recurring payment automation.",
        },
      ],
    },
    {
      kind: "p",
      text: "Selection depends on company size, existing software ecosystem, and specific needs in the AP workflow.",
    },

    { kind: "h", text: "Configuring the solution" },
    {
      kind: "p",
      text: "Each step has questions to answer and a rough plan that follows from the answers.",
    },
    {
      kind: "qa",
      items: [
        {
          title: "Assess current process",
          question:
            "What are the pain points in your current AP process? Where do delays most often occur?",
          plan: "Map the current workflow, identifying bottlenecks and inefficiencies. Understand invoice volume and supplier diversity.",
        },
        {
          title: "Define requirements",
          question:
            "What features are essential? What are your compliance and reporting needs?",
          plan: "List the essentials — invoice capture, approval workflows, payment processing, reporting — and confirm regulatory compliance is covered.",
        },
        {
          title: "Select the software",
          question:
            "Does it integrate with your existing ERP or accounting system? Can it scale with the business?",
          plan: "Choose a solution that integrates seamlessly and grows with the company. Prioritise user-friendliness and vendor support.",
        },
        {
          title: "Design the workflow",
          question:
            "Who needs to approve what, and at which stages? What are your payment policies?",
          plan: "Create a digital approval workflow mirroring your hierarchy and payment terms. Configure rules for auto-approvals and escalations.",
        },
        {
          title: "Integrate with existing systems",
          question:
            "How will the AP solution interact with other business systems? Are there technical constraints?",
          plan: "Work with IT for smooth integration with minimal disruption, and test the integrations thoroughly.",
        },
        {
          title: "Configure invoice processing",
          question: "What data capture method will you use? How will you handle exceptions?",
          plan: "Set up OCR or other capture technology and establish an exception process that keeps manual intervention minimal.",
        },
        {
          title: "Set up payment processing",
          question:
            "Which payment methods will you support? How will you manage schedules and approvals?",
          plan: "Configure payment gateways and approval protocols, automating scheduling based on vendor terms.",
        },
        {
          title: "Establish reporting and analytics",
          question:
            "What reports do you need for compliance and performance? How often do you need them?",
          plan: "Customise dashboards for real-time tracking and regular reporting for decision-making.",
        },
        {
          title: "Plan training and change management",
          question:
            "What training do staff need? How will you address resistance to change?",
          plan: "Develop training programs and communicate the benefits of the new system to encourage adoption.",
        },
        {
          title: "Test and go live",
          question: "Have all scenarios been tested? Is there a rollback plan?",
          plan: "Test extensively with various invoice types and scenarios, and have a contingency plan before going live.",
        },
        {
          title: "Monitor and optimise",
          question: "How is the system performing? Where can improvements be made?",
          plan: "Review performance regularly and solicit feedback for continuous improvement.",
        },
      ],
    },

    { kind: "h", text: "Metrics and KPIs to track" },
    {
      kind: "metrics",
      items: [
        { name: "Invoice processing time", text: "Time taken from receipt to payment." },
        {
          name: "Cost per invoice",
          text: "Total AP operation cost divided by invoices processed.",
        },
        {
          name: "Exception rate",
          text: "Share of invoices that cannot be processed without manual intervention.",
        },
        {
          name: "First-time match rate",
          text: "Invoices matched successfully on the first try.",
        },
        { name: "Approval cycle time", text: "Average time for an invoice to be approved." },
        {
          name: "Early payment discounts captured",
          text: "Discounts taken versus those offered.",
        },
        {
          name: "E-invoicing adoption rate",
          text: "Invoices processed electronically versus on paper.",
        },
        { name: "On-time payment rate", text: "Payments made by the due date." },
        { name: "AP turnover ratio", text: "Number of times AP is paid off in a period." },
      ],
    },
  ],
};

export const articles: Article[] = [
  apAutomation,
  ...hcmArticles,
  ...finaccArticles,
  ...crmArticles,
];

export const articleBySlug = new Map(articles.map((a) => [a.slug, a]));
