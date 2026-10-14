import { useState } from "react";

import { useUpdateCachedScope } from "@/hooks/use-saved-scopes";
import { renameScope, scopeTitle, type SavedScope } from "@/lib/saved-scopes";

/**
 * A scope's title with an inline rename. An empty name puts it back to the
 * automatic title, which is derived from its picks and so keeps up as they
 * change; a name you chose stays put.
 */
export function ScopeNameEditor({ scope }: { scope: SavedScope }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const updateCache = useUpdateCachedScope();

  const begin = () => {
    setValue(scope.name ?? "");
    setFailed(false);
    setEditing(true);
  };

  const commit = async () => {
    const next = value.trim() || null;
    if (next === scope.name) {
      setEditing(false);
      return;
    }
    setBusy(true);
    setFailed(false);
    try {
      updateCache(await renameScope(scope.id, next));
      setEditing(false);
    } catch (error) {
      console.error(error);
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  if (!editing) {
    return (
      <span className="inline-flex flex-wrap items-baseline gap-x-2">
        <strong className="font-semibold text-foreground">{scopeTitle(scope)}</strong>
        <button
          type="button"
          onClick={begin}
          className="text-xs text-muted-foreground underline transition hover:text-foreground"
        >
          Rename
        </button>
      </span>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void commit();
      }}
      className="inline-flex flex-wrap items-center gap-2"
    >
      <input
        autoFocus
        value={value}
        maxLength={120}
        aria-label="Scope name"
        placeholder={scopeTitle({ name: null, picks: scope.picks })}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setEditing(false);
        }}
        className="w-64 max-w-full rounded border border-input bg-background px-2 py-1 text-sm text-foreground outline-none focus:border-primary"
      />
      <button
        type="submit"
        disabled={busy}
        className="rounded bg-primary px-2.5 py-1 font-display text-xs font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-60"
      >
        Save
      </button>
      <button
        type="button"
        onClick={() => setEditing(false)}
        className="text-xs text-muted-foreground underline transition hover:text-foreground"
      >
        Cancel
      </button>
      {failed && (
        <span role="alert" className="text-xs text-destructive">
          Couldn&rsquo;t rename. Try again.
        </span>
      )}
    </form>
  );
}
