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
 */

import { useEffect, useRef, useSyncExternalStore } from "react";

import { parsePicks, serialisePicks } from "@/content/scope";

const KEY = "ezrp-scope";
const EMPTY: string[] = [];

const listeners = new Set<() => void>();

// useSyncExternalStore needs a stable snapshot, so the parsed list is cached
// against the raw string it came from.
let cachedRaw: string | null = null;
let cachedPicks: string[] = EMPTY;

function readStored(): string[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    /* storage blocked: the basket just won't persist */
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    const picks = parsePicks(raw ?? undefined);
    cachedPicks = picks.length ? picks : EMPTY;
  }
  return cachedPicks;
}

export function setStoredPicks(slugs: string[]) {
  const value = serialisePicks(slugs);
  try {
    if (value) localStorage.setItem(KEY, value);
    else localStorage.removeItem(KEY);
  } catch {
    /* storage blocked */
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab changing the basket shows up here too.
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === KEY) listener();
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

/**
 * Keep a page's `?pick=` and the basket in step.
 *
 * On a page that opens with picks in the URL, the URL is copied into the
 * basket. On a page that opens without any, the basket is put back into the
 * URL through `restore`. After that every URL change is mirrored, including
 * the change to nothing — dropping the last pick really does empty the basket.
 */
export function useScopeSync(urlPick: string | undefined, restore: (pick: string) => void) {
  // null until the first run, so a mount can be told apart from a change.
  const previous = useRef<string | undefined | null>(null);

  useEffect(() => {
    const before = previous.current;
    previous.current = urlPick;

    if (urlPick) {
      setStoredPicks(parsePicks(urlPick));
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
