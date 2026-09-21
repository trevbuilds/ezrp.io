/**
 * One-line glimpses, for the picker.
 *
 * `guides.ts` carries `definition` copied from the DX Guides wiki, and where
 * the source page was empty the definition is null — deliberately, because
 * inventing one would make migrated and authored content indistinguishable.
 * That rule holds. But a picker pill with nothing behind it is a dead hover,
 * and the topics with no migrated definition include Accounts Payable and
 * Accounts Receivable, which are the two people reach for first.
 *
 * So these are a separate, clearly authored field: written for the picker,
 * never merged into `definition`, and only for the topics that would otherwise
 * show nothing at all. One sentence each — this is a glimpse, and the article
 * is one click away.
 */

export const blurbs: Record<string, string> = {
  "accounts-payable":
    "The back half of procure-to-pay: matching what was invoiced against what was ordered and received, and paying once.",
  "accounts-receivable":
    "Turning delivered work into an invoice and an invoice into cash, then chasing what has not arrived.",
  "asset-management":
    "The financial asset register: capitalisation, depreciation and disposal, kept in step with what physically exists.",
  "bank-reconciliation":
    "Agreeing the ledger to the bank, daily, so that what the organisation thinks it holds is what it holds.",
  payments:
    "Releasing money: the run, the approvals before it, and the controls that stop it going to the wrong account.",
  "3-way-matching":
    "Invoice against purchase order against goods receipt — the control that makes paying for what you did not get difficult.",
  "ap-automation":
    "Capture, code and match invoices without keying them, so the exceptions are the work rather than the whole queue.",
  "eft-files":
    "Generating and lodging the payment file the bank will act on, and knowing it was accepted.",
  aba: "The Australian bank file format for direct entry payments — the thing that actually moves the money here.",
  "data-migration":
    "Getting data out of the old system and into the new one at a quality somebody will sign off, with totals that reconcile.",
  "asset-lifecycle-management":
    "Acquire to retire for physical assets: planned, commissioned, operated, renewed and disposed of, with the cost recorded against each.",
  integration:
    "The interfaces between systems: what crosses, which way, how often, and who owns each end.",
  "integration-catalogue":
    "The list of every interface in the estate, what it carries and what depends on it — the thing needed before any system can safely be replaced.",
  "development-standards":
    "What may be extended and what may not be modified, which decides whether customisation survives the next upgrade.",
  "environment-and-deployment-management":
    "The environments a change moves through on its way to production, and whether a test result means anything.",
  security:
    "Who can do what without supervision. In an ERP that is a financial control, not an IT setting.",
  "sod-and-rbac":
    "Designing roles so one person cannot complete a whole risky transaction alone — and evidencing it when they can.",
  "disaster-recovery":
    "Restoring systems and data after a failure, within a time and to a point the business has actually agreed.",
  bcp: "How the organisation keeps operating while a system is down — the manual workarounds and who may invoke them.",
};

export const blurbFor = (slug: string): string | null => blurbs[slug] ?? null;
