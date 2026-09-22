/**
 * A first draft of a deliverable, generated from the scope.
 *
 * This is deliberately not a finished document, and it says so on the page.
 * What it can do is remove the blank-page problem: the scope already knows
 * which processes are in play, which modules got dragged in, what order the
 * work falls into, which interfaces straddle the boundary and which
 * obligations apply — and every one of those is a paragraph somebody would
 * otherwise write by hand from the same facts.
 *
 * Where a section needs something only the organisation has, the draft says
 * what is missing rather than inventing it. A gap that is named is worth more
 * than a plausible sentence that is wrong, because the plausible sentence gets
 * left in.
 */

import { buildPlan } from "./build";
import { deliverableBySlug, type Deliverable } from "./deliverables";
import { guideBySlug } from "./guides";
import { moduleLabel } from "./labels";

export type DraftSection = {
  heading: string;
  /** Paragraphs the scope can actually support. */
  body: string[];
  /** What this section still needs, named rather than invented. */
  gaps: string[];
};

export type Draft = {
  title: string;
  sections: DraftSection[];
  /** Blocking inputs only the organisation holds, listed once. */
  outstanding: Array<{ name: string; what: string }>;
  /** How much of the outline the scope could say anything about. */
  coverage: { filled: number; total: number };
};

const list = (values: string[]) =>
  values.length <= 1
    ? (values[0] ?? "")
    : `${values.slice(0, -1).join(", ")} and ${values[values.length - 1]}`;

const topicName = (slug: string) => guideBySlug.get(slug)?.topic ?? slug;

/**
 * Sentences the scope supports, keyed by the heading they belong under.
 * Anything not keyed here falls through to the gap list for its deliverable.
 */
function sentences(slug: string, picks: string[]) {
  const plan = buildPlan(picks);
  const scope = plan.scope;
  const modules = list(scope.modules.map(moduleLabel));
  const dragged = list(scope.draggedIn.map(moduleLabel));
  const streams = list(scope.topStreams.map((stream) => stream.name));
  const releases = plan.releases
    .map((release) => `${release.index}. ${release.subModules.map((sub) => sub.name).join(", ")}`)
    .join("; ");
  const prereqs = list(scope.prerequisites.map((sub) => sub.name));
  const au = list(scope.localAu.map((guide) => guide.topic));
  const straddling = scope.flows.straddling.slice(0, 6);
  const external = scope.flows.external.slice(0, 6);

  const scopeParagraph = `The change covers ${scope.picked.length} chosen ${
    scope.picked.length === 1 ? "area" : "areas"
  } — ${list(scope.picked.map((guide) => guide.topic))} — which in turn implies ${
    scope.topics.length
  } topics across ${scope.modules.length} ${
    scope.modules.length === 1 ? "module" : "modules"
  }: ${modules}.`;

  const draggedParagraph =
    scope.draggedIn.length > 0
      ? `${dragged} ${scope.draggedIn.length === 1 ? "was" : "were"} not chosen. ${
          scope.draggedIn.length === 1 ? "It is" : "They are"
        } in scope because the value streams the chosen areas sit on cross into ${
          scope.draggedIn.length === 1 ? "it" : "them"
        }, so work happens there whether or not it was planned for. This needs to be accepted or the scope reduced — it should not be left unstated.`
      : `No module was dragged in beyond those chosen, which is unusual and worth re-checking against how the work actually runs.`;

  const streamParagraph = `End to end, the work sits on ${scope.topStreams.length} value ${
    scope.topStreams.length === 1 ? "stream" : "streams"
  }: ${streams}.`;

  const releaseParagraph =
    plan.releases.length > 0
      ? `The dependency order gives ${plan.releases.length} ${
          plan.releases.length === 1 ? "release" : "releases"
        }: ${releases}. Items within a release have no unmet prerequisite inside the scope and can start together.`
      : "";

  const prereqParagraph =
    scope.prerequisites.length > 0
      ? `The scope depends on ${prereqs} without including ${
          scope.prerequisites.length === 1 ? "it" : "them"
        }. That is fine if ${
          scope.prerequisites.length === 1
            ? "it is staying as it is"
            : "they are staying as they are"
        }, and a gap in the plan otherwise.`
      : "";

  const interfaceParagraph =
    straddling.length > 0
      ? `${scope.flows.straddling.length} data ${
          scope.flows.straddling.length === 1 ? "flow straddles" : "flows straddle"
        } the scope boundary — one side is changing and the other is not. ${straddling
          .map(
            (flow) =>
              `${flow.payload} (${topicName(flow.topic)} ${flow.direction === "in" ? "←" : "→"} ${topicName(
                flow.counterpart,
              )}, ${flow.cadence.toLowerCase()}; without it: ${flow.breaks.toLowerCase()})`,
          )
          .join("; ")}.`
      : "";

  const externalParagraph =
    external.length > 0
      ? `Interfaces outside the ERP: ${external
          .map((flow) => `${flow.payload} with ${flow.counterpart}`)
          .join("; ")}.`
      : "";

  const auParagraph =
    scope.localAu.length > 0
      ? `Australian obligations in scope: ${au}. These are obligations rather than configuration preferences, and several of them differ by state.`
      : "";

  const artefactParagraph = `${plan.totals.artefacts} artefacts have to be produced across the releases, ${plan.totals.decisions} of which are decisions that constrain everything after them. ${plan.totals.interfaces} interfaces need specifying on both sides.`;

  const concernParagraph = `The scope raises ${scope.considerations.length} of the nine considerations: ${list(
    scope.considerations,
  )}.`;

  const byHeading: Record<string, string[]> = {
    // Shared across deliverables — matched on heading text.
    "Recommended approach and scope": [scopeParagraph, draggedParagraph],
    "Scope, exclusions and baseline": [scopeParagraph, draggedParagraph, prereqParagraph],
    "Scope of assessment and method": [scopeParagraph, streamParagraph],
    "Processes in scope, and what is out": [scopeParagraph, draggedParagraph],
    "What we are not doing": [draggedParagraph, prereqParagraph],
    "The integrated plan and critical path": [releaseParagraph, prereqParagraph],
    "Series structure, following the streams": [streamParagraph, releaseParagraph],
    "Artefacts per sub-module, with owners": [artefactParagraph],
    "Approach and analysis method": [artefactParagraph, streamParagraph],
    "Sequence and cross-stream dependencies": [releaseParagraph, interfaceParagraph],
    "Gates and what each one proves": [releaseParagraph],
    "Risks and what would make us stop": [draggedParagraph, prereqParagraph, concernParagraph],
    "Risks that could stop it": [draggedParagraph, prereqParagraph],
    "Risks to adoption, and what would mitigate them": [draggedParagraph, concernParagraph],
    "Current state, evidenced": [interfaceParagraph, externalParagraph],
    "Why now, and the cost of waiting": [auParagraph],
    "Objectives and the decisions to be made": [artefactParagraph, streamParagraph],
    "Impact per role: tasks, systems, authority, what is lost": [scopeParagraph, streamParagraph],
    "Roles affected, with headcount": [scopeParagraph],
    "Traceability and acceptance criteria": [artefactParagraph],
    "Change control and the baseline discipline": [scopeParagraph],
  };

  return { plan, byHeading };
}

export function draftDeliverable(slug: string, picks: string[]): Draft | null {
  const deliverable: Deliverable | undefined = deliverableBySlug.get(slug);
  if (!deliverable) return null;
  const { byHeading } = sentences(slug, picks);

  // Only the organisation can answer these. They are listed once, against the
  // deliverable, rather than sprinkled across sections they do not belong to —
  // a gap under the wrong heading is worse than a gap in a list.
  const outstanding = deliverable.inputs
    .filter((input) => input.source === "client" && input.blocking)
    .map((input) => ({ name: input.name, what: input.what }));

  // A paragraph earns its place once. The same fact restated under a second
  // heading reads as padding, which is how generated drafts get distrusted.
  const used = new Set<string>();
  let filled = 0;
  const sections: DraftSection[] = deliverable.sections.map((heading) => {
    const body = (byHeading[heading] ?? []).filter((text) => {
      if (text.length === 0 || used.has(text)) return false;
      used.add(text);
      return true;
    });
    if (body.length > 0) filled += 1;
    return { heading, body, gaps: [] };
  });

  return {
    title: deliverable.name,
    sections,
    outstanding,
    coverage: { filled, total: deliverable.sections.length },
  };
}

/** The draft as markdown, so it can be lifted straight into a document. */
export function draftMarkdown(draft: Draft): string {
  const lines = [`# ${draft.title}`, ""];
  draft.sections.forEach((section) => {
    lines.push(`## ${section.heading}`, "");
    if (section.body.length > 0) section.body.forEach((paragraph) => lines.push(paragraph, ""));
    else lines.push("> To write. The scope cannot supply this one.", "");
  });
  if (draft.outstanding.length > 0) {
    lines.push("## Still needed", "");
    draft.outstanding.forEach((gap) => lines.push(`- **${gap.name}** — ${gap.what}`));
    lines.push("");
  }
  lines.push(
    `_First draft from a scope. ${draft.coverage.filled} of ${draft.coverage.total} sections had something the scope could say; the rest need a person, and so does everything under Still needed._`,
  );
  return lines.join("\n");
}
