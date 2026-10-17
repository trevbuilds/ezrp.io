import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { ScopeNameEditor } from "@/components/ScopeNameEditor";
import { SignInButton } from "@/components/SignInButton";
import { SiteShell } from "@/components/SiteShell";
import { guideBySlug } from "@/content/guides";
import { serialisePicks } from "@/content/scope";
import { useRemoveCachedScope, useScopes } from "@/hooks/use-saved-scopes";
import { forgetScope, setScopeLink, setStoredPicks, useScopeLink } from "@/hooks/use-scope";
import { useAuth } from "@/lib/auth";
import { deleteScope, type SavedScope } from "@/lib/saved-scopes";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "My work — EZRP" },
      {
        name: "description",
        content: "The scopes you have saved. Open one to carry on where you left off.",
      },
      // A page of someone's own saved work has nothing for a search engine.
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WorkPage,
});

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(iso),
  );

function WorkPage() {
  const auth = useAuth();
  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-5 pt-12 pb-6">
        <p className="label-xs">My work</p>
        {auth.status === "signed-in" && <SavedScopes userId={auth.userId} />}
        {auth.status === "signed-out" && <SignedOut />}
        {auth.status === "loading" && (
          <p className="mt-4 text-sm text-muted-foreground">Loading&hellip;</p>
        )}
      </section>
    </SiteShell>
  );
}

function SignedOut() {
  return (
    <>
      <h1 className="mt-3 text-3xl font-bold md:text-4xl">Keep your scopes</h1>
      <p className="mt-4 max-w-2xl text-base text-muted-foreground">
        Sign in and every scope you build is saved as you go, so you can pick it up on any device.
        Nothing changes if you don&rsquo;t: the scope tool works the same signed out, and a scope is
        still a link you can send.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <SignInButton className="rounded bg-primary px-4 py-2 font-display text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-60">
          Sign in with Google
        </SignInButton>
        <Link
          to="/guides"
          className="rounded border border-border px-4 py-2 font-display text-sm font-semibold text-muted-foreground transition hover:border-primary hover:text-foreground"
        >
          Browse the library
        </Link>
      </div>
    </>
  );
}

function SavedScopes({ userId }: { userId: string }) {
  const navigate = useNavigate();
  const { data: scopes, isPending, isError, refetch } = useScopes();

  const startNew = () => {
    // Detach from the saved scope and empty the basket, or autosave would keep
    // writing the next scope's picks over the one you just left.
    forgetScope();
    void navigate({ to: "/guides" });
  };

  return (
    <>
      <h1 className="mt-3 text-3xl font-bold md:text-4xl">Your saved scopes</h1>
      <p className="mt-4 max-w-2xl text-base text-muted-foreground">
        Saved automatically as you build. Open one to carry on, or start a new scope.
      </p>
      <div className="mt-5">
        <button
          type="button"
          onClick={startNew}
          className="rounded bg-primary px-4 py-2 font-display text-sm font-semibold text-primary-foreground transition hover:brightness-110"
        >
          Start a new scope
        </button>
      </div>

      {isPending && (
        <p className="mt-8 text-sm text-muted-foreground">Loading your scopes&hellip;</p>
      )}

      {isError && (
        <p role="alert" className="mt-8 text-sm text-muted-foreground">
          <span className="text-destructive">Couldn&rsquo;t load your scopes.</span>{" "}
          <button
            type="button"
            onClick={() => void refetch()}
            className="text-primary underline transition hover:brightness-110"
          >
            Try again
          </button>
        </p>
      )}

      {scopes && scopes.length === 0 && (
        <section className="panel mt-8 rounded-lg p-5">
          <p className="label-xs">Nothing saved yet</p>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Pick some areas in the library and they appear here, saved as you go.
          </p>
          <Link
            to="/guides"
            className="mt-3 inline-block text-sm text-primary transition hover:brightness-110"
          >
            Browse the library →
          </Link>
        </section>
      )}

      {scopes && scopes.length > 0 && (
        <ul className="mt-8 space-y-3">
          {scopes.map((scope) => (
            <ScopeRow key={scope.id} scope={scope} userId={userId} />
          ))}
        </ul>
      )}

      <p className="mt-10 max-w-2xl text-xs text-muted-foreground">
        A saved scope holds the areas you picked, and nothing else. Everything the scope page shows
        is worked out from the model each time it opens, so a saved scope never goes stale when the
        content changes.
      </p>
    </>
  );
}

function ScopeRow({ scope, userId }: { scope: SavedScope; userId: string }) {
  const navigate = useNavigate();
  const link = useScopeLink();
  const removeFromCache = useRemoveCachedScope();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const current = link?.user === userId && link.id === scope.id;
  const known = scope.picks.map((slug) => guideBySlug.get(slug)?.topic ?? slug);

  const open = () => {
    const pick = serialisePicks(scope.picks) ?? "";
    // Link first, so autosave sees a basket that matches its saved row and has
    // nothing to write. Opening a scope must not bump its edit date.
    setScopeLink({ user: userId, id: scope.id, picks: pick });
    setStoredPicks(scope.picks);
    void navigate({ to: "/scope", search: { pick } });
  };

  const remove = async () => {
    setBusy(true);
    setFailed(false);
    try {
      await deleteScope(scope.id);
      removeFromCache(scope.id);
      // Deleting the scope you are working on would otherwise let autosave
      // quietly recreate it from the basket.
      if (current) forgetScope();
    } catch (error) {
      console.error(error);
      setFailed(true);
      setBusy(false);
    }
  };

  return (
    <li className={`panel rounded-lg p-4 ${current ? "border-l-2 border-primary" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-display text-lg">
            <ScopeNameEditor scope={scope} />
            {current && (
              <span className="rounded border border-primary/45 px-1.5 py-0.5 font-mono text-[0.625rem] uppercase text-primary">
                Working on this
              </span>
            )}
          </div>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {scope.picks.length} {scope.picks.length === 1 ? "area" : "areas"} · edited{" "}
            {formatDate(scope.updatedAt)}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {known.slice(0, 5).map((name, index) => (
              <span
                key={`${name}-${index}`}
                className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
              >
                {name}
              </span>
            ))}
            {known.length > 5 && (
              <span className="px-1 py-0.5 text-xs text-muted-foreground">
                +{known.length - 5} more
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {confirming ? (
            <>
              <span className="text-xs text-muted-foreground">Delete this scope?</span>
              <button
                type="button"
                onClick={() => void remove()}
                disabled={busy}
                className="rounded bg-destructive px-3 py-1.5 font-display text-xs font-semibold text-destructive-foreground transition hover:brightness-110 disabled:opacity-60"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="text-xs text-muted-foreground underline transition hover:text-foreground"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={open}
                className="rounded bg-primary px-3 py-1.5 font-display text-xs font-semibold text-primary-foreground transition hover:brightness-110"
              >
                Open
              </button>
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="rounded border border-border px-3 py-1.5 font-display text-xs font-semibold text-muted-foreground transition hover:border-destructive hover:text-destructive"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
      {failed && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          Couldn&rsquo;t delete this scope. Try again.
        </p>
      )}
    </li>
  );
}
