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
import {
  allConsiderations,
  streamsInBand,
  subStreamsOf,
  type Consideration,
  type Stream,
} from "@/content/model";

type MapNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  kind: "domain" | "stream" | "substream" | "guide" | "cross";
  guide?: Guide;
  domain?: BusinessDomain;
  stream?: Stream;
  consideration?: Consideration;
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
 * Five tiers out from the core: shared concerns on an inner ring, then bands,
 * their L1 streams, the L2 sub-streams beneath those, and the guides at the
 * edge. Guides attach to the most specific stream they are tagged with, which
 * is why the sub-stream tier has to exist — most guides sit on an L2, and
 * without it they had no node to hang from.
 */
function useLayout() {
  return useMemo(() => {
    const nodes = new Map<string, MapNode>();
    const links: MapLink[] = [];
    const placed = new Set<string>();

    allConsiderations.forEach((consideration, index) => {
      const angle = -Math.PI / 2 + (index / allConsiderations.length) * TAU;
      nodes.set(`cross:${consideration}`, {
        id: `cross:${consideration}`,
        label: consideration,
        ...point(angle, 150, 112),
        kind: "cross",
        consideration,
      });
    });

    const guidesOnStream = (slug: string) =>
      guides.filter(
        (guide) =>
          guide.streams.includes(slug) && guide.parent !== null && guide.slug !== guide.module,
      );

    allBusinessDomains.forEach((domain, domainIndex) => {
      const angle = -Math.PI / 2 + (domainIndex / allBusinessDomains.length) * TAU;
      const domainId = `domain:${domain}`;
      nodes.set(domainId, {
        id: domainId,
        label: domain,
        ...point(angle, 320, 242),
        kind: "domain",
        domain,
        depth: 0,
      });
      links.push({ from: "core", to: domainId, depth: 0 });

      const domainGuides = guides.filter((guide) => guide.domain === domain);
      allConsiderations.forEach((consideration) => {
        if (domainGuides.some((guide) => considerationsOf(guide.slug).includes(consideration))) {
          links.push({ from: `cross:${consideration}`, to: domainId, cross: true });
        }
      });

      const streams = streamsInBand(domain);
      streams.forEach((stream, streamIndex) => {
        const spread = Math.min(1.02, Math.max(0.42, streams.length * 0.13));
        const offset =
          streams.length === 1 ? 0 : (streamIndex / (streams.length - 1) - 0.5) * spread;
        const streamAngle = angle + offset;
        const streamId = `stream:${stream.slug}`;
        nodes.set(streamId, {
          id: streamId,
          label: stream.name,
          ...point(streamAngle, 470, 356),
          kind: "stream",
          domain,
          stream,
          depth: 1,
        });
        links.push({ from: domainId, to: streamId, depth: 1 });

        // A guide hangs off its sub-stream where one exists, and off the L1
        // stream otherwise, so nothing is attached twice.
        const subStreams = subStreamsOf(stream.slug);
        const branches: Array<{ id: string; angle: number; depth: number; slug: string }> = [];

        subStreams.forEach((sub, subIndex) => {
          const subSpread = Math.min(0.5, Math.max(0.16, subStreams.length * 0.11));
          const subOffset =
            subStreams.length === 1 ? 0 : (subIndex / (subStreams.length - 1) - 0.5) * subSpread;
          const subAngle = streamAngle + subOffset;
          const subId = `stream:${sub.slug}`;
          nodes.set(subId, {
            id: subId,
            label: sub.name,
            ...point(subAngle, 585, 442),
            kind: "substream",
            domain,
            stream: sub,
            depth: 2,
          });
          links.push({ from: streamId, to: subId, depth: 2 });
          branches.push({ id: subId, angle: subAngle, depth: 3, slug: sub.slug });
        });

        branches.push({ id: streamId, angle: streamAngle, depth: 2, slug: stream.slug });

        branches.forEach((branch) => {
          const attached = guidesOnStream(branch.slug).filter((guide) => !placed.has(guide.slug));
          attached.forEach((guide, guideIndex) => {
            placed.add(guide.slug);
            const guideOffset = (guideIndex - (attached.length - 1) / 2) * 0.05;
            const radiusX = (branch.depth === 3 ? 690 : 620) + (guideIndex % 2) * 30;
            const radiusY = (branch.depth === 3 ? 522 : 470) + (guideIndex % 2) * 22;
            nodes.set(guide.slug, {
              id: guide.slug,
              label: guide.topic,
              ...point(branch.angle + guideOffset, radiusX, radiusY),
              kind: "guide",
              guide,
              domain,
              stream,
              depth: branch.depth,
            });
            links.push({ from: branch.id, to: guide.slug, depth: branch.depth });
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
const REPULSION_RANGE = 50;
const REPULSION = 0.003;
const ANCHOR_PULL = {
  domain: 0.009,
  cross: 0.009,
  stream: 0.007,
  substream: 0.006,
  guide: 0.0045,
} as const;
const DAMPING = 0.945;
const SWAY = { base: 0.11, leaf: 0.145 } as const;
const BOUNDS = { x: 735, y: 550 } as const;

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
        if (index === 0 || index === held) return;
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

    if (node.kind === "cross") {
      links
        .filter((link) => link.cross && link.from === node.id)
        .forEach((link) => {
          set.add(link.to);
          descend(link.to);
        });
      return set;
    }

    descend(active);
    ascend(active);

    if (node.kind === "guide" && node.guide) {
      considerationsOf(node.guide.slug).forEach((item) => set.add(`cross:${item}`));
    }
    return set;
  }, [active, graph, links, nodes]);

  const selected = active ? nodes.get(active) : undefined;
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
        ? 14
        : node.kind === "stream"
          ? 8
          : node.kind === "substream"
            ? 6
            : node.kind === "cross"
              ? 7
              : 4;
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
              ref={svgRef}
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
                  const inNetwork = active !== null && related.has(node.id);
                  const muted = active !== null && !inNetwork;
                  const tier =
                    node.kind === "domain"
                      ? "tier-1"
                      : node.kind === "stream"
                        ? "tier-2"
                        : node.kind === "substream"
                          ? "tier-2b"
                          : node.kind === "cross"
                            ? "cross-cutting"
                            : "tier-3";
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
                      if (dragRef.current?.moved) event.preventDefault();
                    },
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
