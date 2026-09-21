import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, GitBranch, Search } from "lucide-react";

import { GuideMap } from "@/components/GuideMap";
import { SiteShell } from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
import { guides, pillars } from "@/content/guides";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EZRP — making ERP and digital transformation easier" },
      {
        name: "description",
        content:
          "Plain-English guidance for navigating ERP and digital transformation, understanding the moving parts, and avoiding common delivery pitfalls.",
      },
      {
        property: "og:title",
        content: "EZRP — making ERP and digital transformation easier",
      },
      {
        property: "og:description",
        content:
          "Understand ERP, follow end-to-end value streams, and use practical field guides to avoid common transformation pitfalls.",
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
      <section className="mx-auto max-w-6xl px-5 pt-12 md:pt-16">
        <p className="label-xs">Easy Resource Planning · Alpha</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
          Making ERP and digital transformation easier for everyone.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
          ERP programmes connect nearly every part of an organisation, which means small
          decisions can create expensive problems elsewhere. EZRP turns that complexity into
          practical maps and field guides so more people can understand the work, spot the
          pitfalls, and make better decisions.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/guides">
              Open the field guide <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/framework">Understand the framework</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-5">
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
          <article className="bg-surface p-6">
            <p className="label-xs">01 · The system</p>
            <h2 className="mt-3 text-xl font-semibold">What is ERP?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Enterprise Resource Planning is the connected system a business uses to run
              finance, people, customers, supply, operations, assets, projects and reporting.
              It creates one operational backbone rather than a collection of disconnected tools.
            </p>
          </article>
          <article className="bg-surface p-6">
            <p className="label-xs">02 · The change</p>
            <h2 className="mt-3 text-xl font-semibold">What is digital transformation?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              It is not simply installing software. It is changing how work flows across people,
              process, data and technology—with governance, security, adoption and delivery all
              shaping whether the change succeeds.
            </p>
          </article>
          <article className="bg-surface p-6">
            <p className="label-xs">03 · The reality</p>
            <h2 className="mt-3 text-xl font-semibold">What is involved?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Strategy and scope, process design, data, integrations, controls, implementation,
              testing, migration, training, cutover and ongoing improvement. The map below shows
              how those concerns connect rather than treating them as separate projects.
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-5">
        <div className="mb-6 max-w-3xl">
          <p className="label-xs">The knowledge map</p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">See the whole system, then follow the work.</h2>
          <p className="mt-3 text-muted-foreground">
            Start at EZRP, move through a business domain, then follow its value streams into the
            practical guides. Shared concerns connect across the map because transformation never
            happens in neat departmental boxes.
          </p>
        </div>
        <GuideMap />
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-5">
        <div className="border-y border-border py-10 md:grid md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <p className="label-xs">How to use the library</p>
            <h2 className="mt-2 text-3xl font-bold">Start wherever the problem is.</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The field guide is a working reference, not a course you need to read front to back.
              Use the path that matches the question in front of you.
            </p>
          </div>
          <ol className="mt-8 space-y-6 md:mt-0">
            <li className="flex gap-4">
              <Search className="mt-0.5 size-5 shrink-0 text-primary" />
              <div><h3 className="font-semibold">Find a topic</h3><p className="mt-1 text-sm text-muted-foreground">Search for the system, process or delivery challenge you are working through.</p></div>
            </li>
            <li className="flex gap-4">
              <GitBranch className="mt-0.5 size-5 shrink-0 text-accent" />
              <div><h3 className="font-semibold">Follow the value stream</h3><p className="mt-1 text-sm text-muted-foreground">See what happens before and after your topic, including where work crosses business domains.</p></div>
            </li>
            <li className="flex gap-4">
              <BookOpen className="mt-0.5 size-5 shrink-0 text-primary" />
              <div><h3 className="font-semibold">Use the guide in the room</h3><p className="mt-1 text-sm text-muted-foreground">Bring the definitions, workflows, questions and measures into planning, design and delivery conversations.</p></div>
            </li>
          </ol>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
          <p className="max-w-2xl text-sm text-muted-foreground">
            The library currently connects {guides.length} guides across {pillars.length} top-level areas, and will keep growing during Alpha.
          </p>
          <Button asChild>
            <Link to="/guides">Browse the field guide <ArrowRight /></Link>
          </Button>
        </div>
      </section>
    </SiteShell>
  );
}
