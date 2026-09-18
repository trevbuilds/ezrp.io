# ezrp.io — guide library, map, and AI chat

Build ezrp.io as the public home of Easy Resource Planning: a browsable library of your
ERP/DX guides, an interactive map that shows how the topics connect, and a chat that
answers questions using only your guide content.

## What gets built

**1. The map (home page)**
An interactive, animated map of your ERP knowledge, using the same interaction we built
for Clariti but with its own EZRP look. Three levels, taken straight from Notion:

- Pillars — the top-level topics (Finance, Manufacturing, Supply Chain, CRM, Data
  Services, Integration, Security, PMO, HR, Industry, Guides, Go Live Toolkit, …)
- Topics — each guide sitting under its pillar (113 guides in total)
- Workflow steps — for guides that have a workflow, the steps shown as the flow they are
  (e.g. Invoice Receipt → 3-Way Match → Payment Approval → Payment Disbursement)

Hovering highlights a node and its connections; clicking opens that guide. Panning and
zooming on desktop, and a simplified tappable version on mobile.

**2. Guide library**
- Library page: search by name, filter by pillar and by category (Concept, Module,
  Component, Process, Solution, Technology, Integration, Project Management, Local-AU,
  Global, Common)
- Guide page for each topic: definition, what it covers, its workflow as a step-by-step
  sequence, where it sits in the hierarchy, and links to its related and child guides
- Pillar pages that collect the guides underneath them

**3. Framework story**
A short page explaining Easy Resource Planning as an operating model — change capacity as
the real constraint, the three pillars, the EZRP loop — drawn from your framework and
manuscript pages in Notion. Plus an "ask me for a guide" invitation matching the tone of
your Notion hub.

**4. AI chat**
A chat panel available from every page. It answers ERP and transformation questions using
your guides as its source, cites the guides it used, and links to them. When your guides
don't cover something, it says so rather than inventing an answer. Conversations are not
stored.

## Content

Guides are copied out of Notion into the site now (Topic, definition, category, workflow,
parent/child links, excerpt, and the search description you already wrote for each). When
you update Notion, ask me and I'll refresh them.

Two things to flag:
- Some top-level entries (Recruitment, Writing a Business Case) have no definition or
  child guides yet. They'll appear in the library as short stubs rather than being padded
  with invented text — tell me which to hide or fill.
- Your Notion rows carry `ezrp.io/...` post URLs from the old site. I'll keep the same
  URL shapes so existing links and search rankings survive.

## Look

Its own identity, not Clariti's: a dark technical-blueprint palette with a single warm
accent, condensed geometric headings against a highly readable body face, and fine grid
and connector lines echoing the map. Defined once as a design system so every page and the
map share it.

## Technical notes

- TanStack Start routes: `/` (map), `/guides` (library), `/guides/$slug`,
  `/pillars/$slug`, `/framework`. Guide data as typed modules under `src/content`,
  generated from the Notion export, with the graph derived from parent/child relations.
- Map: SVG + Framer Motion, adapted from the Clariti `SemanticBrainPrototype` graph
  approach; layout positions computed per pillar rather than hand-placed.
- Chat: server function calling Lovable AI Gateway (`openai/gpt-6-astra`), streaming, with
  keyword retrieval over the local guide corpus injected as context. No database needed.
- Per-page titles, descriptions and social tags from your existing Meta Title and Meta
  Description fields.

## Not in this build

Members-only gating, the EZRP book/manuscript chapters, and the role-based consulting
agents from your Ezrp.ai notes — those are a separate step once this is live.
