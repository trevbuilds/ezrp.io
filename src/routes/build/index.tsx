import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteShell } from "@/components/SiteShell";
import { buildPlan } from "@/content/build";
import { deliverables, groupInputs } from "@/content/deliverables";
import { programmes } from "@/content/programmes";
import { parsePicks } from "@/content/scope";

type BuildSearch = { pick?: string | undefined };

export const Route = createFileRoute("/build/")({
  validateSearch: (search: Record<string, unknown>): BuildSearch => ({
    pick: typeof search["pick"] === "string" && search["pick"] ? search["pick"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Build — EZRP" },
      {
        name: "description",
        content:
          "The step after scoping: the documents a programme has to produce, starting with what each one needs as an input.",
      },
      { property: "og:title", content: "Build — EZRP" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BuildIndex,
});

function BuildIndex() {
  const search = Route.useSearch();
  const picks = parsePicks(search.pick);
  const plan = picks.length > 0 ? buildPlan(picks) : null;

  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-5 pt-12 pb-6">
        <p className="label-xs">Build</p>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">
          Scoping tells you what is in. This is where it becomes work.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground">
          Most of these documents get started from a template someone had lying around, which is why
          so many of them carry the previous programme&rsquo;s assumptions. The useful part of a
          template is not its headings — it is knowing what has to be gathered before the headings
          can be answered honestly. So each one starts with its inputs.
        </p>

        {plan && (
          <section className="panel mt-8 rounded-lg border-l-2 border-primary p-5">
            <p className="label-xs">Your scope, as work</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {plan.scope.topics.length} topics across {plan.scope.modules.length} modules imply{" "}
              <strong className="text-foreground">{plan.totals.artefacts} artefacts</strong> to
              produce, {plan.totals.decisions} of them decisions that constrain everything after
              them, and {plan.totals.interfaces} interfaces to specify, across{" "}
              {plan.releases.length} {plan.releases.length === 1 ? "release" : "releases"}.
            </p>
            <Link
              to="/scope"
              search={{ pick: search.pick }}
              className="mt-3 inline-block text-xs text-primary transition hover:brightness-110"
            >
              Back to the scope →
            </Link>
          </section>
        )}

        <section className="mt-10">
          <p className="label-xs">Deliverables</p>
          <p className="mt-1 max-w-2xl text-xs text-muted-foreground">
            All alpha. The inputs are the settled part; generating the document itself is not built
            yet.
          </p>
          <div className="mt-3 space-y-2">
            {deliverables.map((item) => {
              const { blocking } = groupInputs(item.inputs);
              return (
                <Link
                  key={item.slug}
                  to="/build/$slug"
                  params={{ slug: item.slug }}
                  search={{ pick: search.pick }}
                  className="panel block rounded-lg p-4 transition hover:border-primary"
                >
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h2 className="font-display text-lg font-semibold">{item.name}</h2>
                    <span className="rounded border border-primary/45 px-1.5 py-0.5 font-mono text-[0.625rem] uppercase text-primary">
                      Alpha
                    </span>
                  </div>
                  <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{item.summary}</p>
                  <p className="mt-2 font-mono text-xs text-muted-foreground">
                    {item.inputs.length} inputs · {blocking.length} blocking ·{" "}
                    {item.sections.length} sections
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-10">
          <p className="label-xs">Templates</p>
          <p className="mt-1 max-w-2xl text-xs text-muted-foreground">
            A whole programme, mapped against the model. It names what is being changed and what is
            deliberately not; everything else on the page is computed.
          </p>
          <div className="mt-3 space-y-2">
            {programmes.map((programme) => (
              <Link
                key={programme.slug}
                to="/build/template/$slug"
                params={{ slug: programme.slug }}
                className="panel block rounded-lg p-4 transition hover:border-primary"
              >
                <h2 className="font-display text-lg font-semibold">{programme.name}</h2>
                <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
                  {programme.summary}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </SiteShell>
  );
}
