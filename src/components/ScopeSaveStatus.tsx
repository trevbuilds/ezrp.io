import { Link } from "@tanstack/react-router";

import { ScopeNameEditor } from "@/components/ScopeNameEditor";
import { SignInButton } from "@/components/SignInButton";
import { useScopeLink, useStoredPicks } from "@/hooks/use-scope";
import { useScopes } from "@/hooks/use-saved-scopes";
import { useAuth } from "@/lib/auth";
import { retrySave, useSaveStatus } from "@/lib/scope-autosave";

/**
 * Where this scope lives, said plainly. Signed out, it lives in this browser
 * and in the link. Signed in, it is saved as you go, so the line is a status
 * rather than a button: there is nothing to press.
 */
export function ScopeSaveStatus() {
  const auth = useAuth();
  const status = useSaveStatus();
  const link = useScopeLink();
  const picks = useStoredPicks();
  const { data: scopes } = useScopes();

  if (auth.status === "loading") return null;

  if (auth.status === "signed-out") {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span>Kept on this device and in the link.</span>
        <SignInButton
          className="text-primary underline transition hover:brightness-110 disabled:opacity-60"
          noticeClassName="basis-full text-destructive"
        >
          Sign in with Google to keep it in your account
        </SignInButton>
      </div>
    );
  }

  if (picks.length === 0) return null;

  const linked = link && link.user === auth.userId ? link : null;
  const active = linked ? scopes?.find((scope) => scope.id === linked.id) : undefined;

  if (status === "error") {
    return (
      <p role="status" className="text-xs text-muted-foreground">
        <span className="text-destructive">Couldn&rsquo;t save this scope.</span> It is still here,
        and in the link.{" "}
        <button
          type="button"
          onClick={retrySave}
          className="text-primary underline transition hover:brightness-110"
        >
          Try again
        </button>
      </p>
    );
  }

  // A basket with no saved row yet is about to get one.
  if (status === "saving" || !linked) {
    return (
      <p role="status" className="text-xs text-muted-foreground">
        Saving to your account…
      </p>
    );
  }

  // A div, not a p: the rename form inside it is not valid inside a paragraph.
  return (
    <div
      role="status"
      className="flex flex-wrap items-baseline gap-x-2 text-xs text-muted-foreground"
    >
      <span>Saved to your account{active ? " as" : ""}</span>
      {active && <ScopeNameEditor scope={active} />}
      <span aria-hidden>·</span>
      <Link to="/work" className="text-primary transition hover:brightness-110">
        My work →
      </Link>
    </div>
  );
}
