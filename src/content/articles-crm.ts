/**
 * Customer Relationship Management branch articles.
 *
 * Prose is migrated from the DX Guides wiki pages for CRM, Marketing
 * Automation, Sales Force Automation, Customer Support and Field Service,
 * re-cast into the ArticleBlock shape and edited to Australian English.
 *
 * Value streams follow published best practice rather than the sequence a
 * wiki page happened to carry: CRM, marketing and sales sit on Lead-to-Cash
 * (SAP's five stages), while support and field service sit on
 * Issue-to-Resolution. Where that departs from the source, the comment says so.
 */

import type { Article } from "./articles";

const customerRelationshipManagement: Article = {
  slug: "customer-relationship-management",
  intro:
    "CRM is where the customer relationship is recorded rather than remembered. In an ERP context its job is to consolidate every touchpoint into one view, so that sales, marketing, service and finance are all working from the same version of the customer.",
  blocks: [
    { kind: "h", text: "Where CRM sits in Lead-to-Cash" },
    {
      kind: "p",
      text: "Lead-to-Cash is the stream that runs from a stranger's first interaction to money in the bank. CRM owns the front of it and hands off to supply chain and finance at the order. Treating it as a self-contained module is the most common way to end up with a sales system that nobody in finance trusts.",
    },
    {
      kind: "steps",
      items: [
        {
          title: "Contact to Lead",
          text: "Marketing generates interest and captures consent. A contact becomes a lead once there is enough signal to act on.",
        },
        {
          title: "Lead to Opportunity",
          text: "The lead is qualified and handed to sales, who judge whether it is worth pursuing and convert it to an opportunity.",
        },
        {
          title: "Opportunity to Quote",
          text: "Sales assess whether the opportunity is ready to be priced, and a quote is raised — by the rep, or by the customer through a web store.",
        },
        {
          title: "Quote to Order",
          text: "The quote is negotiated until agreed, then converted into an order.",
        },
        {
          title: "Order to Cash",
          text: "The order is fulfilled, invoiced and collected. This stage lives in supply chain and finance, not in CRM.",
        },
      ],
    },
    {
      kind: "callout",
      text: "The handover at Quote to Order is where most CRM implementations leak. If the order that lands in the ERP does not match the quote the customer agreed to, no amount of pipeline reporting will save you.",
    },

    { kind: "h", text: "What the module actually does" },
    {
      kind: "bullets",
      items: [
        {
          term: "Contact management",
          text: "Centralises contact detail and the full history of interactions, so the relationship survives a change of account manager.",
        },
        {
          term: "Sales management",
          text: "Tracks opportunities, pipeline and performance against target.",
        },
        {
          term: "Marketing tools",
          text: "Campaign management, lead generation and the analysis that says which of them worked.",
        },
        {
          term: "Customer support",
          text: "Service requests, ticketing and the feedback loop back into the record.",
        },
        {
          term: "Analytics and reporting",
          text: "Insight into customer behaviour, sales trends and marketing effectiveness.",
        },
      ],
    },

    { kind: "h", text: "Setting it up" },
    {
      kind: "bullets",
      items: [
        {
          term: "Integration with other modules",
          text: "CRM must share data with sales, marketing and support, or you have simply bought a second customer database.",
        },
        {
          term: "Data migration",
          text: "Existing customer data comes across checked for accuracy and completeness, not copied wholesale.",
        },
        {
          term: "Customisation",
          text: "Tailor the system to the processes the business actually runs, rather than reshaping the business around a demo.",
        },
        {
          term: "Security settings",
          text: "Access controls and permissions that reflect who should be able to see which customers.",
        },
        {
          term: "User training",
          text: "Sales teams abandon CRM faster than any other module when it feels like admin. Training is adoption work, not a formality.",
        },
      ],
    },

    { kind: "h", text: "Implementing it" },
    {
      kind: "steps",
      items: [
        {
          title: "Requirements gathering",
          text: "Define what this business needs CRM to do, in its own words.",
        },
        {
          title: "Vendor selection",
          text: "Choose a CRM that integrates with the existing ERP, or an ERP whose built-in CRM is good enough.",
        },
        {
          title: "Customisation and configuration",
          text: "Configure against the documented processes.",
        },
        {
          title: "Data migration",
          text: "Move existing customer data with a cleansing pass, not a straight copy.",
        },
        {
          title: "Integration",
          text: "Wire up real-time exchange with the other ERP modules.",
        },
        {
          title: "Testing",
          text: "Prove the whole Lead-to-Cash path end to end, not each component in isolation.",
        },
        { title: "Training", text: "Get users genuinely comfortable before go-live." },
        {
          title: "Go-live",
          text: "Launch, then watch adoption and data quality closely in the first weeks.",
        },
      ],
    },

    { kind: "h", text: "Questions to ask vendors" },
    {
      kind: "qa",
      items: [
        {
          title: "Integration",
          question: "How does the CRM integrate with our existing ERP?",
          plan: "Ask for the actual integration pattern and which objects sync in which direction, not a logo slide.",
        },
        {
          title: "Customisation",
          question: "What customisation is available to fit our sales process?",
          plan: "Establish what is configuration, what is code, and what will break on upgrade.",
        },
        {
          title: "Privacy and security",
          question: "How does the CRM handle data privacy and security?",
          plan: "Confirm where customer data is hosted and how access is controlled and audited.",
        },
        {
          title: "Support",
          question: "What training and support services are offered?",
          plan: "Pin down what is included in licence cost and what is billable.",
        },
        {
          title: "Scale",
          question: "Can the CRM scale as the business grows?",
          plan: "Test against realistic record volumes and user counts, not the current headcount.",
        },
      ],
    },

    { kind: "h", text: "Metrics and KPIs to track" },
    {
      kind: "metrics",
      items: [
        {
          name: "Customer satisfaction score",
          text: "How customers rate their dealings with the business.",
        },
        {
          name: "Sales conversion rate",
          text: "Share of qualified leads that become customers.",
        },
        { name: "Average deal size", text: "Average revenue per closed deal." },
        {
          name: "Customer retention rate",
          text: "Share of customers retained over a period.",
        },
        {
          name: "Marketing ROI",
          text: "Return generated by marketing spend.",
        },
      ],
    },
  ],
};

const marketingAutomation: Article = {
  slug: "marketing-automation",
  intro:
    "Marketing automation is the Contact to Lead stage of Lead-to-Cash made repeatable: campaigns run across channels on their own, and the interactions they generate are scored and handed to sales rather than sitting in a marketing tool nobody else can see.",
  blocks: [
    { kind: "h", text: "Why it matters" },
    {
      kind: "bullets",
      items: [
        {
          term: "Lead nurturing",
          text: "Moves prospects toward a buying decision without a person chasing each one.",
        },
        {
          term: "Productivity",
          text: "Automates the repetitive send-and-follow-up work that otherwise consumes a marketing team.",
        },
        {
          term: "Measurable campaigns",
          text: "Produces analytics on campaigns and engagement, so spend can be argued for with evidence.",
        },
        {
          term: "One view of the customer",
          text: "Sales, marketing and service see the same interaction history.",
        },
      ],
    },

    { kind: "h", text: "The workflow" },
    {
      kind: "p",
      text: "This sequence sits entirely inside the Contact to Lead stage, and ends the moment a qualified lead is handed to sales.",
    },
    {
      kind: "steps",
      items: [
        {
          title: "Lead capture",
          text: "Collect detail from landing pages, social channels and events, and store it against the CRM record.",
        },
        {
          title: "Segmentation",
          text: "Classify leads by behaviour, demographics and engagement.",
        },
        {
          title: "Campaign execution",
          text: "Run targeted campaigns against those segments through automated workflows.",
        },
        {
          title: "Lead nurturing",
          text: "Deliver relevant content at the right point to move the lead along.",
        },
        {
          title: "Evaluation and scoring",
          text: "Score leads on engagement and likelihood to convert, so follow-up is prioritised.",
        },
        {
          title: "Handover to sales",
          text: "Pass qualified leads to the sales team inside the CRM for personal follow-up.",
        },
        {
          title: "Analysis and reporting",
          text: "Measure campaign effectiveness and adjust.",
        },
      ],
    },
    {
      kind: "callout",
      text: "Lead scoring is where marketing and sales either agree or quietly stop trusting each other. Define the scoring criteria jointly, and revisit them once real conversion data exists.",
    },

    { kind: "h", text: "What you need in place" },
    {
      kind: "bullets",
      items: [
        {
          term: "CRM integration",
          text: "The automation tool has to read and write the same customer data the CRM holds.",
        },
        {
          term: "Email and channel tools",
          text: "Automated communication triggered by customer action rather than by calendar.",
        },
        {
          term: "Lead management",
          text: "Capture, track and manage leads across their whole lifecycle.",
        },
        {
          term: "Segmentation",
          text: "Build detailed segments from CRM data rather than from exported spreadsheets.",
        },
        {
          term: "Lead scoring",
          text: "An agreed model for prioritising leads by engagement and fit.",
        },
      ],
    },

    { kind: "h", text: "Questions to ask vendors" },
    {
      kind: "qa",
      items: [
        {
          title: "Integration",
          question: "How does the tool integrate with our existing CRM?",
          plan: "Confirm whether the integration is native, and what it costs to keep working.",
        },
        {
          title: "Scoring model",
          question: "Can we customise lead scoring to fit our business?",
          plan: "Check whether scoring rules can be changed by marketing or need a developer.",
        },
        {
          title: "Journey handling",
          question: "How does the tool handle nurturing across stages of the customer journey?",
          plan: "Walk a real journey through the product rather than accepting a diagram.",
        },
        {
          title: "Attribution",
          question: "How do we measure ROI of automation efforts?",
          plan: "Establish what attribution model is available and whether finance will accept it.",
        },
      ],
    },

    { kind: "h", text: "Metrics and KPIs to track" },
    {
      kind: "metrics",
      items: [
        {
          name: "Conversion rate",
          text: "Share of leads that become customers.",
        },
        {
          name: "Lead generation volume",
          text: "Number of new leads captured.",
        },
        {
          name: "Engagement rate",
          text: "How actively leads interact with campaigns.",
        },
        {
          name: "Campaign ROI",
          text: "Return on investment for a given marketing effort.",
        },
        {
          name: "Customer lifetime value",
          text: "Total value a customer is expected to bring over the relationship.",
        },
      ],
    },
  ],
};

const salesForceAutomation: Article = {
  slug: "sales-force-automation",
  intro:
    "Sales force automation covers the middle of Lead-to-Cash — Lead to Opportunity, Opportunity to Quote, and Quote to Order. It is the part of CRM that turns a qualified lead into a priced, agreed, bookable order.",
  blocks: [
    { kind: "h", text: "Why it matters in an ERP context" },
    {
      kind: "p",
      text: "Integrating sales automation into the ERP makes sales activity visible across the whole organisation, and keeps information flowing between sales, finance, inventory and service. Without it, the sales pipeline is a forecast nobody else can verify.",
    },

    { kind: "h", text: "The workflow" },
    {
      kind: "steps",
      items: [
        {
          title: "Lead management",
          text: "Capture leads from their various sources, track activity, and manage qualification.",
        },
        {
          title: "Contact and account management",
          text: "Hold detailed contact and account records, including communication history and related opportunities.",
        },
        {
          title: "Opportunity management",
          text: "Track opportunities from creation to closure, with stages, activities and probabilities.",
        },
        {
          title: "Quote and order management",
          text: "Generate quotes against customer requirements and convert them to orders once approved.",
        },
        {
          title: "Sales forecasting",
          text: "Use historical data and predictive analysis to forecast, which drives planning and resourcing.",
        },
        {
          title: "Task and activity management",
          text: "Organise sales activity, schedule tasks and set follow-up reminders.",
        },
        {
          title: "Performance management",
          text: "Monitor performance against target and report on it.",
        },
      ],
    },
    {
      kind: "callout",
      text: "Quoting is the stage most ERP sales configuration actually turns on — pricing rules, discount authority and approval limits all land here. It is worth more design time than lead capture.",
    },

    { kind: "h", text: "What you need in place" },
    {
      kind: "bullets",
      items: [
        {
          term: "Marketing automation integration",
          text: "So leads transition from marketing to sales without a manual rekey.",
        },
        {
          term: "Customisation and configuration",
          text: "Match the system to the sales process, workflows and reporting the business runs.",
        },
        {
          term: "Data management and migration",
          text: "Clean, accurate and complete data moved from the existing system.",
        },
        {
          term: "User training and adoption",
          text: "Sales teams need to see the system pay them back, or they will keep their own spreadsheet.",
        },
        {
          term: "Security and access controls",
          text: "Access rights that protect commercially sensitive pipeline information.",
        },
      ],
    },

    { kind: "h", text: "Implementing it" },
    {
      kind: "steps",
      items: [
        {
          title: "Requirement analysis",
          text: "Define the sales process requirements, reporting needs and integration points.",
        },
        {
          title: "Solution selection",
          text: "Choose against those requirements, weighing scale and customisation.",
        },
        {
          title: "System design and customisation",
          text: "Design layout, customise fields and configure workflows.",
        },
        {
          title: "Data migration",
          text: "Move existing sales data with integrity checks.",
        },
        {
          title: "Integration",
          text: "Connect to the other ERP modules and any external systems.",
        },
        {
          title: "Training and go-live",
          text: "Train users and go live with support in place for the first weeks.",
        },
      ],
    },

    { kind: "h", text: "Metrics and KPIs to track" },
    {
      kind: "metrics",
      items: [
        {
          name: "Sales cycle length",
          text: "Average time from lead capture to closed deal.",
        },
        {
          name: "Conversion rate",
          text: "Share of leads that convert to sales.",
        },
        { name: "Average deal size", text: "Average revenue per closed deal." },
        {
          name: "Pipeline health",
          text: "Total value of opportunities by stage.",
        },
        {
          name: "Sales rep performance",
          text: "Individual performance against target.",
        },
      ],
    },
  ],
};

const customerSupport: Article = {
  slug: "customer-support",
  intro:
    "Customer support is a different stream to the one that won the customer. Issue-to-Resolution starts with a case, not a lead, and ends in a resolved problem and a recorded piece of feedback — not an order.",
  blocks: [
    { kind: "h", text: "Why it matters in an ERP context" },
    {
      kind: "p",
      text: "Support inside the ERP can draw on everything the system already knows — the customer's orders, their history, what they were shipped and when. That is the difference between a personalised answer and asking the customer to explain their own account back to you.",
    },

    { kind: "h", text: "The workflow" },
    {
      kind: "steps",
      items: [
        {
          title: "Inquiry initiation",
          text: "A customer makes contact through one of the available channels.",
        },
        {
          title: "Ticket generation",
          text: "The system raises a support ticket and logs the detail of the inquiry.",
        },
        {
          title: "Assignment and notification",
          text: "The ticket is assigned to a representative, who is notified of the new case.",
        },
        {
          title: "Issue resolution",
          text: "The representative draws on ERP data to resolve it, involving other departments where needed.",
        },
        {
          title: "Follow-up and feedback",
          text: "The customer is contacted for feedback once resolved, and it is logged against the record.",
        },
      ],
    },
    {
      kind: "callout",
      text: "The DX Guides wiki carried the Sales Force Automation workflow on this page. Support is not a sales process: it begins with a case and ends with a resolution, and modelling it as a pipeline produces the wrong metrics and the wrong queue behaviour.",
    },

    { kind: "h", text: "What you need in place" },
    {
      kind: "bullets",
      items: [
        {
          term: "Multi-channel integration",
          text: "Email, phone, live chat and self-service portals all landing in the same queue.",
        },
        {
          term: "Customer data management",
          text: "Centralised customer data so a representative is not searching three systems mid-call.",
        },
        {
          term: "Knowledge base management",
          text: "A maintained repository of answers, for both self-service and agent use.",
        },
        {
          term: "Ticket management",
          text: "Tracking, assignment and escalation that someone actually owns.",
        },
        {
          term: "Feedback and reporting",
          text: "Tools for collecting feedback and reporting on support performance.",
        },
      ],
    },

    { kind: "h", text: "Implementing it" },
    {
      kind: "steps",
      items: [
        {
          title: "Define the support process",
          text: "Map it end to end, from inquiry through resolution to feedback.",
        },
        {
          title: "Select and customise modules",
          text: "Choose the modules that support service operations and configure them to the mapped process.",
        },
        {
          title: "Integrate communication channels",
          text: "Bring every channel into one support experience.",
        },
        {
          title: "Train support staff",
          text: "On the system and on the procedures around it.",
        },
        {
          title: "Deploy the knowledge base",
          text: "Make it accessible to customers and staff alike.",
        },
        {
          title: "Implement feedback mechanisms",
          text: "Set up collection and analysis of customer feedback.",
        },
      ],
    },

    { kind: "h", text: "Questions to ask vendors" },
    {
      kind: "qa",
      items: [
        {
          title: "Channels",
          question: "How does the system integrate with different communication channels?",
          plan: "Confirm which channels are native and which need middleware.",
        },
        {
          title: "Ticketing",
          question: "What features exist for ticket management and tracking?",
          plan: "Check escalation, SLA handling and queue routing against real scenarios.",
        },
        {
          title: "Reporting",
          question: "Can the system report on support performance?",
          plan: "Ask to see the standard reports rather than a report builder.",
        },
        {
          title: "Knowledge base",
          question: "What tools exist for knowledge base management?",
          plan: "Establish who can author and approve articles, and how stale content is found.",
        },
      ],
    },

    { kind: "h", text: "Metrics and KPIs to track" },
    {
      kind: "metrics",
      items: [
        {
          name: "First response time",
          text: "Time taken to acknowledge an inquiry.",
        },
        {
          name: "Resolution time",
          text: "Average time to resolve an issue.",
        },
        {
          name: "Customer satisfaction (CSAT)",
          text: "Customer rating of the support received.",
        },
        {
          name: "Ticket volume trends",
          text: "How ticket numbers move over time, and why.",
        },
        {
          name: "Self-service usage",
          text: "How far customers resolve their own issues through the knowledge base.",
        },
      ],
    },
  ],
};

const fieldService: Article = {
  slug: "field-service",
  intro:
    "Field service is Issue-to-Resolution carried out at the customer's site rather than over a phone line. It manages resources that are away from the business's own premises, and it only truly closes when the work has been recorded and billed.",
  blocks: [
    { kind: "h", text: "Why it matters in an ERP context" },
    {
      kind: "p",
      text: "Field service bridges office processes and field operations. Done properly it keeps data flowing between the two, which is what makes scheduling, parts availability and invoicing agree with one another.",
    },
    {
      kind: "bullets",
      items: [
        {
          term: "Customer satisfaction",
          text: "Service arrives when it was promised, with the right parts.",
        },
        {
          term: "Resource utilisation",
          text: "Scheduling and dispatch that makes proper use of technician time and skills.",
        },
        {
          term: "Visibility",
          text: "Real-time insight into what is happening in the field.",
        },
        {
          term: "Inventory control",
          text: "Parts and equipment tracked against jobs rather than disappearing into vans.",
        },
      ],
    },

    { kind: "h", text: "The workflow" },
    {
      kind: "p",
      text: "Note that this sequence ends at billing. Confirming the job is not the end of the stream — capturing parts and labour is what connects field work back to revenue.",
    },
    {
      kind: "steps",
      items: [
        {
          title: "Service request creation",
          text: "Raised by a customer call, or automatically by a connected device.",
        },
        {
          title: "Service order management",
          text: "Generate and schedule orders against priority, technician availability and location.",
        },
        {
          title: "Dispatching",
          text: "Assign the order to a technician with the detail, parts and instructions needed.",
        },
        {
          title: "Service execution",
          text: "The technician performs the work and records what was done, what was used, and the customer sign-off.",
        },
        {
          title: "Billing and payment",
          text: "Invoice against the completed service and process payment.",
        },
      ],
    },

    { kind: "h", text: "What you need in place" },
    {
      kind: "bullets",
      items: [
        {
          term: "Service catalogue",
          text: "A defined set of services the business offers.",
        },
        {
          term: "Resource management",
          text: "Technicians, their skills and their availability held as data.",
        },
        {
          term: "Inventory management",
          text: "Parts and equipment needed for field work, tracked to the van and the job.",
        },
        {
          term: "Scheduling and dispatch",
          text: "Tools that automate assignment rather than relying on a whiteboard.",
        },
        {
          term: "Mobile access",
          text: "Applications that let technicians update job status in real time, including offline.",
        },
        {
          term: "Customer portal",
          text: "So customers can request service, track status and pay.",
        },
      ],
    },

    { kind: "h", text: "Built-in or specialist?" },
    {
      kind: "p",
      text: "Some ERPs ship field service capability; specialist products exist for industries whose service model is unusual. The question is not which is better but whether the specialist's advantage outweighs another integration to maintain.",
    },
    {
      kind: "bullets",
      items: [
        {
          term: "Compatibility",
          text: "Whether the product integrates without extensive customisation.",
        },
        {
          term: "Functionality against need",
          text: "Whether its industry-specific features match what this business actually does.",
        },
        {
          term: "Vendor support",
          text: "Whether there is real support and an active user community behind it.",
        },
      ],
    },
    {
      kind: "callout",
      text: "Industries with genuinely distinct field service models — telecommunications, utilities, healthcare equipment, heavy manufacturing — are where specialist tools earn their integration cost. Elsewhere, the ERP's own module is usually enough.",
    },

    { kind: "h", text: "Questions to ask vendors" },
    {
      kind: "qa",
      items: [
        {
          title: "Integration",
          question: "How does the module integrate with the rest of the ERP?",
          plan: "Confirm how inventory, CRM and accounting stay in step with field activity.",
        },
        {
          title: "Scheduling",
          question: "Can it support real-time scheduling and dispatch?",
          plan: "Test against a realistic day, including same-day reschedules.",
        },
        {
          title: "Mobile",
          question: "Is there a mobile app for technicians, and what can it do?",
          plan: "Check offline behaviour specifically — field work happens where coverage does not.",
        },
        {
          title: "Parts",
          question: "How does it handle parts and inventory?",
          plan: "Follow a part from warehouse to van to job to invoice.",
        },
      ],
    },

    { kind: "h", text: "Metrics and KPIs to track" },
    {
      kind: "metrics",
      items: [
        {
          name: "First-time fix rate",
          text: "Share of issues resolved on the first visit.",
        },
        {
          name: "Customer satisfaction (CSAT)",
          text: "Customer feedback following the service call.",
        },
        {
          name: "Technician utilisation",
          text: "How effectively technician time and skills are used.",
        },
        {
          name: "Service completion rate",
          text: "Calls completed within the expected timeframe.",
        },
      ],
    },
  ],
};

export const crmArticles: Article[] = [
  customerRelationshipManagement,
  marketingAutomation,
  salesForceAutomation,
  customerSupport,
  fieldService,
];
