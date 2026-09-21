# ezrp.io — working rules

This repo is two-way synced with Lovable. Read `AGENTS.md` as well; its rules
override anything here that contradicts them.

## Git — non-negotiable

- **Never rewrite published history.** No force push, no rebase, amend or
  squash of commits that are already pushed. It rewrites history on Lovable's
  side and destroys project history.
- `main` is the branch Lovable syncs. Keep it in a working state at all times.
- **Always `git pull` before starting work.** Lovable's agent commits to `main`
  too, so the remote moves without warning. If local and remote have diverged,
  **merge — never rebase.**
- Push in small, complete commits. A half-finished commit on `main` is a broken
  published site.

## Tooling

- Package manager is **bun**. Never npm or yarn — it will rewrite `bun.lock`
  and pollute the diff.
- Install: `bun install`
- Dev server: `bun run dev`
- Build: `bun run build`
- Lint: `bun run lint`
- Format: `bun run format`
- There is no `typecheck` script. Type-check with `bunx tsc --noEmit`.

**Before every commit:** `bunx tsc --noEmit && bun run build`

## Content architecture

All guide content is data, not components. Adding or editing content should
never require touching a component or a route.

- `src/content/guides.ts` — the taxonomy. Every node: `slug`, `topic`,
  `parent`, `categories`, `definition`, `workflow`, `sourceUrl`. The map, the
  breadcrumbs and the parent/child navigation all derive from this.
- `src/content/articles.ts` — the `Article` and `ArticleBlock` types, the
  AP Automation article, and the aggregation into `articleBySlug`.
- `src/content/articles-<area>.ts` — long-form articles for one area, exporting
  a named array that `articles.ts` spreads into `articles`.
- `src/content/flows.ts`, `flows-<area>.ts` — end-to-end flow data, rendered by
  `EndToEndFlow`.

**To add a new area:** create `articles-<area>.ts`, import the `Article` type
with `import type` (avoids a runtime import cycle), export a named array, then
add the import and spread it into the `articles` array in `articles.ts`. Add
taxonomy entries to `guides.ts` only if the slugs don't already exist there.

Article bodies are built from `ArticleBlock` unions only: `h`, `sub`, `p`,
`bullets`, `steps`, `qa`, `metrics`, `callout`. Don't add block kinds without
also updating `ArticleBody.tsx`.

## Content provenance

`articles.ts` and `guides.ts` were copied from the DX Guides wiki, and their
header comments state that nothing is invented — empty source pages simply have
no article. **Preserve that.** Don't fill a `null` definition or workflow in
`guides.ts` with generated text. Authored-for-EZRP content goes in its own file
with a header comment saying so.

House style: Australian English (`minimise`, `optimisation`, `capitalisation`).

## Australian context

Local-AU content (ABA files, superannuation, Single Touch Payroll, award
interpretation) is a deliberate differentiator. Keep AU-specific guidance
accurate and clearly scoped rather than blended into global guidance.
