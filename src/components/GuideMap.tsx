import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Crosshair, Minus, Plus } from "lucide-react";

import { childrenOf, guideBySlug, guides, pillars, type Guide } from "@/content/guides";

type Node = {
  guide: Guide;
  x: number;
  y: number;
  tier: 1 | 2 | 3;
};

type MotionNode = Node & {
  vx: number;
  vy: number;
  anchorX: number;
  anchorY: number;
};

type DragState = {
  slug: string;
  pointerId: number;
  moved: boolean;
  startX: number;
  startY: number;
} | null;

const WIDTH = 1600;
const HEIGHT = 980;
const CENTRE_X = WIDTH / 2;
const CENTRE_Y = HEIGHT / 2;
const PILLAR_RADIUS_X = 470;
const PILLAR_RADIUS_Y = 285;

function seededOffset(slug: string, range: number) {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  return ((Math.abs(hash) % 1000) / 999 - 0.5) * range;
}

/**
 * A deterministic, clustered layout: pillars form the broad silhouette while
 * their descendants gather around them like connected areas of a living map.
 */
function useLayout() {
  return useMemo(() => {
    const nodes = new Map<string, Node>();
    const links: Array<[string, string]> = [];
    const orderedPillars = [...pillars].sort((a, b) => {
      const aWeight = childrenOf(a.slug).length;
      const bWeight = childrenOf(b.slug).length;
      return bWeight - aWeight;
    });

    orderedPillars.forEach((pillar, pillarIndex) => {
      const angle = -Math.PI / 2 + (pillarIndex / orderedPillars.length) * Math.PI * 2;
      const wobble = seededOffset(pillar.slug, 0.18);
      const pillarX = Math.round(CENTRE_X + Math.cos(angle + wobble) * PILLAR_RADIUS_X);
      const pillarY = Math.round(CENTRE_Y + Math.sin(angle + wobble) * PILLAR_RADIUS_Y);

      nodes.set(pillar.slug, { guide: pillar, x: pillarX, y: pillarY, tier: 1 });

      const children = childrenOf(pillar.slug);
      children.forEach((child, childIndex) => {
        const spread = children.length <= 1 ? 0 : (childIndex / (children.length - 1) - 0.5) * 1.5;
        const childAngle = angle + spread + seededOffset(child.slug, 0.14);
        const inward = 118 + (childIndex % 2) * 28;
        const lateral = seededOffset(`${child.slug}-lateral`, 44);
        const childX = Math.round(
          pillarX - Math.cos(angle) * inward + Math.cos(childAngle + Math.PI / 2) * lateral,
        );
        const childY = Math.round(
          pillarY - Math.sin(angle) * inward + Math.sin(childAngle + Math.PI / 2) * lateral,
        );

        nodes.set(child.slug, { guide: child, x: childX, y: childY, tier: 2 });
        links.push([pillar.slug, child.slug]);

        const grandchildren = childrenOf(child.slug);
        grandchildren.forEach((grandchild, grandchildIndex) => {
          const arc =
            grandchildren.length <= 1
              ? 0
              : (grandchildIndex / (grandchildren.length - 1) - 0.5) * 1.15;
          const grandchildAngle = childAngle + arc;
          const distance = 86 + (grandchildIndex % 3) * 16;
          const grandchildX = Math.round(childX - Math.cos(angle) * distance + Math.cos(grandchildAngle) * 24);
          const grandchildY = Math.round(childY - Math.sin(angle) * distance + Math.sin(grandchildAngle) * 24);

          nodes.set(grandchild.slug, {
            guide: grandchild,
            x: grandchildX,
            y: grandchildY,
            tier: 3,
          });
          links.push([child.slug, grandchild.slug]);
        });
      });
    });

    return { nodes: [...nodes.values()], links };
  }, []);
}

export function GuideMap() {
  const { nodes, links } = useLayout();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const nodeRefs = useRef(new Map<string, SVGGElement>());
  const linkRefs = useRef<Array<SVGPathElement | null>>([]);
  const signalRefs = useRef<Array<SVGPathElement | null>>([]);
  const positionsRef = useRef(
    new Map<string, MotionNode>(
      nodes.map((node) => [
        node.guide.slug,
        { ...node, vx: 0, vy: 0, anchorX: node.x, anchorY: node.y },
      ]),
    ),
  );
  const dragRef = useRef<DragState>(null);
  const activeRef = useRef<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [idleLinks, setIdleLinks] = useState<number[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [zoom, setZoom] = useState(1);

  const adjacency = useMemo(() => {
    const map = new Map<string, Set<string>>();
    nodes.forEach((node) => map.set(node.guide.slug, new Set()));
    links.forEach(([from, to]) => {
      map.get(from)?.add(to);
      map.get(to)?.add(from);
    });
    return map;
  }, [links, nodes]);

  const related = useMemo(() => {
    const set = new Set<string>();
    if (!active) return set;
    set.add(active);
    adjacency.get(active)?.forEach((slug) => set.add(slug));
    return set;
  }, [active, adjacency]);

  const selected = active ? guideBySlug.get(active) : undefined;
  const idleLinkSet = useMemo(() => new Set(idleLinks), [idleLinks]);
  const idleNodeSet = useMemo(() => {
    const set = new Set<string>();
    idleLinks.forEach((index) => {
      const link = links[index];
      if (!link) return;
      set.add(link[0]);
      set.add(link[1]);
    });
    return set;
  }, [idleLinks, links]);

  const activate = useCallback((slug: string | null) => {
    activeRef.current = slug;
    setActive(slug);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion || links.length === 0) {
      setIdleLinks([]);
      return;
    }
    const choose = () => {
      const count = Math.min(9, Math.max(4, Math.round(links.length * 0.1)));
      const start = Math.floor(Math.random() * links.length);
      setIdleLinks(Array.from({ length: count }, (_, index) => (start + index * 7) % links.length));
    };
    choose();
    const timer = window.setInterval(choose, 4800);
    return () => window.clearInterval(timer);
  }, [links, reducedMotion]);

  useEffect(() => {
    let frame = 0;
    let previous = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(2, (now - previous) / 16.667);
      previous = now;
      const positions = positionsRef.current;
      const dragged = dragRef.current?.slug;

      links.forEach(([from, to]) => {
        const source = positions.get(from);
        const target = positions.get(to);
        if (!source || !target) return;
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        const rest = Math.hypot(source.anchorX - target.anchorX, source.anchorY - target.anchorY);
        const force = (distance - rest) * 0.004 * dt;
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;
        if (from !== dragged) {
          source.vx += fx;
          source.vy += fy;
        }
        if (to !== dragged) {
          target.vx -= fx;
          target.vy -= fy;
        }
      });

      nodes.forEach((node, index) => {
        const position = positions.get(node.guide.slug);
        if (!position || node.guide.slug === dragged) return;
        const pull = node.tier === 1 ? 0.012 : node.tier === 2 ? 0.008 : 0.005;
        position.vx += (position.anchorX - position.x) * pull * dt;
        position.vy += (position.anchorY - position.y) * pull * dt;
        if (!reducedMotion) {
          const drift = node.tier === 3 ? 0.038 : 0.027;
          position.vx += Math.sin(now * 0.00038 + index * 1.71) * drift * dt;
          position.vy += Math.cos(now * 0.00033 + index * 2.09) * drift * dt;
        }
        position.vx *= 0.94;
        position.vy *= 0.94;
        position.x += position.vx * dt;
        position.y += position.vy * dt;
        position.x = Math.min(WIDTH - 110, Math.max(110, position.x));
        position.y = Math.min(HEIGHT - 75, Math.max(75, position.y));
      });

      positions.forEach((position, slug) => {
        nodeRefs.current.get(slug)?.setAttribute(
          "transform",
          `translate(${position.x.toFixed(2)} ${position.y.toFixed(2)})`,
        );
      });

      links.forEach(([from, to], index) => {
        const source = positions.get(from);
        const target = positions.get(to);
        if (!source || !target) return;
        const bend = (source.tier === 1 ? 0.09 : 0.05) * (index % 2 === 0 ? 1 : -1);
        const midX = (source.x + target.x) / 2 - (target.y - source.y) * bend;
        const midY = (source.y + target.y) / 2 + (target.x - source.x) * bend;
        const path = `M ${source.x.toFixed(2)} ${source.y.toFixed(2)} Q ${midX.toFixed(2)} ${midY.toFixed(2)} ${target.x.toFixed(2)} ${target.y.toFixed(2)}`;
        linkRefs.current[index]?.setAttribute("d", path);
        signalRefs.current[index]?.setAttribute("d", path);
      });

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [links, nodes, reducedMotion]);

  const pointerPosition = (event: ReactPointerEvent<SVGGElement>) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!matrix) return null;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    return { x: point.x, y: point.y };
  };

  const startNodeDrag = (slug: string, event: ReactPointerEvent<SVGGElement>) => {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      slug,
      pointerId: event.pointerId,
      moved: false,
      startX: event.clientX,
      startY: event.clientY,
    };
    activate(slug);
    setDragging(slug);
  };

  const moveNodeDrag = (event: ReactPointerEvent<SVGGElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const point = pointerPosition(event);
    const position = positionsRef.current.get(drag.slug);
    if (!point || !position) return;
    if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 4) drag.moved = true;
    position.x = point.x;
    position.y = point.y;
    position.vx = 0;
    position.vy = 0;
  };

  const endNodeDrag = (event: ReactPointerEvent<SVGGElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const position = positionsRef.current.get(drag.slug);
    if (position && drag.moved) {
      position.anchorX = position.x;
      position.anchorY = position.y;
    }
    setDragging(null);
  };

  const resetMap = () => {
    setZoom(1);
    positionsRef.current.forEach((position) => {
      position.anchorX = position.guide ? nodes.find((node) => node.guide.slug === position.guide.slug)?.x ?? position.x : position.x;
      position.anchorY = position.guide ? nodes.find((node) => node.guide.slug === position.guide.slug)?.y ?? position.y : position.y;
    });
  };

  return (
    <div className="relative">
      <div className="panel guide-brain overflow-hidden rounded-lg">
        <div className="guide-brain__stage h-[34rem] cursor-grab active:cursor-grabbing md:h-[42rem]">
          <motion.div drag dragMomentum={false} className="size-full">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
              className="size-full"
              style={{ transform: `scale(${zoom})` }}
              role="img"
              aria-label="Interactive map of ERP pillars, guides and workflow topics"
            >
              <defs>
                <filter id="guide-brain-glow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <g className="guide-brain__links">
                {links.map(([from, to], index) => {
                  const lit = related.has(from) && related.has(to);
                  return (
                    <path
                      key={`${from}-${to}`}
                      ref={(element) => {
                        linkRefs.current[index] = element;
                      }}
                      className={`${lit ? "is-active" : ""}${active && !lit ? " is-muted" : ""}`}
                    />
                  );
                })}
              </g>

              <g className="guide-brain__signals" aria-hidden="true">
                {links.map(([from, to], index) => {
                  const lit = related.has(from) && related.has(to);
                  return (
                    <path
                      key={`signal-${from}-${to}`}
                      ref={(element) => {
                        signalRefs.current[index] = element;
                      }}
                      pathLength="1"
                      className={`${lit ? "is-active" : ""}${!active && idleLinkSet.has(index) ? " is-idle" : ""}`}
                    />
                  );
                })}
              </g>

              <g className="guide-brain__core" aria-hidden="true">
                <circle cx={CENTRE_X} cy={CENTRE_Y} r="25" />
                <circle cx={CENTRE_X} cy={CENTRE_Y} r="44" />
                <text x={CENTRE_X} y={CENTRE_Y} dy="0.34em" textAnchor="middle">
                  EZRP
                </text>
              </g>

              <g className="guide-brain__nodes">
                {nodes.map((node) => {
                  const slug = node.guide.slug;
                  const isActive = related.has(slug);
                  const isSelected = active === slug;
                  const isIdle = !active && idleNodeSet.has(slug);
                  const isMuted = active !== null && !isActive;
                  const hasKids = childrenOf(slug).length > 0;
                  const radius = node.tier === 1 ? 9 : node.tier === 2 ? 6 : 3.8;
                  const outward = node.x >= CENTRE_X;
                  const label =
                    node.guide.topic.length > 34
                      ? `${node.guide.topic.slice(0, 32)}…`
                      : node.guide.topic;
                  const mark = (
                    <>
                      <circle className="hit" r={node.tier === 3 ? 13 : 17} />
                      {isSelected && <circle className="focus-ring" r={radius + 8} />}
                      <circle className="visible" r={radius} />
                      <text
                        className="node-label"
                        x={outward ? radius + 10 : -(radius + 10)}
                        y={node.tier === 3 ? -4 : 0}
                        dy="0.34em"
                        textAnchor={outward ? "start" : "end"}
                      >
                        {label}
                      </text>
                    </>
                  );

                  return (
                    <g
                      key={slug}
                      ref={(element) => {
                        if (element) nodeRefs.current.set(slug, element);
                        else nodeRefs.current.delete(slug);
                      }}
                      transform={`translate(${node.x} ${node.y})`}
                      className={`tier-${node.tier}${isActive ? " is-active" : ""}${isSelected ? " is-selected" : ""}${isMuted ? " is-muted" : ""}${isIdle ? " is-idle" : ""}${dragging === slug ? " is-dragging" : ""}`}
                      role="button"
                      tabIndex={node.tier === 3 ? -1 : 0}
                      aria-label={`${node.guide.topic}. ${node.guide.definition ?? "Guide topic"}`}
                      onFocus={() => activate(slug)}
                      onBlur={() => {
                        if (!dragRef.current) activate(null);
                      }}
                      onPointerEnter={() => {
                        if (!dragRef.current) activate(slug);
                      }}
                      onPointerLeave={() => {
                        if (!dragRef.current) activate(null);
                      }}
                      onPointerDown={(event) => startNodeDrag(slug, event)}
                      onPointerMove={moveNodeDrag}
                      onPointerUp={endNodeDrag}
                      onPointerCancel={endNodeDrag}
                      onClick={(event) => {
                        if (dragRef.current?.moved) event.preventDefault();
                        dragRef.current = null;
                      }}
                    >
                      {hasKids ? (
                        <Link to="/guides" search={{ module: slug }}>
                          {mark}
                        </Link>
                      ) : (
                        <Link to="/guides/$slug" params={{ slug }}>
                          {mark}
                        </Link>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>
          </motion.div>
        </div>
      </div>

      <div className="absolute right-3 top-3 flex flex-col gap-1">
        {[
          { icon: Plus, action: () => setZoom((value) => Math.min(1.55, value + 0.12)), label: "Zoom in" },
          { icon: Minus, action: () => setZoom((value) => Math.max(0.72, value - 0.12)), label: "Zoom out" },
          { icon: Crosshair, action: resetMap, label: "Reset map" },
        ].map(({ icon: Icon, action, label }) => (
          <button
            key={label}
            type="button"
            onClick={action}
            aria-label={label}
            title={label}
            className="panel rounded p-2 text-muted-foreground transition hover:text-foreground"
          >
            <Icon className="size-4" />
          </button>
        ))}
      </div>

      <div className="panel mt-3 min-h-32 rounded-lg p-4" aria-live="polite">
        {selected ? (
          <div className="animate-fade-in">
            <p className="label-xs">
              {selected.parent ? guideBySlug.get(selected.parent)?.topic : "Top-level pillar"}
            </p>
            <h3 className="mt-1 text-xl font-semibold">{selected.topic}</h3>
            {selected.definition && (
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{selected.definition}</p>
            )}
            {selected.workflow.length > 0 && (
              <p className="mt-3 font-mono text-xs text-accent">
                {selected.workflow.join("  →  ")}
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <Link
                to="/guides/$slug"
                params={{ slug: selected.slug }}
                className="text-sm font-semibold text-primary hover:underline"
              >
                Open guide →
              </Link>
              {childrenOf(selected.slug).length > 0 && (
                <Link
                  to="/guides"
                  search={{ module: selected.slug }}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Browse this area
                </Link>
              )}
              {selected.domain && (
                <Link
                  to="/guides"
                  search={{ domain: selected.domain }}
                  className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground hover:brightness-110"
                >
                  {selected.domain}
                </Link>
              )}
              {selected.valueStream && (
                <Link
                  to="/guides"
                  search={{ stream: selected.valueStream }}
                  className="rounded-full border border-primary px-2 py-0.5 text-xs text-primary hover:brightness-110"
                >
                  {selected.valueStream}
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div>
            <p className="label-xs">Living ERP map</p>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Hover a node to trace its immediate connections. Drag a node to test the network, or
              open it to explore the guide. {guides.length} guides mapped.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
