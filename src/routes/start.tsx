import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteShell } from "@/components/SiteShell";
import { guideBySlug } from "@/content/guides";
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
import { serialisePicks } from "@/content/scope";

type StartSearch = {
  industry?: string | undefined;
  country?: string | undefined;
  size?: string | undefined;
  orgType?: string | undefined;
};

const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);

export const Route = createFileRoute("/start")({
  validateSearch: (search: Record<string, unknown>): StartSearch => ({
    industry: str(search["industry"]),
    country: str(search["country"]),
    size: str(search["size"]),
    orgType: str(search["orgType"]),
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
  const country = search.country as Country | undefined;

  const raised = [
    ...new Set([
      ...(dial?.raises ?? []),
      ...(size ? sizeModifier[size].raises : []),
      ...(orgType ? orgTypeModifier[orgType].raises : []),
    ]),
  ];

  const answered = [industry, country, size, orgType].filter(Boolean).length;

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
          <Question
            label="Industry"
            hint="Which sector's dial-ups apply"
            options={allIndustries}
            value={search.industry}
            onPick={(v) => set({ industry: v })}
          />
          <Question
            label="Where you operate"
            hint="Drives the statutory obligations"
            options={allCountries}
            value={search.country}
            onPick={(v) => set({ country: v })}
          />
          <Question
            label="Size"
            hint="People, not revenue"
            options={allSizes}
            value={search.size}
            onPick={(v) => set({ size: v })}
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

        {(size || orgType || country) && (
          <section className="mt-6 space-y-3">
            <p className="label-xs">What your context adds</p>
            {size && <Modifier title={size} note={sizeModifier[size].note} />}
            {orgType && <Modifier title={orgType} note={orgTypeModifier[orgType].note} />}
            {country && <Modifier title={country} note={countryModifier[country].note} />}
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
              Start a scope from the modules that dominate in your sector, then add or drop areas
              until it matches what you are actually changing.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to="/scope"
                search={{ pick: serialisePicks(dial.dominates) }}
                className="rounded bg-primary px-4 py-2 font-display text-sm font-semibold text-primary-foreground transition hover:brightness-110"
              >
                Scope these {dial.dominates.length} modules →
              </Link>
              {country === "Australia" && (
                <Link
                  to="/guides"
                  search={{ scope: "Local-AU" }}
                  className="rounded border border-border px-4 py-2 font-display text-sm font-semibold transition hover:border-primary"
                >
                  What is AU-specific
                </Link>
              )}
            </div>
          </section>
        )}
      </section>
    </SiteShell>
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
