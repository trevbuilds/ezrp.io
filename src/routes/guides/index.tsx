import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteShell } from "@/components/SiteShell";
import { allCategories, childrenOf, guides, pillars } from "@/content/guides";

export const Route = createFileRoute("/guides/")({
  head: () => ({
    meta: [
      { title: "Guide library — EZRP" },
      {
        name: "description",
        content:
          "Search every EZRP guide: ERP modules, the processes inside them, their workflow steps and where they sit in the delivery map.",
      },
      { property: "og:title", content: "Guide library — EZRP" },
      {
        property: "og:description",
        content: "Search and filter the full EZRP guide library by pillar and category.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GuideLibrary,
});

function GuideLibrary() {
  const [q, setQ] = useState("");
  const [pillar, setPillar] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return guides.filter((g) => {
      if (pillar) {
        const inPillar =
          g.slug === pillar ||
          g.parent === pillar ||
          childrenOf(pillar).some((c) => childrenOf(c.slug).some((x) => x.slug === g.slug));
        if (!inPillar) return false;
      }
      if (category && !g.categories.includes(category as never)) return false;
      if (!needle) return true;
      return [g.topic, g.definition ?? "", g.workflow.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [q, pillar, category]);

  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-5 pt-12">
        <p className="label-xs">Library</p>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">Every guide, one place</h1>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search topics, definitions, workflow steps…"
          className="mt-6 w-full rounded border border-input bg-background px-4 py-3 outline-none focus:border-primary"
        />

        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Chip active={pillar === null} onClick={() => setPillar(null)}>
              All pillars
            </Chip>
            {pillars.map((p) => (
              <Chip
                key={p.slug}
                active={pillar === p.slug}
                onClick={() => setPillar(pillar === p.slug ? null : p.slug)}
              >
                {p.topic}
              </Chip>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip active={category === null} onClick={() => setCategory(null)}>
              All categories
            </Chip>
            {allCategories.map((c) => (
              <Chip
                key={c}
                active={category === c}
                onClick={() => setCategory(category === c ? null : c)}
              >
                {c}
              </Chip>
            ))}
          </div>
        </div>

        <p className="label-xs mt-6">{results.length} guides</p>

        <div className="mt-3 grid gap-3 pb-6 md:grid-cols-2">
          {results.map((g) => (
            <Link
              key={g.slug}
              to="/guides/$slug"
              params={{ slug: g.slug }}
              className="panel rounded-lg p-4 transition hover:border-primary"
            >
              <p className="label-xs">
                {g.parent ? g.parent.replace(/-/g, " ") : "Top-level pillar"}
              </p>
              <h2 className="mt-1 font-display text-lg font-semibold">{g.topic}</h2>
              {g.definition && (
                <p className="mt-1 text-sm text-muted-foreground">{g.definition}</p>
              )}
              {g.workflow.length > 0 && (
                <p className="mt-2 font-mono text-xs text-accent">
                  {g.workflow.join("  →  ")}
                </p>
              )}
            </Link>
          ))}
          {results.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nothing in the library matches that yet.
            </p>
          )}
        </div>
      </section>
    </SiteShell>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs transition ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
