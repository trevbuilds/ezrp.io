/**
 * Per-topic tagging against the structural model.
 *
 * Only the facts that cannot be derived live here. Level, module, sub-module
 * and band are all worked out in guides.ts by walking the tree and consulting
 * ./model, so they are never stated twice and cannot drift.
 *
 * Considerations are tagged on leaves only — processes and sub-modules — and
 * rolled up by union. Tagging a module directly would make every module look
 * like it touches every consideration.
 */

import type { Consideration, Scope } from "./model";

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
  "project-management": ["Strategy"],
  "data-services": ["Strategy"],
  integration: ["Strategy", "Technology"],
  security: ["Strategy", "Compliance"],
  pmo: ["Strategy", "Governance"],
  "change-people-and-adoption": ["Strategy", "People"],

  // Finance
  "general-ledger": ["Governance", "Compliance", "Technology"],
  "accounts-payable": ["Governance", "Compliance", "Technology"],
  "3-way-matching": ["Governance", "Compliance"],
  "ap-automation": ["Technology", "Delivery"],
  payments: ["Governance", "Compliance", "Technology"],
  "eft-files": ["Compliance", "Technology"],
  aba: ["Compliance", "Technology"],
  "accounts-receivable": ["Governance", "Compliance"],
  "order-to-cash": ["Governance", "Compliance", "Delivery"],
  "order-to-fulfil": ["Delivery", "Technology"],
  "fulfil-to-invoice": ["Compliance", "Technology"],
  "invoice-to-cash": ["Governance", "Compliance"],
  "asset-management": ["Compliance", "Governance"],
  "cash-management": ["Governance", "Compliance"],
  "bank-reconciliation": ["Governance", "Compliance"],

  // People
  "core-hr": ["People", "Compliance", "Technology"],
  "org-and-position-management": ["People", "Governance"],
  "employee-self-service": ["People", "Technology"],
  onboarding: ["People", "Delivery"],
  offboarding: ["People", "Compliance", "Governance"],
  "talent-acquisition": ["People", "Delivery"],
  payroll: ["Compliance", "People", "Technology"],
  "payroll-automation": ["Technology", "Delivery"],
  superannuation: ["Compliance", "Governance"],
  "single-touch-payroll": ["Compliance", "Governance"],
  "time-and-attendance": ["Compliance", "People", "Technology"],
  "rostering-and-scheduling": ["People", "Delivery"],
  "leave-management": ["Compliance", "People"],
  "award-interpretation": ["Compliance", "Governance", "People"],
  "performance-management": ["People", "Governance"],
  "learning-and-development": ["People", "Delivery"],
  "workforce-analytics": ["People", "Technology"],
  benefits: ["People", "Compliance"],
  compliance: ["Compliance", "Governance"],

  // Customer & Revenue
  "sales-force-automation": ["Technology", "Delivery"],
  "contact-to-lead": ["Compliance", "Technology"],
  "lead-to-opportunity": ["People", "Delivery"],
  "opportunity-to-quote": ["Governance", "Technology"],
  "quote-to-order": ["Governance", "Compliance"],
  "marketing-automation": ["Compliance", "Technology"],
  "customer-support": ["People", "Technology", "Delivery"],
  "field-service": ["People", "Delivery", "Technology"],

  // Programmes, Projects & Data
  billing: ["Compliance", "Governance"],
  "business-intelligence": ["Technology", "Strategy"],
  "data-models": ["Technology", "Governance"],
  "data-warehousing": ["Technology", "Governance"],
  "data-migration": ["Delivery", "Technology", "Governance"],
  "integration-catalogue": ["Technology", "Governance"],
  "development-standards": ["Technology", "Governance"],
  "environment-and-deployment-management": ["Technology", "Delivery"],
  "sod-and-rbac": ["Compliance", "Governance", "Technology"],
  bcp: ["Governance", "Compliance", "Delivery"],
  "disaster-recovery": ["Technology", "Governance", "Delivery"],
  governance: ["Governance", "Delivery"],
  "actions-and-decisions": ["Governance", "Delivery"],
  "change-requests": ["Governance", "Delivery"],
  "functional-specifications": ["Delivery", "Governance"],
  "technical-specifications": ["Technology", "Delivery"],
  "erp-project-budgeting": ["Strategy", "Governance"],
  "cutover-and-go-live": ["Delivery", "Governance", "People"],
  "cutover-checklist": ["Delivery", "Governance"],
  "functional-module-implementation": ["Delivery", "Technology"],

  // Customer & Revenue - supply chain
  procurement: ["Governance", "Compliance", "Delivery"],
  "inventory-management": ["Delivery", "Technology"],
  "order-processing": ["Delivery", "Technology"],
  logistics: ["Delivery", "Compliance"],

  // Operations
  "production-planning": ["Delivery", "Technology"],
  "materials-management": ["Delivery", "Governance"],
  "product-lifecycle-management": ["Strategy", "Delivery"],
  "quality-control": ["Compliance", "Governance"],

  // Operations & Assets
  "asset-lifecycle-management": ["Compliance", "Governance"],
  "energy-management": ["Compliance", "Technology", "Strategy"],
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
  "eft-files": ["Common"],
  payments: ["Common"],
  "payroll-automation": ["Common"],
  "bank-reconciliation": ["Common"],
};
