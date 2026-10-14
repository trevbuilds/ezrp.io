/**
 * The scope basket: the one scope you are building, remembered between pages.
 *
 * The URL stays the source of truth — a scope is a link someone can send, and
 * that only works if the address bar holds the whole thing. What the URL cannot
 * do is survive a trip through a guide page, the header nav or a new tab, so
 * this mirrors it into localStorage and puts it back when a scope-aware page
 * opens without one.
 *
 * The rule when the two disagree is that the URL wins. Opening someone's link
 * replaces your basket, which is the trade every shared cart makes.
 *
 * For a signed-in user the basket is also saved to their account. The "link"
 * below records which saved row the basket currently belongs to, and what its
 * picks were when last saved, so autosave knows what to update and when there
 * is nothing to write.
 */

import { useEffect, useRef, useSyncExternalStore } from "react";

import { parsePicks, serialisePicks } from "@/content/scope";

const KEY = "ezrp-scope";
const LINK_KEY = "ezrp-scope-link";
const EMPTY: string[] = [];

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

// useSyncExternalStore needs a stable snapshot, so each parsed value is cached
// against the raw string it came from.
let cachedRaw: string | null = null;
let cachedPicks: string[] = EMPTY;

function readItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    /* storage blocked: the basket just won't persist */
    return null;
  }
}

function readStored(): string[] {
  const raw = readItem(KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    const picks = parsePicks(raw ?? undefined);
    cachedPicks = picks.length ? picks : EMPTY;
  }
  return cachedPicks;
}

export const getStoredPicks = readStored;

export function setStoredPicks(slugs: string[]) {
  const value = serialisePicks(slugs);
  try {
    if (value) localStorage.setItem(KEY, value);
    else localStorage.removeItem(KEY);
  } catch {
    /* storage blocked */
  }
  notify();
}

/** The saved row this basket belongs to, for the account that saved it. */
export type ScopeLink = {
  user: string;
  id: string;
  /** The picks as they were when last saved, serialised the way the URL does. */
  picks: string;
};

let linkRaw: string | null = null;
let linkCache: ScopeLink | null = null;

function parseLink(raw: string | null): ScopeLink | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<ScopeLink> | null;
    if (
      value &&
      typeof value.user === "string" &&
      typeof value.id === "string" &&
      typeof value.picks === "string"
    ) {
      return { user: value.user, id: value.id, picks: value.picks };
    }
  } catch {
    /* corrupt: treat as no link */
  }
  return null;
}

function readLink(): ScopeLink | null {
  const raw = readItem(LINK_KEY);
  if (raw !== linkRaw) {
    linkRaw = raw;
    linkCache = parseLink(raw);
  }
  return linkCache;
}

export const getScopeLink = readLink;

export function setScopeLink(link: ScopeLink | null) {
  try {
    if (link) localStorage.setItem(LINK_KEY, JSON.stringify(link));
    else localStorage.removeItem(LINK_KEY);
  } catch {
    /* storage blocked */
  }
  notify();
}

/** Empty the basket and detach it from any saved scope. */
export function forgetScope() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(LINK_KEY);
  } catch {
    /* storage blocked */
  }
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab changing the basket shows up here too.
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === KEY || event.key === LINK_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** The remembered basket. Empty on the server and during hydration. */
export function useStoredPicks(): string[] {
  return useSyncExternalStore(subscribe, readStored, () => EMPTY);
}

/** The remembered basket, serialised for a `search={{ pick }}` prop. */
export function useStoredPick(): string | undefined {
  return serialisePicks(useStoredPicks());
}

/** Which saved scope the basket is attached to, if any. */
export function useScopeLink(): ScopeLink | null {
  return useSyncExternalStore(subscribe, readLink, () => null);
}

const sameSet = (a: string[], b: string[]) => {
  const left = new Set(a);
  const right = new Set(b);
  return left.size === right.size && [...left].every((slug) => right.has(slug));
};

/**
 * Keep a page's `?pick=` and the basket in step.
 *
 * On a page that opens with picks in the URL, the URL is copied into the
 * basket. On a page that opens without any, the basket is put back into the
 * URL through `restore`. After that every URL change is mirrored, including
 * the change to nothing — dropping the last pick really does empty the basket.
 *
 * A page that opens with picks that differ from the basket is somebody else's
 * link, or a recipe, or a fresh start. That is a different scope, so it is
 * detached from the saved one: autosave must never write a stranger's picks
 * over a scope you saved yourself.
 */
export function useScopeSync(urlPick: string | undefined, restore: (pick: string) => void) {
  // null until the first run, so a mount can be told apart from a change.
  const previous = useRef<string | undefined | null>(null);

  useEffect(() => {
    const before = previous.current;
    previous.current = urlPick;

    if (urlPick) {
      const picks = parsePicks(urlPick);
      if (before === null && !sameSet(picks, readStored())) setScopeLink(null);
      setStoredPicks(picks);
      return;
    }
    if (before === null) {
      const stored = serialisePicks(readStored());
      if (stored) restore(stored);
      return;
    }
    // Only a real transition from something to nothing clears the basket;
    // an effect re-run on an already-empty URL must not.
    if (before) setStoredPicks([]);
    // `restore` is a navigation closure and is deliberately not a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlPick]);
}
