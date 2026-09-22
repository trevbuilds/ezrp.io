import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { SiteShell } from "@/components/SiteShell";
import { buildPlan } from "@/content/build";
import { draftDeliverable, draftMarkdown } from "@/content/draft";
import {
  deliverableBySlug,
  deliverables,
  groupInputs,
  inputSourceLabel,
  type Deliverable,
  type DeliverableInput,
} from "@/content/deliverables";
import { guideBySlug } from "@/content/guides";
import { moduleLabel } from "@/content/labels";
import { parsePicks } from "@/content/scope";

type DeliverableSearch = { pick?: string | undefined };

export const Route = createFileRoute("/build/$slug")({
  validateSearch: (search: Record<string, unknown>): DeliverableSearch => ({
    pick: typeof search["pick"] === "string" && search["pick"] ? search["pick"] : undefined,
  }),
  loader: ({ params }) => {
    const deliverable = deliverableBySlug.get(params.slug);
    if (!deliverable) throw notFound();
    return { deliverable };
  },
  head: ({ loaderData }) => {
    const deliverable = loaderData?.deliverable as Deliverable | undefined;
    const title = deliverable ? `${deliverable.name} — Build — EZRP` : "Build — EZRP";
    const description = deliverable?.summary ?? "A build deliverable and the inputs it needs.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: DeliverablePage,
});

function DeliverablePage() {
  const { deliverable } = Route.useLoaderData();
  const search = Route.useSearch();
  const picks = parsePicks(search.pick);
  const plan = picks.length > 0 ? buildPlan(picks) : null;
  const draft = picks.length > 0 ? draftDeliverable(deliverable.slug, picks) : null;
  const { blocking, optional } = groupInputs(deliverable.inputs);
  const others = deliverables.filter((item) => item.slug !== deliverable.slug);

  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-5 pt-12">
        <nav className="label-xs flex flex-wrap items-center gap-2">
          <Link to="/build" search={{ pick: search.pick }} className="hover:text-foreground">
            Build
          </Link>
          <span>/</span>
          <span>Deliverable</span>
        </nav>

        <div className="mt-4 flex flex-wrap items-baseline gap-3">
          <h1 className="text-3xl font-bold leading-tight md:text-4xl">{deliverable.name}</h1>
          <span className="rounded border border-primary/45 px-1.5 py-0.5 font-mono text-[0.625rem] uppercase text-primary">
            Alpha
          </span>
        </div>
        <p className="mt-3 text-lg text-muted-foreground">{deliverable.summary}</p>

        <section className="panel mt-8 rounded-lg p-5">
          <p className="label-xs">What it is for</p>
          <p className="mt-2 text-sm text-muted-foreground">{deliverable.purpose}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="label-xs inline">Audience</dt>{" "}
              <dd className="inline text-muted-foreground">{deliverable.audience}</dd>
            </div>
            <div>
              <dt className="label-xs inline">The decision it supports</dt>{" "}
              <dd className="inline text-muted-foreground">{deliverable.decision}</dd>
            </div>
          </dl>
        </section>

        <section className="mt-10">
          <p className="label-xs">Inputs — {blocking.length} blocking</p>
          <p className="mt-1 max-w-2xl text-xs text-muted-foreground">
            Blocking means the document cannot be honestly drafted without it. The rest can be left
            open and marked as such.
          </p>
          <div className="mt-3 space-y-2">
            {blocking.map((input) => (
              <InputRow key={input.name} input={input} blocking />
            ))}
          </div>
          {optional.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="font-mono text-xs text-muted-foreground">
                Draft around these if needed
              </p>
              {optional.map((input) => (
                <InputRow key={input.name} input={input} />
              ))}
            </div>
          )}
        </section>

        {/* Where the scope can actually answer one of the inputs, show it. */}
        {plan && (
          <section className="panel mt-10 rounded-lg border-l-2 border-primary p-5">
            <p className="label-xs">What your scope already answers</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">Scope and exclusions:</strong>{" "}
                {plan.scope.topics.length} topics across {plan.scope.modules.length} modules
                {plan.scope.draggedIn.length > 0 && (
                  <> — including {plan.scope.draggedIn.map(moduleLabel).join(", ")}, unpicked</>
                )}
                .
              </li>
              {deliverable.slug === "business-analysis-plan" && (
                <li>
                  <strong className="text-foreground">Artefacts to produce:</strong>{" "}
                  {plan.totals.artefacts} across {plan.releases.length}{" "}
                  {plan.releases.length === 1 ? "release" : "releases"}, {plan.totals.decisions} of
                  them decisions that constrain what follows.
                </li>
              )}
              {(deliverable.slug === "business-analysis-plan" ||
                deliverable.slug === "project-management-plan") && (
                <li>
                  <strong className="text-foreground">Interfaces to specify:</strong>{" "}
                  {plan.totals.interfaces}, including the hand-offs where only one side is being
                  changed.
                </li>
              )}
              {deliverable.slug === "workshop-plan" && (
                <li>
                  <strong className="text-foreground">Workshop series:</strong>{" "}
                  {plan.scope.topStreams.length} end-to-end streams —{" "}
                  {plan.scope.topStreams.map((stream) => stream.name).join(", ")}.
                </li>
              )}
              {(deliverable.slug === "project-management-plan" ||
                deliverable.slug === "investment-brief") && (
                <li>
                  <strong className="text-foreground">Release order:</strong>{" "}
                  {plan.releases
                    .map(
                      (release) =>
                        `${release.index}. ${release.subModules.map((sub) => sub.name).join(", ")}`,
                    )
                    .join("  ·  ")}
                </li>
              )}
              {plan.scope.prerequisites.length > 0 && (
                <li>
                  <strong className="text-foreground">Assumed already in place:</strong>{" "}
                  {plan.scope.prerequisites.map((sub) => sub.name).join(", ")} — depended on, not
                  included.
                </li>
              )}
              {plan.uncovered.length > 0 && (
                <li>
                  <strong className="text-foreground">Not yet covered here:</strong>{" "}
                  {plan.uncovered.map((sub) => sub.name).join(", ")} — in scope, with no artefact
                  list recorded yet.
                </li>
              )}
            </ul>
          </section>
        )}

        {!plan && (
          <section className="panel mt-10 rounded-lg p-5">
            <p className="label-xs">Bring a scope</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Several of these inputs can be answered from a scope — the processes in play, the
              artefacts they demand, the interfaces that straddle the boundary, and the order the
              work falls into. Pick the areas you intend to change and come back.
            </p>
            <Link
              to="/scope"
              className="mt-3 inline-block rounded bg-primary px-3 py-1.5 font-display text-xs font-semibold text-primary-foreground transition hover:brightness-110"
            >
              Scope it first →
            </Link>
          </section>
        )}

        {draft && (
          <section className="mt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="label-xs">First draft</p>
              <p className="font-mono text-xs text-muted-foreground">
                {draft.coverage.filled}/{draft.coverage.total} sections the scope could speak to
              </p>
            </div>
            <p className="mt-1 max-w-2xl text-xs text-muted-foreground">
              Generated from your scope. It is not a finished document and it does not pretend to be
              — where a section needs something only you have, it says so rather than inventing a
              plausible sentence, because plausible sentences are the ones that get left in.
            </p>

            <div className="panel mt-3 rounded-lg p-5">
              <h2 className="font-display text-lg font-semibold">{draft.title}</h2>
              {draft.sections.map((section) => (
                <div key={section.heading} className="mt-4">
                  <p className="font-display text-sm font-semibold">{section.heading}</p>
                  {section.body.length > 0 ? (
                    section.body.map((paragraph) => (
                      <p key={paragraph} className="mt-1.5 text-sm text-muted-foreground">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p className="mt-1.5 border-l-2 border-border pl-3 text-sm text-muted-foreground">
                      To write. The scope cannot supply this one.
                    </p>
                  )}
                </div>
              ))}

              {draft.outstanding.length > 0 && (
                <div className="mt-5 border-t border-border pt-4">
                  <p className="font-display text-sm font-semibold">Still needed</p>
                  <ul className="mt-2 space-y-1.5">
                    {draft.outstanding.map((gap) => (
                      <li key={gap.name} className="text-sm text-muted-foreground">
                        <span className="text-foreground">{gap.name}</span> — {gap.what}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <details className="mt-3">
              <summary className="cursor-pointer text-xs text-primary transition hover:brightness-110">
                As markdown, to lift into a document
              </summary>
              <pre className="panel mt-2 max-h-96 overflow-auto rounded-lg p-4 text-xs whitespace-pre-wrap text-muted-foreground">
                {draftMarkdown(draft)}
              </pre>
            </details>
          </section>
        )}

        <section className="mt-10">
          <p className="label-xs">Outline</p>
          <ol className="mt-3 space-y-1.5">
            {deliverable.sections.map((section, index) => (
              <li key={section} className="flex gap-3 text-sm">
                <span className="font-mono text-xs text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-muted-foreground">{section}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10">
          <p className="label-xs">What separates a useful one from a compliant one</p>
          <ul className="mt-3 space-y-2">
            {deliverable.done.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                <span className="text-primary">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 border-t border-border pt-5">
          <p className="label-xs">The rest of the set</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {others.map((item) => (
              <Link
                key={item.slug}
                to="/build/$slug"
                params={{ slug: item.slug }}
                search={{ pick: search.pick }}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition hover:border-primary hover:text-foreground"
              >
                {item.short}
              </Link>
            ))}
          </div>
        </section>
      </article>
    </SiteShell>
  );
}

function InputRow({ input, blocking = false }: { input: DeliverableInput; blocking?: boolean }) {
  const guide = input.topic ? guideBySlug.get(input.topic) : undefined;
  return (
    <div className={`panel rounded-lg p-4 ${blocking ? "border-l-2 border-primary" : ""}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-display text-sm font-semibold">{input.name}</p>
        <p className="font-mono text-[0.65rem] uppercase text-muted-foreground">
          {inputSourceLabel[input.source]}
        </p>
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">{input.what}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        <span className="text-foreground">{input.owner}</span>
        {guide && (
          <>
            {" · "}
            <Link
              to="/guides/$slug"
              params={{ slug: input.topic as string }}
              className="text-primary transition hover:brightness-110"
            >
              {guide.topic}
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
