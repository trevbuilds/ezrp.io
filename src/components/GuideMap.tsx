import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Crosshair, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  allBusinessDomains,
  considerationsOf,
  guides,
  guidesInStream,
  streamsInDomain,
  type BusinessDomain,
  type Guide,
  type ValueStream,
} from "@/content/guides";
import { allConsiderations, type Consideration } from "@/content/model";

type MapNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  kind: "domain" | "stream" | "guide" | "cross";
  guide?: Guide;
  domain?: BusinessDomain;
  stream?: ValueStream;
  consideration?: Consideration;
};

type MapLink = {
  from: string;
  to: string;
  cross?: boolean;
};

const TAU = Math.PI * 2;
const point = (angle: number, radiusX: number, radiusY: number) => ({
  x: Math.round(Math.cos(angle) * radiusX),
  y: Math.round(Math.sin(angle) * radiusY),
});

function useLayout() {
  return useMemo(() => {
    const nodes = new Map<string, MapNode>();
    const links: MapLink[] = [];

    allConsiderations.forEach((consideration, index) => {
      const angle = -Math.PI / 2 + (index / allConsiderations.length) * TAU;
      const position = point(angle, 158, 118);
      nodes.set(`cross:${consideration}`, {
        id: `cross:${consideration}`,
        label: consideration,
        ...position,
        kind: "cross",
        consideration,
      });
    });

    allBusinessDomains.forEach((domain, domainIndex) => {
      const angle = -Math.PI / 2 + (domainIndex / allBusinessDomains.length) * TAU;
      const domainPosition = point(angle, 350, 265);
      const domainId = `domain:${domain}`;
      nodes.set(domainId, {
        id: domainId,
        label: domain,
        ...domainPosition,
        kind: "domain",
        domain,
      });
      links.push({ from: "core", to: domainId });

      const domainGuides = guides.filter((guide) => guide.domain === domain);
      allConsiderations.forEach((consideration) => {
        if (domainGuides.some((guide) => considerationsOf(guide.slug).includes(consideration))) {
          links.push({ from: `cross:${consideration}`, to: domainId, cross: true });
        }
      });

      const streams = streamsInDomain(domain);
      streams.forEach((stream, streamIndex) => {
        const spread = Math.min(1.02, Math.max(0.42, streams.length * 0.13));
        const offset =
          streams.length === 1 ? 0 : (streamIndex / (streams.length - 1) - 0.5) * spread;
        const streamAngle = angle + offset;
        const streamPosition = point(streamAngle, 525, 395);
        const streamId = `stream:${stream}`;
        nodes.set(streamId, {
          id: streamId,
          label: stream,
          ...streamPosition,
          kind: "stream",
          domain,
          stream,
        });
        links.push({ from: domainId, to: streamId });

        const streamGuides = guidesInStream(stream).filter(
          (guide) => guide.parent !== null && guide.slug !== guide.module,
        );
        streamGuides.forEach((guide, guideIndex) => {
          const guideOffset = (guideIndex - (streamGuides.length - 1) / 2) * 0.055;
          const guideRadiusX = 650 + (guideIndex % 2) * 34;
          const guideRadiusY = 490 + (guideIndex % 2) * 26;
          const guidePosition = point(streamAngle + guideOffset, guideRadiusX, guideRadiusY);
          nodes.set(guide.slug, {
            id: guide.slug,
            label: guide.topic,
            ...guidePosition,
            kind: "guide",
            guide,
            domain,
            stream,
          });
          links.push({ from: streamId, to: guide.slug });
        });
      });
    });

    return { nodes, links };
  }, []);
}

/**
 * Physics, ported from the Clariti brain and scaled to this viewBox, which is
 * about 2.5x theirs (1520x1140 against 604x424). The brain's own values are
 * kept where they are proportional — spring, anchor pull and damping — and the
 * distance-based ones are scaled.
 */
const SPRING = 0.007;
const REPULSION_RANGE = 50;
const REPULSION = 0.003;
const ANCHOR_PULL = { domain: 0.009, cross: 0.009, stream: 0.007, guide: 0.0045 } as const;
const DAMPING = 0.945;
const SWAY = { base: 0.11, leaf: 0.145 } as const;
const BOUNDS = { x: 740, y: 555 } as const;

type Motion = { x: number; y: number; vx: number; vy: number };

function linkPath(from: MapNode | undefined, to: MapNode | undefined, cross = false) {
  if (!from || !to) return "";
  if (cross) {
    const bendX = (from.x + to.x) * 0.34;
    const bendY = (from.y + to.y) * 0.34;
    return `M ${from.x} ${from.y} Q ${bendX} ${bendY}, ${to.x} ${to.y}`;
  }
  return `M ${from.x} ${from.y} Q ${(from.x + to.x) * 0.46} ${(from.y + to.y) * 0.46}, ${to.x} ${to.y}`;
}

/** Same curve as linkPath, but from live positions rather than node records. */
function pathFrom(ax: number, ay: number, bx: number, by: number, cross: boolean) {
  const bend = cross ? 0.34 : 0.46;
  return `M ${ax.toFixed(1)} ${ay.toFixed(1)} Q ${((ax + bx) * bend).toFixed(1)} ${((ay + by) * bend).toFixed(1)}, ${bx.toFixed(1)} ${by.toFixed(1)}`;
}

const coreNode: MapNode = { id: "core", label: "EZRP", x: 0, y: 0, kind: "domain" };

export function GuideMap() {
  const { nodes, links } = useLayout();
  const [active, setActive] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0.86);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Stable index order for the simulation. "core" is index 0 and never moves.
  const nodeList = useMemo(() => [coreNode, ...nodes.values()], [nodes]);
  const indexById = useMemo(
    () => new Map(nodeList.map((node, index) => [node.id, index])),
    [nodeList],
  );
  const indexedLinks = useMemo(
    () =>
      links.flatMap((link) => {
        const from = indexById.get(link.from);
        const to = indexById.get(link.to);
        if (from === undefined || to === undefined) return [];
        const a = nodeList[from];
        const b = nodeList[to];
        if (!a || !b) return [];
        return [{ ...link, a: from, b: to, rest: Math.hypot(a.x - b.x, a.y - b.y) }];
      }),
    [links, indexById, nodeList],
  );

  // Every fifth link carries the idle signal, as the brain does.
  const signalLinks = useMemo(
    () => indexedLinks.filter((_, index) => index % 5 === 0),
    [indexedLinks],
  );

  const positionsRef = useRef<Motion[]>([]);
  const anchorsRef = useRef<Array<{ x: number; y: number }>>([]);
  const nodeRefs = useRef<Array<SVGGElement | null>>([]);
  const linkRefs = useRef<Array<SVGPathElement | null>>([]);
  const signalRefs = useRef<Array<SVGPathElement | null>>([]);

  if (positionsRef.current.length !== nodeList.length) {
    positionsRef.current = nodeList.map((node) => ({ x: node.x, y: node.y, vx: 0, vy: 0 }));
    anchorsRef.current = nodeList.map((node) => ({ x: node.x, y: node.y }));
  }

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  /**
   * Springs along links, short-range repulsion, a pull back to the authored
   * anchor, and two low-frequency sines for idle sway. Positions are written
   * straight to SVG attributes so React never re-renders during motion.
   */
  useEffect(() => {
    let frame = 0;
    let previous = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(2, (now - previous) / 16.667);
      previous = now;
      const positions = positionsRef.current;

      indexedLinks.forEach((link) => {
        const from = positions[link.a];
        const to = positions[link.b];
        if (!from || !to) return;
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        const force = (distance - link.rest) * SPRING * dt;
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;
        if (link.a !== 0) {
          from.vx += fx;
          from.vy += fy;
        }
        if (link.b !== 0) {
          to.vx -= fx;
          to.vy -= fy;
        }
      });

      for (let a = 1; a < positions.length; a += 1) {
        const first = positions[a];
        if (!first) continue;
        for (let b = a + 1; b < positions.length; b += 1) {
          const second = positions[b];
          if (!second) continue;
          const dx = second.x - first.x;
          const dy = second.y - first.y;
          const distanceSq = dx * dx + dy * dy;
          if (distanceSq < 1 || distanceSq > REPULSION_RANGE * REPULSION_RANGE) continue;
          const distance = Math.sqrt(distanceSq);
          const force = (REPULSION_RANGE - distance) * REPULSION * dt;
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          first.vx -= fx;
          first.vy -= fy;
          second.vx += fx;
          second.vy += fy;
        }
      }

      positions.forEach((position, index) => {
        if (index === 0) return;
        const node = nodeList[index];
        const anchor = anchorsRef.current[index];
        if (!node || !anchor) return;
        const pull = ANCHOR_PULL[node.kind];
        position.vx += (anchor.x - position.x) * pull * dt;
        position.vy += (anchor.y - position.y) * pull * dt;
        if (!reducedMotion) {
          const sway = node.kind === "guide" ? SWAY.leaf : SWAY.base;
          position.vx += Math.sin(now * 0.00046 + index * 1.618) * sway * dt;
          position.vy += Math.cos(now * 0.00041 + index * 2.113) * sway * dt;
          position.vx += Math.sin(now * 0.00019 + index * 0.731) * sway * 0.7 * dt;
          position.vy += Math.cos(now * 0.00023 + index * 1.114) * sway * 0.7 * dt;
        }
        position.vx *= DAMPING;
        position.vy *= DAMPING;
        position.x += position.vx * dt;
        position.y += position.vy * dt;
        if (!Number.isFinite(position.x) || !Number.isFinite(position.y)) {
          position.x = node.x;
          position.y = node.y;
          position.vx = 0;
          position.vy = 0;
        }
        position.x = Math.min(BOUNDS.x, Math.max(-BOUNDS.x, position.x));
        position.y = Math.min(BOUNDS.y, Math.max(-BOUNDS.y, position.y));
      });

      nodeRefs.current.forEach((element, index) => {
        const position = positions[index];
        if (element && position) {
          element.setAttribute(
            "transform",
            `translate(${position.x.toFixed(1)} ${position.y.toFixed(1)})`,
          );
        }
      });

      const paint = (refs: Array<SVGPathElement | null>, list: typeof indexedLinks) => {
        refs.forEach((element, index) => {
          const link = list[index];
          if (!element || !link) return;
          const from = positions[link.a];
          const to = positions[link.b];
          if (!from || !to) return;
          element.setAttribute("d", pathFrom(from.x, from.y, to.x, to.y, Boolean(link.cross)));
        });
      };
      paint(linkRefs.current, indexedLinks);
      paint(signalRefs.current, signalLinks);

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // signalLinks is derived from indexedLinks, so this covers it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexedLinks, nodeList, reducedMotion]);

  const related = useMemo(() => {
    if (!active) return new Set<string>();
    const set = new Set<string>([active, "core"]);
    const node = nodes.get(active);
    if (!node) return set;

    if (node.domain) set.add(`domain:${node.domain}`);
    if (node.stream) set.add(`stream:${node.stream}`);

    if (node.kind === "domain" && node.domain) {
      streamsInDomain(node.domain).forEach((stream) => {
        set.add(`stream:${stream}`);
        guidesInStream(stream).forEach((guide) => set.add(guide.slug));
      });
      links
        .filter((link) => link.cross && link.to === node.id)
        .forEach((link) => set.add(link.from));
    }

    if (node.kind === "stream" && node.stream) {
      guidesInStream(node.stream).forEach((guide) => set.add(guide.slug));
    }

    if (node.kind === "guide" && node.guide) {
      considerationsOf(node.guide.slug).forEach((item) => set.add(`cross:${item}`));
    }

    if (node.kind === "cross") {
      links
        .filter((link) => link.cross && link.from === node.id)
        .forEach((link) => {
          set.add(link.to);
          const domain = nodes.get(link.to)?.domain;
          if (domain) streamsInDomain(domain).forEach((stream) => set.add(`stream:${stream}`));
        });
    }
    return set;
  }, [active, links, nodes]);

  const selected = active ? nodes.get(active) : undefined;
  const isRelatedLink = (link: MapLink) => related.has(link.from) && related.has(link.to);

  const nodeMark = (node: MapNode) => {
    const radius =
      node.kind === "domain" ? 14 : node.kind === "stream" ? 8 : node.kind === "cross" ? 7 : 4;
    const labelY = node.kind === "guide" ? 17 : 25;
    return (
      <>
        <circle className="hit" cx={0} cy={0} r={23} />
        {node.kind === "domain" && <circle className="orbit" cx={0} cy={0} r={23} />}
        <circle className="visible" cx={0} cy={0} r={radius} />
        <text className="node-label" x={0} y={labelY} textAnchor="middle">
          {node.label.length > 27 ? `${node.label.slice(0, 25)}…` : node.label}
        </text>
      </>
    );
  };

  return (
    <div className="relative">
      <div className="guide-brain panel overflow-hidden rounded-lg">
        <div className="guide-brain__legend absolute left-4 top-4 z-10 hidden items-center gap-4 font-mono text-[0.625rem] uppercase text-muted-foreground md:flex">
          <span>
            <i className="bg-primary" /> Domain
          </span>
          <span>
            <i className="bg-accent" /> Value stream
          </span>
          <span>
            <i className="bg-foreground" /> Guide
          </span>
          <span>
            <i className="border border-primary" /> Shared concern
          </span>
        </div>
        <div className="guide-brain__stage h-[38rem] cursor-grab active:cursor-grabbing md:h-[48rem]">
          <motion.div drag dragMomentum={false} className="size-full">
            <svg
              viewBox="-760 -570 1520 1140"
              className="size-full"
              style={{ transform: `scale(${zoom})` }}
              aria-label="EZRP knowledge map showing business domains, value streams, guide topics, and cross-cutting capabilities"
            >
              <defs>
                <filter id="guide-brain-glow" x="-200%" y="-200%" width="400%" height="400%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <g className="guide-brain__links">
                {indexedLinks.map((link, index) => (
                  <path
                    key={`${link.from}-${link.to}`}
                    ref={(element) => {
                      linkRefs.current[index] = element;
                    }}
                    d={linkPath(
                      link.from === "core" ? coreNode : nodes.get(link.from),
                      nodes.get(link.to),
                      link.cross,
                    )}
                    className={`${link.cross ? "is-cross" : ""} ${isRelatedLink(link) ? "is-active" : active ? "is-muted" : ""}`}
                  />
                ))}
              </g>
              <g className="guide-brain__signals">
                {signalLinks.map((link, index) => (
                  <path
                    key={`signal-${link.from}-${link.to}`}
                    ref={(element) => {
                      signalRefs.current[index] = element;
                    }}
                    d={linkPath(
                      link.from === "core" ? coreNode : nodes.get(link.from),
                      nodes.get(link.to),
                      link.cross,
                    )}
                    pathLength="1"
                    className={active ? (isRelatedLink(link) ? "is-active" : "") : "is-idle"}
                    style={{ animationDelay: `${index * -0.37}s` }}
                  />
                ))}
              </g>

              <g className="guide-brain__core">
                <circle cx={0} cy={0} r={52} />
                <circle cx={0} cy={0} r={67} />
                <circle cx={0} cy={0} r={81} />
                <text x={0} y={5} textAnchor="middle">
                  EZRP
                </text>
              </g>

              <g className="guide-brain__nodes">
                {nodeList.map((node, index) => {
                  if (node.id === "core") return null;
                  const muted = active !== null && !related.has(node.id);
                  const className = `${node.kind === "domain" ? "tier-1" : node.kind === "stream" ? "tier-2" : node.kind === "cross" ? "cross-cutting" : "tier-3"} ${active === node.id ? "is-active" : muted ? "is-muted" : ""}`;
                  const handlers = {
                    onMouseEnter: () => setActive(node.id),
                    onFocus: () => setActive(node.id),
                    onMouseLeave: () => setActive(null),
                    onBlur: () => setActive(null),
                  };
                  const mark = (
                    <g
                      ref={(element) => {
                        nodeRefs.current[index] = element;
                      }}
                      transform={`translate(${node.x} ${node.y})`}
                    >
                      {nodeMark(node)}
                    </g>
                  );

                  if (node.kind === "domain") {
                    return (
                      <Link
                        key={node.id}
                        to="/guides"
                        search={{ domain: node.domain }}
                        className={className}
                        {...handlers}
                      >
                        {mark}
                      </Link>
                    );
                  }
                  if (node.kind === "stream") {
                    return (
                      <Link
                        key={node.id}
                        to="/guides"
                        search={{ stream: node.stream }}
                        className={className}
                        {...handlers}
                      >
                        {mark}
                      </Link>
                    );
                  }
                  if (node.kind === "cross") {
                    return (
                      <Link
                        key={node.id}
                        to="/guides"
                        search={{ q: node.consideration }}
                        className={className}
                        {...handlers}
                      >
                        {mark}
                      </Link>
                    );
                  }
                  if (node.guide) {
                    return (
                      <Link
                        key={node.id}
                        to="/guides/$slug"
                        params={{ slug: node.guide.slug }}
                        className={className}
                        {...handlers}
                      >
                        {mark}
                      </Link>
                    );
                  }
                  return null;
                })}
              </g>
            </svg>
          </motion.div>
        </div>
      </div>

      <div className="absolute right-3 top-3 flex flex-col gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setZoom((value) => Math.min(1.35, value + 0.1))}
          aria-label="Zoom in"
        >
          <Plus />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setZoom((value) => Math.max(0.55, value - 0.1))}
          aria-label="Zoom out"
        >
          <Minus />
        </Button>
        <Button variant="outline" size="icon" onClick={() => setZoom(0.86)} aria-label="Reset zoom">
          <Crosshair />
        </Button>
      </div>

      <div className="panel mt-3 min-h-28 rounded-lg p-4">
        {selected ? (
          <div>
            <p className="label-xs">
              {selected.kind === "cross" ? "Cross-cutting concern" : selected.kind}
            </p>
            <h3 className="mt-1 text-xl font-semibold">{selected.label}</h3>
            {selected.guide?.definition && (
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                {selected.guide.definition}
              </p>
            )}
            <p className="mt-3 font-mono text-xs text-accent">
              {selected.kind === "cross"
                ? "Linked wherever this concern shapes a domain or its guides"
                : [selected.domain, selected.stream].filter(Boolean).join("  →  ")}
            </p>
          </div>
        ) : (
          <div>
            <p className="label-xs">How to read the map</p>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              EZRP is the core. Business domains orbit it, value streams branch outward, and
              practical guides sit at the edge. The inner shared concerns connect across every area
              they influence.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
