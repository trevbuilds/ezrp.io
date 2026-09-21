import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Crosshair, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  allBusinessDomains,
  considerationsOf,
  guides,
  type BusinessDomain,
  type Guide,
} from "@/content/guides";
import { bandOfModule, streamsInBand, subStreamsOf, type Stream } from "@/content/model";
import { BAND_ANCHORS, brainCandidates, claimNear } from "./brain-layout";

type MapNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  kind: "domain" | "stream" | "substream" | "guide" | "step";
  guide?: Guide;
  domain?: BusinessDomain;
  stream?: Stream;
  /** Distance from the band, used to stagger the chain fill. */
  depth?: number;
};

type MapLink = {
  from: string;
  to: string;
  cross?: boolean;
  /** Position in the band -> stream -> sub-stream -> guide chain. */
  depth?: number;
};

const TAU = Math.PI * 2;
const point = (angle: number, radiusX: number, radiusY: number) => ({
  x: Math.round(Math.cos(angle) * radiusX),
  y: Math.round(Math.sin(angle) * radiusY),
});

/**
 * The map is the ERP, drawn into the Clariti brain silhouette. The
 * considerations are guidance that cuts across it, and they live in the
 * library's navigation rather than here — drawing them on the map meant a link
 * from nearly every concern to nearly every band, which was a hairball.
 *
 * Bands are hand-placed inside the silhouette; everything below them is
 * generated into it, seeded from its parent so a branch holds together.
 */
function useLayout() {
  return useMemo(() => {
    const nodes = new Map<string, MapNode>();
    const links: MapLink[] = [];
    const placed = new Set<string>();

    const anchors = allBusinessDomains
      .map((band) => BAND_ANCHORS[band])
      .filter((point): point is { x: number; y: number } => Boolean(point));
    const candidates = brainCandidates(anchors);
    const used = new Set<number>();

    // Streams are spread across the whole silhouette rather than parked beside
    // their band. Bands sit around the edge, so clustering streams against
    // them left the middle empty and the map read as a ring. Taking candidates
    // in Halton order fills the shape evenly; the link back to the band still
    // carries the hierarchy, and a long line is fine — the brain has them too.
    let spread = 0;
    const nextSpreadPoint = () => {
      while (used.has(spread) && spread < candidates.length) spread += 1;
      used.add(spread);
      return candidates[spread] ?? { x: 340, y: 200 };
    };

    const guidesOnStream = (slug: string) =>
      guides.filter(
        (guide) =>
          guide.streams.includes(slug) && guide.parent !== null && guide.slug !== guide.module,
      );

    allBusinessDomains.forEach((band) => {
      const anchor = BAND_ANCHORS[band];
      if (!anchor) return;
      const domainId = `domain:${band}`;
      nodes.set(domainId, {
        id: domainId,
        label: band,
        x: anchor.x,
        y: anchor.y,
        kind: "domain",
        domain: band,
        depth: 0,
      });

      streamsInBand(band).forEach((stream) => {
        const streamPoint = nextSpreadPoint();
        const streamId = `stream:${stream.slug}`;
        nodes.set(streamId, {
          id: streamId,
          label: stream.name,
          ...streamPoint,
          kind: "stream",
          domain: band,
          stream,
          depth: 1,
        });
        links.push({ from: domainId, to: streamId, depth: 1 });

        // The model's central claim, drawn: a stream crosses modules, so it
        // links to every band the work actually happens in. These are the long
        // lines that give the map its texture — and they are real
        // relationships, not decoration.
        stream.modules.forEach((moduleSlug) => {
          const crossed = bandOfModule(moduleSlug);
          if (!crossed || crossed === band) return;
          links.push({ from: `domain:${crossed}`, to: streamId, cross: true });
        });

        const branches: Array<{
          id: string;
          at: { x: number; y: number };
          depth: number;
          slug: string;
        }> = [];

        subStreamsOf(stream.slug).forEach((sub, subIndex) => {
          const subPoint = claimNear(
            candidates,
            used,
            streamPoint,
            22 + subIndex * 4,
            subIndex + 3,
          );
          const subId = `stream:${sub.slug}`;
          nodes.set(subId, {
            id: subId,
            label: sub.name,
            ...subPoint,
            kind: "substream",
            domain: band,
            stream: sub,
            depth: 2,
          });
          links.push({ from: streamId, to: subId, depth: 2 });
          branches.push({ id: subId, at: subPoint, depth: 3, slug: sub.slug });
        });

        branches.push({ id: streamId, at: streamPoint, depth: 2, slug: stream.slug });

        branches.forEach((branch) => {
          guidesOnStream(branch.slug)
            .filter((guide) => !placed.has(guide.slug))
            .forEach((guide, guideIndex) => {
              placed.add(guide.slug);
              const at = claimNear(candidates, used, branch.at, 15 + guideIndex * 3.5, guideIndex);
              nodes.set(guide.slug, {
                id: guide.slug,
                label: guide.topic,
                ...at,
                kind: "guide",
                guide,
                domain: band,
                stream,
                depth: branch.depth,
              });
              links.push({ from: branch.id, to: guide.slug, depth: branch.depth });

              // A topic that sits in more than one stream is linked to each —
              // data-migration belongs to both the data stream and cutover.
              guide.streams
                .filter((slug) => slug !== branch.slug)
                .forEach((slug) => {
                  links.push({ from: `stream:${slug}`, to: guide.slug, cross: true });
                });

              // Workflow steps are the finest tier. They are what fills the
              // silhouette — the shape is read from their density, the way
              // the brain reads from its transaction-step nodes.
              guide.workflow.forEach((step, stepIndex) => {
                const stepAt = claimNear(candidates, used, at, 9 + stepIndex * 2.6, stepIndex + 7);
                const stepId = `${guide.slug}#${stepIndex}`;
                nodes.set(stepId, {
                  id: stepId,
                  label: step,
                  ...stepAt,
                  kind: "step",
                  guide,
                  domain: band,
                  stream,
                  depth: branch.depth + 1,
                });
                links.push({ from: guide.slug, to: stepId, depth: branch.depth + 1 });
              });
            });
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
const REPULSION_RANGE = 20;
const REPULSION = 0.003;
const ANCHOR_PULL = {
  domain: 0.009,
  stream: 0.007,
  substream: 0.006,
  guide: 0.0045,
  step: 0.0045,
} as const;
const DAMPING = 0.945;
const SWAY = { base: 0.044, leaf: 0.058 } as const;
/** The silhouette lives in the Clariti coordinate space. */
const BOUNDS = { minX: 45, maxX: 675, minY: 35, maxY: 465 } as const;

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

export function GuideMap() {
  const { nodes, links } = useLayout();
  const [active, setActive] = useState<string | null>(null);
  // Start fitted rather than zoomed in: on a phone the whole map has to be
  // visible before any of it is worth touching.
  const [zoom, setZoom] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Stable index order for the simulation. "core" is index 0 and never moves.
  const nodeList = useMemo(() => [...nodes.values()], [nodes]);
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
  // Bands are the fixed points of the silhouette; everything else settles
  // around them, which is what keeps the shape recognisable while it moves.
  const rootIndexes = useMemo(
    () =>
      new Set(
        nodeList.map((node, index) => (node.kind === "domain" ? index : -1)).filter((i) => i >= 0),
      ),
    [nodeList],
  );

  const signalLinks = useMemo(
    () => indexedLinks.filter((_, index) => index % 5 === 0),
    [indexedLinks],
  );

  /**
   * Idle firing. The brain lights a rotating subset rather than every link at
   * once, keeping roughly half of the previous set so activity reads as
   * continuous rather than as a blink.
   */
  const [idleLit, setIdleLit] = useState<number[]>([]);
  useEffect(() => {
    if (reducedMotion || signalLinks.length === 0) {
      setIdleLit([]);
      return;
    }
    const previous = new Set<number>();
    const pick = () => {
      const count = 6 + Math.floor(Math.random() * 6);
      const picked = new Set<number>(
        [...previous].sort(() => Math.random() - 0.5).slice(0, Math.floor(previous.size * 0.55)),
      );
      while (picked.size < count) picked.add(Math.floor(Math.random() * signalLinks.length));
      previous.clear();
      picked.forEach((index) => previous.add(index));
      setIdleLit([...picked]);
    };
    pick();
    const timer = window.setInterval(pick, 5200);
    return () => window.clearInterval(timer);
  }, [signalLinks, reducedMotion]);
  const idleLitSet = useMemo(() => new Set(idleLit), [idleLit]);

  const dragRef = useRef<{ index: number; pointerId: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const positionsRef = useRef<Motion[]>([]);
  const anchorsRef = useRef<Array<{ x: number; y: number }>>([]);
  const nodeRefs = useRef<Array<SVGGElement | null>>([]);
  const linkRefs = useRef<Array<SVGPathElement | null>>([]);
  const signalRefs = useRef<Array<SVGPathElement | null>>([]);

  if (positionsRef.current.length !== nodeList.length) {
    positionsRef.current = nodeList.map((node) => ({ x: node.x, y: node.y, vx: 0, vy: 0 }));
    anchorsRef.current = nodeList.map((node) => ({ x: node.x, y: node.y }));
  }

  const [coarsePointer, setCoarsePointer] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarsePointer(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

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

      const held = dragRef.current?.index;
      const roots = rootIndexes;

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

      for (let a = 0; a < positions.length; a += 1) {
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
        if (roots.has(index) || index === held) return;
        const node = nodeList[index];
        const anchor = anchorsRef.current[index];
        if (!node || !anchor) return;
        const pull = ANCHOR_PULL[node.kind];
        position.vx += (anchor.x - position.x) * pull * dt;
        position.vy += (anchor.y - position.y) * pull * dt;
        if (!reducedMotion) {
          const sway = node.kind === "guide" || node.kind === "step" ? SWAY.leaf : SWAY.base;
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
        position.x = Math.min(BOUNDS.maxX, Math.max(BOUNDS.minX, position.x));
        position.y = Math.min(BOUNDS.maxY, Math.max(BOUNDS.minY, position.y));
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
  }, [indexedLinks, nodeList, reducedMotion, rootIndexes]);

  // Adjacency over the real chain, so highlighting follows band -> stream ->
  // sub-stream -> guide rather than re-deriving it from names.
  const graph = useMemo(() => {
    const children = new Map<string, string[]>();
    const parents = new Map<string, string[]>();
    links.forEach((link) => {
      if (link.cross) return;
      children.set(link.from, [...(children.get(link.from) ?? []), link.to]);
      parents.set(link.to, [...(parents.get(link.to) ?? []), link.from]);
    });
    return { children, parents };
  }, [links]);

  const related = useMemo(() => {
    if (!active) return new Set<string>();
    const set = new Set<string>([active, "core"]);
    const node = nodes.get(active);
    if (!node) return set;

    const descend = (id: string) => {
      (graph.children.get(id) ?? []).forEach((child) => {
        if (set.has(child)) return;
        set.add(child);
        descend(child);
      });
    };
    const ascend = (id: string) => {
      (graph.parents.get(id) ?? []).forEach((parent) => {
        if (set.has(parent)) return;
        set.add(parent);
        ascend(parent);
      });
    };

    descend(active);
    ascend(active);

    return set;
  }, [active, graph, links, nodes]);

  const selected = active ? nodes.get(active) : undefined;
  const panelConsiderations = useMemo(() => {
    if (!selected) return [];
    if (selected.guide) return considerationsOf(selected.guide.slug);
    // For a band or stream, roll up everything inside it.
    const inside = [...related]
      .map((id) => nodes.get(id)?.guide?.slug)
      .filter((slug): slug is string => Boolean(slug));
    return [...new Set(inside.flatMap((slug) => considerationsOf(slug)))];
  }, [selected, related, nodes]);
  const isRelatedLink = (link: MapLink) => related.has(link.from) && related.has(link.to);

  /**
   * Node drag. The brain invites you to "test the system" by pulling a node
   * and watching its neighbours follow; on release the drop point becomes the
   * new anchor. A drag past a few units suppresses the click so dragging a
   * node never navigates.
   */
  const pointerPoint = (event: ReactPointerEvent<SVGGElement>) => {
    const svg = svgRef.current;
    const matrix = svg?.getScreenCTM();
    if (!svg || !matrix) return null;
    const dom = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    return { x: dom.x, y: dom.y };
  };

  const startDrag = (index: number, id: string) => (event: ReactPointerEvent<SVGGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { index, pointerId: event.pointerId, moved: false };
    setDragging(id);
  };

  const moveDrag = (event: ReactPointerEvent<SVGGElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const target = pointerPoint(event);
    const position = positionsRef.current[drag.index];
    if (!target || !position) return;
    if (Math.hypot(target.x - position.x, target.y - position.y) > 4) drag.moved = true;
    position.x = target.x;
    position.y = target.y;
    position.vx = 0;
    position.vy = 0;
  };

  const endDrag = (event: ReactPointerEvent<SVGGElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const position = positionsRef.current[drag.index];
    const anchor = anchorsRef.current[drag.index];
    if (position && anchor) {
      anchor.x = position.x;
      anchor.y = position.y;
      position.vx = 0;
      position.vy = 0;
    }
    if (drag.moved) event.preventDefault();
    dragRef.current = null;
    setDragging(null);
  };

  const nodeMark = (node: MapNode) => {
    const radius =
      node.kind === "domain"
        ? 2.8
        : node.kind === "stream"
          ? 2.3
          : node.kind === "substream"
            ? 1.8
            : node.kind === "guide"
              ? 1.2
              : 0.85;
    const labelY = node.kind === "guide" || node.kind === "step" ? -5 : -9;
    return (
      <>
        <circle
          className="hit"
          cx={0}
          cy={0}
          r={node.kind === "step" ? 5 : node.kind === "guide" ? 7 : 11}
        />

        <circle className="visible" cx={0} cy={0} r={radius} />
        <text
          className="node-label"
          x={node.x > 540 ? -7 : 7}
          y={labelY}
          textAnchor={node.x > 540 ? "end" : "start"}
        >
          {node.label.length > 30 ? `${node.label.slice(0, 28)}…` : node.label}
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
        <div className="guide-brain__stage aspect-[604/424] max-h-[80vh] w-full cursor-grab active:cursor-grabbing md:aspect-auto md:h-[48rem]">
          <motion.div drag dragMomentum={false} className="size-full">
            <svg
              ref={svgRef}
              viewBox="56 36 604 424"
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
                    d={linkPath(nodes.get(link.from), nodes.get(link.to), link.cross)}
                    className={`${isRelatedLink(link) ? "is-active" : active ? "is-muted" : ""}`}
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
                    d={linkPath(nodes.get(link.from), nodes.get(link.to), link.cross)}
                    pathLength="1"
                    className={
                      active
                        ? isRelatedLink(link)
                          ? "is-active"
                          : ""
                        : idleLitSet.has(index)
                          ? "is-idle"
                          : ""
                    }
                    style={{ animationDelay: `${index * -0.37}s` }}
                  />
                ))}
              </g>

              <g className="guide-brain__nodes">
                {nodeList.map((node, index) => {
                  if (node.id === "core") return null;
                  const inNetwork = active !== null && related.has(node.id);
                  const muted = active !== null && !inNetwork;
                  const tier =
                    node.kind === "domain"
                      ? "tier-1"
                      : node.kind === "stream"
                        ? "tier-2"
                        : node.kind === "substream"
                          ? "tier-2b"
                          : node.kind === "guide"
                            ? "tier-3"
                            : "tier-4";
                  const state =
                    active === node.id
                      ? "is-active"
                      : muted
                        ? "is-muted"
                        : inNetwork
                          ? "is-related"
                          : "";
                  const className = `${tier} ${state}`;
                  const handlers = {
                    onMouseEnter: () => setActive(node.id),
                    onFocus: () => setActive(node.id),
                    onMouseLeave: () => setActive(null),
                    onBlur: () => setActive(null),
                    onClick: (event: { preventDefault: () => void }) => {
                      if (dragRef.current?.moved) {
                        event.preventDefault();
                        return;
                      }
                      // Touch has no hover: the first tap traces the chain,
                      // the second opens the destination.
                      if (coarsePointer && active !== node.id) {
                        event.preventDefault();
                        setActive(node.id);
                      }
                    },
                    // Keep the tab order to the tiers a reader navigates by;
                    // guides are reachable through the library.
                    tabIndex: node.kind === "guide" ? -1 : 0,
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
                  if (node.kind === "stream" || node.kind === "substream") {
                    return (
                      <Link
                        key={node.id}
                        to="/guides"
                        search={{ stream: node.stream?.name }}
                        className={className}
                        {...handlers}
                      >
                        {mark}
                      </Link>
                    );
                  }
                  if (node.kind === "step" && node.guide) {
                    return (
                      <Link
                        key={node.id}
                        to="/guides/$slug"
                        params={{ slug: node.guide.slug }}
                        className={className}
                        {...handlers}
                        tabIndex={-1}
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
        <Button variant="outline" size="icon" onClick={() => setZoom(1)} aria-label="Reset zoom">
          <Crosshair />
        </Button>
      </div>

      <div className="panel mt-3 min-h-28 rounded-lg p-4">
        {selected ? (
          <div>
            <p className="label-xs">
              {selected.kind === "domain"
                ? "Band"
                : selected.kind === "stream"
                  ? "Value stream"
                  : selected.kind === "substream"
                    ? "Sub-stream"
                    : (selected.guide?.level ?? "Guide")}
            </p>
            <h3 className="mt-1 text-xl font-semibold">{selected.label}</h3>
            {selected.guide?.definition && (
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                {selected.guide.definition}
              </p>
            )}
            {selected.guide && selected.guide.workflow.length > 0 && (
              <p className="mt-2 max-w-3xl font-mono text-xs text-accent">
                {selected.guide.workflow.join("  →  ")}
              </p>
            )}
            {selected.stream && selected.stream.modules.length > 1 && (
              <p className="mt-2 text-xs text-muted-foreground">
                Crosses {selected.stream.modules.length} modules — the work happens in more than one
                place.
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {selected.domain && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-[0.65rem] text-primary-foreground">
                  {selected.domain}
                </span>
              )}
              {panelConsiderations.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-primary px-2 py-0.5 text-[0.65rem] text-primary"
                >
                  {item}
                </span>
              ))}
            </div>
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
