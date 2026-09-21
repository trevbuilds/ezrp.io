import { useMemo, useState } from "react";
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
        const offset = streams.length === 1 ? 0 : (streamIndex / (streams.length - 1) - 0.5) * spread;
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

function linkPath(from: MapNode | undefined, to: MapNode | undefined, cross = false) {
  if (!from || !to) return "";
  if (cross) {
    const bendX = (from.x + to.x) * 0.34;
    const bendY = (from.y + to.y) * 0.34;
    return `M ${from.x} ${from.y} Q ${bendX} ${bendY}, ${to.x} ${to.y}`;
  }
  return `M ${from.x} ${from.y} Q ${(from.x + to.x) * 0.46} ${(from.y + to.y) * 0.46}, ${to.x} ${to.y}`;
}

const coreNode: MapNode = { id: "core", label: "EZRP", x: 0, y: 0, kind: "domain" };

export function GuideMap() {
  const { nodes, links } = useLayout();
  const [active, setActive] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0.86);

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
    const radius = node.kind === "domain" ? 14 : node.kind === "stream" ? 8 : node.kind === "cross" ? 7 : 4;
    const labelY = node.kind === "guide" ? node.y + 17 : node.y + 25;
    return (
      <>
        <circle className="hit" cx={node.x} cy={node.y} r={23} />
        {node.kind === "domain" && <circle className="orbit" cx={node.x} cy={node.y} r={23} />}
        <circle className="visible" cx={node.x} cy={node.y} r={radius} />
        <text className="node-label" x={node.x} y={labelY} textAnchor="middle">
          {node.label.length > 27 ? `${node.label.slice(0, 25)}…` : node.label}
        </text>
      </>
    );
  };

  return (
    <div className="relative">
      <div className="guide-brain panel overflow-hidden rounded-lg">
        <div className="guide-brain__legend absolute left-4 top-4 z-10 hidden items-center gap-4 font-mono text-[0.625rem] uppercase text-muted-foreground md:flex">
          <span><i className="bg-primary" /> Domain</span>
          <span><i className="bg-accent" /> Value stream</span>
          <span><i className="bg-foreground" /> Guide</span>
          <span><i className="border border-primary" /> Shared concern</span>
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
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              <g className="guide-brain__links">
                {links.map((link) => (
                  <path
                    key={`${link.from}-${link.to}`}
                    d={linkPath(link.from === "core" ? coreNode : nodes.get(link.from), nodes.get(link.to), link.cross)}
                    className={`${link.cross ? "is-cross" : ""} ${isRelatedLink(link) ? "is-active" : active ? "is-muted" : ""}`}
                  />
                ))}
              </g>
              <g className="guide-brain__signals">
                {links.filter((_, index) => index % 5 === 0).map((link, index) => (
                  <path
                    key={`signal-${link.from}-${link.to}`}
                    d={linkPath(link.from === "core" ? coreNode : nodes.get(link.from), nodes.get(link.to), link.cross)}
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
                <text x={0} y={5} textAnchor="middle">EZRP</text>
              </g>

              <g className="guide-brain__nodes">
                {[...nodes.values()].map((node) => {
                  const muted = active !== null && !related.has(node.id);
                  const className = `${node.kind === "domain" ? "tier-1" : node.kind === "stream" ? "tier-2" : node.kind === "cross" ? "cross-cutting" : "tier-3"} ${active === node.id ? "is-active" : muted ? "is-muted" : ""}`;
                  const handlers = {
                    onMouseEnter: () => setActive(node.id),
                    onFocus: () => setActive(node.id),
                    onMouseLeave: () => setActive(null),
                    onBlur: () => setActive(null),
                  };

                  if (node.kind === "domain") {
                    return <Link key={node.id} to="/guides" search={{ domain: node.domain }} className={className} {...handlers}>{nodeMark(node)}</Link>;
                  }
                  if (node.kind === "stream") {
                    return <Link key={node.id} to="/guides" search={{ stream: node.stream }} className={className} {...handlers}>{nodeMark(node)}</Link>;
                  }
                  if (node.kind === "cross") {
                    return <Link key={node.id} to="/guides" search={{ q: node.consideration }} className={className} {...handlers}>{nodeMark(node)}</Link>;
                  }
                  if (node.guide) {
                    return <Link key={node.id} to="/guides/$slug" params={{ slug: node.guide.slug }} className={className} {...handlers}>{nodeMark(node)}</Link>;
                  }
                  return null;
                })}
              </g>
            </svg>
          </motion.div>
        </div>
      </div>

      <div className="absolute right-3 top-3 flex flex-col gap-1">
        <Button variant="outline" size="icon" onClick={() => setZoom((value) => Math.min(1.35, value + 0.1))} aria-label="Zoom in"><Plus /></Button>
        <Button variant="outline" size="icon" onClick={() => setZoom((value) => Math.max(0.55, value - 0.1))} aria-label="Zoom out"><Minus /></Button>
        <Button variant="outline" size="icon" onClick={() => setZoom(0.86)} aria-label="Reset zoom"><Crosshair /></Button>
      </div>

      <div className="panel mt-3 min-h-28 rounded-lg p-4">
        {selected ? (
          <div>
            <p className="label-xs">{selected.kind === "cross" ? "Cross-cutting concern" : selected.kind}</p>
            <h3 className="mt-1 text-xl font-semibold">{selected.label}</h3>
            {selected.guide?.definition && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{selected.guide.definition}</p>}
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
              EZRP is the core. Business domains orbit it, value streams branch outward, and practical guides sit at the edge. The inner shared concerns connect across every area they influence.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}