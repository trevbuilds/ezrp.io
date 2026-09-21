---
slug: cash-management
source: authored
intro: >-
  Cash management is knowing where the money is, where it will be, and making sure it is in the right account before it is needed.
  Profitable organisations fail on liquidity, not on margin.
---

## Position, forecast, and the gap between them

- **Cash position**: Actual cleared and available balances across every account, today. A fact.
- **Short-term forecast**: Days to weeks, built from known payables, receivables and payroll. Mostly arithmetic.
- **Medium-term forecast**: Weeks to months, built from the order book, billing schedule and capital plan. Part judgement.
- **Long-term forecast**: Quarters to years, driven by the business plan. Entirely judgement, and treated as such.

Forecast accuracy degrades sharply with horizon. The design question is not how to make the long forecast accurate, but how to make the short one reliable enough to act on daily.

## Bank connectivity

```steps
Statement import :: Prior-day or intraday statements retrieved automatically, not downloaded by hand.
Balance consolidation :: Every account, entity and currency presented as one position.
Payment file generation :: Approved payment runs formatted for the bank's channel.
Transmission and acknowledgement :: Files delivered securely and the bank's acknowledgement matched back.
Reconciliation :: Cleared items matched to the subledger, exceptions reported.
```

> Bank file formats and connectivity are almost always underestimated in ERP programs. Test with the actual bank, in the actual channel, with production-shaped files, well before go-live — not in the last fortnight.

## Liquidity management

- **Concentration and sweeping**: Moving balances to a main account automatically, so idle cash is not scattered.
- **Target balances**: Minimum buffers per account, with the surplus invested or the shortfall funded.
- **Facility management**: Tracking drawn and undrawn facilities against covenants.
- **Currency exposure**: Knowing net position by currency before deciding whether to hedge it.
- **Payment timing**: Paying on terms rather than early, unless the discount beats the cost of capital.

## Metrics and KPIs to track

```metrics
Forecast accuracy :: Variance of forecast to actual at one, four and thirteen weeks.
Cash conversion cycle :: Days inventory plus days receivable less days payable.
Idle cash balance :: Funds sitting above target balance in non-interest-bearing accounts.
Time to produce the position :: Hours from start of day to a trusted consolidated position.
Failed payment rate :: Payment files or items rejected by the bank.
```
