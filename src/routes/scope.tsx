import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteShell } from "@/components/SiteShell";
import { guideBySlug } from "@/content/guides";
import { moduleLabel } from "@/content/labels";
import { computeScope, parsePicks, serialisePicks } from "@/content/scope";

type ScopeSearch = { pick?: string | undefined };

export const Route = createFileRoute("/scope")({
  validateSearch: (search: Record<string, unknown>): ScopeSearch => ({
    pick: typeof search["pick"] === "string" && search["pick"] ? search["pick"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Your scope — EZRP" },
      {
        name: "description",
        content:
          "Pick the areas you intend to change and see the end-to-end that implies: the value streams they sit on, the modules they drag in, and the concerns they raise.",
      },
      { property: "og:title", content: "Your scope — EZRP" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ScopePage,
});

function ScopePage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const picks = parsePicks(search.pick);
  const scope = computeScope(picks);

  const drop = (slug: string) =>
    navigate({
      search: { pick: serialisePicks(picks.filter((item) => item !== slug)) },
      replace: true,
    });

  if (picks.length === 0) {
    return (
      <SiteShell>
        <section className="mx-auto max-w-3xl px-5 pt-12 pb-6">
          <p className="label-xs">Scope</p>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">Nothing picked yet</h1>
          <p className="mt-4 text-base text-muted-foreground">
            Choose the areas you intend to change and this page works out the rest — the value
            streams they sit on, the modules the work actually happens in, and the concerns that
            come with them.
          </p>
          <Link
            to="/guides"
            className="mt-6 inline-block rounded bg-primary px-4 py-2 font-display text-sm font-semibold text-primary-foreground transition hover:brightness-110"
          >
            Browse the library
          </Link>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-5 pt-12 pb-6">
        <p className="label-xs">Scope</p>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">
          {scope.picked.length} {scope.picked.length === 1 ? "area" : "areas"} implies{" "}
          {scope.topics.length} topics across {scope.modules.length}{" "}
          {scope.modules.length === 1 ? "module" : "modules"}
        </h1>

        <div className="mt-5 flex flex-wrap gap-2">
          {scope.picked.map((guide) => (
            <span
              key={guide.slug}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground"
            >
              {guide.topic}
              <button
                onClick={() => drop(guide.slug)}
                aria-label={`Remove ${guide.topic} from scope`}
                className="opacity-70 transition hover:opacity-100"
              >
                ✕
              </button>
            </span>
          ))}
          <Link
            to="/guides"
            search={{ pick: search.pick }}
            className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition hover:text-foreground"
          >
            + Add more
          </Link>
        </div>

        {scope.unknown.length > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            Not in the library: {scope.unknown.join(", ")}
          </p>
        )}

        {/* The finding that matters most, stated first. */}
        {scope.draggedIn.length > 0 && (
          <section className="panel mt-8 rounded-lg border-l-2 border-primary p-5">
            <p className="label-xs">You did not pick these</p>
            <h2 className="mt-2 text-xl font-semibold">
              {scope.draggedIn.map(moduleLabel).join(", ")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Your streams cross into{" "}
              {scope.draggedIn.length === 1 ? "this module" : "these modules"}, so the work happens
              there too. That is the part most scoping exercises miss.
            </p>
          </section>
        )}

        <section className="mt-8">
          <p className="label-xs">The end-to-end</p>
          <div className="mt-3 space-y-3">
            {scope.topStreams.map((stream) => {
              const subs = scope.streams.filter((item) => item.parent === stream.slug);
              return (
                <div key={stream.slug} className="panel rounded-lg p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold">{stream.name}</h3>
                    <p className="font-mono text-xs text-muted-foreground">
                      {stream.modules.map(moduleLabel).join("  →  ")}
                    </p>
                  </div>
                  {subs.length > 0 && (
                    <ol className="mt-3 space-y-1.5">
                      {subs.map((sub, index) => (
                        <li key={sub.slug} className="flex gap-3 text-sm">
                          <span className="font-mono text-xs text-primary">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="text-muted-foreground">
                            {sub.name}
                            {scope.impliedStreams.some((item) => item.slug === sub.slug) && (
                              <em className="ml-2 not-italic text-primary">implied</em>
                            )}
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {scope.phases.length > 0 && (
          <section className="mt-8">
            <p className="label-xs">The order to do it in</p>
            <div className="mt-3 space-y-3">
              {scope.phases.map((phase, index) => (
                <div key={index} className="panel rounded-lg p-4">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-display text-base font-semibold">
                        {phase.map((sub) => sub.name).join(", ")}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {index === 0
                          ? "Nothing in scope blocks these — they can start together."
                          : "Unblocked once the phase above is standing."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 max-w-2xl text-xs text-muted-foreground">
              Sequence is a delivery judgement rather than a fact about the taxonomy. These are
              proposals from common tier-1 ordering —{" "}
              <a
                href="https://github.com/trevbuilds/ezrp.io/discussions"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                argue with them
              </a>
              .
            </p>
          </section>
        )}

        {scope.prerequisites.length > 0 && (
          <section className="panel mt-8 rounded-lg p-5">
            <p className="label-xs">Assumed already in place</p>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              This scope depends on{" "}
              <strong className="text-foreground">
                {scope.prerequisites.map((sub) => sub.name).join(", ")}
              </strong>{" "}
              without including {scope.prerequisites.length === 1 ? "it" : "them"}. Fine if
              {scope.prerequisites.length === 1 ? " it is" : " they are"} already standing and
              staying as {scope.prerequisites.length === 1 ? "it is" : "they are"} — a gap in the
              plan otherwise.
            </p>
          </section>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <section className="panel rounded-lg p-4">
            <p className="label-xs">Concerns raised</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {scope.considerations.map((item) => (
                <Link
                  key={item}
                  to="/guides"
                  search={{ q: item }}
                  className="rounded-full border border-primary px-2 py-0.5 text-xs text-primary transition hover:brightness-110"
                >
                  {item}
                </Link>
              ))}
            </div>
          </section>

          <section className="panel rounded-lg p-4">
            <p className="label-xs">Australian obligations in scope</p>
            {scope.localAu.length > 0 ? (
              <ul className="mt-3 space-y-1.5">
                {scope.localAu.map((guide) => (
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
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Nothing AU-specific in this scope.
              </p>
            )}
          </section>
        </div>

        <section className="mt-8">
          <p className="label-xs">
            Everything in scope — {scope.topics.length} topics, {scope.implied.length} you did not
            pick
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {scope.topics.map((guide) => {
              const isPick = scope.picked.some((item) => item.slug === guide.slug);
              return (
                <Link
                  key={guide.slug}
                  to="/guides/$slug"
                  params={{ slug: guide.slug }}
                  className={`panel rounded p-3 text-sm transition hover:border-primary ${
                    isPick ? "border-primary" : ""
                  }`}
                >
                  <span className="font-semibold">{guide.topic}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {guide.level ?? "Topic"} · {guide.module ? moduleLabel(guide.module) : "—"}
                    {isPick ? " · picked" : ""}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="panel mt-8 rounded-lg p-5">
          <p className="label-xs">Share this scope</p>
          <p className="mt-2 text-sm text-muted-foreground">
            The scope is in the address bar. Send the link and the other person sees the same
            picture.
          </p>
        </section>
      </section>
    </SiteShell>
  );
}

/** Kept out of the component so the empty state can use it too. */
export const scopeHasTopic = (pick: string | undefined, slug: string) =>
  parsePicks(pick).includes(slug) && Boolean(guideBySlug.get(slug));
