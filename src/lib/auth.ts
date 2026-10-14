/**
 * Who is signed in, and how to sign in and out.
 *
 * Sign-in is Google through Lovable's OAuth broker, which lives on the site's
 * own domain at /~oauth/initiate. Outside the editor it is a plain redirect to
 * Google and back to the page you left, with the session in the URL hash for
 * the Supabase client to pick up; inside the editor preview it is a popup that
 * hands the tokens back, which is the only case where this code sets the
 * session itself.
 *
 * Signing in is optional everywhere. Nothing here may block a page: the state
 * starts as "loading", and every consumer has to render fine in that state, on
 * the server and during hydration.
 */

import { useSyncExternalStore } from "react";
import { createLovableAuth } from "@lovable.dev/cloud-auth-js";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

export type AuthState =
  | { status: "loading" }
  | { status: "signed-out" }
  | {
      status: "signed-in";
      userId: string;
      email: string | null;
      name: string | null;
    };

const LOADING: AuthState = { status: "loading" };
const SIGNED_OUT: AuthState = { status: "signed-out" };

/** A sign-in problem, and which button it belongs to. */
export type AuthNotice = {
  message: string;
  /** The button that started the attempt, or REDIRECT_SOURCE for a failure that arrived with the page. */
  source: string;
};

/** A sign-in that failed on Google's side arrives with the page, not from a click. */
export const REDIRECT_SOURCE = "redirect";

let state: AuthState = LOADING;
let notice: AuthNotice | null = null;
let started = false;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

const text = (value: unknown) => (typeof value === "string" && value ? value : null);

function toState(session: Session | null): AuthState {
  if (!session) return SIGNED_OUT;
  const meta = session.user.user_metadata ?? {};
  return {
    status: "signed-in",
    userId: session.user.id,
    email: session.user.email ?? null,
    name: text(meta["full_name"]) ?? text(meta["name"]),
  };
}

function sameState(a: AuthState, b: AuthState) {
  if (a.status !== b.status) return false;
  if (a.status !== "signed-in" || b.status !== "signed-in") return true;
  return a.userId === b.userId && a.email === b.email && a.name === b.name;
}

function publish(next: AuthState) {
  if (sameState(state, next)) return;
  state = next;
  notify();
}

function setNotice(message: string | null, source = REDIRECT_SOURCE) {
  if (message === null) {
    if (notice === null) return;
    notice = null;
  } else {
    if (notice?.message === message && notice.source === source) return;
    notice = { message, source };
  }
  notify();
}

/** Turn what the broker says into something a visitor can act on. */
function explain(description: string | null | undefined) {
  if (!description) return "Sign in failed. Try again.";
  let readable = description;
  try {
    readable = decodeURIComponent(description);
  } catch {
    /* already readable */
  }
  if (/not supported|not enabled/i.test(readable)) {
    return "Google sign-in isn't switched on for this site yet.";
  }
  if (/cancel|denied/i.test(readable)) return "Sign in was cancelled.";
  return `Sign in failed: ${readable}`;
}

/**
 * The broker reports a failed redirect sign-in in the hash of the page it sends
 * you back to. Read it before the Supabase client is created, then take it out
 * of the address bar so a refresh doesn't show it twice.
 */
function readRedirectError() {
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return;
  const params = new URLSearchParams(hash);
  const description = params.get("error_description");
  if (!params.get("error") && !description) return;
  setNotice(explain(description), REDIRECT_SOURCE);
  const clean = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState(window.history.state, "", clean);
}

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  readRedirectError();
  try {
    // INITIAL_SESSION arrives here once the stored session has been read.
    supabase.auth.onAuthStateChange((_event, session) => publish(toState(session)));
    void supabase.auth
      .getSession()
      .then(({ data }) => publish(toState(data.session)))
      .catch(() => publish(SIGNED_OUT));
  } catch (error) {
    // The Supabase client throws when its environment is missing. The site has
    // to keep working without accounts, so treat that as signed out.
    console.error(error);
    publish(SIGNED_OUT);
  }
}

function subscribe(listener: () => void) {
  start();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getAuthState = () => state;

/** Loading on the server and during hydration, so both render the same thing. */
export function useAuth(): AuthState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => LOADING,
  );
}

/** The last sign-in problem, if there is one. */
export function useAuthNotice(): AuthNotice | null {
  return useSyncExternalStore(
    subscribe,
    () => notice,
    () => null,
  );
}

export const dismissAuthNotice = () => setNotice(null);

const lovableAuth = createLovableAuth();

/**
 * Start Google sign-in. Resolves once the popup has finished, or never in
 * practice when the page redirects away. Problems land in the notice rather
 * than being thrown, so a button can call this without a try/catch. `source`
 * names the button, so only that button shows the problem.
 */
export async function signInWithGoogle(source: string): Promise<void> {
  setNotice(null);
  // Come back to this page, not the home page. The hash is dropped because the
  // broker uses it to return the session.
  const { origin, pathname, search } = window.location;
  const result = await lovableAuth.signInWithOAuth("google", {
    redirect_uri: `${origin}${pathname}${search}`,
  });
  if (result.redirected) return;
  if (result.error) {
    setNotice(explain(result.error.message), source);
    return;
  }
  const { error } = await supabase.auth.setSession(result.tokens);
  if (error) setNotice(explain(error.message), source);
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) console.error(error);
  // Signed out locally even if the server call failed.
  publish(SIGNED_OUT);
}
