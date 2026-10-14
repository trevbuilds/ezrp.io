/**
 * Saved scopes: reading and writing the signed-in user's scopes.
 *
 * The browser talks to the table directly. That is safe because row level
 * security limits every operation to the owner's rows (see
 * supabase/migrations), so there is no server function to add and nothing here
 * that a user could aim at somebody else's data.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { guideBySlug } from "@/content/guides";
import { supabase } from "@/integrations/supabase/client";

export type SavedScope = {
  id: string;
  /** Null until the user names it; the title is then derived from the picks. */
  name: string | null;
  picks: string[];
  createdAt: string;
  updatedAt: string;
};

export const scopesKey = (userId: string) => ["saved-scopes", userId] as const;

// The generated Database type lists no tables until Lovable regenerates it from
// the schema, so the client is untyped here and rows are checked by hand.
// Typing this properly is a one-line change once that file knows the table.
const table = () => (supabase as unknown as SupabaseClient).from("saved_scopes");

const COLUMNS = "id,name,picks,created_at,updated_at";

function toScope(row: unknown): SavedScope {
  const value = row as Record<string, unknown> | null;
  if (!value || typeof value["id"] !== "string" || !Array.isArray(value["picks"])) {
    throw new Error("Unexpected saved scope row");
  }
  return {
    id: value["id"],
    name: typeof value["name"] === "string" ? value["name"] : null,
    picks: value["picks"].filter((slug): slug is string => typeof slug === "string"),
    createdAt: String(value["created_at"]),
    updatedAt: String(value["updated_at"]),
  };
}

export async function listScopes(): Promise<SavedScope[]> {
  const { data, error } = await table()
    .select(COLUMNS)
    .order("updated_at", { ascending: false })
    .limit(200);
  if (error) throw error;
  return (data ?? []).map(toScope);
}

export const newScopeId = () => crypto.randomUUID();

/**
 * Create or update a scope's picks, in one request.
 *
 * The caller chooses the id, so a retry after a lost response updates the row
 * it just made instead of making a second. The name is left out of the payload
 * on purpose: an upsert only sets the columns it is given, so autosave can
 * never overwrite a name the user chose.
 */
export async function saveScopePicks(id: string, picks: string[]): Promise<SavedScope> {
  const { data, error } = await table()
    .upsert({ id, picks }, { onConflict: "id" })
    .select(COLUMNS)
    .single();
  if (error) throw error;
  return toScope(data);
}

export async function renameScope(id: string, name: string | null): Promise<SavedScope> {
  const { data, error } = await table().update({ name }).eq("id", id).select(COLUMNS).single();
  if (error) throw error;
  return toScope(data);
}

export async function deleteScope(id: string): Promise<void> {
  const { error } = await table().delete().eq("id", id);
  if (error) throw error;
}

const join = (names: string[]) =>
  names.length <= 1
    ? (names[0] ?? "")
    : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;

/** What to call a scope: the name it was given, else a summary of its picks. */
export function scopeTitle(scope: Pick<SavedScope, "name" | "picks">): string {
  if (scope.name) return scope.name;
  const names = scope.picks.map((slug) => guideBySlug.get(slug)?.topic ?? slug);
  if (names.length <= 3) return join(names);
  return `${names.slice(0, 3).join(", ")} and ${names.length - 3} more`;
}
