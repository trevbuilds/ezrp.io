import React, { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteShell } from "@/components/SiteShell";
import { parsePicks, serialisePicks } from "@/content/scope";
import { allConsiderations, allScopes, erpBands } from "@/content/model";
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

  // Expansion is independent of filtering: a branch can be opened to look
  // inside without narrowing the results to it.
  const [open, setOpen] = useState<Set<string>>(new Set());

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
            Two trees, kept apart, both with their own expand toggles so a
            branch can be opened to look inside without filtering to it — the
            pattern SAP Help uses, which is what makes a deep tree navigable.

            The ERP is what the system does. Delivery — PMO, programme
            governance, cutover, change adoption — is how a programme is run,
            so it sits with the guidance rather than among the modules.
          */}
          <nav className="space-y-7 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto">
            <div>
              <div className="flex items-baseline justify-between gap-2">
                <p className="label-xs">ERP Modules</p>
                <button
                  onClick={() => setOpen(new Set())}
                  className="font-mono text-[0.625rem] text-muted-foreground transition hover:text-foreground"
                >
                  collapse all
                </button>
              </div>
              <ul className="mt-3 space-y-0.5">
                <li>
                  <button
                    onClick={() => set({ module: undefined, domain: undefined })}
                    className={`py-0.5 text-sm transition hover:text-foreground ${
                      search.module || search.domain
                        ? "text-muted-foreground"
                        : "font-semibold text-primary"
                    }`}
                  >
                    All areas
                  </button>
                </li>
                {erpBands().map((band) => (
                  <TreeBranch
                    key={band}
                    id={`band:${band}`}
                    label={band}
                    tone="band"
                    open={open}
                    setOpen={setOpen}
                    active={search.domain === band}
                    onSelect={() => toggle("domain", band)}
                  >
                    {pillars
                      .filter((p) => p.domain === band)
                      .map((m) => (
                        <TreeBranch
                          key={m.slug}
                          id={`module:${m.slug}`}
                          label={m.topic}
                          open={open}
                          setOpen={setOpen}
                          active={search.module === m.slug}
                          onSelect={() => toggle("module", m.slug)}
                        >
                          {childrenOf(m.slug).map((c) => (
                            <TreeLeaf
                              key={c.slug}
                              label={c.topic}
                              active={search.module === c.slug}
                              onSelect={() => toggle("module", c.slug)}
                            />
                          ))}
                        </TreeBranch>
                      ))}
                  </TreeBranch>
                ))}
              </ul>
            </div>

            <div>
              <p className="label-xs">Considerations</p>
              <ul className="mt-3 space-y-0.5">
                <li>
                  <button
                    onClick={() => set({ consideration: undefined, scope: undefined })}
                    className={`py-0.5 text-sm transition hover:text-foreground ${
                      search.consideration ? "text-muted-foreground" : "font-semibold text-primary"
                    }`}
                  >
                    All concerns
                  </button>
                </li>
                {allConsiderations.map((concern) => (
                  <TreeLeaf
                    key={concern}
                    label={concern}
                    size="sm"
                    active={search.consideration === concern}
                    onSelect={() => toggle("consideration", concern)}
                  />
                ))}
              </ul>
            </div>

            <div>
              <p className="label-xs">Applies</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Where the guidance holds. Combines with any concern above.
              </p>
              <ul className="mt-3 space-y-0.5">
                <li>
                  <button
                    onClick={() => set({ scope: undefined })}
                    className={`py-0.5 text-sm transition hover:text-foreground ${
                      search.scope ? "text-muted-foreground" : "font-semibold text-primary"
                    }`}
                  >
                    Everywhere
                  </button>
                </li>
                {allScopes.map((sc) => (
                  <TreeLeaf
                    key={sc}
                    label={sc}
                    mono
                    active={search.scope === sc}
                    onSelect={() => toggle("scope", sc)}
                  />
                ))}
              </ul>
            </div>

            <div>
              <p className="label-xs">Delivery</p>
              <p className="mt-1 text-xs text-muted-foreground">
                How a programme is run, rather than what the ERP does.
              </p>
              <ul className="mt-3 space-y-0.5">
                {pillars
                  .filter((p) => p.domain === "Delivery")
                  .map((m) => (
                    <TreeBranch
                      key={m.slug}
                      id={`module:${m.slug}`}
                      label={m.topic}
                      open={open}
                      setOpen={setOpen}
                      active={search.module === m.slug}
                      onSelect={() => toggle("module", m.slug)}
                    >
                      {childrenOf(m.slug).map((c) => (
                        <TreeLeaf
                          key={c.slug}
                          label={c.topic}
                          active={search.module === c.slug}
                          onSelect={() => toggle("module", c.slug)}
                        />
                      ))}
                    </TreeBranch>
                  ))}
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

/** A branch with a chevron toggle: open it, or select it, independently. */
function TreeBranch({
  id,
  label,
  tone = "item",
  open,
  setOpen,
  active,
  onSelect,
  children,
}: {
  id: string;
  label: string;
  tone?: "band" | "item";
  open: Set<string>;
  setOpen: (next: Set<string>) => void;
  active: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  const kids = React.Children.toArray(children).filter(Boolean);
  const isOpen = open.has(id);
  const toggleOpen = () => {
    const next = new Set(open);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setOpen(next);
  };

  return (
    <li>
      <div className="flex items-center gap-1">
        {kids.length > 0 ? (
          <button
            onClick={toggleOpen}
            aria-expanded={isOpen}
            aria-label={`${isOpen ? "Collapse" : "Expand"} ${label}`}
            className="flex size-4 shrink-0 items-center justify-center text-muted-foreground transition hover:text-foreground"
          >
            <ChevronRight className={`size-3 transition-transform ${isOpen ? "rotate-90" : ""}`} />
          </button>
        ) : (
          <span className="size-4 shrink-0" />
        )}
        <button
          onClick={onSelect}
          className={`py-0.5 text-left transition hover:text-foreground ${
            tone === "band" ? "font-display text-sm" : "text-sm"
          } ${active ? "font-semibold text-primary" : tone === "band" ? "text-foreground" : "text-muted-foreground"}`}
        >
          {label}
        </button>
      </div>
      {isOpen && kids.length > 0 && (
        <ul className="ml-2 mt-0.5 space-y-0.5 border-l border-border pl-3">{kids}</ul>
      )}
    </li>
  );
}

function TreeLeaf({
  label,
  active,
  onSelect,
  mono = false,
  size = "xs",
}: {
  label: string;
  active: boolean;
  onSelect: () => void;
  mono?: boolean;
  size?: "xs" | "sm";
}) {
  return (
    <li className="flex items-center gap-1">
      <span className="size-4 shrink-0" />
      <button
        onClick={onSelect}
        className={`py-0.5 text-left transition hover:text-foreground ${
          mono ? "font-mono text-[0.7rem] uppercase" : size === "sm" ? "text-sm" : "text-xs"
        } ${active ? "font-semibold text-primary" : "text-muted-foreground"}`}
      >
        {label}
      </button>
    </li>
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
