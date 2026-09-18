import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { SiteShell } from "@/components/SiteShell";
import { childrenOf, guideBySlug, type Guide } from "@/content/guides";

export const Route = createFileRoute("/pillars/$slug")({
  loader: ({ params }) => {
    const pillar = guideBySlug.get(params.slug);
    if (!pillar || pillar.parent !== null) throw notFound();
    return { pillar };
  },
  head: ({ loaderData }) => {
    const pillar = loaderData?.pillar as Guide | undefined;
    const title = pillar ? `${pillar.topic} — EZRP pillar` : "Pillar — EZRP";
    const description =
      pillar?.definition ??
      (pillar
        ? `Every EZRP guide under ${pillar.topic}, with the processes and workflow steps it covers.`
        : "EZRP pillar");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: PillarPage,
});

function PillarPage() {
  const { pillar } = Route.useLoaderData();
  const kids = childrenOf(pillar.slug);

  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-5 pt-12">
        <p className="label-xs">Pillar</p>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">{pillar.topic}</h1>
        {pillar.definition && (
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{pillar.definition}</p>
        )}
        {pillar.workflow.length > 0 && (
          <p className="mt-4 font-mono text-xs text-accent">{pillar.workflow.join("  →  ")}</p>
        )}

        <div className="mt-8 space-y-3 pb-6">
          {kids.map((k) => {
            const grandKids = childrenOf(k.slug);
            return (
              <div key={k.slug} className="panel rounded-lg p-4">
                <Link
                  to="/guides/$slug"
                  params={{ slug: k.slug }}
                  className="font-display text-lg font-semibold hover:text-primary"
                >
                  {k.topic}
                </Link>
                {k.definition && (
                  <p className="mt-1 text-sm text-muted-foreground">{k.definition}</p>
                )}
                {k.workflow.length > 0 && (
                  <p className="mt-2 font-mono text-xs text-accent">
                    {k.workflow.join("  →  ")}
                  </p>
                )}
                {grandKids.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {grandKids.map((g) => (
                      <Link
                        key={g.slug}
                        to="/guides/$slug"
                        params={{ slug: g.slug }}
                        className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition hover:text-foreground"
                      >
                        {g.topic}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {kids.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No guides are recorded under this pillar yet.
            </p>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
