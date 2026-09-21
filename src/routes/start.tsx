import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteShell } from "@/components/SiteShell";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { blurbFor } from "@/content/blurbs";
import { childrenOf, guideBySlug, guides, pillars } from "@/content/guides";
import { jurisdictionByCode } from "@/content/jurisdictions";
import { moduleLabel } from "@/content/labels";
import {
  allJurisdictions,
  bandByModule,
  erpBands,
  jurisdictionName,
  subStreamsOf,
  topStreams,
  type Band,
  type Jurisdiction,
  type Stream,
} from "@/content/model";
import {
  allCountries,
  allIndustries,
  allOrgTypes,
  allSizes,
  countryModifier,
  dialUpFor,
  orgTypeModifier,
  sizeModifier,
  type Country,
  type Industry,
  type OrgSize,
  type OrgType,
} from "@/content/context";
import { parsePicks, serialisePicks } from "@/content/scope";

type StartSearch = {
  /** Modules the client actually plans to change, as slugs. */
  changing?: string | undefined;
  industry?: string | undefined;
  country?: string | undefined;
  /** AU states and territories, once Australia is picked. */
  state?: string | undefined;
  size?: string | undefined;
  orgType?: string | undefined;
  /** How the areas picker is sliced: by module, or by value stream. */
  by?: string | undefined;
};

const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);

export const Route = createFileRoute("/start")({
  validateSearch: (search: Record<string, unknown>): StartSearch => ({
    changing: str(search["changing"]),
    industry: str(search["industry"]),
    country: str(search["country"]),
    state: str(search["state"]),
    size: str(search["size"]),
    orgType: str(search["orgType"]),
    by: str(search["by"]),
  }),
  head: () => ({
    meta: [
      { title: "Start here — EZRP" },
      {
        name: "description",
        content:
          "Answer four questions about your organisation and get a starting scope: the modules that dominate in your sector, the controls that intensify, and the obligations that apply where you operate.",
      },
      { property: "og:title", content: "Start here — EZRP" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StartPage,
});

function StartPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const set = (patch: Partial<StartSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });

  const industry = search.industry as Industry | undefined;
  const dial = industry ? dialUpFor(industry) : undefined;
  const size = search.size as OrgSize | undefined;
  const orgType = search.orgType as OrgType | undefined;
  const countries = parsePicks(search.country) as Country[];
  const toggleCountry = (value: string) => {
    const next = countries.includes(value as Country)
      ? countries.filter((c) => c !== value)
      : [...countries, value];
    // Dropping Australia drops the states with it, so the URL cannot hold a
    // state selection that nothing on the page is showing.
    set({
      country: serialisePicks(next),
      ...(next.includes("Australia") ? {} : { state: undefined }),
    });
  };

  const states = parsePicks(search.state) as Jurisdiction[];
  const toggleState = (value: string) =>
    set({
      state: serialisePicks(
        states.includes(value as Jurisdiction)
          ? states.filter((code) => code !== value)
          : [...states, value],
      ),
    });

  const raised = [
    ...new Set([
      ...(dial?.raises ?? []),
      ...(size ? sizeModifier[size].raises : []),
      ...(orgType ? orgTypeModifier[orgType].raises : []),
    ]),
  ];

  const changing = parsePicks(search.changing);
  const toggleChanging = (slug: string) =>
    set({
      changing: serialisePicks(
        changing.includes(slug) ? changing.filter((s) => s !== slug) : [...changing, slug],
      ),
    });
  const setChanging = (slugs: string[]) => set({ changing: serialisePicks(slugs) });

  // What they plan to change beats what the sector says dominates. The
  // dial-up is a prompt; their answer is the actual scope.
  const scopePicks = changing.length > 0 ? changing : (dial?.dominates ?? []);
  const notDominant = dial ? changing.filter((slug) => !dial.dominates.includes(slug)) : [];
  const dominantNotPicked = dial
    ? dial.dominates.filter((slug) => changing.length > 0 && !changing.includes(slug))
    : [];

  const answered = [industry, size, orgType].filter(Boolean).length + countries.length;

  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-5 pt-12 pb-6">
        <p className="label-xs">Start here</p>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">
          The thesis is universal. The dial-ups are not.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground">
          What dominates for a water utility is not what dominates for a consultancy, and a listed
          company carries obligations a family business does not. Four questions, then a starting
          scope you can argue with.
        </p>

        <div className="mt-8 space-y-6">
          <div>
            <div className="flex items-baseline gap-3">
              <p className="label-xs">Where you operate</p>
              <p className="text-xs text-muted-foreground">
                Pick every country — each brings its own obligations
              </p>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {allCountries.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleCountry(option)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    countries.includes(option)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Australia has a layer under it: payroll tax, long service leave
                and workers compensation are state obligations, not national
                ones. */}
            {countries.includes("Australia") && (
              <div className="mt-3 border-l-2 border-primary/40 pl-4">
                <div className="flex flex-wrap items-baseline gap-3">
                  <p className="label-xs">Australian states and territories</p>
                  <p className="text-xs text-muted-foreground">
                    Payroll tax, long service leave and workers compensation differ in each
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {allJurisdictions.map((code) => (
                    <button
                      key={code}
                      onClick={() => toggleState(code)}
                      title={jurisdictionName[code]}
                      className={`rounded-full border px-2.5 py-1 font-mono text-xs transition ${
                        states.includes(code)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
                <Link
                  to="/locales"
                  className="mt-2 inline-block text-xs text-primary transition hover:brightness-110"
                >
                  What changes state by state →
                </Link>
              </div>
            )}
          </div>
          <Question
            label="Industry"
            hint="Which sector's dial-ups apply"
            options={allIndustries}
            value={search.industry}
            onPick={(v) => set({ industry: v })}
          />
          <Question
            label="Size"
            hint="People, not revenue"
            options={allSizes}
            value={search.size}
            onPick={(v) => set({ size: v })}
          />
          <AreasPicker
            changing={changing}
            toggleOne={toggleChanging}
            setMany={setChanging}
            by={search.by === "stream" ? "stream" : "module"}
            setBy={(value) => set({ by: value === "module" ? undefined : value })}
          />

          <Question
            label="Type of organisation"
            hint="Shapes what has to be evidenced"
            options={allOrgTypes}
            value={search.orgType}
            onPick={(v) => set({ orgType: v })}
          />
        </div>

        {answered === 0 && (
          <p className="mt-8 text-sm text-muted-foreground">
            Answer at least the industry to see the dial-ups.
          </p>
        )}

        {dial && (
          <>
            <section className="panel mt-10 rounded-lg border-l-2 border-primary p-5">
              <p className="label-xs">{dial.industry}</p>
              <h2 className="mt-2 text-xl font-semibold">{dial.character}</h2>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{dial.hides}</p>
              <p className="mt-2 font-mono text-xs text-accent">Where the commitment hides</p>
            </section>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <section className="panel rounded-lg p-4">
                <p className="label-xs">Modules that dominate</p>
                <ul className="mt-3 space-y-1.5">
                  {dial.dominates.map((slug) => (
                    <li key={slug} className="text-sm">
                      <Link
                        to="/guides/$slug"
                        params={{ slug }}
                        className="text-muted-foreground transition hover:text-foreground"
                      >
                        {guideBySlug.get(slug)?.topic ?? slug}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="panel rounded-lg p-4">
                <p className="label-xs">Integration patterns that are not optional</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {dial.integrations.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            <section className="panel mt-4 rounded-lg p-4">
              <p className="label-xs">Controls that intensify</p>
              <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{dial.controls}</p>
            </section>
          </>
        )}

        {dial &&
          changing.length > 0 &&
          (notDominant.length > 0 || dominantNotPicked.length > 0) && (
            <section className="panel mt-6 rounded-lg border-l-2 border-primary p-5">
              <p className="label-xs">Your plan against your sector</p>
              {dominantNotPicked.length > 0 && (
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  <strong className="text-foreground">
                    {dominantNotPicked
                      .map((slug) => guideBySlug.get(slug)?.topic ?? slug)
                      .join(", ")}
                  </strong>{" "}
                  {dominantNotPicked.length === 1 ? "dominates" : "dominate"} in {dial.industry} and
                  {dominantNotPicked.length === 1 ? " is" : " are"} not in your plan. Deliberate, or
                  worth a second look.
                </p>
              )}
              {notDominant.length > 0 && (
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  {notDominant.map((slug) => guideBySlug.get(slug)?.topic ?? slug).join(", ")}{" "}
                  {notDominant.length === 1 ? "is" : "are"} not a typical focus for your sector —
                  fine if you know why.
                </p>
              )}
            </section>
          )}

        {(size || orgType || countries.length > 0) && (
          <section className="mt-6 space-y-3">
            <p className="label-xs">What your context adds</p>
            {size && <Modifier title={size} note={sizeModifier[size].note} />}
            {orgType && <Modifier title={orgType} note={orgTypeModifier[orgType].note} />}
            {countries.map((c) => (
              <Modifier key={c} title={c} note={countryModifier[c].note} />
            ))}
            {states.map((code) => {
              const profile = jurisdictionByCode.get(code);
              if (!profile) return null;
              return (
                <div key={code} className="panel rounded-lg p-4">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <p className="font-display text-sm font-semibold">{profile.name}</p>
                    <Link
                      to="/locales/$code"
                      params={{ code }}
                      className="font-mono text-xs text-primary transition hover:brightness-110"
                    >
                      {code} →
                    </Link>
                  </div>
                  <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{profile.note}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Payroll tax through {profile.revenueOffice} · {profile.longServiceLeave} ·{" "}
                    {profile.workersCompensation}
                  </p>
                </div>
              );
            })}
            {states.length > 1 && (
              <div className="panel rounded-lg border-l-2 border-primary p-4">
                <p className="font-display text-sm font-semibold">
                  Operating in {states.length} Australian jurisdictions
                </p>
                <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                  Payroll tax is assessed separately in each, long service leave accrues under a
                  different act in each, and workers compensation is a different scheme with a
                  different premium basis in each. Payroll has to hold the rule for where the
                  employee works, not where they are paid from.
                </p>
              </div>
            )}
            {countries.length > 1 && (
              <div className="panel rounded-lg border-l-2 border-primary p-4">
                <p className="font-display text-sm font-semibold">
                  Operating in {countries.length} countries
                </p>
                <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                  Multi-country means the standardise-versus-localise decision is unavoidable: one
                  chart of accounts and one payroll model, or one per jurisdiction. Statutory
                  reporting and payroll are the two that rarely standardise.
                </p>
              </div>
            )}
          </section>
        )}

        {raised.length > 0 && (
          <section className="panel mt-6 rounded-lg p-4">
            <p className="label-xs">Concerns dialled up for you</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {raised.map((item) => (
                <Link
                  key={item}
                  to="/guides"
                  search={{ consideration: item }}
                  className="rounded-full border border-primary px-2 py-0.5 text-xs text-primary transition hover:brightness-110"
                >
                  {item}
                </Link>
              ))}
            </div>
          </section>
        )}

        {dial && (
          <section className="panel mt-8 rounded-lg p-5">
            <p className="label-xs">Next</p>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              {changing.length > 0
                ? "Scope what you plan to change, and see what it drags in."
                : "Start a scope from the modules that dominate in your sector, then add or drop areas until it matches what you are actually changing."}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to="/scope"
                search={{ pick: serialisePicks(scopePicks) }}
                className="rounded bg-primary px-4 py-2 font-display text-sm font-semibold text-primary-foreground transition hover:brightness-110"
              >
                Scope {scopePicks.length} {scopePicks.length === 1 ? "module" : "modules"} →
              </Link>
              {countries.includes("Australia") && (
                <Link
                  to="/guides"
                  search={
                    states[0] ? { scope: "Local-AU", state: states[0] } : { scope: "Local-AU" }
                  }
                  className="rounded border border-border px-4 py-2 font-display text-sm font-semibold transition hover:border-primary"
                >
                  {states[0] ? `What differs in ${states[0]}` : "What is AU-specific"}
                </Link>
              )}
            </div>
          </section>
        )}
      </section>
    </SiteShell>
  );
}

/**
 * The areas picker.
 *
 * Two things it has to do that a flat list of module pills could not. First,
 * cascade: "we are changing finance" is almost never the real answer, and the
 * difference between finance and the general ledger alone is most of the
 * programme. Opening a module and picking the sub-modules makes the scope
 * honest, and because the picks are guide slugs the scope engine reads them
 * without any translation.
 *
 * Second, slice both ways. Some organisations think in modules because that is
 * how the licence is sold; others think in end-to-end streams because that is
 * how the work runs. The same picks come out either way — a stream row is just
 * a different route to the same topics.
 */

type Slice = "module" | "stream";

/** What a pill is, and what is inside it. Nothing here is asserted twice. */
function glimpse(slug: string) {
  const guide = guideBySlug.get(slug);
  if (!guide) return null;
  const kids = childrenOf(slug).map((kid) => kid.topic);
  const involved = kids.length > 0 ? kids : guide.workflow;
  // A migrated definition first, then the authored picker blurb. Never the
  // other way around, and the blurb is never written back into the taxonomy.
  return { what: guide.definition ?? blurbFor(slug), involved, level: guide.level };
}

const erpModules = pillars.filter((module) => module.domain && module.domain !== "Delivery");

/** Streams grouped by the band their primary module sits in. */
const streamsByBand: Array<{ band: Band; streams: Stream[] }> = erpBands()
  .map((band) => ({
    band,
    streams: topStreams.filter((stream) => bandByModule[stream.primaryModule] === band),
  }))
  .filter((entry) => entry.streams.length > 0);

/** Every topic on a stream, including its sub-streams — the selectable leaves. */
function topicsOnStream(stream: Stream) {
  const slugs = new Set([stream.slug, ...subStreamsOf(stream.slug).map((sub) => sub.slug)]);
  return guides.filter(
    (guide) =>
      guide.streams.some((slug) => slugs.has(slug)) &&
      guide.level !== "Value stream" &&
      guide.level !== "Sub-stream",
  );
}

function AreasPicker({
  changing,
  toggleOne,
  setMany,
  by,
  setBy,
}: {
  changing: string[];
  toggleOne: (slug: string) => void;
  setMany: (slugs: string[]) => void;
  by: Slice;
  setBy: (value: Slice) => void;
}) {
  const [open, setOpen] = useState<Set<string>>(new Set());
  const picked = new Set(changing);

  const toggleOpen = (key: string) => {
    const next = new Set(open);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setOpen(next);
  };

  /** Clicking the parent selects it and opens what is underneath. */
  const selectAndOpen = (key: string, slug: string) => {
    toggleOne(slug);
    if (!picked.has(slug) && !open.has(key)) toggleOpen(key);
  };

  /** A stream has no single slug to pick, so it picks everything on it. */
  const toggleStream = (stream: Stream, leaves: string[]) => {
    const all = leaves.every((slug) => picked.has(slug));
    setMany(all ? changing.filter((slug) => !leaves.includes(slug)) : [...changing, ...leaves]);
    if (!all && !open.has(stream.slug)) toggleOpen(stream.slug);
  };

  return (
    <TooltipProvider delayDuration={220}>
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-3">
            <p className="label-xs">Areas you plan to change</p>
            <p className="text-xs text-muted-foreground">
              Open one to pick the parts — this drives the scope
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-full border border-border p-0.5">
            {(["module", "stream"] as const).map((option) => (
              <button
                key={option}
                onClick={() => setBy(option)}
                className={`rounded-full px-2.5 py-1 text-xs transition ${
                  by === option
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {option === "module" ? "By module" : "By value stream"}
              </button>
            ))}
          </div>
        </div>

        {by === "module" ? (
          <div className="mt-3 space-y-1">
            {erpModules.map((module) => {
              const kids = childrenOf(module.slug);
              const childPicked = kids.some((kid) => picked.has(kid.slug));
              const isOpen = open.has(module.slug) || childPicked;
              return (
                <Row
                  key={module.slug}
                  label={module.topic}
                  slug={module.slug}
                  selected={picked.has(module.slug)}
                  isOpen={isOpen}
                  hasChildren={kids.length > 0}
                  onToggleOpen={() => toggleOpen(module.slug)}
                  onSelect={() => selectAndOpen(module.slug, module.slug)}
                  count={kids.length}
                  selectedInside={kids
                    .filter((kid) => picked.has(kid.slug))
                    .map((kid) => ({
                      slug: kid.slug,
                      label: kid.topic,
                      what: glimpse(kid.slug)?.what ?? null,
                    }))}
                >
                  {kids.map((kid) => (
                    <Pill
                      key={kid.slug}
                      label={kid.topic}
                      slug={kid.slug}
                      selected={picked.has(kid.slug)}
                      onSelect={() => toggleOne(kid.slug)}
                    />
                  ))}
                </Row>
              );
            })}
          </div>
        ) : (
          <div className="mt-3 space-y-4">
            {streamsByBand.map((group) => (
              <div key={group.band}>
                <p className="font-display text-xs font-semibold text-foreground">{group.band}</p>
                <div className="mt-1 space-y-1">
                  {group.streams.map((stream) => {
                    const leaves = topicsOnStream(stream);
                    const slugs = leaves.map((leaf) => leaf.slug);
                    const anyPicked = slugs.some((slug) => picked.has(slug));
                    const allPicked = slugs.length > 0 && slugs.every((slug) => picked.has(slug));
                    const isOpen = open.has(stream.slug) || anyPicked;
                    return (
                      <Row
                        key={stream.slug}
                        label={stream.name}
                        crosses={stream.modules.map(moduleLabel)}
                        selected={allPicked}
                        partial={anyPicked && !allPicked}
                        isOpen={isOpen}
                        hasChildren={slugs.length > 0}
                        onToggleOpen={() => toggleOpen(stream.slug)}
                        onSelect={() => toggleStream(stream, slugs)}
                        count={slugs.length}
                        selectedInside={leaves
                          .filter((leaf) => picked.has(leaf.slug))
                          .map((leaf) => ({
                            slug: leaf.slug,
                            label: leaf.topic,
                            what: glimpse(leaf.slug)?.what ?? null,
                          }))}
                      >
                        {leaves.map((leaf) => (
                          <Pill
                            key={leaf.slug}
                            label={leaf.topic}
                            slug={leaf.slug}
                            selected={picked.has(leaf.slug)}
                            onSelect={() => toggleOne(leaf.slug)}
                          />
                        ))}
                      </Row>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {changing.length > 0 && (
          <div className="mt-3 flex flex-wrap items-baseline gap-2 text-xs text-muted-foreground">
            <span className="label-xs">{changing.length} picked</span>
            <button
              onClick={() => setMany([])}
              className="text-primary transition hover:brightness-110"
            >
              clear
            </button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

/** A parent row: selectable, expandable, and explains itself on hover. */
function Row({
  label,
  slug,
  crosses,
  selected,
  partial = false,
  isOpen,
  hasChildren,
  onToggleOpen,
  onSelect,
  count,
  selectedInside = [],
  children,
}: {
  label: string;
  slug?: string;
  crosses?: string[];
  selected: boolean;
  partial?: boolean;
  isOpen: boolean;
  hasChildren: boolean;
  onToggleOpen: () => void;
  onSelect: () => void;
  count: number;
  /** Explains what is picked inside, for touch screens with no hover. */
  selectedInside?: Array<{ slug: string; label: string; what: string | null }>;
  children: React.ReactNode;
}) {
  const info = slug ? glimpse(slug) : null;
  const detail = info?.what ?? (crosses ? `Crosses ${crosses.join(" → ")}` : null);
  const involved = info?.involved ?? [];

  return (
    <div>
      <div className="flex items-center gap-1">
        {hasChildren ? (
          <button
            onClick={onToggleOpen}
            aria-expanded={isOpen}
            aria-label={`${isOpen ? "Collapse" : "Expand"} ${label}`}
            className="flex size-5 shrink-0 items-center justify-center text-muted-foreground transition hover:text-foreground"
          >
            <ChevronRight
              className={`size-3.5 transition-transform ${isOpen ? "rotate-90" : ""}`}
            />
          </button>
        ) : (
          <span className="size-5 shrink-0" />
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onSelect}
              className={`rounded-full border px-3 py-1.5 text-left text-sm transition ${
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : partial
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
              }`}
            >
              {label}
              {count > 0 && (
                <span className="ml-2 font-mono text-[0.65rem] opacity-70">{count}</span>
              )}
            </button>
          </TooltipTrigger>
          <Glimpse label={label} detail={detail} involved={involved} />
        </Tooltip>
      </div>
      {isOpen && (
        <div className="ml-6 mt-1.5 border-l border-border pl-3">
          {/* Repeated inline because a tooltip never fires on a touch screen. */}
          {detail && <p className="mb-2 max-w-xl text-xs text-muted-foreground">{detail}</p>}
          <div className="flex flex-wrap gap-1.5">{children}</div>
          {selectedInside.length > 0 && (
            <ul className="mt-2 space-y-1">
              {selectedInside.map((entry) => (
                <li key={entry.slug} className="max-w-xl text-xs text-muted-foreground">
                  <span className="text-foreground">{entry.label}</span>
                  {entry.what ? ` — ${entry.what}` : ""}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function Pill({
  label,
  slug,
  selected,
  onSelect,
}: {
  label: string;
  slug: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const info = glimpse(slug);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onSelect}
          title={info?.what ?? undefined}
          className={`rounded-full border px-2.5 py-1 text-xs transition ${
            selected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
          }`}
        >
          {label}
        </button>
      </TooltipTrigger>
      <Glimpse label={label} detail={info?.what ?? null} involved={info?.involved ?? []} />
    </Tooltip>
  );
}

/** The hover glimpse: what it is, and what is inside it. */
function Glimpse({
  label,
  detail,
  involved,
}: {
  label: string;
  detail: string | null;
  involved: string[];
}) {
  if (!detail && involved.length === 0) return null;
  return (
    <TooltipContent
      side="top"
      align="start"
      className="max-w-xs bg-background p-0 text-foreground shadow-lg"
    >
      <div className="rounded-md border border-border p-3">
        <p className="font-display text-xs font-semibold">{label}</p>
        {detail && <p className="mt-1 text-xs text-muted-foreground">{detail}</p>}
        {involved.length > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            <span className="text-foreground">Involves:</span> {involved.slice(0, 7).join(" · ")}
            {involved.length > 7 ? ` +${involved.length - 7} more` : ""}
          </p>
        )}
      </div>
    </TooltipContent>
  );
}

function Question({
  label,
  hint,
  options,
  value,
  onPick,
}: {
  label: string;
  hint: string;
  options: readonly string[];
  value: string | undefined;
  onPick: (value: string | undefined) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-3">
        <p className="label-xs">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onPick(value === option ? undefined : option)}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              value === option
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function Modifier({ title, note }: { title: string; note: string }) {
  return (
    <div className="panel rounded-lg p-4">
      <p className="font-display text-sm font-semibold">{title}</p>
      <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{note}</p>
    </div>
  );
}
