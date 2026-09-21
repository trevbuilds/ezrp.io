---
slug: payroll
source: authored
intro: >-
  Payroll is where every other HR and time process is settled in money.
  It is the least forgiving process in the enterprise: it runs to a fixed date, it is visible to every employee, and errors are legally, industrially and reputationally expensive.
---

## Why it matters

- **Legal obligation**: Pay, withholding and retirement contributions are statutory, not discretionary.
- **Trust**: It is the one process every employee audits personally, every cycle.
- **Cost accuracy**: Labour is usually the largest line in the ledger and the hardest to restate.
- **Cash**: The pay run is a scheduled, unavoidable cash event.
- **Compliance exposure**: Award misapplication compounds quietly across thousands of shifts.
- **Auditability**: Every calculation must be explainable years later.

## The basic payroll workflow

A pay cycle is a fixed-date pipeline. Most failure is upstream of the calculation, not inside it.

```steps
Input cut-off :: Time, leave, new starters, terminations and permanent changes are locked for the period.
Time and leave interpreted :: Approved worked time is converted into payable hours under the applicable award, agreement or policy.
  - Ordinary hours, overtime and penalties are separated.
  - Allowances and higher duties are applied.
  - Leave taken is offset against accrued balances.
Payroll calculation :: Gross pay, deductions, tax and employer obligations are calculated for every employee in the population.
  - Gross earnings by code.
  - Pre-tax and post-tax deductions.
  - Withholding under the current tax tables.
  - Employer contributions such as superannuation.
Validation and variance review :: The run is compared to the prior period and to expectation, with outliers investigated before approval.
Approval :: A person with the delegation, and not the person who prepared it, approves the run.
Disbursement :: The bank file is generated and released under dual control.
General ledger posting :: Cost, liability and accrual entries post to the correct cost centres and accounts.
Statutory reporting :: Pay event reporting, withholding and contribution obligations are lodged on time.
Reconciliation :: Bank, ledger, sub-ledger and statutory reports are reconciled for the period.
Payslips and records :: Payslips are issued and records retained for the statutory period.
```

## How a business implements it

### For small businesses

- **Buy, do not build**: Use a compliant cloud payroll that maintains tax tables and statutory reporting for you.
- **Single award**: Confirm which award or agreement applies before configuring anything.
- **Bank controls**: Keep dual authorisation on the payment file even at low headcount.

### For medium-sized enterprises

- **Automated inputs**: Interface time, leave and employee change rather than rekeying them.
- **Variance controls**: Build standard pre-approval variance reports into the cycle.
- **Segregation of duties**: Separate the roles that maintain, calculate, approve and release.

### For large enterprises

- **Multi-entity and multi-country**: Handle multiple legal employers, currencies and statutory regimes under one calendar.
- **Complex interpretation**: Configure and version award and agreement rules, and test them against real historical shifts.
- **Controls and audit**: Automate reconciliation and retain evidence of every rule change.
- **Continuous compliance**: Re-test interpretation whenever an agreement or rate schedule changes.

> Payroll accuracy is decided upstream. If time capture, award interpretation and the employee master are not right, no payroll engine will save the run — it will only calculate the wrong answer faster.

## What solutions are out there?

Payroll is either a module of the HR suite, a specialist engine interfaced to it, or an outsourced bureau service.

- **SAP SuccessFactors Employee Central Payroll**: Enterprise payroll sitting directly on the SuccessFactors core record.
- **Oracle Fusion Payroll**: Native payroll inside Fusion HCM with direct ledger posting.
- **Ceridian Dayforce**: Continuous calculation across time, HR and pay on a single record.
- **ADP**: Managed and in-house payroll across many jurisdictions.
- **Aurion**: Australian enterprise payroll and HR, common in government and utilities.
- **Frontier Software chris21**: Long-standing Australian payroll and HR platform.
- **Employment Hero**: Small to mid-market Australian HR and payroll in one.
- **Xero Payroll and MYOB**: Small business payroll integrated with the accounting ledger.

Selection turns on award complexity, number of legal entities, and whether payroll is kept in-house or run as a bureau service.

## Configuring the solution

Each step has questions to answer and a rough plan that follows from the answers.

```qa
Confirm the pay population :: Which legal employers, employment types and countries are in scope? :: List every population and confirm the rules that apply to each, including casuals, contractors and expatriates.
Define earnings and deduction codes :: What does each code mean, and how does it behave for tax, contributions and leave accrual? :: Build a code catalogue with tax treatment, contribution treatment and ledger mapping stated for every code.
Confirm award and agreement rules :: Which instruments apply, and who owns the interpretation of each clause? :: Document each rule with a named owner and a worked example, and version the rule set against its effective date.
Design the pay calendar :: What are the frequencies, cut-offs, processing days and payment dates? :: Publish a calendar covering the full year, including public holidays, and work backwards from the payment date to the cut-off.
Configure tax and statutory obligations :: Which withholding, contribution and reporting obligations apply to each population? :: Configure current rates and thresholds, and confirm who maintains them when they change.
Design the ledger mapping :: How do cost, liability and accrual post, and at what level of detail? :: Map every code to accounts and cost centres, and agree the posting level with finance before the first run.
Design approvals and segregation of duties :: Who prepares, approves and releases, and can one person do two of those? :: Configure roles so preparation, approval and bank release are held by different people, and log every override.
Plan integrations :: Where do inputs come from and where do outputs go? :: Define interfaces for HR master, time, leave, banking, ledger and statutory reporting, each with a failure and reprocessing path.
Plan parallel runs :: How many cycles will run in parallel and what is the tolerance for variance? :: Run at least two full cycles in parallel, reconcile to the cent, and record the cause of every difference.
Plan cutover :: How do year-to-date balances, leave balances and in-flight payments transfer? :: Migrate and reconcile year-to-date and entitlement balances, and agree the last run in the old system in writing.
Monitor and optimise :: What went wrong last cycle, and what caused it upstream? :: Review off-cycle payments and adjustments by root cause each period, and fix the upstream source rather than the symptom.
```

## Metrics and KPIs to track

```metrics
Payroll accuracy rate :: Payslips issued without a correction required.
Off-cycle payment rate :: Payments made outside the scheduled run, by cause.
Cost per payslip :: Total payroll operating cost divided by payslips produced.
Payroll cycle time :: Input cut-off to payment release.
Manual adjustments per run :: Interventions required after calculation.
Input interface error rate :: Failed time, leave and HR records per cycle.
Statutory lodgement on-time rate :: Pay event and contribution obligations lodged by the due date.
Ledger reconciliation variance :: Unexplained difference between payroll and the general ledger.
Payroll query volume :: Employee queries per hundred payslips.
Overpayment recovery rate :: Value recovered against value overpaid.
```
