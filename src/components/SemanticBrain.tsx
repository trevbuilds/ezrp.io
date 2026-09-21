import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Link } from "@tanstack/react-router";

import {
  brainLinks as semanticLinks,
  brainNodes as semanticNodes,
  tierLabels,
  type BrainTier,
} from "@/content/brain-graph";
import "./semantic-brain.css";

type MotionNode = { x: number; y: number; vx: number; vy: number };
type DragState = { index: number; pointerId: number } | null;

const radiusByTier: Record<BrainTier, number> = {
  enterprise: 2.8,
  capability: 2.3,
  stream: 1.8,
  element: 1.2,
};

export function SemanticBrain({ embedded = true }: { embedded?: boolean } = {}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const nodeRefs = useRef<Array<SVGGElement | null>>([]);
  const linkRefs = useRef<Array<SVGLineElement | null>>([]);
  const pulseLinkRefs = useRef<Array<SVGLineElement | null>>([]);
  const activeLinkRefs = useRef<Array<SVGLineElement | null>>([]);
  const positionsRef = useRef<MotionNode[]>(
    semanticNodes.map((node) => ({ x: node.x, y: node.y, vx: 0, vy: 0 })),
  );
  const anchorsRef = useRef(semanticNodes.map((node) => ({ x: node.x, y: node.y })));
  const dragRef = useRef<DragState>(null);
  const activeIndexRef = useRef<number | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const indexById = useMemo(
    () => new Map(semanticNodes.map((node, index) => [node.id, index])),
    [],
  );
  const indexedLinks = useMemo(
    () =>
      semanticLinks.flatMap((link) => {
        const source = indexById.get(link.source);
        const target = indexById.get(link.target);
        if (source === undefined || target === undefined) return [];
        const a = semanticNodes[source];
        const b = semanticNodes[target];
        if (!a || !b) return [];
        return [{ ...link, source, target, rest: Math.hypot(a.x - b.x, a.y - b.y) }];
      }),
    [indexById],
  );

  const adjacency = useMemo(() => {
    const incoming = semanticNodes.map(() => [] as number[]);
    const outgoing = semanticNodes.map(() => [] as number[]);
    indexedLinks.forEach((link) => {
      outgoing[link.source]?.push(link.target);
      incoming[link.target]?.push(link.source);
    });
    return { incoming, outgoing };
  }, [indexedLinks]);

  const activeNetwork = useMemo(() => {
    const selected = activeId ? indexById.get(activeId) : undefined;
    const nodes = new Set<number>();
    const links = new Set<number>();
    if (selected === undefined) return { nodes, links };
    nodes.add(selected);
    adjacency.incoming[selected]?.forEach((index) => nodes.add(index));
    adjacency.outgoing[selected]?.forEach((index) => nodes.add(index));
    indexedLinks.forEach((link, index) => {
      if (link.source === selected || link.target === selected) links.add(index);
    });
    return { nodes, links };
  }, [activeId, adjacency, indexById, indexedLinks]);

  const activeNode = activeId ? semanticNodes[indexById.get(activeId) ?? -1] : undefined;
  const activeStream = activeNode?.tier === "stream" ? activeNode.id : activeNode?.streamId;
  const selectedIndex = activeId ? (indexById.get(activeId) ?? -1) : -1;

  const [idleLinks, setIdleLinks] = useState<number[]>([]);

  useEffect(() => {
    if (reducedMotion || indexedLinks.length === 0) {
      setIdleLinks([]);
      return;
    }
    const previous = new Set<number>();
    const pick = () => {
      const count = 6 + Math.floor(Math.random() * 6);
      const picked = new Set<number>();
      // carry over roughly half of the previous set for continuity
      const kept = [...previous]
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(previous.size * 0.55));
      kept.forEach((index) => picked.add(index));
      while (picked.size < count) picked.add(Math.floor(Math.random() * indexedLinks.length));
      previous.clear();
      picked.forEach((index) => previous.add(index));
      setIdleLinks([...picked]);
    };
    pick();
    const timer = window.setInterval(pick, 5200);
    return () => window.clearInterval(timer);
  }, [indexedLinks, reducedMotion]);

  const idleLinkSet = useMemo(() => new Set(idleLinks), [idleLinks]);
  const idleNodeSet = useMemo(() => {
    const nodes = new Set<number>();
    idleLinks.forEach((index) => {
      const link = indexedLinks[index];
      if (!link) return;
      nodes.add(link.source);
      nodes.add(link.target);
    });
    return nodes;
  }, [idleLinks, indexedLinks]);

  const activate = useCallback((index: number | null) => {
    activeIndexRef.current = index;
    setActiveId(index === null ? null : (semanticNodes[index]?.id ?? null));
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [expanded]);

  useEffect(() => {
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(2, (now - previous) / 16.667);
      previous = now;
      const positions = positionsRef.current;
      const dragged = dragRef.current?.index;
      const active = activeIndexRef.current;
      const local = new Set<number>();
      if (dragged !== undefined) {
        local.add(dragged);
        adjacency.incoming[dragged]?.forEach((index) => local.add(index));
        adjacency.outgoing[dragged]?.forEach((index) => local.add(index));
      } else if (active !== null) {
        local.add(active);
        adjacency.incoming[active]?.forEach((index) => local.add(index));
        adjacency.outgoing[active]?.forEach((index) => local.add(index));
      }

      indexedLinks.forEach((link) => {
        const source = positions[link.source];
        const target = positions[link.target];
        if (!source || !target) return;
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        const force = (distance - link.rest) * 0.007 * dt;
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;
        if (link.source !== dragged) {
          source.vx += fx;
          source.vy += fy;
        }
        if (link.target !== dragged) {
          target.vx -= fx;
          target.vy -= fy;
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
          const range = 20;
          if (distanceSq < 1 || distanceSq > range * range) continue;
          const distance = Math.sqrt(distanceSq);
          const force = (range - distance) * 0.003 * dt;
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          if (a !== dragged) {
            first.vx -= fx;
            first.vy -= fy;
          }
          if (b !== dragged) {
            second.vx += fx;
            second.vy += fy;
          }
        }
      }

      positions.forEach((position, index) => {
        const authored = semanticNodes[index];
        const anchor = anchorsRef.current[index];
        if (!authored || !anchor || index === dragged) return;
        const tierAnchor =
          authored.tier === "enterprise" ? 0.009 : authored.tier === "capability" ? 0.007 : 0.0045;
        position.vx += (anchor.x - position.x) * tierAnchor * dt;
        position.vy += (anchor.y - position.y) * tierAnchor * dt;
        if (!reducedMotion) {
          const idle = authored.tier === "element" ? 0.058 : 0.044;
          position.vx += Math.sin(now * 0.00046 + index * 1.618) * idle * dt;
          position.vy += Math.cos(now * 0.00041 + index * 2.113) * idle * dt;
          position.vx += Math.sin(now * 0.00019 + index * 0.731) * idle * 0.7 * dt;
          position.vy += Math.cos(now * 0.00023 + index * 1.114) * idle * 0.7 * dt;
        }
        const damping = 0.945;
        position.vx *= damping;
        position.vy *= damping;
        position.x += position.vx * dt;
        position.y += position.vy * dt;
        if (!Number.isFinite(position.x) || !Number.isFinite(position.y)) {
          position.x = authored.x;
          position.y = authored.y;
          position.vx = 0;
          position.vy = 0;
        }
        position.x = Math.min(675, Math.max(45, position.x));
        position.y = Math.min(465, Math.max(35, position.y));
      });

      nodeRefs.current.forEach((element, index) => {
        const position = positions[index];
        if (element && position)
          element.setAttribute(
            "transform",
            `translate(${position.x.toFixed(2)} ${position.y.toFixed(2)})`,
          );
      });
      linkRefs.current.forEach((element, index) => {
        const link = indexedLinks[index];
        const source = link ? positions[link.source] : undefined;
        const target = link ? positions[link.target] : undefined;
        if (!element || !source || !target) return;
        element.setAttribute("x1", source.x.toFixed(2));
        element.setAttribute("y1", source.y.toFixed(2));
        element.setAttribute("x2", target.x.toFixed(2));
        element.setAttribute("y2", target.y.toFixed(2));
      });
      pulseLinkRefs.current.forEach((element, index) => {
        const link = indexedLinks[index];
        const source = link ? positions[link.source] : undefined;
        const target = link ? positions[link.target] : undefined;
        if (!element || !source || !target) return;
        element.setAttribute("x1", source.x.toFixed(2));
        element.setAttribute("y1", source.y.toFixed(2));
        element.setAttribute("x2", target.x.toFixed(2));
        element.setAttribute("y2", target.y.toFixed(2));
      });
      activeLinkRefs.current.forEach((element, index) => {
        const link = indexedLinks[index];
        const source = link ? positions[link.source] : undefined;
        const target = link ? positions[link.target] : undefined;
        if (!element || !source || !target) return;
        element.setAttribute("x1", source.x.toFixed(2));
        element.setAttribute("y1", source.y.toFixed(2));
        element.setAttribute("x2", target.x.toFixed(2));
        element.setAttribute("y2", target.y.toFixed(2));
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [adjacency, indexedLinks, reducedMotion]);

  const pointerPosition = (event: ReactPointerEvent<SVGGElement>) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const matrix = svg.getScreenCTM();
    if (!matrix) return null;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    return { x: point.x, y: point.y };
  };

  const startDrag = (index: number, event: ReactPointerEvent<SVGGElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { index, pointerId: event.pointerId };
    activate(index);
    setDraggingId(semanticNodes[index]?.id ?? null);
    const point = pointerPosition(event);
    const position = positionsRef.current[index];
    if (point && position) {
      position.x = point.x;
      position.y = point.y;
      position.vx = 0;
      position.vy = 0;
    }
  };

  const moveDrag = (event: ReactPointerEvent<SVGGElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const point = pointerPosition(event);
    const position = positionsRef.current[drag.index];
    if (point && position) {
      position.x = point.x;
      position.y = point.y;
      position.vx = 0;
      position.vy = 0;
    }
  };

  const endDrag = (event: ReactPointerEvent<SVGGElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    const position = positionsRef.current[drag.index];
    const anchor = anchorsRef.current[drag.index];
    if (position && anchor) {
      anchor.x = position.x;
      anchor.y = position.y;
      position.vx = 0;
      position.vy = 0;
    }
    dragRef.current = null;
    setDraggingId(null);
  };

  return (
    <section
      className={`brain-prototype${embedded ? " brain-prototype--embedded" : ""}${expanded ? " brain-prototype--expanded" : ""}`}
      aria-labelledby={embedded ? undefined : "brain-prototype-title"}
      aria-label={embedded ? "Interactive enterprise systems map" : undefined}
    >
      {embedded ? null : (
        <div className="brain-prototype__topbar">
          <div>
            <p className="brain-prototype__brand">
              Clariti<span>.</span>
            </p>
            <h1 id="brain-prototype-title">Enterprise clarity, in motion.</h1>
          </div>
          <p className="brain-prototype__instruction">Hover to trace · Drag to test the system</p>
        </div>
      )}

      {embedded ? (
        <div className="brain-prototype__embedded-heading">
          <p className="brain-prototype__embedded-lead">
            <button
              type="button"
              className="brain-prototype__expand"
              aria-expanded={expanded}
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? "Collapse" : "Expand"}
            </button>
            <span>
              {" "}
              the map. Hover to trace a chain, drag a node to test the system, click to open it.
            </span>
          </p>
        </div>
      ) : null}
      {expanded ? (
        <button
          type="button"
          className="brain-prototype__collapse"
          onClick={() => setExpanded(false)}
        >
          Collapse map ✕
        </button>
      ) : null}
      <div className="brain-prototype__stage">
        <svg
          ref={svgRef}
          viewBox="56 36 604 424"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Interactive map of EZRP bands, modules, value streams and guides"
        >
          <defs>
            <filter id="prototype-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g className="brain-prototype__links">
            {indexedLinks.map((link, index) => (
              <line
                key={link.id}
                ref={(element) => {
                  linkRefs.current[index] = element;
                }}
                className={`${link.kind} ${activeId && !activeNetwork.links.has(index) ? "is-muted" : ""}`}
              />
            ))}
          </g>
          <g className="brain-prototype__pulse-links">
            {indexedLinks.map((link, index) => (
              <line
                key={`pulse-${link.id}`}
                ref={(element) => {
                  pulseLinkRefs.current[index] = element;
                }}
                pathLength="1"
                className={`${link.kind}${!activeId && idleLinkSet.has(index) ? " is-idle-lit" : ""}`}
              />
            ))}
          </g>
          <g className="brain-prototype__active-links">
            {indexedLinks.map((link, index) =>
              activeNetwork.links.has(index) ? (
                <line
                  key={`active-${link.id}`}
                  ref={(element) => {
                    activeLinkRefs.current[index] = element;
                  }}
                  className="is-active-fill"
                  pathLength="1"
                />
              ) : null,
            )}
          </g>
          <g className="brain-prototype__nodes">
            {semanticNodes.map((node, index) => {
              const active = activeNetwork.nodes.has(index);
              const isSelected = index === selectedIndex;
              const related = active && !isSelected;
              const showDetailLabel =
                node.tier !== "element" || (activeStream && node.streamId === activeStream);
              const body = (
                <>
                  <circle className="hit" r={node.tier === "element" ? 7 : 12} />
                  <circle className="visible" r={radiusByTier[node.tier]} />
                  <text
                    className={`node-label${showDetailLabel ? " is-shown" : ""}`}
                    x={node.x > 540 ? -10 : 10}
                    y={node.tier === "element" ? -6 : -9}
                    textAnchor={node.x > 540 ? "end" : "start"}
                  >
                    {node.label}
                  </text>
                </>
              );
              return (
                <g
                  key={node.id}
                  ref={(element) => {
                    nodeRefs.current[index] = element;
                  }}
                  className={`${node.tier} ${active ? "is-active" : ""} ${related ? "is-related" : ""} ${activeId && !active ? "is-muted" : ""} ${!activeId && idleNodeSet.has(index) ? "is-idle-lit" : ""} ${draggingId === node.id ? "is-dragging" : ""}`}
                  tabIndex={node.tier === "element" ? -1 : 0}
                  role="button"
                  aria-label={`${tierLabels.find(({ tier }) => tier === node.tier)?.label}: ${node.label}. ${node.description}`}
                  onFocus={() => activate(index)}
                  onBlur={() => {
                    if (!dragRef.current) activate(null);
                  }}
                  onPointerOver={() => {
                    if (!dragRef.current) activate(index);
                  }}
                  onPointerLeave={() => {
                    if (!dragRef.current) activate(null);
                  }}
                  onPointerDown={(event) => startDrag(index, event)}
                  onPointerMove={moveDrag}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                >
                  {node.href ? (
                    <Link
                      to={node.href.to}
                      {...(node.href.params ? { params: node.href.params } : {})}
                      {...(node.href.search ? { search: node.href.search } : {})}
                      onClick={(event) => {
                        if (dragRef.current) event.preventDefault();
                      }}
                    >
                      {body}
                    </Link>
                  ) : (
                    body
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <div className="brain-prototype__footer">
        <div className="brain-prototype__context" aria-live="polite">
          {activeNode ? (
            <div key={activeNode.id} className="brain-prototype__context-inner">
              <strong>
                {activeNode.label}{" "}
                <small>({tierLabels.find(({ tier }) => tier === activeNode.tier)?.label})</small>
              </strong>
              <span>{activeNode.description}</span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
