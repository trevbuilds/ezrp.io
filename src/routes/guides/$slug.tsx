import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { ArticleBody } from "@/components/ArticleBody";
import { EndToEndFlow } from "@/components/EndToEndFlow";
import { SiteShell } from "@/components/SiteShell";
import { loadArticle } from "@/content/article-loader";
import type { Article } from "@/content/article";
import { flowBySlug } from "@/content/flows";
import { ancestorsOf, childrenOf, guideBySlug, pillarOf, type Guide } from "@/content/guides";
import { computeScope } from "@/content/scope";
import { flowsFor, inboundTo } from "@/content/integrations";

export const Route = createFileRoute("/guides/$slug")({
  loader: async ({ params }) => {
    const guide = guideBySlug.get(params.slug);
    if (!guide) throw notFound();
    // Article bodies are markdown, fetched per route rather than bundled.
    const article = await loadArticle(params.slug);
    return { guide, article };
  },
  head: ({ loaderData }) => {
    const guide = loaderData?.guide as Guide | undefined;
    const title = guide ? `${guide.topic} — EZRP guide` : "Guide — EZRP";
    const description =
      guide?.definition ??
      (loaderData?.article as Article | undefined)?.intro ??
      (guide
        ? `Where ${guide.topic} sits in the EZRP delivery map, plus its recorded workflow and related guides.`
        : "EZRP guide");
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
  component: GuidePage,
});

function GuidePage() {
  const { guide, article } = Route.useLoaderData();
  const trail = ancestorsOf(guide.slug);
  const kids = childrenOf(guide.slug);
  const pillar = pillarOf(guide.slug);
  const siblings = guide.parent
    ? childrenOf(guide.parent).filter((g) => g.slug !== guide.slug)
    : [];
  const flow = flowBySlug.get(guide.slug);

  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-5 pt-12">
        <nav className="label-xs flex flex-wrap items-center gap-2">
          <Link to="/guides" className="hover:text-foreground">
            Library
          </Link>
          {trail.map((t) => (
            <span key={t.slug} className="flex items-center gap-2">
              <span>/</span>
              <Link to="/guides/$slug" params={{ slug: t.slug }} className="hover:text-foreground">
                {t.topic}
              </Link>
            </span>
          ))}
        </nav>

        <h1 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">{guide.topic}</h1>

        {/* Facets: every tag is a way back into the filtered library. */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {guide.domain && (
            <Link
              to="/guides"
              search={{ domain: guide.domain }}
              className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground transition hover:brightness-110"
            >
              {guide.domain}
            </Link>
          )}
          {guide.valueStream && (
            <Link
              to="/guides"
              search={{ stream: guide.valueStream }}
              className="rounded-full border border-primary px-3 py-1 text-xs text-primary transition hover:brightness-110"
            >
              {guide.valueStream}
            </Link>
          )}
          {pillar && pillar.slug !== guide.slug && (
            <Link
              to="/guides"
              search={{ module: pillar.slug }}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition hover:text-foreground"
            >
              {pillar.topic}
            </Link>
          )}
          {guide.categories.map((c) => (
            <Link
              key={c}
              to="/guides"
              search={{ category: c }}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition hover:text-foreground"
            >
              {c}
            </Link>
          ))}
        </div>

        {(guide.definition ?? article) ? (
          <p className="mt-5 text-lg text-muted-foreground">{guide.definition ?? article?.intro}</p>
        ) : (
          <p className="mt-5 text-sm text-muted-foreground">
            No written definition recorded for this topic yet — the map position and links below are
            what the library holds.
          </p>
        )}

        {guide.workflow.length > 0 && (
          <section className="panel mt-8 rounded-lg p-5">
            <p className="label-xs">Workflow</p>
            <ol className="mt-3 space-y-2">
              {guide.workflow.map((step, i) => (
                <li key={step} className="flex gap-3 text-sm">
                  <span className="font-mono text-xs text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* What this topic exchanges, and with what. */}
        {(() => {
          const own = flowsFor(guide.slug);
          const incoming = inboundTo(guide.slug);
          if (own.length === 0 && incoming.length === 0) return null;
          return (
            <section className="panel mt-8 rounded-lg p-5">
              <p className="label-xs">Data in and out</p>
              <ul className="mt-3 space-y-2">
                {own.map((flow, index) => (
                  <li key={`o${index}`} className="text-sm">
                    <span className="font-mono text-xs text-primary">
                      {flow.direction === "in" ? "IN " : "OUT"}
                    </span>{" "}
                    <span className="font-semibold">{flow.payload}</span>{" "}
                    <span className="text-muted-foreground">
                      {flow.direction === "in" ? "from" : "to"}{" "}
                      {guideBySlug.get(flow.counterpart)?.topic ?? flow.counterpart} ·{" "}
                      {flow.cadence.toLowerCase()}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      Without it: {flow.breaks}
                    </span>
                  </li>
                ))}
                {incoming.map((flow, index) => (
                  <li key={`i${index}`} className="text-sm">
                    <span className="font-mono text-xs text-primary">IN </span>{" "}
                    <span className="font-semibold">{flow.payload}</span>{" "}
                    <span className="text-muted-foreground">
                      from {guideBySlug.get(flow.topic)?.topic ?? flow.topic} ·{" "}
                      {flow.cadence.toLowerCase()}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })()}

        {/* What picking this one topic would actually imply. */}
        {guide.streams.length > 0 &&
          (() => {
            const scope = computeScope([guide.slug]);
            if (scope.topics.length < 2) return null;
            return (
              <section className="panel mt-8 rounded-lg p-5">
                <p className="label-xs">If you change this</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  It implies {scope.topics.length} topics across{" "}
                  {scope.modules.length === 1 ? "one module" : `${scope.modules.length} modules`}
                  {scope.draggedIn.length > 0 && (
                    <>
                      , including{" "}
                      <strong className="text-foreground">
                        {scope.draggedIn
                          .map((slug) => guideBySlug.get(slug)?.topic ?? slug)
                          .join(" and ")}
                      </strong>{" "}
                      which you might not expect
                    </>
                  )}
                  .
                </p>
                <Link
                  to="/scope"
                  search={{ pick: guide.slug }}
                  className="mt-3 inline-block rounded bg-primary px-3 py-1.5 font-display text-xs font-semibold text-primary-foreground transition hover:brightness-110"
                >
                  See the path ahead →
                </Link>
              </section>
            );
          })()}

        {flow && <EndToEndFlow flow={flow} />}

        {article && <ArticleBody article={article} />}

        {kids.length > 0 && (
          <section className="mt-8">
            <p className="label-xs">Covers</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {kids.map((k) => (
                <Link
                  key={k.slug}
                  to="/guides/$slug"
                  params={{ slug: k.slug }}
                  className="panel rounded p-3 text-sm transition hover:border-primary"
                >
                  {k.topic}
                </Link>
              ))}
            </div>
          </section>
        )}

        {siblings.length > 0 && (
          <section className="mt-8">
            <p className="label-xs">Alongside this</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {siblings.map((s) => (
                <Link
                  key={s.slug}
                  to="/guides/$slug"
                  params={{ slug: s.slug }}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition hover:text-foreground"
                >
                  {s.topic}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-8 flex flex-wrap gap-4 border-t border-border pt-5 text-sm">
          {pillar && (
            <Link
              to="/pillars/$slug"
              params={{ slug: pillar.slug }}
              className="font-semibold text-primary hover:underline"
            >
              All of {pillar.topic} →
            </Link>
          )}
          {guide.sourceUrl && (
            <a
              href={guide.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              Original article
            </a>
          )}
        </section>
      </article>
    </SiteShell>
  );
}
