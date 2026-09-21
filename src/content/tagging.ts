/**
 * Per-topic tagging against the structural model.
 *
 * Only the facts that cannot be derived live here. Level, module, sub-module
 * and band are all worked out in guides.ts by walking the tree and consulting
 * ./model, so they are never stated twice and cannot drift.
 *
 * Considerations are tagged on leaves only — processes and sub-modules — and
 * rolled up by union. Tagging a module directly would make every module look
 * like it touches every consideration. Strategy is the one exception, since
 * it is genuinely a module-level commitment.
 *
 * The lens set is the Clariti brain's eight enterprise elements plus
 * Compliance; see ./model for the ring they form.
 */

import { allJurisdictions, type Consideration, type Jurisdiction, type Scope } from "./model";

/**
 * Topic slug -> the stream slugs it belongs to. Plural because some topics
 * genuinely sit in more than one: data-migration is part of both the data
 * stream and the cutover stream.
 */
export const streamsBySlug: Record<string, string[]> = {
  // ------------------------------------------------ Financial Accounting
  "financial-accounting": ["record-to-report"],
  "general-ledger": ["record-to-report"],
  "accounts-payable": ["invoice-to-pay"],
  "3-way-matching": ["invoice-to-pay"],
  "ap-automation": ["invoice-to-pay"],
  payments: ["invoice-to-pay"],
  "eft-files": ["invoice-to-pay"],
  aba: ["invoice-to-pay"],
  "accounts-receivable": ["invoice-to-cash"],
  "order-to-cash": ["order-to-cash"],
  "order-to-fulfil": ["order-to-fulfil"],
  "fulfil-to-invoice": ["fulfil-to-invoice"],
  "invoice-to-cash": ["invoice-to-cash"],
  "asset-management": ["acquire-to-retire-assets"],
  "cash-management": ["cash-and-treasury"],
  "bank-reconciliation": ["cash-and-treasury", "record-to-report"],

  // -------------------------------------------- Human Capital Management
  "human-capital-management": ["hire-to-retire"],
  "core-hr": ["hire-to-retire"],
  "org-and-position-management": ["hire-to-retire"],
  "employee-self-service": ["hire-to-retire"],
  onboarding: ["recruit-to-onboard"],
  offboarding: ["offboard-to-exit"],
  "talent-acquisition": ["recruit-to-onboard"],
  payroll: ["calculate-to-disburse"],
  "payroll-automation": ["calculate-to-disburse"],
  superannuation: ["calculate-to-disburse", "report-to-comply"],
  "single-touch-payroll": ["report-to-comply"],
  "payroll-tax": ["report-to-comply"],
  "long-service-leave": ["capture-to-approve", "calculate-to-disburse"],
  "workers-compensation": ["benefits-and-compliance", "report-to-comply"],
  "time-and-attendance": ["capture-to-approve"],
  "rostering-and-scheduling": ["capture-to-approve"],
  "leave-management": ["capture-to-approve"],
  "award-interpretation": ["capture-to-approve", "calculate-to-disburse"],
  "performance-management": ["manage-to-develop"],
  "learning-and-development": ["manage-to-develop"],
  "workforce-analytics": ["manage-to-develop"],
  benefits: ["benefits-and-compliance"],
  compliance: ["benefits-and-compliance"],

  // --------------------------------- Customer Relationship Management
  "customer-relationship-management": ["lead-to-order"],
  "sales-force-automation": ["lead-to-order"],
  "contact-to-lead": ["contact-to-lead"],
  "lead-to-opportunity": ["lead-to-opportunity"],
  "opportunity-to-quote": ["opportunity-to-quote"],
  "quote-to-order": ["quote-to-order"],
  "marketing-automation": ["campaign-to-conversion"],
  "customer-support": ["service-to-resolution"],
  "field-service": ["dispatch-to-done"],

  // -------------------------------------- Project & Portfolio Management
  "project-management": ["plan-to-deliver-project"],
  billing: ["bill-to-recognise"],

  // ------------------------------------------------- Data & Analytics
  "data-services": ["source-to-insight"],
  "business-intelligence": ["source-to-insight"],
  "data-models": ["source-to-insight"],
  "data-warehousing": ["source-to-insight"],
  "data-migration": ["migrate-to-steady-state", "plan-to-cutover"],

  // ------------------------------------------------------- Integration
  integration: ["specify-to-live"],
  "integration-catalogue": ["specify-to-live"],
  "development-standards": ["specify-to-live"],
  "environment-and-deployment-management": ["specify-to-live", "plan-to-cutover"],

  // ------------------------------------------------ Security & Identity
  security: ["identity-to-access"],
  "sod-and-rbac": ["identity-to-access", "control-to-evidence"],
  bcp: ["detect-to-continue"],
  "disaster-recovery": ["detect-to-continue"],

  // --------------------------------------- PMO & Programme Governance
  pmo: ["initiate-to-gate"],
  governance: ["track-to-decide"],
  "actions-and-decisions": ["track-to-decide"],
  "change-requests": ["track-to-decide"],
  "functional-specifications": ["track-to-decide"],
  "technical-specifications": ["track-to-decide"],
  "erp-project-budgeting": ["initiate-to-gate"],
  "go-live-toolkit": ["plan-to-cutover"],
  "cutover-and-go-live": ["plan-to-cutover"],
  "cutover-checklist": ["plan-to-cutover"],
  "functional-module-implementation": ["plan-to-cutover"],

  // --------------------------------------------- Supply Chain, Mfg, Change
  "supply-chain-management": ["plan-to-replenish"],
  procurement: ["source-to-contract", "requisition-to-receipt"],
  "inventory-management": ["plan-to-replenish"],
  "order-processing": ["order-to-ship", "order-to-fulfil"],
  logistics: ["plan-to-deliver-logistics"],
  manufacturing: ["plan-to-produce"],
  "production-planning": ["plan-to-produce"],
  "materials-management": ["plan-to-produce"],
  "product-lifecycle-management": ["design-to-production"],
  "quality-control": ["quality-to-confidence"],
  "change-people-and-adoption": ["awareness-to-adoption"],

  // ------------------------------------- Enterprise Asset Management
  "enterprise-asset-management": ["plan-to-maintain"],
  "asset-lifecycle-management": ["acquire-to-retire-physical"],
  "energy-management": ["detect-to-respond"],
};

/**
 * Leaf-level considerations. Rolled up by union in guides.ts, so a module
 * shows what its children raise and you can click through to the cause.
 */
export const considerationsBySlug: Record<string, Consideration[]> = {
  // Strategy is the exception to leaf-only tagging: it is genuinely a
  // module-level commitment. The chart of accounts is the operating model in
  // numbers; position management shapes the org for a decade. It does not
  // belong on a matching rule.
  "financial-accounting": ["Strategy"],
  "human-capital-management": ["Strategy"],
  "customer-relationship-management": ["Strategy"],
  "supply-chain-management": ["Strategy"],
  manufacturing: ["Strategy"],
  "enterprise-asset-management": ["Strategy"],
  "project-management": ["Strategy", "Value"],
  "data-services": ["Strategy", "Data"],
  integration: ["Strategy", "Technology"],
  security: ["Strategy", "Compliance"],
  pmo: ["Strategy", "Governance"],
  "change-people-and-adoption": ["Strategy", "People"],

  // Finance
  "general-ledger": ["Governance", "Process", "Technology", "Data", "Compliance"],
  "accounts-payable": ["Governance", "Process", "Technology", "Compliance"],
  "3-way-matching": ["Governance", "Process", "Compliance"],
  "ap-automation": ["Technology", "Delivery"],
  payments: ["Governance", "Process", "Technology", "Compliance"],
  "eft-files": ["Technology", "Compliance"],
  aba: ["Technology", "Compliance"],
  "accounts-receivable": ["Governance", "Process", "Value", "Compliance"],
  "order-to-cash": ["Governance", "Process", "Delivery", "Value", "Compliance"],
  "order-to-fulfil": ["Process", "Technology", "Delivery"],
  "fulfil-to-invoice": ["Process", "Technology", "Compliance"],
  "invoice-to-cash": ["Governance", "Process", "Value", "Compliance"],
  "asset-management": ["Governance", "Value", "Compliance"],
  "cash-management": ["Governance", "Compliance"],
  "bank-reconciliation": ["Governance", "Process", "Compliance"],

  // People
  "core-hr": ["People", "Technology", "Data", "Compliance"],
  "org-and-position-management": ["Governance", "People", "Data"],
  "employee-self-service": ["People", "Technology"],
  onboarding: ["People", "Process", "Delivery"],
  offboarding: ["Governance", "People", "Process", "Compliance"],
  "talent-acquisition": ["People", "Delivery"],
  payroll: ["People", "Technology", "Compliance"],
  "payroll-automation": ["Technology", "Delivery"],
  superannuation: ["Governance", "Compliance"],
  "single-touch-payroll": ["Governance", "Compliance"],
  "payroll-tax": ["Compliance", "Governance", "Data"],
  "long-service-leave": ["Compliance", "People", "Data"],
  "workers-compensation": ["Compliance", "People", "Process"],
  "time-and-attendance": ["People", "Process", "Technology", "Compliance"],
  "rostering-and-scheduling": ["People", "Process", "Delivery"],
  "leave-management": ["People", "Process", "Compliance"],
  "award-interpretation": ["Governance", "People", "Compliance"],
  "performance-management": ["Governance", "People", "Value"],
  "learning-and-development": ["People", "Delivery"],
  "workforce-analytics": ["People", "Technology", "Data", "Value"],
  benefits: ["People", "Compliance"],
  compliance: ["Governance", "Process", "Compliance"],

  // Customer & Revenue
  "sales-force-automation": ["Technology", "Delivery"],
  "contact-to-lead": ["Technology", "Data", "Compliance"],
  "lead-to-opportunity": ["People", "Delivery"],
  "opportunity-to-quote": ["Governance", "Technology"],
  "quote-to-order": ["Governance", "Compliance"],
  "marketing-automation": ["Technology", "Data", "Compliance"],
  "customer-support": ["People", "Process", "Technology", "Delivery"],
  "field-service": ["People", "Process", "Technology", "Delivery"],

  // Programmes, Projects & Data
  billing: ["Governance", "Value", "Compliance"],
  "business-intelligence": ["Strategy", "Technology", "Data", "Value"],
  "data-models": ["Governance", "Technology", "Data"],
  "data-warehousing": ["Governance", "Technology", "Data"],
  "data-migration": ["Governance", "Technology", "Data", "Delivery"],
  "integration-catalogue": ["Governance", "Technology", "Data"],
  "development-standards": ["Governance", "Technology", "Data"],
  "environment-and-deployment-management": ["Technology", "Data", "Delivery"],
  "sod-and-rbac": ["Governance", "Technology", "Data", "Compliance"],
  bcp: ["Governance", "Delivery", "Compliance"],
  "disaster-recovery": ["Governance", "Technology", "Delivery"],
  governance: ["Governance", "Process", "Delivery"],
  "actions-and-decisions": ["Governance", "Process", "Delivery"],
  "change-requests": ["Governance", "Process", "Delivery"],
  "functional-specifications": ["Governance", "Delivery"],
  "technical-specifications": ["Technology", "Data", "Delivery"],
  "erp-project-budgeting": ["Strategy", "Governance", "Value"],
  "go-live-toolkit": ["Governance", "Process", "Delivery"],
  "cutover-and-go-live": ["Governance", "People", "Process", "Delivery"],
  "cutover-checklist": ["Governance", "Process", "Delivery"],
  "functional-module-implementation": ["Process", "Technology", "Delivery"],

  // Customer & Revenue - supply chain
  procurement: ["Governance", "Process", "Delivery", "Compliance"],
  "inventory-management": ["Process", "Technology", "Data", "Delivery"],
  "order-processing": ["Process", "Technology", "Delivery"],
  logistics: ["Process", "Delivery", "Compliance"],

  // Operations
  "production-planning": ["Process", "Technology", "Delivery"],
  "materials-management": ["Governance", "Process", "Delivery"],
  "product-lifecycle-management": ["Strategy", "Delivery"],
  "quality-control": ["Governance", "Process", "Value", "Compliance"],

  // Operations & Assets
  "asset-lifecycle-management": ["Governance", "Data", "Compliance"],
  "energy-management": ["Strategy", "Technology", "Value", "Compliance"],
};

/**
 * Applicability. Only stated where it is not plain Global — the AU-specific
 * material is a deliberate differentiator and needs to be filterable.
 */
export const scopeBySlug: Record<string, Scope[]> = {
  aba: ["Local-AU"],
  superannuation: ["Local-AU"],
  "single-touch-payroll": ["Local-AU"],
  "award-interpretation": ["Local-AU"],
  "payroll-tax": ["Local-AU"],
  "long-service-leave": ["Local-AU"],
  "workers-compensation": ["Local-AU"],
  "eft-files": ["Common"],
  payments: ["Common"],
  "payroll-automation": ["Common"],
  "bank-reconciliation": ["Common"],
};

/**
 * The layer under Local-AU: which states and territories a topic actually
 * differs between.
 *
 * Absence is meaningful. Single Touch Payroll, the superannuation guarantee
 * and ABA files are federal — they are Local-AU and carry no jurisdictions,
 * because there is nothing to vary. A topic listed here is saying the rule
 * itself changes at the border, so an employer operating in two states is
 * running two rules rather than one rule twice.
 *
 * Everything here applies in all eight, which is the point: the differences
 * are in the threshold, the scheme and the instrument, not in whether the
 * obligation exists. What each jurisdiction does is in ./jurisdictions.
 */
export const jurisdictionsBySlug: Record<string, Jurisdiction[]> = {
  "payroll-tax": [...allJurisdictions],
  "long-service-leave": [...allJurisdictions],
  "workers-compensation": [...allJurisdictions],
  // Western Australia runs its own industrial relations system for some
  // employers, so which system an employee sits under has to be settled
  // before interpretation is configured. Elsewhere the federal award system
  // answers it.
  "award-interpretation": ["WA"],
};
