import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, GitBranch, Search } from "lucide-react";

import { SemanticBrain } from "@/components/SemanticBrain";
import { SiteShell } from "@/components/SiteShell";
import { SolutionFinder } from "@/components/SolutionFinder";
import { Button } from "@/components/ui/button";
import { guides, pillars } from "@/content/guides";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "EZRP — map the change before you absorb it",
      },
      {
        name: "description",
        content:
          "ERP programmes fail on change capacity, not features. EZRP maps modules, processes and Australian obligations so you can see what a change actually asks for.",
      },
      {
        property: "og:title",
        content: "EZRP — map the change before you absorb it",
      },
      {
        property: "og:description",
        content:
          "See what a change drags in across modules and value streams, with Australian federal vs state obligations mapped alongside the work.",
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
      <section className="dark cover-grid relative overflow-hidden bg-background px-5 py-12 text-foreground md:px-8 md:py-16 lg:px-12">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-8">
          <div>
            <p className="label-xs">Easy Resource Planning · Beta</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
              Map how much change you are asking for.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              ERP programmes rarely fail on features. They fail because an organisation can only
              absorb so much change at once — and nobody maps how much is being asked for. EZRP
              makes the shape of the work visible: modules, processes, value streams, and the
              Australian obligations that differ federal vs state.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/start">
                  Scope a change <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/framework">Understand the framework</Link>
              </Button>
            </div>
            <p className="mt-5 max-w-2xl text-sm text-muted-foreground">
              Working in Australia?{" "}
              <Link to="/locales" className="text-primary hover:underline">
                Locales
              </Link>{" "}
              maps federal vs state obligations — payroll tax, long service leave, workers
              compensation and the rest — without embedding rates that go stale.
            </p>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              Demo walkthrough:{" "}
              <Link
                to="/guides/$slug"
                params={{ slug: "procurement" }}
                className="text-primary hover:underline"
              >
                Procure-to-Pay end to end
              </Link>
              , then Scope → Build → Locales.
            </p>
          </div>
          <div className="w-full min-w-0">
            <SemanticBrain />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-6xl px-5">
        <p className="label-xs">Find your starting point</p>
        <h2 className="mt-2 text-2xl font-bold md:text-3xl">
          Tell us three things, we'll scope it.
        </h2>
        <p className="mb-5 mt-2 max-w-2xl text-sm text-muted-foreground">
          Pick your industry and the area you are changing. We open the scoping tool with your
          answers filled in and show what that area drags in.
        </p>
        <SolutionFinder />
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-5">
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
          <article className="bg-surface p-6">
            <p className="label-xs">01 · The system</p>
            <h2 className="mt-3 text-xl font-semibold">What is ERP?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Enterprise Resource Planning is the connected system a business uses to run finance,
              people, customers, supply, operations, assets, projects and reporting. It creates one
              operational backbone rather than a collection of disconnected tools.
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
              testing, migration, training, cutover and ongoing improvement. The map at the top of
              the page shows how those concerns connect rather than treating them as separate
              projects.
            </p>
          </article>
        </div>
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
              <div>
                <h3 className="font-semibold">Find a topic</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Search for the system, process or delivery challenge you are working through.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <GitBranch className="mt-0.5 size-5 shrink-0 text-accent" />
              <div>
                <h3 className="font-semibold">Follow the value stream</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  See what happens before and after your topic, including where work crosses
                  business domains.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <BookOpen className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold">Use the guide in the room</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Bring the definitions, workflows, questions and measures into planning, design and
                  delivery conversations.
                </p>
              </div>
            </li>
          </ol>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
          <p className="max-w-2xl text-sm text-muted-foreground">
            The library currently connects {guides.length} guides across {pillars.length} top-level
            areas. Feedback during Beta shapes what gets sharpened next.
          </p>
          <Button asChild>
            <Link to="/guides">
              Browse the field guide <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
    </SiteShell>
  );
}
