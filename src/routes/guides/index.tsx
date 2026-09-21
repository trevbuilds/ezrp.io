import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteShell } from "@/components/SiteShell";
import { parsePicks, serialisePicks } from "@/content/scope";
import { allConsiderations, allScopes } from "@/content/model";
import {
  allBusinessDomains,
  allCategories,
  considerationsOf,
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
  /** Comma-separated slugs in the scope basket, carried through browsing. */
  pick?: string | undefined;
  q?: string | undefined;
  module?: string | undefined;
  domain?: string | undefined;
  stream?: string | undefined;
  category?: string | undefined;
  consideration?: string | undefined;
  scope?: string | undefined;
};

const str = (v: unknown) => (typeof v === "string" && v.length > 0 ? v : undefined);

/** Facets with nothing behind them are hidden rather than shown empty. */
const liveDomains = allBusinessDomains.filter((d) => guides.some((g) => g.domain === d));
const liveStreams = allValueStreams.filter((s) => guides.some((g) => g.valueStream === s));

export const Route = createFileRoute("/guides/")({
  validateSearch: (search: Record<string, unknown>): GuideSearch => ({
    pick: str(search["pick"]),
    q: str(search["q"]),
    module: str(search["module"]),
    domain: str(search["domain"]),
    stream: str(search["stream"]),
    category: str(search["category"]),
    consideration: str(search["consideration"]),
    scope: str(search["scope"]),
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

  const picks = parsePicks(search.pick);
  const pickedSet = useMemo(() => new Set(picks), [picks]);
  const togglePick = (slug: string) =>
    set({
      pick: serialisePicks(
        pickedSet.has(slug) ? picks.filter((item) => item !== slug) : [...picks, slug],
      ),
    });

  const activeModule = search.module ? guideBySlug.get(search.module) : undefined;

  const results = useMemo(() => {
    const needle = (search.q ?? "").trim().toLowerCase();
    return guides.filter((g) => {
      if (search.module && !inBranch(g, search.module)) return false;
      if (search.domain && g.domain !== search.domain) return false;
      if (search.stream && g.valueStream !== search.stream) return false;
      if (search.category && !g.categories.includes(search.category as never)) return false;
      if (search.consideration && !considerationsOf(g.slug).includes(search.consideration as never))
        return false;
      if (search.scope && !g.scope.includes(search.scope as never)) return false;
      if (!needle) return true;
      return [g.topic, g.definition ?? "", g.workflow.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [
    search.q,
    search.module,
    search.domain,
    search.stream,
    search.category,
    search.consideration,
    search.scope,
  ]);

  // Narrow the stream row to the chosen domain, so the two layers read as a
  // hierarchy rather than as two unrelated filter rows.
  const streamChips = search.domain
    ? streamsInDomain(search.domain as BusinessDomain).filter((s) => liveStreams.includes(s))
    : liveStreams;

  const hasFilter = Boolean(
    search.module ||
    search.domain ||
    search.stream ||
    search.category ||
    search.consideration ||
    search.scope ||
    search.q,
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

        {picks.length > 0 && (
          <div className="panel mt-4 flex flex-wrap items-center gap-2 rounded-lg p-3">
            <span className="label-xs mr-1">Scope</span>
            {picks.map((slug) => (
              <span
                key={slug}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-0.5 text-xs text-primary-foreground"
              >
                {guideBySlug.get(slug)?.topic ?? slug}
                <button
                  onClick={() => togglePick(slug)}
                  aria-label={`Remove ${guideBySlug.get(slug)?.topic ?? slug} from scope`}
                  className="opacity-70 transition hover:opacity-100"
                >
                  ✕
                </button>
              </span>
            ))}
            <Link
              to="/scope"
              search={{ pick: search.pick }}
              className="ml-auto rounded bg-primary px-3 py-1 font-display text-xs font-semibold text-primary-foreground transition hover:brightness-110"
            >
              See the path ahead →
            </Link>
            <button
              onClick={() => set({ pick: undefined })}
              className="text-xs text-muted-foreground underline hover:text-foreground"
            >
              Clear
            </button>
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[15rem_1fr]">
          {/*
            Two trees, kept apart. The ERP is a structure you navigate down:
            band, module, sub-module. The considerations are guidance that cuts
            across all of it, with the localities each one applies in nested
            underneath. Mixing them into one list was the garble.
          */}
          <nav className="space-y-7 lg:sticky lg:top-6 lg:self-start">
            <div>
              <p className="label-xs">ERP Modules</p>
              <ul className="mt-3 space-y-1">
                <li>
                  <button
                    onClick={() => set({ module: undefined, domain: undefined })}
                    className={`text-sm transition hover:text-foreground ${
                      search.module || search.domain
                        ? "text-muted-foreground"
                        : "font-semibold text-primary"
                    }`}
                  >
                    All areas
                  </button>
                </li>
                {liveDomains.map((band) => {
                  const modules = pillars.filter((p) => p.domain === band);
                  const bandOpen =
                    search.domain === band ||
                    modules.some(
                      (m) => inBranch(activeModule ?? m, m.slug) && Boolean(search.module),
                    );
                  return (
                    <li key={band} className="pt-1.5">
                      <button
                        onClick={() => toggle("domain", band)}
                        className={`text-left font-display text-sm transition hover:text-foreground ${
                          search.domain === band ? "font-semibold text-primary" : "text-foreground"
                        }`}
                      >
                        {band}
                      </button>
                      {modules.length > 0 && (
                        <ul className="mt-1 space-y-1 border-l border-border pl-3">
                          {modules.map((m) => {
                            const open =
                              Boolean(search.module) &&
                              (m.slug === search.module || inBranch(activeModule ?? m, m.slug));
                            return (
                              <li key={m.slug}>
                                <button
                                  onClick={() => toggle("module", m.slug)}
                                  className={`text-left text-sm transition hover:text-foreground ${
                                    search.module === m.slug
                                      ? "font-semibold text-primary"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {m.topic}
                                </button>
                                {(open || bandOpen) && childrenOf(m.slug).length > 0 && (
                                  <ul className="mt-1 space-y-1 border-l border-border pl-3">
                                    {childrenOf(m.slug).map((c) => (
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
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <p className="label-xs">Considerations</p>
              <ul className="mt-3 space-y-1">
                <li>
                  <button
                    onClick={() => set({ consideration: undefined, scope: undefined })}
                    className={`text-sm transition hover:text-foreground ${
                      search.consideration ? "text-muted-foreground" : "font-semibold text-primary"
                    }`}
                  >
                    All concerns
                  </button>
                </li>
                {allConsiderations.map((concern) => {
                  const localities = allScopes.filter((sc) =>
                    guides.some(
                      (g) => g.scope.includes(sc) && considerationsOf(g.slug).includes(concern),
                    ),
                  );
                  return (
                    <li key={concern}>
                      <button
                        onClick={() => toggle("consideration", concern)}
                        className={`text-left text-sm transition hover:text-foreground ${
                          search.consideration === concern
                            ? "font-semibold text-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        {concern}
                      </button>
                      {search.consideration === concern && localities.length > 0 && (
                        <ul className="mt-1 space-y-1 border-l border-border pl-3">
                          {localities.map((sc) => (
                            <li key={sc}>
                              <button
                                onClick={() => toggle("scope", sc)}
                                className={`text-left font-mono text-[0.7rem] uppercase transition hover:text-foreground ${
                                  search.scope === sc
                                    ? "font-semibold text-primary"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {sc}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          <div>
            <div className="space-y-3">
              {/* The flow axis: the nav carries structure, this carries streams. */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="label-xs w-24 shrink-0">Value stream</span>
                {streamChips.map((st) => (
                  <Chip key={st} active={search.stream === st} onClick={() => toggle("stream", st)}>
                    {st}
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
                <div
                  key={g.slug}
                  className="panel relative rounded-lg p-4 transition hover:border-primary"
                >
                  <button
                    onClick={() => togglePick(g.slug)}
                    aria-pressed={pickedSet.has(g.slug)}
                    aria-label={
                      pickedSet.has(g.slug)
                        ? `Remove ${g.topic} from scope`
                        : `Add ${g.topic} to scope`
                    }
                    className={`absolute right-3 top-3 rounded-full border px-2 py-0.5 text-[0.65rem] transition ${
                      pickedSet.has(g.slug)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                    }`}
                  >
                    {pickedSet.has(g.slug) ? "In scope ✓" : "+ Scope"}
                  </button>
                  <Link to="/guides/$slug" params={{ slug: g.slug }} className="block pr-20">
                    <p className="label-xs">
                      {g.parent
                        ? (guideBySlug.get(g.parent)?.topic ?? g.parent)
                        : "Top-level pillar"}
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
                </div>
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
