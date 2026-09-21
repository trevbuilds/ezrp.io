# ezrp.io

**A working map of ERP delivery.** Pick the areas you intend to change, and see
what that actually drags in — the value streams they sit on, the modules they
cross, and the concerns they raise.

Live at **[ezrp.io](https://ezrp.io)**. Alpha: the model is settled, the content
is still filling in.

## Why it exists

ERP programmes connect nearly every part of an organisation, so a small decision
in one place becomes an expensive problem somewhere else. Most of the damage is
not technical — it is a change nobody mapped.

EZRP makes the shape visible. Not a vendor diagram, and not a methodology: a
navigable map of the modules, the processes inside them, the workflow steps
teams actually run, and the end-to-end streams those steps belong to.

## The model

Two hierarchies intersect, the way tier-1 vendors separate application structure
from end-to-end process, and the way APQC separates function from process:

```
Structure   Band → Module → Sub-module → Component
Flow        Value stream (L1) → Sub-stream (L2) → Process → Step
```

They join at the bottom: a process belongs to a sub-module _and_ sits in a
sub-stream. That join is what lets a stream cross modules without anyone wiring
it by hand. Procure-to-Pay crosses supply chain and finance because its
requisition and purchase-order processes live in Procurement while its invoice,
match and payment processes live in Accounts Payable. The crossing is derived
from where the work happens.

A third axis cuts across both. Nine **considerations** — Strategy, Governance,
People, Process, Technology, Data, Delivery, Value, Compliance — are tagged on
leaves and rolled up, so a module shows what its children raise and you can
click through to the cause.

**Eight bands**: Finance · People/HCM · Customer & Revenue · Operations ·
Assets · Projects & Portfolio · Data & Technology · Delivery. The first seven
describe the ERP; Delivery describes how it gets built, which is why it is kept
separate in the navigator.

## Australian context

Local-AU material — ABA files, superannuation, Single Touch Payroll, award
interpretation — is a deliberate differentiator rather than an afterthought.
Scope is its own axis (`Global` / `Local-AU` / `Common`), so "show me what is
AU-specific" is a filter, not a reading exercise.

**Under Local-AU sits a jurisdiction layer**, because "applies in Australia" is
not precise enough to configure anything. Payroll tax, long service leave and
workers compensation are state obligations with a different threshold, a
different scheme and a different instrument in each of the eight jurisdictions —
so an employer operating across a border runs two rules rather than one rule
twice. Absence is meaningful: a topic tagged `Local-AU` with no jurisdictions is
saying the obligation is federal and there is nothing to vary.

`src/content/jurisdictions.ts` holds what changes per state — the revenue
office, the long service leave act and any portable scheme, the workers
compensation scheme, the procurement framework, the public finance legislation,
the auditor-general and the economic regulator. Thresholds, rates and dates are
deliberately **not** recorded: they move at least annually and a number
published there would be wrong before it was useful. Name the source, go and get
the current figure. `/locales` renders it.

## Content

Everything is data. Adding or editing content never requires touching a
component or a route.

| Path                           | Holds                                                           |
| ------------------------------ | --------------------------------------------------------------- |
| `src/content/guides.ts`        | the taxonomy — every topic's slug, parent, definition, workflow |
| `src/content/model.ts`         | bands, modules, sub-modules, streams, considerations            |
| `src/content/tagging.ts`       | per-topic tagging that cannot be derived                        |
| `src/content/articles/*.md`    | article bodies, one markdown file per article                   |
| `src/content/programmes.ts`    | worked programmes — one organisation, one scope, one plan       |
| `src/content/jurisdictions.ts` | what changes between AU states and territories                  |

Level, module, sub-module and band are **computed**, never stored — they are
derived by walking the tree against the model, so they cannot drift from it.

Articles are markdown with frontmatter, loaded lazily per route. Prose is
ordinary markdown; the structured sections use fenced blocks:

````markdown
---
slug: accounts-payable
source: dx-guides
intro: >-
  Accounts payable is the back half of procure-to-pay.
---

## Why it matters

- **Duplicate detection**: Match before paying, not after.

> A callout for the thing people get wrong.

```steps
Invoice receipt :: The supplier invoice arrives.
```

```metrics
Days payable outstanding :: Average days taken to pay suppliers.
```
````

Drop a file in `src/content/articles/` whose slug matches a `guides.ts` entry.
There is no registration step.

### Provenance

Most content is migrated from the DX Guides wiki, where nothing is invented — an
empty source page simply has no article, and those topics show a definition and
workflow only. Frontmatter records which is which: `source: dx-guides` for
migrated, `source: authored` for written-for-EZRP.

`workflow` is the one field deliberately re-modelled rather than copied, against
published value streams rather than whatever sequence a wiki record carried.

## Programmes

`/programmes` holds worked examples: one organisation, one decision, one set of
constraints. A programme names only what is being changed and what is
deliberately not — the streams, the modules it drags in, the phase order and the
interfaces that straddle the boundary are all computed by `computeScope` from
the same model the rest of the site runs on. If the model is wrong, the
programme page is wrong in the same way, which is the point.

They are worked plans rather than status reports, built from publicly known
sector shape plus the model, and each page says so.

## Running it

Package manager is **bun**. Not npm or yarn — they rewrite `bun.lock`.

```sh
bun install
bun run dev
```

| Command             |                                             |
| ------------------- | ------------------------------------------- |
| `bun run dev`       | dev server                                  |
| `bun run build`     | production build                            |
| `bun run lint`      | lint                                        |
| `bun run format`    | format                                      |
| `bunx tsc --noEmit` | type-check (there is no `typecheck` script) |

Before committing: `bunx tsc --noEmit && bun run build`.

Built with TanStack Start, deployed on Cloudflare. The repository is two-way
synced with [Lovable](https://lovable.dev), so `main` must stay in a working
state and published history is never rewritten — no force push, no rebase of
pushed commits.

## Feedback and contributions

The content is the point, and it is incomplete. Corrections are more useful than
compliments.

- **Something wrong, missing or misleading?**
  [Open an issue](https://github.com/trevbuilds/ezrp.io/issues/new) — say which
  guide, and what it should say instead.
- **Disagree with the model?**
  [Start a discussion](https://github.com/trevbuilds/ezrp.io/discussions). Where
  a stream sits, what crosses what, which considerations apply — all of it is
  arguable and most of it has been argued once already.
- **Practitioner correction on AU specifics?** Especially welcome. Award
  interpretation and STP move faster than this repository does.

Pull requests are welcome for content. For the model itself, open a discussion
first — a change to `model.ts` re-levels everything beneath it.
