import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { ArticleBody } from "@/components/ArticleBody";
import { EndToEndFlow } from "@/components/EndToEndFlow";
import { SiteShell } from "@/components/SiteShell";
import { articleBySlug } from "@/content/articles";
import { flowBySlug } from "@/content/flows";
import {
  ancestorsOf,
  childrenOf,
  guideBySlug,
  pillarOf,
  type Guide,
} from "@/content/guides";

export const Route = createFileRoute("/guides/$slug")({
  loader: ({ params }) => {
    const guide = guideBySlug.get(params.slug);
    if (!guide) throw notFound();
    return { guide };
  },
  head: ({ loaderData }) => {
    const guide = loaderData?.guide as Guide | undefined;
    const title = guide ? `${guide.topic} — EZRP guide` : "Guide — EZRP";
    const description =
      guide?.definition ??
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
  const { guide } = Route.useLoaderData();
  const trail = ancestorsOf(guide.slug);
  const kids = childrenOf(guide.slug);
  const pillar = pillarOf(guide.slug);
  const siblings = guide.parent
    ? childrenOf(guide.parent).filter((g) => g.slug !== guide.slug)
    : [];
  const article = articleBySlug.get(guide.slug);
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
              <Link
                to="/guides/$slug"
                params={{ slug: t.slug }}
                className="hover:text-foreground"
              >
                {t.topic}
              </Link>
            </span>
          ))}
        </nav>

        <h1 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">{guide.topic}</h1>

        {guide.categories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {guide.categories.map((c) => (
              <span
                key={c}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
              >
                {c}
              </span>
            ))}
          </div>
        )}

        {(guide.definition ?? article) ? (
          <p className="mt-5 text-lg text-muted-foreground">
            {guide.definition ?? article?.intro}
          </p>
        ) : (
          <p className="mt-5 text-sm text-muted-foreground">
            No written definition recorded for this topic yet — the map position and links
            below are what the library holds.
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
