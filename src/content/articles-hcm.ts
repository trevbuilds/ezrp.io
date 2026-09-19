/**
 * Long-form guide articles — Human Capital Management batch.
 * Same Article shape as articles.ts.
 */
import type { Article } from "./articles";

const coreHr: Article = {
  slug: "core-hr",
  intro:
    "Core HR is the system of record for people — the employee master, the position and reporting structure, and the effective-dated history that payroll, time, access and finance all read from. An error entered once here is inherited by every system downstream of it.",
  blocks: [
    { kind: "h", text: "Why it matters" },
    {
      kind: "bullets",
      items: [
        { term: "One record", text: "Every downstream process reads the same employee, or they disagree in public." },
        { term: "Effective dating", text: "Pay, access and reporting depend on what was true on a date, not what is true today." },
        { term: "Cost visibility", text: "Position, cost centre and assignment are how labour cost reaches the ledger." },
        { term: "Access and risk", text: "Joiner, mover and leaver events drive provisioning and revocation." },
        { term: "Compliance", text: "Right-to-work, qualifications and mandatory training all hang off the master record." },
        { term: "Analytics", text: "Headcount, turnover and capability reporting are only as good as the master." },
      ],
    },

    { kind: "h", text: "The core HR workflow" },
    {
      kind: "p",
      text: "The sequence below is the joiner-mover-leaver spine. Every HR module is either feeding it or reading from it.",
    },
    {
      kind: "steps",
      items: [
        {
          title: "Position established",
          text: "A funded seat exists before anyone is hired into it.",
          sub: [
            "Legal entity, business unit and cost centre are set.",
            "Grade, job family and delegation limit are attached.",
            "The position is released as a vacancy, not invented at offer stage.",
          ],
        },
        { title: "Candidate hired", text: "The accepted offer becomes a hire event with a start date." },
        {
          title: "Employee record created",
          text: "Personal, employment and payment data is captured once, with the source document retained.",
        },
        { title: "Assignment and reporting line set", text: "The person is attached to the position, the manager and the cost centre." },
        { title: "Access provisioned", text: "Identity, role-based access and physical access are raised from the hire event, not by email." },
        { title: "Entitlements initialised", text: "Pay rate, leave accrual rules, benefits eligibility and superannuation are established." },
        {
          title: "Change events processed",
          text: "Promotions, transfers, rate changes and hours changes are recorded as effective-dated changes rather than overwrites.",
        },
        { title: "Organisational change absorbed", text: "Restructures move positions and reporting lines without breaking history." },
        { title: "Termination and retention", text: "The leaver event triggers final pay, access revocation, asset return and the retention clock." },
      ],
    },

    { kind: "h", text: "How a business implements it" },
    { kind: "sub", text: "For small businesses" },
    {
      kind: "bullets",
      items: [
        { term: "One system", text: "Keep the employee master inside the payroll platform rather than running a spreadsheet beside it." },
        { term: "Minimum viable data", text: "Capture only the fields that drive pay, leave and compliance." },
        { term: "Self-service early", text: "Let employees maintain their own contact and bank details from day one." },
      ],
    },
    { kind: "sub", text: "For medium-sized enterprises" },
    {
      kind: "bullets",
      items: [
        { term: "Position management", text: "Move from person-based to position-based structure so vacancies and budgets are visible." },
        { term: "Manager self-service", text: "Push change events to the manager who owns the decision, with approval routing." },
        { term: "Integration", text: "Make HR the upstream source for payroll, time, identity and finance." },
      ],
    },
    { kind: "sub", text: "For large enterprises" },
    {
      kind: "bullets",
      items: [
        { term: "Global core model", text: "One global template with local extensions for country-specific legal and payroll data." },
        { term: "Effective-dated everything", text: "Support retrospective and future-dated changes across all downstream interfaces." },
        { term: "Data governance", text: "Named ownership per field, with a correction process rather than ad hoc edits." },
        { term: "Identity integration", text: "Drive joiner-mover-leaver into the identity platform automatically." },
      ],
    },
    {
      kind: "callout",
      text: "Whatever the size, decide first which system is the master for people data and make every other system a subscriber. Most HR failures are not feature gaps — they are two systems both believing they are the source of truth.",
    },

    { kind: "h", text: "What solutions are out there?" },
    {
      kind: "p",
      text: "Core HR is usually bought as part of a suite. The real selection criterion is how well it carries effective-dated change out to payroll, time and identity.",
    },
    {
      kind: "bullets",
      items: [
        { term: "SAP SuccessFactors Employee Central", text: "Strong global core model with position management and country extensions." },
        { term: "Workday HCM", text: "Unified worker model with deep effective dating and reporting." },
        { term: "Oracle Fusion HCM", text: "Full suite core HR that sits natively beside Fusion finance." },
        { term: "Dynamics 365 Human Resources", text: "Core HR on Dataverse, typically paired with a partner payroll." },
        { term: "Cornerstone", text: "Talent-led suite with core HR, learning and performance in one record." },
        { term: "Ceridian Dayforce", text: "Single record across HR, time and payroll, calculated continuously." },
        { term: "Employment Hero", text: "Small to mid-market Australian platform combining HR, payroll and onboarding." },
        { term: "ELMO", text: "Australian mid-market suite spanning core HR, recruitment and learning." },
      ],
    },
    { kind: "p", text: "Selection depends on headcount complexity, the number of countries and awards in scope, and what the payroll and identity platforms already are." },

    { kind: "h", text: "Configuring the solution" },
    { kind: "p", text: "Each step has questions to answer and a rough plan that follows from the answers." },
    {
      kind: "qa",
      items: [
        {
          title: "Define the organisation model",
          question: "What are the legal entities, business units and cost centres, and who owns each level?",
          plan: "Agree one hierarchy that finance and HR both accept, and confirm it reconciles to the general ledger structure.",
        },
        {
          title: "Decide the employee data model",
          question: "Which fields drive a downstream outcome, and which are being collected out of habit?",
          plan: "Keep fields that drive pay, entitlement, access or a legal obligation. Retire the rest rather than migrating them.",
        },
        {
          title: "Set effective dating rules",
          question: "How far back may a change be dated, and who may do it?",
          plan: "Define retrospective and future-dated limits, and confirm each downstream interface can consume both.",
        },
        {
          title: "Design position management",
          question: "Is the structure position-based or person-based, and is a position funded before it is filled?",
          plan: "Adopt position-based structure where headcount control matters, and link position to budget and delegation.",
        },
        {
          title: "Map joiner, mover and leaver events",
          question: "What must happen automatically on each event, and what genuinely needs a human?",
          plan: "Document each event end to end, including access, assets, pay and notification, then automate the deterministic parts.",
        },
        {
          title: "Define security and data access",
          question: "Who may see and change which fields, for which population?",
          plan: "Configure role-based access by population and field sensitivity, and separate the ability to change pay from the ability to approve it.",
        },
        {
          title: "Design self-service",
          question: "Which transactions belong to the employee, the manager and HR?",
          plan: "Push routine change to the person who owns the fact, with approval routing that matches the delegation of authority.",
        },
        {
          title: "Plan integrations",
          question: "Which systems subscribe to the employee master, and how often?",
          plan: "Define the interface contract per consumer, including the effective date, the change trigger and the failure path.",
        },
        {
          title: "Plan data migration",
          question: "What history is actually required, and can it be reconciled?",
          plan: "Migrate current state plus the history that pay, leave and service calculations depend on, and reconcile headcount before cutover.",
        },
        {
          title: "Test and cut over",
          question: "Have hire, change and termination been tested through to payroll and access?",
          plan: "Test end to end rather than by module, and verify a retrospective change lands correctly downstream.",
        },
        {
          title: "Govern the data",
          question: "Who owns each field after go-live, and how are errors corrected?",
          plan: "Assign field ownership, publish a correction process, and report on data quality rather than assuming it.",
        },
      ],
    },

    { kind: "h", text: "Metrics and KPIs to track" },
    {
      kind: "metrics",
      items: [
        { name: "Record accuracy", text: "Share of employee records free of defects on audit." },
        { name: "Time to create a hire record", text: "Offer acceptance to a complete, payable record." },
        { name: "Access provisioned by day one", text: "New starters with correct access on their first day." },
        { name: "Effective-dated correction rate", text: "Retrospective corrections per period, by cause." },
        { name: "Downstream interface failure rate", text: "Failed employee records per integration run." },
        { name: "Duplicate employee records", text: "Duplicates found per period." },
        { name: "Manager self-service adoption", text: "Change events raised by managers versus by HR." },
        { name: "Headcount reconciliation variance", text: "Difference between HR headcount and payroll and finance." },
        { name: "Terminations processed on time", text: "Leavers with access revoked and final pay correct by the due date." },
      ],
    },
  ],
};

const payroll: Article = {
  slug: "payroll",
  intro:
    "Payroll is where every other HR and time process is settled in money. It is the least forgiving process in the enterprise: it runs to a fixed date, it is visible to every employee, and errors are legally, industrially and reputationally expensive.",
  blocks: [
    { kind: "h", text: "Why it matters" },
    {
      kind: "bullets",
      items: [
        { term: "Legal obligation", text: "Pay, withholding and retirement contributions are statutory, not discretionary." },
        { term: "Trust", text: "It is the one process every employee audits personally, every cycle." },
        { term: "Cost accuracy", text: "Labour is usually the largest line in the ledger and the hardest to restate." },
        { term: "Cash", text: "The pay run is a scheduled, unavoidable cash event." },
        { term: "Compliance exposure", text: "Award misapplication compounds quietly across thousands of shifts." },
        { term: "Auditability", text: "Every calculation must be explainable years later." },
      ],
    },

    { kind: "h", text: "The basic payroll workflow" },
    { kind: "p", text: "A pay cycle is a fixed-date pipeline. Most failure is upstream of the calculation, not inside it." },
    {
      kind: "steps",
      items: [
        { title: "Input cut-off", text: "Time, leave, new starters, terminations and permanent changes are locked for the period." },
        {
          title: "Time and leave interpreted",
          text: "Approved worked time is converted into payable hours under the applicable award, agreement or policy.",
          sub: [
            "Ordinary hours, overtime and penalties are separated.",
            "Allowances and higher duties are applied.",
            "Leave taken is offset against accrued balances.",
          ],
        },
        {
          title: "Payroll calculation",
          text: "Gross pay, deductions, tax and employer obligations are calculated for every employee in the population.",
          sub: [
            "Gross earnings by code.",
            "Pre-tax and post-tax deductions.",
            "Withholding under the current tax tables.",
            "Employer contributions such as superannuation.",
          ],
        },
        { title: "Validation and variance review", text: "The run is compared to the prior period and to expectation, with outliers investigated before approval." },
        { title: "Approval", text: "A person with the delegation, and not the person who prepared it, approves the run." },
        { title: "Disbursement", text: "The bank file is generated and released under dual control." },
        { title: "General ledger posting", text: "Cost, liability and accrual entries post to the correct cost centres and accounts." },
        { title: "Statutory reporting", text: "Pay event reporting, withholding and contribution obligations are lodged on time." },
        { title: "Reconciliation", text: "Bank, ledger, sub-ledger and statutory reports are reconciled for the period." },
        { title: "Payslips and records", text: "Payslips are issued and records retained for the statutory period." },
      ],
    },

    { kind: "h", text: "How a business implements it" },
    { kind: "sub", text: "For small businesses" },
    {
      kind: "bullets",
      items: [
        { term: "Buy, do not build", text: "Use a compliant cloud payroll that maintains tax tables and statutory reporting for you." },
        { term: "Single award", text: "Confirm which award or agreement applies before configuring anything." },
        { term: "Bank controls", text: "Keep dual authorisation on the payment file even at low headcount." },
      ],
    },
    { kind: "sub", text: "For medium-sized enterprises" },
    {
      kind: "bullets",
      items: [
        { term: "Automated inputs", text: "Interface time, leave and employee change rather than rekeying them." },
        { term: "Variance controls", text: "Build standard pre-approval variance reports into the cycle." },
        { term: "Segregation of duties", text: "Separate the roles that maintain, calculate, approve and release." },
      ],
    },
    { kind: "sub", text: "For large enterprises" },
    {
      kind: "bullets",
      items: [
        { term: "Multi-entity and multi-country", text: "Handle multiple legal employers, currencies and statutory regimes under one calendar." },
        { term: "Complex interpretation", text: "Configure and version award and agreement rules, and test them against real historical shifts." },
        { term: "Controls and audit", text: "Automate reconciliation and retain evidence of every rule change." },
        { term: "Continuous compliance", text: "Re-test interpretation whenever an agreement or rate schedule changes." },
      ],
    },
    {
      kind: "callout",
      text: "Payroll accuracy is decided upstream. If time capture, award interpretation and the employee master are not right, no payroll engine will save the run — it will only calculate the wrong answer faster.",
    },

    { kind: "h", text: "What solutions are out there?" },
    { kind: "p", text: "Payroll is either a module of the HR suite, a specialist engine interfaced to it, or an outsourced bureau service." },
    {
      kind: "bullets",
      items: [
        { term: "SAP SuccessFactors Employee Central Payroll", text: "Enterprise payroll sitting directly on the SuccessFactors core record." },
        { term: "Oracle Fusion Payroll", text: "Native payroll inside Fusion HCM with direct ledger posting." },
        { term: "Ceridian Dayforce", text: "Continuous calculation across time, HR and pay on a single record." },
        { term: "ADP", text: "Managed and in-house payroll across many jurisdictions." },
        { term: "Aurion", text: "Australian enterprise payroll and HR, common in government and utilities." },
        { term: "Frontier Software chris21", text: "Long-standing Australian payroll and HR platform." },
        { term: "Employment Hero", text: "Small to mid-market Australian HR and payroll in one." },
        { term: "Xero Payroll and MYOB", text: "Small business payroll integrated with the accounting ledger." },
      ],
    },
    { kind: "p", text: "Selection turns on award complexity, number of legal entities, and whether payroll is kept in-house or run as a bureau service." },

    { kind: "h", text: "Configuring the solution" },
    { kind: "p", text: "Each step has questions to answer and a rough plan that follows from the answers." },
    {
      kind: "qa",
      items: [
        {
          title: "Confirm the pay population",
          question: "Which legal employers, employment types and countries are in scope?",
          plan: "List every population and confirm the rules that apply to each, including casuals, contractors and expatriates.",
        },
        {
          title: "Define earnings and deduction codes",
          question: "What does each code mean, and how does it behave for tax, contributions and leave accrual?",
          plan: "Build a code catalogue with tax treatment, contribution treatment and ledger mapping stated for every code.",
        },
        {
          title: "Confirm award and agreement rules",
          question: "Which instruments apply, and who owns the interpretation of each clause?",
          plan: "Document each rule with a named owner and a worked example, and version the rule set against its effective date.",
        },
        {
          title: "Design the pay calendar",
          question: "What are the frequencies, cut-offs, processing days and payment dates?",
          plan: "Publish a calendar covering the full year, including public holidays, and work backwards from the payment date to the cut-off.",
        },
        {
          title: "Configure tax and statutory obligations",
          question: "Which withholding, contribution and reporting obligations apply to each population?",
          plan: "Configure current rates and thresholds, and confirm who maintains them when they change.",
        },
        {
          title: "Design the ledger mapping",
          question: "How do cost, liability and accrual post, and at what level of detail?",
          plan: "Map every code to accounts and cost centres, and agree the posting level with finance before the first run.",
        },
        {
          title: "Design approvals and segregation of duties",
          question: "Who prepares, approves and releases, and can one person do two of those?",
          plan: "Configure roles so preparation, approval and bank release are held by different people, and log every override.",
        },
        {
          title: "Plan integrations",
          question: "Where do inputs come from and where do outputs go?",
          plan: "Define interfaces for HR master, time, leave, banking, ledger and statutory reporting, each with a failure and reprocessing path.",
        },
        {
          title: "Plan parallel runs",
          question: "How many cycles will run in parallel and what is the tolerance for variance?",
          plan: "Run at least two full cycles in parallel, reconcile to the cent, and record the cause of every difference.",
        },
        {
          title: "Plan cutover",
          question: "How do year-to-date balances, leave balances and in-flight payments transfer?",
          plan: "Migrate and reconcile year-to-date and entitlement balances, and agree the last run in the old system in writing.",
        },
        {
          title: "Monitor and optimise",
          question: "What went wrong last cycle, and what caused it upstream?",
          plan: "Review off-cycle payments and adjustments by root cause each period, and fix the upstream source rather than the symptom.",
        },
      ],
    },

    { kind: "h", text: "Metrics and KPIs to track" },
    {
      kind: "metrics",
      items: [
        { name: "Payroll accuracy rate", text: "Payslips issued without a correction required." },
        { name: "Off-cycle payment rate", text: "Payments made outside the scheduled run, by cause." },
        { name: "Cost per payslip", text: "Total payroll operating cost divided by payslips produced." },
        { name: "Payroll cycle time", text: "Input cut-off to payment release." },
        { name: "Manual adjustments per run", text: "Interventions required after calculation." },
        { name: "Input interface error rate", text: "Failed time, leave and HR records per cycle." },
        { name: "Statutory lodgement on-time rate", text: "Pay event and contribution obligations lodged by the due date." },
        { name: "Ledger reconciliation variance", text: "Unexplained difference between payroll and the general ledger." },
        { name: "Payroll query volume", text: "Employee queries per hundred payslips." },
        { name: "Overpayment recovery rate", text: "Value recovered against value overpaid." },
      ],
    },
  ],
};

const timeAndAttendance: Article = {
  slug: "time-and-attendance",
  intro:
    "Time and attendance is the bridge between what people actually did and what the organisation pays and books for it. In award-driven environments it is also where most payroll error, and most underpayment exposure, originates.",
  blocks: [
    { kind: "h", text: "Why it matters" },
    {
      kind: "bullets",
      items: [
        { term: "Pay accuracy", text: "Almost every payroll defect traces back to a time or interpretation defect." },
        { term: "Compliance", text: "Award and agreement conditions are applied here, at shift level, thousands of times a period." },
        { term: "Cost control", text: "Overtime, penalties and agency use are visible before they are paid, not after." },
        { term: "Coverage and safety", text: "Fatigue rules, minimum breaks and skill coverage are enforceable only if time is captured." },
        { term: "Costing", text: "Worked time is how labour reaches projects, work orders and assets." },
        { term: "Evidence", text: "A defensible record of hours worked is the first thing asked for in a dispute." },
      ],
    },

    { kind: "h", text: "The basic time and attendance workflow" },
    { kind: "p", text: "The chain runs from planned demand to payable hours. Each hand-off is a place where accuracy is either preserved or lost." },
    {
      kind: "steps",
      items: [
        { title: "Roster built and published", text: "Shifts are planned against demand, availability, skills and rule constraints, then published to employees." },
        {
          title: "Time captured",
          text: "Actual attendance is recorded at the point of work rather than reconstructed later.",
          sub: [
            "Clock, kiosk or biometric terminal on site.",
            "Mobile capture, often with geofencing, for field work.",
            "Timesheet entry for salaried and project-based populations.",
          ],
        },
        { title: "Exceptions raised", text: "Missed punches, unplanned absence, early and late starts and unapproved overtime are flagged automatically." },
        { title: "Correction", text: "The employee or manager resolves exceptions against the roster and the actual event." },
        { title: "Manager approval", text: "The person accountable for the cost approves the time before it becomes payable." },
        {
          title: "Award interpretation",
          text: "Approved raw time is converted into payable hours under the applicable rule set.",
          sub: [
            "Ordinary hours separated from overtime.",
            "Penalties applied by day, time of day and shift pattern.",
            "Allowances, higher duties and on-call applied.",
          ],
        },
        { title: "Leave reconciled", text: "Absence is matched to approved leave and offset against balances." },
        { title: "Payroll export", text: "Payable hours are transferred to payroll before the input cut-off, with a reconciliation of what was sent." },
        { title: "Cost allocation and reporting", text: "Hours and cost are allocated to cost centres, projects or work orders and reported." },
      ],
    },

    { kind: "h", text: "How a business implements it" },
    { kind: "sub", text: "For small businesses" },
    {
      kind: "bullets",
      items: [
        { term: "Simple capture", text: "Use a mobile or kiosk app that feeds payroll directly rather than paper timesheets." },
        { term: "One rule set", text: "Configure the single applicable award properly before adding anything else." },
        { term: "Approve weekly", text: "Keep approval close to the work so memory is still reliable." },
      ],
    },
    { kind: "sub", text: "For medium-sized enterprises" },
    {
      kind: "bullets",
      items: [
        { term: "Rostering and time together", text: "Plan and capture in the same system so variance to roster is visible." },
        { term: "Exception-based management", text: "Only differences should reach a manager's queue." },
        { term: "Interface to payroll", text: "Automate the export and reconcile it every cycle." },
      ],
    },
    { kind: "sub", text: "For large enterprises" },
    {
      kind: "bullets",
      items: [
        { term: "Multiple instruments", text: "Support several awards, agreements and local policies with versioned effective dates." },
        { term: "Fatigue and safety rules", text: "Enforce break, rest and maximum-hours constraints at roster and approval time." },
        { term: "Costing integration", text: "Allocate time to projects, work orders and assets, not just cost centres." },
        { term: "Assurance", text: "Re-test interpretation against real historical shifts whenever rules change." },
      ],
    },
    {
      kind: "callout",
      text: "Treat interpretation as a controlled asset. Rules are configuration that determines legal payment outcomes, so they need version control, a named owner and regression tests against known shift patterns — the same discipline as any other financial calculation.",
    },

    { kind: "h", text: "What solutions are out there?" },
    { kind: "p", text: "Solutions range from lightweight capture apps to full workforce management platforms that roster, interpret and cost." },
    {
      kind: "bullets",
      items: [
        { term: "UKG (Kronos) Dimensions", text: "Enterprise workforce management with deep rule and rostering capability." },
        { term: "Humanforce", text: "Australian workforce management strong in shift-based and award-driven industries." },
        { term: "Deputy", text: "Rostering and time capture for small to mid-size shift workforces." },
        { term: "Tanda", text: "Australian time, rostering and award interpretation feeding payroll." },
        { term: "WorkForce Software", text: "Complex time, absence and fatigue rules at enterprise scale." },
        { term: "Oracle Time and Labor", text: "Native time capture and interpretation inside Fusion HCM." },
        { term: "SAP Time Management", text: "Time evaluation integrated with SuccessFactors and payroll." },
        { term: "Ceridian Dayforce", text: "Time and pay calculated continuously on one record." },
      ],
    },
    { kind: "p", text: "Selection depends on how complex the rules are, whether the workforce is shift-based, and what the payroll engine can already consume." },

    { kind: "h", text: "Configuring the solution" },
    { kind: "p", text: "Each step has questions to answer and a rough plan that follows from the answers." },
    {
      kind: "qa",
      items: [
        {
          title: "Confirm the population and capture method",
          question: "Who must capture time, and where are they physically when they work?",
          plan: "Segment the workforce by work location and employment type, and choose a capture method per segment rather than one for all.",
        },
        {
          title: "Define the rule set",
          question: "Which awards, agreements and policies apply, and who owns each interpretation?",
          plan: "Document every rule with a worked example and a named owner, and version each rule set by effective date.",
        },
        {
          title: "Design rosters against demand",
          question: "What drives demand, and what constrains who can fill a shift?",
          plan: "Model demand drivers, then configure skill, availability, fatigue and cost constraints into the roster build.",
        },
        {
          title: "Set exception tolerances",
          question: "What variance is acceptable without a manager decision?",
          plan: "Configure rounding and grace tolerances explicitly, and confirm they are lawful under the applicable instrument.",
        },
        {
          title: "Design approval",
          question: "Who approves time, and what happens when they do not?",
          plan: "Route approval to the cost owner, with escalation and a defined default that never silently pays unapproved hours.",
        },
        {
          title: "Configure interpretation",
          question: "How are ordinary hours, overtime, penalties and allowances derived?",
          plan: "Build and test the rule engine against real historical shifts, including edge cases like shift crossing midnight and public holidays.",
        },
        {
          title: "Handle the leave interaction",
          question: "How does absence interact with rostered hours and accrual?",
          plan: "Define how each leave type consumes rostered time and accrues, and test part-day and part-time cases.",
        },
        {
          title: "Map cost allocation",
          question: "Where must hours land beyond the cost centre?",
          plan: "Configure allocation to projects, work orders or assets and confirm the receiving system can accept it.",
        },
        {
          title: "Integrate with payroll and HR",
          question: "What is the interface contract and the cut-off?",
          plan: "Define the export format, timing, reconciliation report and reprocessing path for late or corrected time.",
        },
        {
          title: "Test with real pay scenarios",
          question: "Have the hardest shift patterns been tested end to end into a payslip?",
          plan: "Build a scenario library from actual rosters and verify the payslip outcome, not just the interpreted hours.",
        },
        {
          title: "Monitor and optimise",
          question: "Which exceptions recur, and why?",
          plan: "Report exceptions by cause and site each period, and fix the roster, the rule or the behaviour that generates them.",
        },
      ],
    },

    { kind: "h", text: "Metrics and KPIs to track" },
    {
      kind: "metrics",
      items: [
        { name: "Timesheet on-time rate", text: "Time submitted and approved before the payroll cut-off." },
        { name: "Exception rate", text: "Shifts requiring manual intervention before they can be paid." },
        { name: "Manual edit rate", text: "Captured records changed after the fact, by reason." },
        { name: "Interpretation defect rate", text: "Shifts paid incorrectly under the applicable rule set." },
        { name: "Approval cycle time", text: "Shift end to manager approval." },
        { name: "Roster-to-actual variance", text: "Hours worked against hours rostered." },
        { name: "Overtime ratio", text: "Overtime hours as a share of ordinary hours." },
        { name: "Unplanned absence rate", text: "Rostered shifts lost to unplanned absence." },
        { name: "Agency and backfill cost", text: "Cost of covering unfilled shifts." },
      ],
    },
  ],
};

export const hcmArticles: Article[] = [coreHr, payroll, timeAndAttendance];
