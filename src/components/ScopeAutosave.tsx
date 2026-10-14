import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { useStoredPicks } from "@/hooks/use-scope";
import { useAuth } from "@/lib/auth";
import { attachQueryClient, flush, retrySave, scheduleSave } from "@/lib/scope-autosave";

/**
 * Mounted once, at the root, so autosave outlives any one page. It renders
 * nothing: it only reminds the autosave engine that something may have changed.
 * The engine itself decides whether there is anything to write.
 */
export function ScopeAutosave() {
  const queryClient = useQueryClient();
  const auth = useAuth();
  const picks = useStoredPicks();
  const userId = auth.status === "signed-in" ? auth.userId : null;
  const key = picks.join(",");

  useEffect(() => {
    attachQueryClient(queryClient);
  }, [queryClient]);

  // Fires on a pick change, and once on sign-in so a basket built while signed
  // out is saved the moment there is an account to save it to.
  useEffect(() => {
    if (userId) scheduleSave();
  }, [userId, key]);

  useEffect(() => {
    // A tab that is being hidden may be about to close: don't sit on a pending save.
    const onVisibility = () => {
      if (document.visibilityState === "hidden") void flush();
    };
    const onOnline = () => retrySave();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("online", onOnline);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  return null;
}
