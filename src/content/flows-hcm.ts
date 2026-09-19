/**
 * End-to-end flows — Human Capital Management batch.
 * Same Flow shape as flows.ts.
 */
import type { Flow } from "./flows";

const coreHrFlow: Flow = {
  slug: "core-hr",
  title: "Org design → Core HR → Downstream → and beyond",
  summary:
    "Where a person actually travels: the organisation creates a funded seat, core HR records who sits in it and when that changed, every downstream system subscribes to that record, and the tail end is cost, access and workforce reporting.",
  lanes: [
    {
      id: "org",
      layer: "Organisation design",
      blurb: "What has to exist before anyone can be hired into it.",
      steps: [
        { label: "Legal entity structure", note: "Who is the employer of record." },
        { label: "Cost centre hierarchy", note: "Where labour cost lands in the ledger." },
        { label: "Job catalogue", note: "Job families and levels that stay stable." },
        { label: "Position and grade", note: "The funded seat, not the person." },
        { label: "Delegation of authority", note: "Who may approve what.", slug: "sod-and-rbac" },
      ],
    },
    {
      id: "corehr",
      layer: "Core HR",
      blurb: "The employee master and its effective-dated history.",
      slug: "core-hr",
      steps: [
        { label: "Hire event", note: "The accepted offer becomes a record." },
        { label: "Employee master", note: "Personal, employment and payment data." },
        { label: "Assignment", note: "Position, manager and cost centre." },
        { label: "Effective-dated change", note: "Promotions and transfers without losing history." },
        { label: "Termination", note: "The leaver event that triggers everything else." },
      ],
    },
    {
      id: "downstream",
      layer: "Downstream",
      blurb: "Everything that subscribes to the master rather than keeping its own copy.",
      steps: [
        { label: "Payroll", note: "Pay rate, tax and contribution setup.", slug: "payroll" },
        { label: "Time and attendance", note: "Who may be rostered and at what rate.", slug: "time-and-attendance" },
        { label: "Leave management", note: "Accrual rules from service and hours.", slug: "leave-management" },
        { label: "Benefits", note: "Eligibility driven by the assignment.", slug: "benefits" },
        { label: "Access provisioning", note: "Role-based access raised from the hire event.", slug: "sod-and-rbac" },
      ],
    },
    {
      id: "beyond",
      layer: "And beyond",
      blurb: "What the employee record turns into once other systems have it.",
      steps: [
        { label: "General ledger", note: "Where labour cost and liability post.", slug: "general-ledger" },
        { label: "Workforce analytics", note: "Headcount, turnover and capability.", slug: "workforce-analytics" },
        { label: "Compliance", note: "Right to work, qualifications, mandatory training.", slug: "compliance" },
        { label: "Integration", note: "The contract each subscriber consumes.", slug: "integration" },
        { label: "Data migration", note: "How history arrived in the first place.", slug: "data-migration" },
      ],
    },
  ],
};

const payrollFlow: Flow = {
  slug: "payroll",
  title: "HR → Time → Payroll → and beyond",
  summary:
    "Where a pay run actually comes from: core HR supplies who and at what rate, time supplies what they did, payroll calculates and approves it, automation removes the handling between those steps, and the tail end is banking, ledger and statutory reporting.",
  lanes: [
    {
      id: "hr",
      layer: "Core HR",
      blurb: "Who is being paid, and under what terms.",
      slug: "core-hr",
      steps: [
        { label: "Employee master", note: "The record payroll is calculated against." },
        { label: "Assignment and rate", note: "Position, hours and pay rate." },
        { label: "Bank and contribution details", note: "Where the money and super go." },
        { label: "Tax declaration", note: "Withholding basis for the individual." },
        { label: "Starters and leavers", note: "The events that change the population." },
      ],
    },
    {
      id: "time",
      layer: "Time and attendance",
      blurb: "What they actually did in the period.",
      slug: "time-and-attendance",
      steps: [
        { label: "Approved worked time", note: "Signed off by the cost owner." },
        { label: "Award interpretation", note: "Raw time converted to payable hours.", slug: "award-interpretation" },
        { label: "Leave taken", note: "Absence offset against balances.", slug: "leave-management" },
        { label: "Allowances and penalties", note: "Conditions applied at shift level." },
        { label: "Payroll export", note: "Sent before the input cut-off." },
      ],
    },
    {
      id: "payroll",
      layer: "Payroll",
      blurb: "The recorded pay cycle — the process automation is applied to.",
      slug: "payroll",
      steps: [
        { label: "Input cut-off", note: "The period is locked." },
        { label: "Calculation", note: "Gross, deductions, tax and employer cost." },
        { label: "Variance review", note: "Compared to prior period before approval." },
        { label: "Approval", note: "By someone other than the preparer." },
        { label: "Disbursement", note: "Bank file released under dual control." },
      ],
    },
    {
      id: "automation",
      layer: "Payroll automation",
      blurb: "The layer that removes the handling between those steps.",
      slug: "payroll-automation",
      steps: [
        { label: "Straight-through inputs", note: "Time and HR change arrive without rekeying." },
        { label: "Rules-based interpretation", note: "Conditions applied without a spreadsheet." },
        { label: "Exception-only review", note: "Only outliers reach a person." },
        { label: "Automated lodgement", note: "Statutory reporting filed from the run." },
        { label: "Digital audit trail", note: "Every rule and approval retained." },
      ],
    },
    {
      id: "beyond",
      layer: "And beyond",
      blurb: "What the pay run turns into once it leaves payroll.",
      steps: [
        { label: "Payments", note: "The disbursement channel.", slug: "payments" },
        { label: "EFT files", note: "The bank file format.", slug: "eft-files" },
        { label: "ABA", note: "The Australian bank file.", slug: "aba" },
        { label: "General ledger", note: "Cost, liability and accrual postings.", slug: "general-ledger" },
        { label: "Bank reconciliation", note: "Payments matched back to statements.", slug: "bank-reconciliation" },
        { label: "Single Touch Payroll", note: "Pay event reporting to the ATO.", slug: "single-touch-payroll" },
      ],
    },
  ],
};

const timeFlow: Flow = {
  slug: "time-and-attendance",
  title: "Roster → Capture → Interpretation → and beyond",
  summary:
    "Where an hour actually travels: demand produces a roster, capture records what happened against it, interpretation turns raw time into payable hours, and the tail end is pay, cost allocation and compliance evidence.",
  lanes: [
    {
      id: "plan",
      layer: "Planning",
      blurb: "Deciding who works when, before anyone turns up.",
      slug: "rostering-and-scheduling",
      steps: [
        { label: "Demand forecast", note: "How much coverage the work requires." },
        { label: "Availability and skills", note: "Who can lawfully and competently fill it." },
        { label: "Shift build", note: "Cost and rule constraints applied." },
        { label: "Published roster", note: "The baseline actuals are measured against." },
        { label: "Shift swaps", note: "Changes that must survive to payroll." },
      ],
    },
    {
      id: "capture",
      layer: "Capture",
      blurb: "Recording what actually happened at the point of work.",
      slug: "time-and-attendance",
      steps: [
        { label: "Clock, kiosk or mobile", note: "Attendance recorded at the point of work." },
        { label: "Timesheet entry", note: "Salaried and project-based populations." },
        { label: "Exception flags", note: "Missed punches, unplanned absence, unapproved overtime." },
        { label: "Correction", note: "Resolved against the roster and the event." },
        { label: "Manager approval", note: "The cost owner signs it off." },
      ],
    },
    {
      id: "interpret",
      layer: "Interpretation",
      blurb: "Turning raw time into hours that can lawfully be paid.",
      slug: "award-interpretation",
      steps: [
        { label: "Ordinary hours", note: "The base separated from everything else." },
        { label: "Overtime and penalties", note: "By day, time of day and pattern." },
        { label: "Allowances", note: "Higher duties, on-call, site conditions." },
        { label: "Leave offsets", note: "Absence matched to approved leave.", slug: "leave-management" },
        { label: "Payable hours", note: "The output payroll consumes." },
      ],
    },
    {
      id: "beyond",
      layer: "And beyond",
      blurb: "What an approved hour turns into once it leaves time.",
      steps: [
        { label: "Payroll", note: "Where hours become money.", slug: "payroll" },
        { label: "Project costing", note: "Time charged to projects and work.", slug: "project-management" },
        { label: "General ledger", note: "Labour cost by cost centre.", slug: "general-ledger" },
        { label: "Compliance", note: "Evidence of hours, breaks and conditions.", slug: "compliance" },
        { label: "Workforce analytics", note: "Overtime, absence and coverage trends.", slug: "workforce-analytics" },
      ],
    },
  ],
};

export const hcmFlows: Flow[] = [coreHrFlow, payrollFlow, timeFlow];
