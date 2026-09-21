import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { SiteShell } from "@/components/SiteShell";
import { guides } from "@/content/guides";
import { jurisdictionByCode, jurisdictionFields } from "@/content/jurisdictions";
import type { JurisdictionProfile } from "@/content/jurisdictions";
import { allJurisdictions, type Jurisdiction } from "@/content/model";

export const Route = createFileRoute("/locales/$code")({
  loader: ({ params }) => {
    const profile = jurisdictionByCode.get(params.code as Jurisdiction);
    if (!profile) throw notFound();
    return { profile };
  },
  head: ({ loaderData }) => {
    const profile = loaderData?.profile as JurisdictionProfile | undefined;
    const title = profile ? `${profile.name} — locale — EZRP` : "Locale — EZRP";
    const description = profile
      ? `What changes in ${profile.name}: payroll tax, long service leave, workers compensation, procurement, public finance and economic regulation.`
      : "An Australian state or territory locale.";
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
  component: LocalePage,
});

function LocalePage() {
  const { profile } = Route.useLoaderData();
  const topics = guides.filter((guide) => guide.jurisdictions.includes(profile.code));

  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-5 pt-12">
        <nav className="label-xs flex flex-wrap items-center gap-2">
          <Link to="/locales" className="hover:text-foreground">
            Locales
          </Link>
          <span>/</span>
          <span className="font-mono">{profile.code}</span>
        </nav>

        <h1 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">{profile.name}</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{profile.note}</p>

        <section className="mt-8 space-y-2">
          {jurisdictionFields.map((field) => (
            <div key={field.key} className="panel rounded-lg p-4">
              <p className="label-xs">{field.label}</p>
              <p className="mt-1.5 text-sm font-semibold">{profile[field.key]}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{field.why}</p>
            </div>
          ))}
        </section>

        {topics.length > 0 && (
          <section className="mt-8">
            <p className="label-xs">Topics whose rule changes here</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {topics.map((guide) => (
                <Link
                  key={guide.slug}
                  to="/guides/$slug"
                  params={{ slug: guide.slug }}
                  className="panel rounded p-3 text-sm transition hover:border-primary"
                >
                  {guide.topic}
                </Link>
              ))}
            </div>
            <Link
              to="/guides"
              search={{ scope: "Local-AU", state: profile.code }}
              className="mt-3 inline-block text-xs text-primary transition hover:brightness-110"
            >
              Filter the library to {profile.code} →
            </Link>
          </section>
        )}

        <section className="mt-8 border-t border-border pt-5">
          <p className="label-xs">The others</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {allJurisdictions
              .filter((code) => code !== profile.code)
              .map((code) => (
                <Link
                  key={code}
                  to="/locales/$code"
                  params={{ code }}
                  className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground transition hover:border-primary hover:text-foreground"
                >
                  {code}
                </Link>
              ))}
          </div>
        </section>
      </article>
    </SiteShell>
  );
}
