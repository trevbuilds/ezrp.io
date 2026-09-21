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
- `src/content/model.ts` — the structural model. Two hierarchies intersect:
  Band → Module → Sub-module → Component, and Value stream (L1) → Sub-stream
  (L2) → Process → Step. They join at Process, which is why a stream can cross
  modules without being wired by hand. Also holds considerations and scope.
- `src/content/tagging.ts` — per-topic tagging that cannot be derived: which
  streams a topic sits in, its leaf considerations, its scope. Level, module,
  sub-module and band are all computed in `guides.ts`, never stored.
- `src/content/articles/<slug>.md` — article bodies, one markdown file per
  article, loaded lazily so an article is fetched only when its guide is
  opened. Frontmatter carries `slug` and `intro`.
- `src/content/article.ts` — the `Article`/`ArticleBlock` types and the
  markdown parser. `article-loader.ts` holds the Vite glob, kept separate so
  the parser can be exercised outside a bundler.
- `src/content/flows.ts`, `flows-<area>.ts` — end-to-end flow data, rendered by
  `EndToEndFlow`.

**To add an article:** create `src/content/articles/<slug>.md` with `slug` and
`intro` frontmatter. The slug must match a `guides.ts` entry or the article
will not be reachable. No registration step — the loader globs the directory.

Article bodies use markdown for prose and fenced blocks for the structured
sections, which plain markdown would flatten:

- `## text` → `h`, `### text` → `sub`, paragraphs → `p`
- `- **Term**: text` → `bullets`, `> text` → `callout`
- ` ```steps `, ` ```qa `, ` ```metrics ` → those blocks, one item per line
  with `::` between fields; indented `- ` lines under a step become its
  sub-points

Don't add block kinds without also updating `ArticleBody.tsx` and the parser
in `article.ts`.

## Content provenance

Most article bodies and `guides.ts` were copied from the DX Guides wiki, where
nothing is invented — an empty source page simply has no article. **Preserve
that.** Don't fill a `null` definition in `guides.ts` with generated text.

`workflow` is the one field that is deliberately re-modelled rather than
copied: streams follow the published value-stream model rather than whatever
sequence a wiki record happened to carry. Every departure carries a comment
naming the stream and the reason.

Content authored for EZRP rather than migrated says so in its frontmatter with
`source: authored`; migrated content uses `source: dx-guides`.

House style: Australian English (`minimise`, `optimisation`, `capitalisation`).

## Australian context

Local-AU content (ABA files, superannuation, Single Touch Payroll, award
interpretation) is a deliberate differentiator. Keep AU-specific guidance
accurate and clearly scoped rather than blended into global guidance.
