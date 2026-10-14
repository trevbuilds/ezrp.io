/**
 * Autosave: a signed-in user's basket is kept in their account without asking.
 *
 * The rules that keep this safe, because an autosave that gets it wrong
 * destroys work silently:
 *
 * - It only ever writes the basket to the row the basket is linked to, or to a
 *   new row. It never picks some other existing row.
 * - It never writes an empty scope. Emptying the basket detaches it and leaves
 *   the saved row as it was, so "remove everything" is not a delete.
 * - It writes only when the basket differs from what was last saved, so loading
 *   a page or opening a saved scope doesn't churn the row's timestamp.
 * - One request at a time, always sending the latest picks, so quick edits can
 *   neither race nor reorder.
 * - Creating a row uses an id chosen here and kept until it succeeds, so a
 *   retry after a lost response updates that row instead of making another.
 */

import type { QueryClient } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";

import { serialisePicks } from "@/content/scope";
import { getScopeLink, getStoredPicks, setScopeLink } from "@/hooks/use-scope";
import { getAuthState } from "@/lib/auth";
import { newScopeId, saveScopePicks, scopesKey, type SavedScope } from "@/lib/saved-scopes";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

const DEBOUNCE_MS = 700;
const RETRY_MS = [2_000, 5_000, 15_000];

let status: SaveStatus = "idle";
const listeners = new Set<() => void>();

function setStatus(next: SaveStatus) {
  if (status === next) return;
  status = next;
  listeners.forEach((listener) => listener());
}

export function useSaveStatus(): SaveStatus {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    () => status,
    () => "idle",
  );
}

let queryClient: QueryClient | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
let running = false;
let again = false;
let failures = 0;
/** The id for a row being created, held until the create has succeeded. */
let pendingId: string | null = null;

export function attachQueryClient(client: QueryClient) {
  queryClient = client;
}

/** Keep the cached list of scopes in step without refetching it on every save. */
function writeCache(userId: string, saved: SavedScope) {
  queryClient?.setQueryData<SavedScope[]>(scopesKey(userId), (old) =>
    old ? [saved, ...old.filter((scope) => scope.id !== saved.id)] : old,
  );
}

export function scheduleSave(delay = DEBOUNCE_MS) {
  clearTimeout(timer);
  timer = setTimeout(() => void flush(), delay);
}

/** Try again now, after a failure. */
export function retrySave() {
  failures = 0;
  scheduleSave(0);
}

export async function flush(): Promise<void> {
  clearTimeout(timer);
  if (running) {
    again = true;
    return;
  }

  const auth = getAuthState();
  if (auth.status !== "signed-in") return;
  const userId = auth.userId;

  const picks = getStoredPicks();
  const stored = getScopeLink();
  // A link left by a different account is not this user's row.
  const link = stored && stored.user === userId ? stored : null;

  if (picks.length === 0) {
    if (stored) setScopeLink(null);
    setStatus("idle");
    return;
  }

  const signature = serialisePicks(picks) ?? "";
  if (link && link.picks === signature) return;

  running = true;
  setStatus("saving");
  const id = link?.id ?? (pendingId ??= newScopeId());
  try {
    const saved = await saveScopePicks(id, picks);
    pendingId = null;
    failures = 0;
    // Skip the bookkeeping if the account changed while the request was out.
    const now = getAuthState();
    if (now.status === "signed-in" && now.userId === userId) {
      setScopeLink({ user: userId, id: saved.id, picks: signature });
      writeCache(userId, saved);
    }
    setStatus("saved");
  } catch (error) {
    console.error(error);
    setStatus("error");
    failures += 1;
    if (failures <= RETRY_MS.length) scheduleSave(RETRY_MS[failures - 1]);
  } finally {
    running = false;
    if (again) {
      again = false;
      scheduleSave(0);
    }
  }
}
