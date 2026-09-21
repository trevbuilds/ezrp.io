import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, MessageSquarePlus } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { deliverables } from "@/content/deliverables";
import { programmes } from "@/content/programmes";
import { ChatPanel } from "./ChatPanel";

const nav = [
  { to: "/", label: "Map" },
  { to: "/start", label: "Start here" },
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
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-3">
          <div className="flex items-center gap-2">
            <Link to="/" className="font-display text-lg font-bold tracking-tight">
              ezrp<span className="text-primary">.io</span>
            </Link>
            <span className="rounded border border-primary/45 px-1.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-normal text-primary">
              Alpha
            </span>
          </div>
          <nav className="flex flex-wrap items-center justify-end gap-1">
            {nav.slice(0, 4).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground data-[status=active]:bg-muted data-[status=active]:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <BuildMenu />
            {nav.slice(4).map((item) => (
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

/**
 * Build is a section rather than a page, so it gets a menu.
 *
 * Click rather than hover: hover menus are unusable on touch, and the whole
 * site has to work on a phone. Closes on outside click, on Escape and on
 * navigation, so it never strands itself open behind a new page.
 */
function BuildMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const onBuild = pathname.startsWith("/build");

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent | TouchEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`flex items-center gap-1 rounded px-3 py-1.5 text-sm transition hover:text-foreground ${
          onBuild ? "bg-muted text-foreground" : "text-muted-foreground"
        }`}
      >
        Build
        <ChevronDown className={`size-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-1 w-[min(19rem,calc(100vw-2.5rem))] rounded-lg border border-border bg-background p-1.5 shadow-lg"
        >
          <Link
            to="/build"
            role="menuitem"
            className="block rounded px-2.5 py-1.5 text-sm text-foreground transition hover:bg-muted"
          >
            Overview
          </Link>
          <p className="label-xs mt-2 px-2.5 py-1">Deliverables</p>
          {deliverables.map((item) => (
            <Link
              key={item.slug}
              to="/build/$slug"
              params={{ slug: item.slug }}
              role="menuitem"
              className="flex items-baseline justify-between gap-2 rounded px-2.5 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <span>{item.short}</span>
              <span className="shrink-0 rounded border border-primary/45 px-1 font-mono text-[0.5625rem] uppercase text-primary">
                Alpha
              </span>
            </Link>
          ))}
          <p className="label-xs mt-2 px-2.5 py-1">Templates</p>
          {programmes.map((programme) => (
            <Link
              key={programme.slug}
              to="/build/template/$slug"
              params={{ slug: programme.slug }}
              role="menuitem"
              className="block rounded px-2.5 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {programme.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
