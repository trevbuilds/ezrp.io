import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteShell } from "@/components/SiteShell";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer and privacy — EZRP" },
      {
        name: "description",
        content:
          "EZRP is practitioner guidance, not legal or tax advice. How we treat Google sign-in and saved scopes.",
      },
      { property: "og:title", content: "Disclaimer and privacy — EZRP" },
      {
        property: "og:description",
        content:
          "Not legal or tax advice; rates omitted by design; how Google sign-in and saved scopes are used.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-5 pt-12 pb-6">
        <p className="label-xs">Trust</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
          Disclaimer and privacy
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Short enough to read before you rely on anything here. Beta honesty, not a terms of
          service novel.
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Not legal or tax advice</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            EZRP is a working map and field guide for ERP delivery. It is practitioner guidance for
            scoping and conversation — not legal advice, tax advice, financial advice, or a
            substitute for advice from a qualified adviser who knows your organisation. Australian
            payroll, superannuation, STP, payroll tax, long service leave, workers compensation and
            award topics are especially sensitive: rules move, and your facts matter.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Rates and thresholds omitted by design</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Where a topic depends on a published rate, threshold or instrument, EZRP names the
            source and the decision you have to make rather than embedding a figure that will go
            stale. Check the current instrument (ATO, Fair Work, state revenue offices, schemes)
            before you configure anything. Corrections to the map are welcome via Feedback.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            For what actually changes by Australian state and territory, start at{" "}
            <Link to="/locales" className="text-primary hover:underline">
              Locales
            </Link>
            .
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Google sign-in and saved scopes</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Signing in is optional. The library, map, scope calculator and draft generation all work
            without an account. If you sign in with Google, we use that identity to associate saved
            scopes with your account so you can reopen them on another device under{" "}
            <Link to="/work" className="text-primary hover:underline">
              My work
            </Link>
            .
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>
              We store the scope picks and questionnaire answers you save — enough to restore the
              work, not a profile of your organisation beyond what you entered.
            </li>
            <li>
              We do not sell that data. Sign-out clears the local copy on that browser; remote saved
              scopes remain until you remove them or delete the account linkage through the product
              path provided.
            </li>
            <li>
              Analytics may record page views to understand how the site is used. Measurement
              configuration can change during Beta.
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Corrections</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            If something is wrong, missing or misleading — especially Australian obligations — say
            so via Feedback. Naming the page is more useful than a general comment.
          </p>
        </section>
      </article>
    </SiteShell>
  );
}
