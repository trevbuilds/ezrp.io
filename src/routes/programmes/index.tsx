import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteShell } from "@/components/SiteShell";
import { computeScope } from "@/content/scope";
import { programmes } from "@/content/programmes";

export const Route = createFileRoute("/programmes/")({
  head: () => ({
    meta: [
      { title: "Programmes — EZRP" },
      {
        name: "description",
        content:
          "Worked programmes: a real piece of ERP work mapped against the model, with what it drags in made explicit.",
      },
      { property: "og:title", content: "Programmes — EZRP" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProgrammesIndex,
});

function ProgrammesIndex() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-5 pt-12 pb-6">
        <p className="label-xs">Programmes</p>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">The model, doing the job</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground">
          The rest of this library is universal. A programme is the opposite — one organisation, one
          decision, one set of constraints. Each one names what is being changed and what is
          deliberately not, and everything else on the page is derived from the same model the rest
          of the site runs on.
        </p>

        <div className="mt-8 space-y-3">
          {programmes.map((programme) => {
            const scope = computeScope(programme.picks);
            return (
              <Link
                key={programme.slug}
                to="/programmes/$slug"
                params={{ slug: programme.slug }}
                className="panel block rounded-lg p-5 transition hover:border-primary"
              >
                <p className="label-xs">{programme.organisation}</p>
                <h2 className="mt-2 font-display text-xl font-semibold">{programme.name}</h2>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{programme.summary}</p>
                <p className="mt-3 font-mono text-xs text-muted-foreground">
                  {programme.picks.length} areas picked · {scope.topics.length} topics ·{" "}
                  {scope.modules.length} modules · {scope.phases.length} phases
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </SiteShell>
  );
}
