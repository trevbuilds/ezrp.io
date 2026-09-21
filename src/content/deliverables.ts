/**
 * Build deliverables: the documents a programme actually has to produce.
 *
 * Scoping tells you what is in. Building starts with writing things down, and
 * the things worth writing down first are the same five on nearly every
 * programme: the case for doing it, how it will be run, how requirements will
 * be produced, how design gets decided in a room, and who it lands on.
 *
 * Every one of these is usually started from a template someone had lying
 * around, which is why so many of them are filled with the previous
 * programme's assumptions. The useful part of a template is not its headings —
 * it is knowing what has to be gathered before the headings can be answered
 * honestly. So each deliverable here starts with its inputs: what the input
 * is, where it comes from, who owns it, and whether the document can be
 * drafted without it.
 *
 * All five are alpha. The inputs are the part that is settled; the generated
 * output is not built yet.
 */

export type InputSource =
  /** Answered on /start — industry, country, size, org type, areas changing. */
  | "questionnaire"
  /** Derived from the picks on /scope. */
  | "scope"
  /** Covered by a guide in the library. */
  | "library"
  /** Only the organisation has it. Nothing can generate this. */
  | "client";

export const inputSourceLabel: Record<InputSource, string> = {
  questionnaire: "From /start",
  scope: "From /scope",
  library: "In the library",
  client: "Only you have it",
};

export type DeliverableInput = {
  name: string;
  /** What the input actually is, in enough detail to go and get it. */
  what: string;
  source: InputSource;
  owner: string;
  /** The library topic that covers it, where one does. */
  topic?: string;
  /** False means the document can be drafted around it and marked open. */
  blocking: boolean;
};

export type Deliverable = {
  slug: string;
  name: string;
  /** Short label for the nav dropdown. */
  short: string;
  status: "alpha";
  /** One line, for listings. */
  summary: string;
  /** What the document is for. */
  purpose: string;
  audience: string;
  /** The decision it exists to support. Documents without one are filing. */
  decision: string;
  inputs: DeliverableInput[];
  /** The outline. Headings only — the inputs are what fill them. */
  sections: string[];
  /** What separates a useful one from a compliant one. */
  done: string[];
};

export const deliverables: Deliverable[] = [
  // --------------------------------------------------- Investment brief
  {
    slug: "investment-brief",
    name: "Investment decision brief",
    short: "Investment brief",
    status: "alpha",
    summary:
      "What goes in front of the people who hold the delegation: the ask, the options, the three numbers they will ask about, and what happens if they wait.",
    purpose:
      "To let senior leaders decide in one sitting. The business case is the analysis; this is the decision. Boards do not decline investments because the analysis was thin — they defer them because the ask was unclear.",
    audience: "Board, executive committee, or whoever holds the investment delegation.",
    decision: "Approve, approve a smaller version, defer with a named condition, or decline.",
    inputs: [
      {
        name: "The ask, stated as a decision",
        what: "The amount, the delegation it sits under, and what approval actually authorises — the whole programme, or the next stage only. Stage-gated asks get approved more often and cost less to be wrong about.",
        source: "client",
        owner: "Sponsor",
        blocking: true,
      },
      {
        name: "The three numbers",
        what: "Total cost to deliver, the change to ongoing run cost, and the quantified benefit. Leaders will ask for these whatever else is in the pack, and the run cost is the one usually missing.",
        source: "library",
        owner: "Finance",
        topic: "erp-project-budgeting",
        blocking: true,
      },
      {
        name: "Options on one page, including doing nothing",
        what: "Fix, upgrade, replace and defer, each with its cost and its consequence. A single-option paper is a request for endorsement, not a decision.",
        source: "library",
        owner: "Sponsor and finance",
        topic: "finding-the-one",
        blocking: true,
      },
      {
        name: "Cost of delay",
        what: "What twelve months of waiting costs and what it forecloses — end of support, a regulatory deadline, a retiring capability. If delay is free, expect it.",
        source: "client",
        owner: "Sponsor",
        topic: "erp-health-check",
        blocking: true,
      },
      {
        name: "Accountability",
        what: "The named sponsor, whether they will still hold the role at the end, and who owns each benefit. Sponsor turnover is one of the more reliable predictors of failure.",
        source: "client",
        owner: "Executive",
        topic: "change-is-the-word",
        blocking: true,
      },
      {
        name: "Capacity answer, honestly",
        what: "Who does this work and what they stop doing. If the answer is the same people who are already fully committed, the pack should say so rather than let the board assume otherwise.",
        source: "client",
        owner: "Executive",
        topic: "digital-transformation-readiness-checklist",
        blocking: true,
      },
      {
        name: "What we are not doing",
        what: "Named exclusions. Boards approve scope by implication, so anything unstated is assumed included and becomes a change request later.",
        source: "scope",
        owner: "Sponsor",
        blocking: true,
      },
      {
        name: "The two or three risks that could stop it",
        what: "Not the delivery register — the risks material to the investment decision, each with what would mitigate it and what it would cost.",
        source: "library",
        owner: "Delivery",
        topic: "digital-transformation-readiness-checklist",
        blocking: false,
      },
      {
        name: "Stop condition and the next gate",
        what: "What would bring this back to the board, and what the next gate has to prove. An investment with no stop condition cannot be governed after approval.",
        source: "library",
        owner: "Sponsor",
        topic: "pmo",
        blocking: false,
      },
      {
        name: "Assurance position",
        what: "Who has independently checked the numbers and the readiness, and what they found. An unassured pack puts the board in the position of being the assurance.",
        source: "library",
        owner: "Assurance",
        topic: "be-a-hero",
        blocking: false,
      },
    ],
    sections: [
      "The ask, and what approval authorises",
      "Why now, and the cost of waiting",
      "Options and the recommendation",
      "Cost, run-cost impact and funding",
      "Benefits, owners and when they land",
      "What we are not doing",
      "Risks that could stop it",
      "Accountability, assurance and the next gate",
    ],
    done: [
      "It can be read and decided in one sitting.",
      "It names the delegation the approval sits under.",
      "Doing nothing and deferring are both costed.",
      "The capacity answer is honest, including when it is uncomfortable.",
      "There is a stated condition that would bring it back to the board.",
      "Every benefit has an owner who is not the programme.",
    ],
  },

  // ------------------------------------------------------- Business case
  {
    slug: "business-case",
    name: "Business case",
    short: "Business case",
    status: "alpha",
    summary:
      "The case for spending the money, with the costs that are usually left out and benefits that somebody has agreed to own.",
    purpose:
      "To let an investment decision be made on a full cost, a measurable benefit and a named alternative — rather than on a vendor quote and a strategic sentence.",
    audience: "Board, executive, or whoever holds the investment delegation.",
    decision: "Fund it, fund a smaller version of it, or do something else.",
    inputs: [
      {
        name: "Problem statement, in one sentence",
        what: "What is actually wrong, stated so that the scope follows from it. If it takes a paragraph, the scope will sprawl to match.",
        source: "client",
        owner: "Sponsor",
        blocking: true,
      },
      {
        name: "Current-state assessment",
        what: "Where the estate stands: what is worked around, the measured data quality, the customisation count, the interface count, the support concentration.",
        source: "library",
        owner: "Finance and technology",
        topic: "erp-health-check",
        blocking: true,
      },
      {
        name: "Total cost of ownership today",
        what: "Licence, support, infrastructure and internal effort for the current estate, per year. The internal share is the one nobody has.",
        source: "client",
        owner: "Finance",
        topic: "erp-health-check",
        blocking: true,
      },
      {
        name: "Options, including doing nothing",
        what: "Fix, upgrade, replace and defer — each costed and each with its consequence. A case with one option is a proposal.",
        source: "library",
        owner: "Sponsor and finance",
        topic: "finding-the-one",
        blocking: true,
      },
      {
        name: "Cost model for the change",
        what: "Software, implementation, internal effort at a real rate, backfill, data work, integration, change, training, infrastructure, contingency, and the twelve months after go-live.",
        source: "library",
        owner: "Delivery and finance",
        topic: "erp-project-budgeting",
        blocking: true,
      },
      {
        name: "Benefits with owners and baselines",
        what: "Each benefit named, quantified, baselined before the change, and accepted by someone outside the programme who will be measured on it.",
        source: "client",
        owner: "Business owners",
        topic: "change-is-the-word",
        blocking: true,
      },
      {
        name: "Scope and explicit exclusions",
        what: "The areas being changed, and named exclusions with reasons. Exclusions left unstated become scope fights in month four.",
        source: "scope",
        owner: "Sponsor",
        blocking: true,
      },
      {
        name: "Organisational context",
        what: "Industry, size, organisation type and jurisdiction — they change which obligations are fixed inputs and which controls intensify.",
        source: "questionnaire",
        owner: "Delivery",
        blocking: false,
      },
      {
        name: "Capitalisation and funding position",
        what: "What can be capitalised and what cannot, agreed with finance, because it changes the approval route and the reported result.",
        source: "client",
        owner: "Finance",
        topic: "erp-project-budgeting",
        blocking: false,
      },
      {
        name: "Risk position",
        what: "The risks material to the investment decision, not the delivery register. Capacity, data condition, sponsorship tenure and end of support.",
        source: "library",
        owner: "Delivery",
        topic: "digital-transformation-readiness-checklist",
        blocking: false,
      },
    ],
    sections: [
      "Problem and why now",
      "Current state, evidenced",
      "Options considered, including do nothing",
      "Recommended approach and scope",
      "Cost, full and phased",
      "Benefits, owners and baselines",
      "Risks and what would make us stop",
      "Funding, capitalisation and approval path",
    ],
    done: [
      "Internal effort and backfill are in the cost, at a real rate.",
      "Every benefit has a named owner outside the programme and a measured baseline.",
      "Doing nothing is costed, not dismissed.",
      "The twelve months after go-live are funded inside the envelope.",
      "There is a stated condition under which the programme would stop.",
    ],
  },

  // --------------------------------------------- Project management plan
  {
    slug: "project-management-plan",
    name: "Project management plan",
    short: "PM plan",
    status: "alpha",
    summary:
      "How the programme will actually be run: decision rights, one plan, the change route, and what each gate has to prove.",
    purpose:
      "To make the programme legible — what is being spent, what is being decided, what is slipping, and who is accountable — before any of those become contested.",
    audience: "Steering committee, workstream leads, assurance.",
    decision: "Whether this programme can be governed at the speed it needs.",
    inputs: [
      {
        name: "Scope baseline and exclusions",
        what: "The areas in scope, the streams they sit on, the modules dragged in, and what is explicitly out.",
        source: "scope",
        owner: "Delivery",
        blocking: true,
      },
      {
        name: "Governance structure and decision rights",
        what: "Forums defined by what they decide, not by seniority, with terms of reference, quorum and cadence.",
        source: "library",
        owner: "Delivery",
        topic: "governance",
        blocking: true,
      },
      {
        name: "Delegation mapping",
        what: "Financial and scope authority traced back to the organisation's own delegation instrument, so approvals inside the programme are valid.",
        source: "client",
        owner: "Finance",
        topic: "governance",
        blocking: true,
      },
      {
        name: "One integrated plan",
        what: "A single schedule across workstreams with dependencies named. Not one plan per workstream stapled together.",
        source: "scope",
        owner: "Delivery",
        topic: "pmo",
        blocking: true,
      },
      {
        name: "Gate criteria",
        what: "What each gate has to prove, agreed while nobody is under pressure to say yes.",
        source: "library",
        owner: "Delivery and assurance",
        topic: "pmo",
        blocking: true,
      },
      {
        name: "Resourcing and backfill",
        what: "Named people at named percentages, with backfill funded and confirmed by the managers losing them.",
        source: "client",
        owner: "Business owners",
        topic: "digital-transformation-readiness-checklist",
        blocking: true,
      },
      {
        name: "Change control route",
        what: "How scope, budget and schedule change deliberately: who raises, who assesses impact, who approves at which threshold, and how cumulative impact is reported.",
        source: "library",
        owner: "Delivery",
        topic: "change-requests",
        blocking: true,
      },
      {
        name: "Risk, issue, decision and action registers",
        what: "One of each, across the programme, with single named owners and visible ageing.",
        source: "library",
        owner: "Delivery",
        topic: "actions-and-decisions",
        blocking: false,
      },
      {
        name: "Reporting cadence and audience",
        what: "What each forum gets, and what it is expected to do with it. Papers ahead of the meeting, with a recommendation.",
        source: "client",
        owner: "Delivery",
        topic: "governance",
        blocking: false,
      },
      {
        name: "Assurance arrangement",
        what: "Who checks the programme independently, and who they report to. Assurance reporting into the programme director is not assurance.",
        source: "library",
        owner: "Sponsor",
        topic: "be-a-hero",
        blocking: false,
      },
      {
        name: "Decision latency baseline",
        what: "How long a decision takes today, measured before mobilisation. A programme needs them faster, not slower.",
        source: "client",
        owner: "Delivery",
        topic: "empower-people",
        blocking: false,
      },
    ],
    sections: [
      "Scope, exclusions and baseline",
      "Governance, decision rights and delegations",
      "The integrated plan and critical path",
      "Gates and what each one proves",
      "Resourcing, backfill and capacity",
      "Change control and the baseline discipline",
      "Risk, issue and decision management",
      "Reporting, assurance and escalation",
      "Closure: what has to be true for this to end",
    ],
    done: [
      "Every forum has stated decision rights, including what it cannot decide.",
      "There is one schedule, not one per workstream.",
      "Gate criteria were set before anyone was under date pressure.",
      "Escalation has a service level, so raised issues cannot simply sit.",
      "The plan says what would make the programme stop.",
    ],
  },

  // -------------------------------------------- Business analysis plan
  {
    slug: "business-analysis-plan",
    name: "Business analysis plan",
    short: "BA plan",
    status: "alpha",
    summary:
      "How requirements will be produced, tested and traced — and which design artefacts the scope actually demands.",
    purpose:
      "To make requirements a controlled deliverable rather than a by-product of workshops, so that what gets built is what was agreed and what was agreed can be tested.",
    audience: "Analysts, workstream leads, the people who will sign designs.",
    decision: "Whether design will be finished in time to build against.",
    inputs: [
      {
        name: "Process inventory in scope",
        what: "Every process in scope, including the ones dragged in by a crossing stream. This is the list analysis has to get through, and it is usually larger than the picks suggest.",
        source: "scope",
        owner: "Delivery",
        blocking: true,
      },
      {
        name: "Design artefact list per sub-module",
        what: "What has to exist before a sub-module can be called designed — the decision that constrains everything else, the design itself, and the part most often skipped.",
        source: "scope",
        owner: "Analysts",
        blocking: true,
      },
      {
        name: "Subject matter expert availability",
        what: "Per business area, who can answer and how much of their time is released. The binding constraint on analysis is almost never analyst capacity.",
        source: "client",
        owner: "Business owners",
        topic: "digital-transformation-readiness-checklist",
        blocking: true,
      },
      {
        name: "Sign-off authority per area",
        what: "Who signs each design, and whether they will be present at user acceptance. Sign-off by someone who never uses it is a formality.",
        source: "client",
        owner: "Business owners",
        topic: "functional-specifications",
        blocking: true,
      },
      {
        name: "Requirement and specification template",
        what: "One template, carrying data, rules, exceptions, volumes and testable acceptance criteria. Plain language, in the organisation's own words.",
        source: "library",
        owner: "Analysts",
        topic: "functional-specifications",
        blocking: true,
      },
      {
        name: "Standard-first position",
        what: "The rule that every departure from the product's standard behaviour is justified in writing, and who may approve one.",
        source: "library",
        owner: "Delivery and technology",
        topic: "development-standards",
        blocking: true,
      },
      {
        name: "Traceability approach",
        what: "Requirement to specification to test case to defect, so coverage is a fact rather than an assertion.",
        source: "library",
        owner: "Analysts and test",
        topic: "functional-specifications",
        blocking: false,
      },
      {
        name: "Current-state documentation, such as it is",
        what: "Whatever exists, plus an honest note on where it is wrong. Documentation drifts; verify rather than trust.",
        source: "client",
        owner: "Business owners",
        topic: "erp-health-check",
        blocking: false,
      },
      {
        name: "Interfaces to specify",
        what: "The hand-offs where one side is being changed and the other is not — the interfaces most often missed at scoping and found during testing.",
        source: "scope",
        owner: "Technology",
        topic: "integration-catalogue",
        blocking: false,
      },
      {
        name: "Data and volume profile",
        what: "Transaction volumes at peak, master data counts and measured quality. Designs sized on test data fail at year end.",
        source: "client",
        owner: "Data",
        topic: "data-migration",
        blocking: false,
      },
    ],
    sections: [
      "Approach and analysis method",
      "Processes in scope, and what is out",
      "Artefacts per sub-module, with owners",
      "Workshop and elicitation approach",
      "Templates, standards and plain-language rules",
      "Standard-first and the customisation position",
      "Traceability and acceptance criteria",
      "Sign-off authority by area",
      "Schedule, dependencies and SME load",
    ],
    done: [
      "Every requirement has testable acceptance criteria — nothing that two people could read differently.",
      "Exception paths are in scope for analysis, not deferred to build.",
      "Each design has a named signer who will be at user acceptance.",
      "SME load is planned against released capacity, not against optimism.",
      "Every specification answers why standard behaviour was insufficient.",
    ],
  },

  // --------------------------------------------------------- Workshop plan
  {
    slug: "workshop-plan",
    name: "Workshop plan",
    short: "Workshop plan",
    status: "alpha",
    summary:
      "How design actually gets decided in a room: which workshops, who has authority in each, and what leaves with a decision attached.",
    purpose:
      "To stop workshops producing notes instead of decisions. A workshop with no decision to make is a briefing, and should be an email.",
    audience: "Workstream leads, facilitators, business participants.",
    decision: "What the process will be, settled by people who can settle it.",
    inputs: [
      {
        name: "Workshop series by value stream",
        what: "The end-to-end streams in scope, broken into sessions that follow the flow rather than the org chart — because the hand-offs between teams are where the design problems are.",
        source: "scope",
        owner: "Delivery",
        blocking: true,
      },
      {
        name: "Attendees with decision authority",
        what: "Per session, who can settle the question in the room. A representative who must check with someone else is a delay, not a decision-maker.",
        source: "client",
        owner: "Business owners",
        topic: "empower-people",
        blocking: true,
      },
      {
        name: "The decision each session has to produce",
        what: "Named in advance. Sessions without one fill their time with current-state narration.",
        source: "client",
        owner: "Facilitator",
        topic: "actions-and-decisions",
        blocking: true,
      },
      {
        name: "Pre-reads and current-state pack",
        what: "Circulated ahead, not read in the room. Including the process as it runs today, with its workarounds named.",
        source: "client",
        owner: "Analysts",
        blocking: true,
      },
      {
        name: "Worked scenarios and real data",
        what: "The organisation's own transactions, including the awkward ones. Abstractions get agreed quickly and mean different things to different people.",
        source: "client",
        owner: "Analysts",
        topic: "ditch-the-dirty-talk",
        blocking: true,
      },
      {
        name: "Standard process demonstration",
        what: "What the product does out of the box for this process, shown before the room designs something else.",
        source: "client",
        owner: "Solution architect",
        topic: "development-standards",
        blocking: false,
      },
      {
        name: "Decision log and parking lot",
        what: "Captured in the room with owner and date, including what the decision assumed. Minutes written afterwards lose the rationale.",
        source: "library",
        owner: "Facilitator",
        topic: "actions-and-decisions",
        blocking: false,
      },
      {
        name: "Output artefact per session",
        what: "What the session produces and who accepts it, so the workshop has a deliverable rather than a follow-up.",
        source: "scope",
        owner: "Analysts",
        blocking: false,
      },
      {
        name: "Cross-stream dependency map",
        what: "Which sessions produce decisions other sessions need, so the sequence is right and nothing is designed twice.",
        source: "scope",
        owner: "Delivery",
        blocking: false,
      },
    ],
    sections: [
      "Objectives and the decisions to be made",
      "Series structure, following the streams",
      "Attendees and decision authority per session",
      "Pre-reads, current-state pack and scenarios",
      "Facilitation approach and plain-language rules",
      "Outputs, acceptance and the decision log",
      "Sequence and cross-stream dependencies",
      "Logistics, and what happens to the parking lot",
    ],
    done: [
      "Every session has a named decision and someone present who can make it.",
      "Scenarios use the organisation's own data, including the exceptions.",
      "Decisions are captured in the room, with the assumption behind them.",
      "Rapid agreement on anything abstract is treated as a warning, not a win.",
      "The parking lot has an owner, not just entries.",
    ],
  },

  // ------------------------------------------------ Change impact assessment
  {
    slug: "change-impact-assessment",
    name: "Change impact assessment",
    short: "Change impact",
    status: "alpha",
    summary:
      "Role by role, what changes about how each person spends their day — specific enough for a manager to act on.",
    purpose:
      "To make adoption plannable. Benefits come from behaviour, and nothing about behaviour can be planned from a statement that the organisation is changing.",
    audience: "Sponsors, line managers, the change team, training.",
    decision:
      "Whether the organisation can absorb this, and what has to be resourced before it can.",
    inputs: [
      {
        name: "Role inventory for the affected areas",
        what: "The actual roles, at the granularity work is organised in — not the job families HR reports on.",
        source: "client",
        owner: "HR and business owners",
        topic: "org-and-position-management",
        blocking: true,
      },
      {
        name: "Process-to-role mapping",
        what: "Which processes in scope each role performs, so impact can be assessed from the change to the process rather than guessed.",
        source: "scope",
        owner: "Change and analysts",
        blocking: true,
      },
      {
        name: "Headcount by affected role",
        what: "How many people, where, and on what shift pattern. It sizes training, support and the hypercare roster.",
        source: "client",
        owner: "HR",
        blocking: true,
      },
      {
        name: "What changes per role, and what they lose",
        what: "Specific: which task, which system, which authority. Including what is being taken away, which is the part that drives resistance and the part usually omitted.",
        source: "client",
        owner: "Change",
        topic: "change-people-and-adoption",
        blocking: true,
      },
      {
        name: "Accountable business owner for adoption",
        what: "Named, in the business, measured on it. Not the programme.",
        source: "client",
        owner: "Sponsor",
        topic: "change-is-the-word",
        blocking: true,
      },
      {
        name: "Capability gap and training need",
        what: "Per role, the gap between current ability and what the new process requires, and when capability has to arrive relative to go-live.",
        source: "client",
        owner: "Change and HR",
        topic: "learning-and-development",
        blocking: false,
      },
      {
        name: "Competing change load",
        what: "Everything else the organisation is asking of these same people this year. Change capacity is finite and usually already spent.",
        source: "client",
        owner: "Sponsor",
        topic: "digital-transformation-readiness-checklist",
        blocking: false,
      },
      {
        name: "Sector and organisational context",
        what: "Industry, size, organisation type and jurisdiction — they change what the workforce is used to and which obligations are non-negotiable.",
        source: "questionnaire",
        owner: "Change",
        blocking: false,
      },
      {
        name: "Adoption measures",
        what: "What will be measured after go-live to know whether people actually work the new way. Usage data, not survey sentiment.",
        source: "library",
        owner: "Change",
        topic: "change-people-and-adoption",
        blocking: false,
      },
      {
        name: "Super users and local support",
        what: "Named, credible in their own area, with time released and a role after go-live rather than only before it.",
        source: "client",
        owner: "Business owners",
        topic: "change-people-and-adoption",
        blocking: false,
      },
    ],
    sections: [
      "Scope of assessment and method",
      "Roles affected, with headcount",
      "Impact per role: tasks, systems, authority, what is lost",
      "Capability gap and training need",
      "Sponsorship and local support network",
      "Competing change and absorption capacity",
      "Adoption measures and how they will be read",
      "Risks to adoption, and what would mitigate them",
    ],
    done: [
      "A line manager could read their own role's entry and know what to do.",
      "What people lose is written down, not only what they gain.",
      "Adoption has a named owner in the business, measured on it.",
      "Training is on the process in a realistic environment, not on the screens.",
      "Competing change load has been counted, not assumed to be zero.",
    ],
  },
];

export const deliverableBySlug = new Map(deliverables.map((item) => [item.slug, item]));

/** Grouped for the page: blocking inputs first, because they gate the draft. */
export const groupInputs = (inputs: DeliverableInput[]) => ({
  blocking: inputs.filter((input) => input.blocking),
  optional: inputs.filter((input) => !input.blocking),
});
