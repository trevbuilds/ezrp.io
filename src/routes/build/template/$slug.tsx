import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { SiteShell } from "@/components/SiteShell";
import { guideBySlug } from "@/content/guides";
import { moduleLabel } from "@/content/labels";
import { dispositionLabel, programmeBySlug, type Programme } from "@/content/programmes";
import { computeScope, serialisePicks } from "@/content/scope";

export const Route = createFileRoute("/build/template/$slug")({
  loader: ({ params }) => {
    const programme = programmeBySlug.get(params.slug);
    if (!programme) throw notFound();
    return { programme };
  },
  head: ({ loaderData }) => {
    const programme = loaderData?.programme as Programme | undefined;
    const title = programme ? `${programme.name} — EZRP` : "Programme — EZRP";
    const description = programme?.summary ?? "A worked ERP programme, mapped against the model.";
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
  component: ProgrammePage,
});

/** A guide link that degrades to plain text when the slug is not in the library. */
function TopicLink({ slug, children }: { slug: string; children?: string }) {
  const guide = guideBySlug.get(slug);
  if (!guide) return <span>{children ?? slug}</span>;
  return (
    <Link
      to="/guides/$slug"
      params={{ slug }}
      className="text-primary transition hover:brightness-110"
    >
      {children ?? guide.topic}
    </Link>
  );
}

function ProgrammePage() {
  const { programme } = Route.useLoaderData();
  const scope = computeScope(programme.picks);
  const pick = serialisePicks(programme.picks);

  return (
    <SiteShell>
      <article className="mx-auto max-w-4xl px-5 pt-12">
        <nav className="label-xs flex flex-wrap items-center gap-2">
          <Link to="/build" className="hover:text-foreground">
            Build
          </Link>
          <span>/</span>
          <span>Template</span>
        </nav>

        <h1 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">{programme.name}</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{programme.summary}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {[programme.industry, programme.orgType, programme.size, programme.country]
            .filter((chip): chip is NonNullable<typeof chip> => Boolean(chip))
            .map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
              >
                {chip}
              </span>
            ))}
        </div>

        <p className="mt-5 border-l-2 border-border pl-4 text-sm text-muted-foreground">
          {programme.provenance}
        </p>

        <Section label="Where it stands">
          <div className="space-y-3">
            {programme.situation.map((paragraph) => (
              <p key={paragraph} className="text-sm text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </Section>

        <Section label="Why now">
          <ul className="space-y-2">
            {programme.drivers.map((driver) => (
              <li key={driver} className="flex gap-3 text-sm text-muted-foreground">
                <span className="text-primary">—</span>
                <span>{driver}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Everything from here to the phase list is computed, not asserted. */}
        <section className="panel mt-10 rounded-lg border-l-2 border-primary p-5">
          <p className="label-xs">What that scope actually implies</p>
          <h2 className="mt-2 text-xl font-semibold">
            {scope.picked.length} areas picked, {scope.topics.length} topics in scope across{" "}
            {scope.modules.length} modules
          </h2>
          {scope.draggedIn.length > 0 && (
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              The streams these picks sit on cross into{" "}
              <strong className="text-foreground">
                {scope.draggedIn.map(moduleLabel).join(", ")}
              </strong>
              . Nobody picked those, and the work still happens there.
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/scope"
              search={{ pick }}
              className="rounded bg-primary px-3 py-1.5 font-display text-xs font-semibold text-primary-foreground transition hover:brightness-110"
            >
              Open this scope →
            </Link>
            <Link
              to="/guides"
              search={{ pick }}
              className="rounded border border-border px-3 py-1.5 font-display text-xs font-semibold text-muted-foreground transition hover:border-primary hover:text-foreground"
            >
              Browse the library with it
            </Link>
          </div>
        </section>

        <Section label="The end-to-end it sits on">
          <div className="space-y-3">
            {scope.topStreams.map((stream) => (
              <div key={stream.slug} className="panel rounded-lg p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-base font-semibold">{stream.name}</h3>
                  <p className="font-mono text-xs text-muted-foreground">
                    {stream.modules.map(moduleLabel).join("  →  ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section label="Deliberately out of scope">
          <p className="mb-3 max-w-2xl text-xs text-muted-foreground">
            Exclusions cause scope fights when they are assumed rather than written. Each one here
            has the reason attached.
          </p>
          <div className="space-y-2">
            {programme.excluded.map((item) => (
              <div key={item.area} className="panel rounded-lg p-4">
                <p className="font-display text-sm font-semibold">{item.area}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.why}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section label="The boundary">
          <p className="mb-3 max-w-2xl text-xs text-muted-foreground">
            Every system the finance core exchanges data with, and what happens to that interface.
            An interface with no disposition is an interface somebody will discover during testing.
          </p>
          <div className="space-y-2">
            {programme.boundary.map((item) => (
              <div
                key={item.name}
                className={`panel rounded-lg p-4 ${
                  item.disposition === "decide" ? "border-l-2 border-primary" : ""
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-display text-sm font-semibold">{item.name}</p>
                  <p className="font-mono text-[0.65rem] uppercase text-primary">
                    {dispositionLabel[item.disposition]}
                  </p>
                </div>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {item.payload}
                  <span className="mx-2 text-primary">
                    {item.direction === "in" ? "←" : item.direction === "out" ? "→" : "↔"}
                  </span>
                  {item.counterpart}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{item.note}</p>
              </div>
            ))}
          </div>
        </Section>

        {scope.flows.straddling.length > 0 && (
          <Section label="Flows the model says straddle this boundary">
            <p className="mb-3 max-w-2xl text-xs text-muted-foreground">
              Derived from the scope, not written here: hand-offs where one side is being changed
              and the other is not. Compare them against the boundary list above — anything present
              here and missing there is a gap.
            </p>
            <div className="space-y-2">
              {scope.flows.straddling.map((flow, index) => (
                <div key={`${flow.topic}-${index}`} className="panel rounded-lg p-3">
                  <p className="text-sm">
                    <span className="font-semibold">{flow.payload}</span>
                    <span className="mx-2 font-mono text-xs text-primary">
                      {flow.direction === "in" ? "←" : "→"}
                    </span>
                    <span className="text-muted-foreground">
                      {guideBySlug.get(flow.counterpart)?.topic ?? flow.counterpart}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {guideBySlug.get(flow.topic)?.topic ?? flow.topic} ·{" "}
                    {flow.cadence.toLowerCase()} · without it: {flow.breaks}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section label="What this context does to a generic finance build">
          <div className="space-y-2">
            {programme.contextDesign.map((item) => (
              <div key={item.heading} className="panel rounded-lg p-4">
                <p className="font-display text-sm font-semibold">{item.heading}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section label="The order to do it in">
          <p className="mb-3 max-w-2xl text-xs text-muted-foreground">
            The grouping is computed from the model's dependency edges. The goal and the exit
            condition for each release are a delivery judgement.
          </p>
          <div className="space-y-3">
            {programme.releases.map((release, index) => {
              const phase = scope.phases[index];
              return (
                <div key={release.name} className="panel rounded-lg p-4">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-display text-base font-semibold">{release.name}</p>
                      {phase && (
                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                          {phase.map((sub) => sub.name).join(" · ")}
                        </p>
                      )}
                      <p className="mt-2 text-sm text-muted-foreground">{release.goal}</p>
                      <p className="mt-2 text-sm">
                        <span className="label-xs">Done when</span>{" "}
                        <span className="text-muted-foreground">{release.proves}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* The model can phase further than the written narration goes —
              cutover in particular sorts last. Show it rather than drop it. */}
          {scope.phases.length > programme.releases.length && (
            <div className="panel mt-3 rounded-lg border-l-2 border-border p-4">
              <p className="label-xs">Then</p>
              <p className="mt-1.5 font-mono text-xs text-muted-foreground">
                {scope.phases
                  .slice(programme.releases.length)
                  .map(
                    (phase, index) =>
                      `${programme.releases.length + index + 1}. ${phase.map((sub) => sub.name).join(" · ")}`,
                  )
                  .join("   ")}
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                The dependency order puts {scope.phases.length - programme.releases.length} more{" "}
                {scope.phases.length - programme.releases.length === 1 ? "phase" : "phases"} after
                the narrated releases.
              </p>
            </div>
          )}

          {scope.prerequisites.length > 0 && (
            <p className="mt-3 max-w-2xl text-xs text-muted-foreground">
              The model also flags{" "}
              <strong className="text-foreground">
                {scope.prerequisites.map((sub) => sub.name).join(", ")}
              </strong>{" "}
              as depended on but not included. Fine if{" "}
              {scope.prerequisites.length === 1 ? "it is" : "they are"} staying as{" "}
              {scope.prerequisites.length === 1 ? "it is" : "they are"} — a gap otherwise.
            </p>
          )}
        </Section>

        <Section label="Decisions to settle">
          <div className="space-y-2">
            {programme.decisions.map((decision) => (
              <div key={decision.question} className="panel rounded-lg p-4">
                <p className="font-display text-sm font-semibold">{decision.question}</p>
                <p className="mt-1 text-sm text-muted-foreground">{decision.stake}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  <span className="text-foreground">By:</span> {decision.by}
                  {decision.topic && (
                    <>
                      {" · "}
                      <TopicLink slug={decision.topic} />
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section label="Risks worth writing down">
          <div className="space-y-2">
            {programme.risks.map((risk) => (
              <div key={risk.risk} className="panel rounded-lg p-4">
                <p className="font-display text-sm font-semibold">{risk.risk}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="text-foreground">So:</span> {risk.consequence}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="text-foreground">Instead:</span> {risk.mitigation}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section label="Readiness">
          <div className="space-y-2">
            {programme.readiness.map((item) => (
              <div key={item.item} className="panel rounded-lg p-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold">{item.item}</p>
                  <p
                    className={`font-mono text-[0.65rem] uppercase ${
                      item.state === "gap" ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {item.state}
                  </p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section label="The artefacts this programme has to produce">
          <p className="mb-3 max-w-2xl text-xs text-muted-foreground">
            Each one has a guide behind it. The library is the general case; this list is the order
            it is needed in.
          </p>
          <div className="space-y-1.5">
            {programme.work.map((item) => (
              <div
                key={item.artefact}
                className="panel flex flex-wrap items-baseline justify-between gap-2 rounded p-3"
              >
                <p className="text-sm">
                  {item.artefact}
                  <span className="ml-2 text-xs text-muted-foreground">{item.owner}</span>
                </p>
                <p className="text-xs">
                  <TopicLink slug={item.topic} />
                </p>
              </div>
            ))}
          </div>
        </Section>

        <section className="panel mt-10 rounded-lg p-5">
          <p className="label-xs">Argue with it</p>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            The scope, the phase order and the straddling interfaces are all computed from the
            model. If a phase looks wrong, the dependency edge behind it is the thing to change —{" "}
            <a
              href="https://github.com/trevbuilds/ezrp.io/discussions"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              say so here
            </a>
            .
          </p>
        </section>
      </article>
    </SiteShell>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <p className="label-xs">{label}</p>
      <div className="mt-3">{children}</div>
    </section>
  );
}
