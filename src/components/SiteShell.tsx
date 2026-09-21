import { Link } from "@tanstack/react-router";
import { MessageSquarePlus } from "lucide-react";
import type { ReactNode } from "react";

import { ChatPanel } from "./ChatPanel";

const nav = [
  { to: "/", label: "Map" },
  { to: "/guides", label: "Guides" },
  { to: "/scope", label: "Scope" },
  { to: "/framework", label: "Framework" },
] as const;

const REPO = "https://github.com/trevbuilds/ezrp.io";

/**
 * Feedback goes to GitHub issues, pre-filled. The content is alpha and
 * incomplete, so a correction naming the page it came from is worth far more
 * than a general comment.
 */
const FEEDBACK_URL = `${REPO}/issues/new?labels=feedback&title=${encodeURIComponent(
  "Feedback: ",
)}&body=${encodeURIComponent(
  [
    "<!-- Which guide or part of the map is this about? A link helps. -->",
    "",
    "**Where:**",
    "",
    "**What is wrong, missing or misleading:**",
    "",
    "**What it should say instead:**",
    "",
  ].join("\n"),
)}`;

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-2">
            <Link to="/" className="font-display text-lg font-bold tracking-tight">
              ezrp<span className="text-primary">.io</span>
            </Link>
            <span className="rounded border border-primary/45 px-1.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-normal text-primary">
              Alpha
            </span>
          </div>
          <nav className="flex items-center gap-1">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground data-[status=active]:bg-muted data-[status=active]:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={FEEDBACK_URL}
              target="_blank"
              rel="noreferrer"
              className="ml-1 inline-flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-sm text-muted-foreground transition hover:border-primary hover:text-foreground"
            >
              <MessageSquarePlus className="size-3.5" />
              <span className="hidden sm:inline">Feedback</span>
            </a>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="mt-16 border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-8">
          <p className="label-xs">Easy Resource Planning</p>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            A working map of ERP delivery: modules, the processes inside them, and the workflow
            steps teams actually run.
          </p>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground">
            Alpha, and the content is still filling in. Corrections are more useful than compliments
            —{" "}
            <a
              href={FEEDBACK_URL}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              tell us what is wrong
            </a>
            , or{" "}
            <a
              href={`${REPO}/discussions`}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              argue with the model
            </a>
            .
          </p>
        </div>
      </footer>
      <ChatPanel />
    </div>
  );
}
