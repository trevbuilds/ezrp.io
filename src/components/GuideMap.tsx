import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Minus, Plus, Crosshair } from "lucide-react";

import { childrenOf, guideBySlug, guides, pillars, type Guide } from "@/content/guides";

type Node = {
  guide: Guide;
  x: number;
  y: number;
  tier: 1 | 2 | 3;
};

const R1 = 250;
const R2 = 470;
const R3 = 650;

/**
 * Radial layout: each pillar owns an angular sector sized by how many
 * descendants it has, so dense pillars get room and labels stop colliding.
 */
function useLayout() {
  return useMemo(() => {
    const nodes = new Map<string, Node>();
    const links: Array<[string, string]> = [];

    const weight = (slug: string) => {
      const kids = childrenOf(slug);
      if (kids.length === 0) return 1;
      return kids.reduce((sum, k) => sum + Math.max(1, childrenOf(k.slug).length), 0);
    };

    const weights = pillars.map((p) => weight(p.slug));
    const total = weights.reduce((a, b) => a + b, 0);
    const gap = 0.04;

    let cursor = -Math.PI / 2;
    pillars.forEach((pillar, i) => {
      const sector = (weights[i] / total) * (Math.PI * 2 - gap * pillars.length);
      const start = cursor + gap / 2;
      const mid = start + sector / 2;
      cursor += sector + gap;

      nodes.set(pillar.slug, {
        guide: pillar,
        x: Math.cos(mid) * R1,
        y: Math.sin(mid) * R1,
        tier: 1,
      });

      const kids = childrenOf(pillar.slug);
      const kidWeights = kids.map((k) => Math.max(1, childrenOf(k.slug).length));
      const kidTotal = kidWeights.reduce((a, b) => a + b, 0) || 1;

      let kidCursor = start;
      kids.forEach((kid, k) => {
        const kidSector = (kidWeights[k] / kidTotal) * sector;
        const kidMid = kidCursor + kidSector / 2;
        kidCursor += kidSector;

        nodes.set(kid.slug, {
          guide: kid,
          x: Math.cos(kidMid) * R2,
          y: Math.sin(kidMid) * R2,
          tier: 2,
        });
        links.push([pillar.slug, kid.slug]);

        const grandKids = childrenOf(kid.slug);
        grandKids.forEach((gk, g) => {
          const gAngle =
            grandKids.length === 1
              ? kidMid
              : kidMid + (g / (grandKids.length - 1) - 0.5) * kidSector * 0.8;
          nodes.set(gk.slug, {
            guide: gk,
            x: Math.cos(gAngle) * R3,
            y: Math.sin(gAngle) * R3,
            tier: 3,
          });
          links.push([kid.slug, gk.slug]);
        });
      });
    });

    return { nodes, links };
  }, []);
}

export function GuideMap() {
  const { nodes, links } = useLayout();
  const [active, setActive] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const related = useMemo(() => {
    if (!active) return new Set<string>();
    const set = new Set<string>([active]);
    let parent = guideBySlug.get(active)?.parent ?? null;
    while (parent) {
      set.add(parent);
      parent = guideBySlug.get(parent)?.parent ?? null;
    }
    childrenOf(active).forEach((c) => {
      set.add(c.slug);
      childrenOf(c.slug).forEach((g) => set.add(g.slug));
    });
    return set;
  }, [active]);

  const selected = active ? guideBySlug.get(active) : undefined;
  const dim = (slug: string) => active !== null && !related.has(slug);

  return (
    <div className="relative">
      <div className="panel overflow-hidden rounded-lg">
        <div className="h-[32rem] cursor-grab active:cursor-grabbing md:h-[38rem]">
          <motion.div drag dragMomentum={false} className="size-full">
            <svg
              viewBox="-760 -760 1520 1520"
              className="size-full"
              style={{ transform: `scale(${zoom})` }}
            >
              <circle r={R1} className="fill-none stroke-grid" strokeWidth={1} />
              <circle r={R2} className="fill-none stroke-grid" strokeWidth={1} />
              <circle r={R3} className="fill-none stroke-grid" strokeWidth={1} />

              {links.map(([from, to]) => {
                const a = nodes.get(from);
                const b = nodes.get(to);
                if (!a || !b) return null;
                const lit = related.has(from) && related.has(to);
                return (
                  <line
                    key={`${from}-${to}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    className={lit ? "stroke-primary" : "stroke-border"}
                    strokeWidth={lit ? 1.6 : 1}
                    opacity={active && !lit ? 0.25 : 1}
                  />
                );
              })}

              {pillars.map((p) => {
                const n = nodes.get(p.slug);
                if (!n) return null;
                return (
                  <line
                    key={`core-${p.slug}`}
                    x1={0}
                    y1={0}
                    x2={n.x}
                    y2={n.y}
                    className="stroke-border"
                    strokeWidth={1}
                    opacity={0.5}
                  />
                );
              })}

              <circle r={54} className="fill-background stroke-primary" strokeWidth={1.5} />
              <text
                textAnchor="middle"
                dy="0.35em"
                className="fill-foreground font-display"
                fontSize={22}
              >
                EZRP
              </text>

              {[...nodes.values()].map((n) => {
                const size = n.tier === 1 ? 9 : n.tier === 2 ? 6 : 4.5;
                const faded = dim(n.guide.slug);
                return (
                  <g
                    key={n.guide.slug}
                    opacity={faded ? 0.25 : 1}
                    onMouseEnter={() => setActive(n.guide.slug)}
                    onFocus={() => setActive(n.guide.slug)}
                    className="cursor-pointer"
                  >
                    <Link to="/guides/$slug" params={{ slug: n.guide.slug }}>
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={size}
                        className={
                          n.tier === 1
                            ? "fill-tier-1"
                            : n.tier === 2
                              ? "fill-tier-2"
                              : "fill-tier-3"
                        }
                      />
                      <text
                        x={n.x + (n.x < 0 ? -(size + 7) : size + 7)}
                        y={n.y}
                        dy="0.34em"
                        textAnchor={n.x < 0 ? "end" : "start"}
                        fontSize={n.tier === 1 ? 19 : 14}
                        className={
                          n.tier === 1
                            ? "fill-foreground font-display"
                            : "fill-muted-foreground"
                        }
                      >
                        {n.guide.topic.length > 34
                          ? `${n.guide.topic.slice(0, 32)}…`
                          : n.guide.topic}
                      </text>
                    </Link>
                  </g>
                );
              })}
            </svg>
          </motion.div>
        </div>
      </div>

      <div className="absolute right-3 top-3 flex flex-col gap-1">
        {[
          { icon: Plus, action: () => setZoom((z) => Math.min(2.2, z + 0.2)), label: "Zoom in" },
          { icon: Minus, action: () => setZoom((z) => Math.max(0.6, z - 0.2)), label: "Zoom out" },
          { icon: Crosshair, action: () => setZoom(1), label: "Reset" },
        ].map(({ icon: Icon, action, label }) => (
          <button
            key={label}
            onClick={action}
            aria-label={label}
            className="panel rounded p-2 text-muted-foreground transition hover:text-foreground"
          >
            <Icon className="size-4" />
          </button>
        ))}
      </div>

      <div className="panel mt-3 rounded-lg p-4">
        {selected ? (
          <div>
            <p className="label-xs">
              {selected.parent ? guideBySlug.get(selected.parent)?.topic : "Top-level pillar"}
            </p>
            <h3 className="mt-1 text-xl font-semibold">{selected.topic}</h3>
            {selected.definition && (
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                {selected.definition}
              </p>
            )}
            {selected.workflow.length > 0 && (
              <p className="mt-3 font-mono text-xs text-accent">
                {selected.workflow.join("  →  ")}
              </p>
            )}
            <Link
              to="/guides/$slug"
              params={{ slug: selected.slug }}
              className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
            >
              Open guide →
            </Link>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Hover a node to trace its connections. Tap any label to open the guide. Drag to
            pan, use the controls to zoom. {guides.length} guides mapped.
          </p>
        )}
      </div>
    </div>
  );
}
