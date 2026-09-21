import { createFileRoute, redirect } from "@tanstack/react-router";

/** Programmes became templates inside Build. Old links still land. */
export const Route = createFileRoute("/programmes/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/build/template/$slug", params: { slug: params.slug }, replace: true });
  },
});
