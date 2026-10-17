import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/lib/auth";
import { listScopes, scopesKey, type SavedScope } from "@/lib/saved-scopes";

/** The signed-in user's saved scopes, newest edit first. Disabled when signed out. */
export function useScopes() {
  const auth = useAuth();
  const userId = auth.status === "signed-in" ? auth.userId : null;
  return useQuery({
    queryKey: scopesKey(userId ?? "signed-out"),
    queryFn: listScopes,
    enabled: userId !== null,
    staleTime: 30_000,
  });
}

/** Replace one scope in the cached list, e.g. after a rename. */
export function useUpdateCachedScope() {
  const client = useQueryClient();
  const auth = useAuth();
  const userId = auth.status === "signed-in" ? auth.userId : null;
  return (scope: SavedScope) => {
    if (!userId) return;
    client.setQueryData<SavedScope[]>(scopesKey(userId), (old) =>
      old?.map((item) => (item.id === scope.id ? scope : item)),
    );
  };
}

export function useRemoveCachedScope() {
  const client = useQueryClient();
  const auth = useAuth();
  const userId = auth.status === "signed-in" ? auth.userId : null;
  return (id: string) => {
    if (!userId) return;
    client.setQueryData<SavedScope[]>(scopesKey(userId), (old) =>
      old?.filter((item) => item.id !== id),
    );
  };
}
