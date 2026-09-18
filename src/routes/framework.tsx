import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteShell } from "@/components/SiteShell";
import { guides, pillars } from "@/content/guides";

export const Route = createFileRoute("/framework")({
  head: () => ({
    meta: [
      { title: "The EZRP framework — change capacity, not software" },
      {
        name: "description",
        content:
          "Why change capacity is the real constraint in ERP delivery, and how the EZRP map, library and assistant work together.",
      },
      { property: "og:title", content: "The EZRP framework" },
      {
        property: "og:description",
        content:
          "Change capacity as the constraint, the pillars that organise the work, and the loop that keeps delivery honest.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Framework,
});

const loop = [
  {
    step: "Map",
    body: "Start from the picture. Every module, process and workflow step sits in one place, so scope is a position on a map instead of a line in a spreadsheet.",
  },
  {
    step: "Decide",
    body: "Governance, change requests and specifications are recorded where the work lives, so decisions stay attached to the process they affect.",
  },
  {
    step: "Deliver",
    body: "Cutover, functional implementation and the go-live checklist follow the same structure the map already describes.",
  },
  {
    step: "Learn",
    body: "Health checks and readiness reviews feed back into the guides, so the next project starts further along.",
  },
];

function Framework() {
  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-5 pt-12 pb-6">
        <p className="label-xs">Framework</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">
          The constraint is change capacity, not software.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          ERP programmes rarely fail on features. They fail because an organisation can only
          absorb so much change at once — and nobody maps how much is being asked for. EZRP
          makes that visible: the modules in play, the processes inside them, and the workflow
          steps people will have to learn on Monday.
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Three things hold the work together</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              {
                t: "Structure",
                b: `${pillars.length} pillars organise ${guides.length} guides, from financial accounting to governance.`,
              },
              {
                t: "Process",
                b: "Each guide records the workflow steps as they are actually run, not as a vendor diagram.",
              },
              {
                t: "Language",
                b: "One shared vocabulary across finance, IT and the project team, so conversations start from the same map.",
              },
            ].map((c) => (
              <div key={c.t} className="panel rounded-lg p-4">
                <p className="label-xs">{c.t}</p>
                <p className="mt-2 text-sm text-muted-foreground">{c.b}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">The EZRP loop</h2>
          <ol className="mt-4 space-y-3">
            {loop.map((l, i) => (
              <li key={l.step} className="panel rounded-lg p-4">
                <p className="font-mono text-xs text-primary">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold">{l.step}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{l.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="panel mt-10 rounded-lg p-6">
          <h2 className="font-display text-xl font-semibold">Not sure where to start?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ask for a guide using the button in the corner — the assistant answers only from
            this library and tells you when something isn't covered yet.
          </p>
          <Link
            to="/guides"
            className="mt-4 inline-block rounded bg-primary px-4 py-2 font-display text-sm font-semibold text-primary-foreground transition hover:brightness-110"
          >
            Browse the library
          </Link>
        </section>
      </article>
    </SiteShell>
  );
}
