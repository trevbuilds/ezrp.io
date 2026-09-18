import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { ChatPanel } from "./ChatPanel";

const nav = [
  { to: "/", label: "Map" },
  { to: "/guides", label: "Guides" },
  { to: "/framework", label: "Framework" },
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <Link to="/" className="font-display text-lg font-bold tracking-tight">
            ezrp<span className="text-primary">.io</span>
          </Link>
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
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="mt-16 border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-8">
          <p className="label-xs">Easy Resource Planning</p>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            A working map of ERP delivery: modules, the processes inside them, and the
            workflow steps teams actually run.
          </p>
        </div>
      </footer>
      <ChatPanel />
    </div>
  );
}
