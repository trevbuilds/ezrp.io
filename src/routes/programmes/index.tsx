import { createFileRoute, redirect } from "@tanstack/react-router";

/** Programmes became templates inside Build. Old links still land. */
export const Route = createFileRoute("/programmes/")({
  beforeLoad: () => {
    throw redirect({ to: "/build", replace: true });
  },
});
