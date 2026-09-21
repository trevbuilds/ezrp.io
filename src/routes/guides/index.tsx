import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteShell } from "@/components/SiteShell";
import {
  allBusinessDomains,
  allCategories,
  allValueStreams,
  childrenOf,
  guideBySlug,
  guides,
  pillars,
  streamsInDomain,
  type BusinessDomain,
  type Guide,
} from "@/content/guides";

/**
 * Library filters live in the URL so a filtered view is linkable — the home
 * page map links straight into a scoped branch, and a domain or value stream
 * view can be shared as a link.
 */
type GuideSearch = {
  q?: string | undefined;
  module?: string | undefined;
  domain?: string | undefined;
  stream?: string | undefined;
  category?: string | undefined;
};

const str = (v: unknown) => (typeof v === "string" && v.length > 0 ? v : undefined);

/** Facets with nothing behind them are hidden rather than shown empty. */
const liveDomains = allBusinessDomains.filter((d) => guides.some((g) => g.domain === d));
const liveStreams = allValueStreams.filter((s) => guides.some((g) => g.valueStream === s));

export const Route = createFileRoute("/guides/")({
  validateSearch: (search: Record<string, unknown>): GuideSearch => ({
    q: str(search["q"]),
    module: str(search["module"]),
    domain: str(search["domain"]),
    stream: str(search["stream"]),
    category: str(search["category"]),
  }),
  head: () => ({
    meta: [
      { title: "Guide library — EZRP" },
      {
        name: "description",
        content:
          "Browse every EZRP guide by business domain, value stream, module or category: ERP modules, the processes inside them, and the workflow steps teams run.",
      },
      { property: "og:title", content: "Guide library — EZRP" },
      {
        property: "og:description",
        content:
          "Browse and filter the full EZRP guide library by business domain, value stream, module and category.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GuideLibrary,
});

/** True when `g` is the branch root, its child, or its grandchild. */
function inBranch(g: Guide, root: string) {
  if (g.slug === root) return true;
  if (g.parent === root) return true;
  const parent = g.parent ? guideBySlug.get(g.parent) : undefined;
  return parent?.parent === root;
}

function GuideLibrary() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState(search.q ?? "");

  const set = (patch: Partial<GuideSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });

  const toggle = (key: keyof GuideSearch, value: string) =>
    set({ [key]: search[key] === value ? undefined : value });

  const activeModule = search.module ? guideBySlug.get(search.module) : undefined;

  const results = useMemo(() => {
    const needle = (search.q ?? "").trim().toLowerCase();
    return guides.filter((g) => {
      if (search.module && !inBranch(g, search.module)) return false;
      if (search.domain && g.domain !== search.domain) return false;
      if (search.stream && g.valueStream !== search.stream) return false;
      if (search.category && !g.categories.includes(search.category as never)) return false;
      if (!needle) return true;
      return [g.topic, g.definition ?? "", g.workflow.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [search.q, search.module, search.domain, search.stream, search.category]);

  // Narrow the stream row to the chosen domain, so the two layers read as a
  // hierarchy rather than as two unrelated filter rows.
  const streamChips = search.domain
    ? streamsInDomain(search.domain as BusinessDomain).filter((s) => liveStreams.includes(s))
    : liveStreams;

  const hasFilter = Boolean(
    search.module || search.domain || search.stream || search.category || search.q,
  );

  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-5 pt-12">
        <p className="label-xs">Library</p>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">
          {activeModule ? activeModule.topic : "Every guide, one place"}
        </h1>
        {activeModule?.definition && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{activeModule.definition}</p>
        )}

        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            set({ q: e.target.value || undefined });
          }}
          placeholder="Search topics, definitions, workflow steps…"
          className="mt-6 w-full rounded border border-input bg-background px-4 py-3 outline-none focus:border-primary"
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[15rem_1fr]">
          {/* Wiki-style contents tree */}
          <nav className="lg:sticky lg:top-6 lg:self-start">
            <p className="label-xs">Contents</p>
            <ul className="mt-3 space-y-1">
              <li>
                <button
                  onClick={() => set({ module: undefined })}
                  className={`text-sm transition hover:text-foreground ${
                    search.module ? "text-muted-foreground" : "font-semibold text-primary"
                  }`}
                >
                  All areas
                </button>
              </li>
              {pillars.map((p) => {
                const open = search.module
                  ? p.slug === search.module || inBranch(activeModule ?? p, p.slug)
                  : false;
                return (
                  <li key={p.slug}>
                    <button
                      onClick={() => toggle("module", p.slug)}
                      className={`text-left text-sm transition hover:text-foreground ${
                        search.module === p.slug
                          ? "font-semibold text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {p.topic}
                    </button>
                    {open && childrenOf(p.slug).length > 0 && (
                      <ul className="mt-1 space-y-1 border-l border-border pl-3">
                        {childrenOf(p.slug).map((c) => (
                          <li key={c.slug}>
                            <button
                              onClick={() => toggle("module", c.slug)}
                              className={`text-left text-xs transition hover:text-foreground ${
                                search.module === c.slug
                                  ? "font-semibold text-primary"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {c.topic}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="label-xs w-24 shrink-0">Domain</span>
                {liveDomains.map((d) => (
                  <Chip key={d} active={search.domain === d} onClick={() => toggle("domain", d)}>
                    {d}
                  </Chip>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="label-xs w-24 shrink-0">Value stream</span>
                {streamChips.map((s) => (
                  <Chip key={s} active={search.stream === s} onClick={() => toggle("stream", s)}>
                    {s}
                  </Chip>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="label-xs w-24 shrink-0">Category</span>
                {allCategories.map((c) => (
                  <Chip
                    key={c}
                    active={search.category === c}
                    onClick={() => toggle("category", c)}
                  >
                    {c}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <p className="label-xs">{results.length} guides</p>
              {hasFilter && (
                <button
                  onClick={() => {
                    setQ("");
                    navigate({ search: {} });
                  }}
                  className="text-xs text-muted-foreground underline hover:text-foreground"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="mt-3 grid gap-3 pb-6 md:grid-cols-2">
              {results.map((g) => (
                <Link
                  key={g.slug}
                  to="/guides/$slug"
                  params={{ slug: g.slug }}
                  className="panel rounded-lg p-4 transition hover:border-primary"
                >
                  <p className="label-xs">
                    {g.parent ? (guideBySlug.get(g.parent)?.topic ?? g.parent) : "Top-level pillar"}
                  </p>
                  <h2 className="mt-1 font-display text-lg font-semibold">{g.topic}</h2>
                  {g.definition && (
                    <p className="mt-1 text-sm text-muted-foreground">{g.definition}</p>
                  )}
                  {g.workflow.length > 0 && (
                    <p className="mt-2 font-mono text-xs text-accent">{g.workflow.join("  →  ")}</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {g.domain && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[0.65rem] text-primary-foreground">
                        {g.domain}
                      </span>
                    )}
                    {g.valueStream && (
                      <span className="rounded-full border border-primary px-2 py-0.5 text-[0.65rem] text-primary">
                        {g.valueStream}
                      </span>
                    )}
                    {g.categories.map((c) => (
                      <span
                        key={c}
                        className="rounded-full border border-border px-2 py-0.5 text-[0.65rem] text-muted-foreground"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
              {results.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nothing in the library matches that yet.
                </p>
              )}
            </div>
          </div>
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
