import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteShell } from "@/components/SiteShell";
import { guides } from "@/content/guides";
import { jurisdictionFields, jurisdictions } from "@/content/jurisdictions";

export const Route = createFileRoute("/locales/")({
  head: () => ({
    meta: [
      { title: "Locales — EZRP" },
      {
        name: "description",
        content:
          "The layer under Local-AU: payroll tax, long service leave, workers compensation, procurement and public finance obligations, state by state.",
      },
      { property: "og:title", content: "Locales — EZRP" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LocalesIndex,
});

/** Topics whose rule actually changes at a state border. */
const varying = guides.filter((guide) => guide.jurisdictions.length > 0);
/** Australian obligations that do not vary — the contrast is the point. */
const federal = guides.filter(
  (guide) => guide.scope.includes("Local-AU") && guide.jurisdictions.length === 0,
);

function LocalesIndex() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-5 pt-12 pb-6">
        <p className="label-xs">Locales</p>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">
          &ldquo;Applies in Australia&rdquo; is not precise enough to configure anything
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground">
          Some Australian obligations are federal and the same everywhere. Others are state
          obligations with a different threshold, a different scheme and a different instrument in
          each jurisdiction, which means an employer operating across a border is running two rules
          rather than one rule twice. This is the layer under Local-AU.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <section className="panel rounded-lg p-4">
            <p className="label-xs">Changes by state</p>
            <ul className="mt-3 space-y-1.5">
              {varying.map((guide) => (
                <li key={guide.slug} className="text-sm">
                  <Link
                    to="/guides/$slug"
                    params={{ slug: guide.slug }}
                    className="text-muted-foreground transition hover:text-foreground"
                  >
                    {guide.topic}
                  </Link>
                  {guide.jurisdictions.length < 8 && (
                    <span className="ml-2 font-mono text-xs text-primary">
                      {guide.jurisdictions.join(" ")}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="panel rounded-lg p-4">
            <p className="label-xs">Australian, but federal</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Local-AU with no jurisdictions is a statement, not a gap: there is nothing to vary.
            </p>
            <ul className="mt-3 space-y-1.5">
              {federal.map((guide) => (
                <li key={guide.slug} className="text-sm">
                  <Link
                    to="/guides/$slug"
                    params={{ slug: guide.slug }}
                    className="text-muted-foreground transition hover:text-foreground"
                  >
                    {guide.topic}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-10">
          <p className="label-xs">The eight</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {jurisdictions.map((item) => (
              <Link
                key={item.code}
                to="/locales/$code"
                params={{ code: item.code }}
                className="panel rounded-lg p-4 transition hover:border-primary"
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-sm text-primary">{item.code}</span>
                  <span className="font-display text-base font-semibold">{item.name}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{item.revenueOffice}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <p className="label-xs">What is worth checking, and why</p>
          <div className="mt-3 space-y-2">
            {jurisdictionFields.map((field) => (
              <div key={field.key} className="panel rounded-lg p-4">
                <p className="font-display text-sm font-semibold">{field.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{field.why}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="panel mt-10 rounded-lg p-5">
          <p className="label-xs">On numbers</p>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Thresholds, rates and dates are deliberately not recorded here. They change at least
            annually, and a figure published on this page would be wrong before it was useful. What
            is recorded is which body, which act and which scheme — go to the named source for the
            current number.{" "}
            <a
              href="https://github.com/trevbuilds/ezrp.io/issues/new?labels=feedback"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              Practitioner corrections
            </a>{" "}
            on any of it are especially welcome.
          </p>
        </section>
      </section>
    </SiteShell>
  );
}
