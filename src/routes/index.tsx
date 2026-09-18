import { createFileRoute, Link } from "@tanstack/react-router";

import { GuideMap } from "@/components/GuideMap";
import { SiteShell } from "@/components/SiteShell";
import { guides, pillars } from "@/content/guides";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EZRP — the ERP delivery map" },
      {
        name: "description",
        content:
          "Easy Resource Planning: a connected map of ERP modules, processes and workflow steps, with a guide library and an assistant that answers from it.",
      },
      { property: "og:title", content: "EZRP — the ERP delivery map" },
      {
        property: "og:description",
        content:
          "Explore ERP modules, the processes inside them and the workflow steps teams run — mapped, searchable, and answerable.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-5 pt-12">
        <p className="label-xs">Easy Resource Planning</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
          ERP delivery, mapped end to end.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
          {pillars.length} pillars, {guides.length} guides, and the workflow steps inside
          them — connected so you can see where a decision lands before you make it.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/guides"
            className="rounded bg-primary px-4 py-2 font-display text-sm font-semibold text-primary-foreground transition hover:brightness-110"
          >
            Browse the library
          </Link>
          <Link
            to="/framework"
            className="rounded border border-border px-4 py-2 font-display text-sm font-semibold transition hover:border-primary"
          >
            The EZRP framework
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl px-5">
        <GuideMap />
      </section>
    </SiteShell>
  );
}
