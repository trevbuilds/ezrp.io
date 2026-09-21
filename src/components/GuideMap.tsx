import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Crosshair, Minus, Plus } from "lucide-react";

import {
  allBusinessDomains,
  childrenOf,
  guides,
  guidesInStream,
  streamsInDomain,
  type BusinessDomain,
  type Guide,
  type ValueStream,
} from "@/content/guides";
import { Button } from "@/components/ui/button";

type MapNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  kind: "domain" | "stream" | "guide" | "cross";
  guide?: Guide;
  domain?: BusinessDomain;
  stream?: ValueStream;
};

type MapLink = {
  from: string;
  to: string;
  cross?: boolean;
};

/**
 * Bands are laid out across the full width, each given horizontal space in
 * proportion to how many streams it owns — the field guide's bands are very
 * uneven (Programmes, Projects & Data owns far more streams than the rest),
 * so fixed columns collapse the dense ones on top of each other.
 */
const MAP_WIDTH = 1680;

function useLayout() {
  return useMemo(() => {
    const nodes = new Map<string, MapNode>();
    const links: MapLink[] = [];

    const bandStreams = allBusinessDomains.map((domain) => streamsInDomain(domain));
    const totalStreams = bandStreams.reduce((sum, list) => sum + list.length, 0) || 1;

    let cursor = -MAP_WIDTH / 2;
    allBusinessDomains.forEach((domain, domainIndex) => {
      const streams = bandStreams[domainIndex] ?? [];
      const span = (streams.length / totalStreams) * MAP_WIDTH;
      const bandStart = cursor;
      const domainX = bandStart + span / 2;
      cursor += span;

      const domainId = `domain:${domain}`;
      nodes.set(domainId, {
        id: domainId,
        label: domain,
        x: domainX,
        y: -270,
        kind: "domain",
        domain,
      });
      links.push({ from: "core", to: domainId });

      streams.forEach((stream, streamIndex) => {
        const streamId = `stream:${stream}`;
        const streamX = bandStart + (span * (streamIndex + 0.5)) / streams.length;
        nodes.set(streamId, {
          id: streamId,
          label: stream,
          x: streamX,
          y: -35,
          kind: "stream",
          domain,
          stream,
        });
        links.push({ from: domainId, to: streamId });

        // Modules are represented by their band node, so only the topics
        // inside a stream are drawn here.
        const streamGuides = guidesInStream(stream).filter((guide) => guide.parent !== null);
        streamGuides.forEach((guide, guideIndex) => {
          const columns = Math.min(3, Math.max(1, streamGuides.length));
          const column = guideIndex % columns;
          const row = Math.floor(guideIndex / columns);
          const guideX = streamX + (column - (columns - 1) / 2) * 60;
          const guideY = 175 + row * 78;
          nodes.set(guide.slug, {
            id: guide.slug,
            label: guide.topic,
            x: guideX,
            y: guideY,
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

function linkPath(from: MapNode | undefined, to: MapNode | undefined) {
  if (!from || !to) return "";
  const bend = (from.y + to.y) / 2;
  return `M ${from.x} ${from.y} C ${from.x} ${bend}, ${to.x} ${bend}, ${to.x} ${to.y}`;
}

export function GuideMap() {
  const { nodes, links } = useLayout();
  const [active, setActive] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0.9);

  const related = useMemo(() => {
    if (!active) return new Set<string>();
    const set = new Set<string>([active, "core"]);
    const node = nodes.get(active);
    if (!node) return set;

    if (node.domain) set.add(`domain:${node.domain}`);
    if (node.stream) set.add(`stream:${node.stream}`);
    if (node.kind === "domain") {
      streamsInDomain(node.domain as BusinessDomain).forEach((stream) =>
        set.add(`stream:${stream}`),
      );
    }
    if (node.kind === "stream") {
      guidesInStream(node.stream as ValueStream).forEach((guide) => set.add(guide.slug));
    }
    if (node.kind === "cross") {
      allBusinessDomains.forEach((domain) => set.add(`domain:${domain}`));
    }
    return set;
  }, [active, nodes]);

  const selected = active ? nodes.get(active) : undefined;
  const isRelatedLink = (link: MapLink) => related.has(link.from) && related.has(link.to);

  const nodeMark = (node: MapNode) => {
    const radius =
      node.kind === "domain" ? 13 : node.kind === "stream" ? 9 : node.kind === "cross" ? 8 : 5;
    const labelY = node.kind === "guide" ? node.y + 19 : node.y + 27;
    return (
      <>
        <circle className="hit" cx={node.x} cy={node.y} r={22} />
        <circle className="visible" cx={node.x} cy={node.y} r={radius} />
        <text className="node-label" x={node.x} y={labelY} textAnchor="middle">
          {node.label.length > 26 ? `${node.label.slice(0, 24)}…` : node.label}
        </text>
      </>
    );
  };

  return (
    <div className="relative">
      <div className="guide-brain panel overflow-hidden rounded-lg">
        <div className="guide-brain__stage h-[36rem] cursor-grab active:cursor-grabbing md:h-[43rem]">
          <motion.div drag dragMomentum={false} className="size-full">
            <svg
              viewBox="-760 -430 1520 1180"
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
                {links.map((link) => {
                  const lit = isRelatedLink(link);
                  return (
                    <path
                      key={`${link.from}-${link.to}`}
                      d={linkPath(
                        link.from === "core"
                          ? { id: "core", label: "EZRP", x: 0, y: -405, kind: "domain" }
                          : nodes.get(link.from),
                        nodes.get(link.to),
                      )}
                      className={`${lit ? "is-active" : active ? "is-muted" : ""} ${link.cross ? "stroke-dasharray-[3_7]" : ""}`}
                    />
                  );
                })}
              </g>

              <g className="guide-brain__core">
                <circle cx={0} cy={-405} r={48} />
                <circle cx={0} cy={-405} r={59} />
                <text x={0} y={-400} textAnchor="middle">
                  EZRP
                </text>
              </g>

              <text
                x={-720}
                y={-305}
                className="fill-muted-foreground font-mono text-[11px] uppercase"
              >
                Bands
              </text>
              <text
                x={-720}
                y={-70}
                className="fill-muted-foreground font-mono text-[11px] uppercase"
              >
                Value streams
              </text>
              <text
                x={-720}
                y={130}
                className="fill-muted-foreground font-mono text-[11px] uppercase"
              >
                Guide topics
              </text>

              <g className="guide-brain__nodes">
                {[...nodes.values()].map((node) => {
                  const muted = active !== null && !related.has(node.id);
                  const className = `${node.kind === "domain" ? "tier-1" : node.kind === "stream" ? "tier-2" : "tier-3"} ${active === node.id ? "is-active" : muted ? "is-muted" : ""}`;
                  const content = nodeMark(node);
                  const handlers = {
                    onMouseEnter: () => setActive(node.id),
                    onFocus: () => setActive(node.id),
                    onMouseLeave: () => setActive(null),
                  };

                  if (node.kind === "domain") {
                    return (
                      <Link
                        key={node.id}
                        to="/guides"
                        search={{ domain: node.domain }}
                        className={className}
                        {...handlers}
                      >
                        {content}
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
                        {content}
                      </Link>
                    );
                  }
                  if (node.kind === "cross" && node.guide) {
                    return (
                      <Link
                        key={node.id}
                        to="/guides"
                        search={{ module: node.guide.slug }}
                        className={className}
                        {...handlers}
                      >
                        {content}
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
                        {content}
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
          onClick={() => setZoom((value) => Math.min(1.55, value + 0.12))}
          aria-label="Zoom in"
        >
          <Plus />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setZoom((value) => Math.max(0.55, value - 0.12))}
          aria-label="Zoom out"
        >
          <Minus />
        </Button>
        <Button variant="outline" size="icon" onClick={() => setZoom(0.9)} aria-label="Reset zoom">
          <Crosshair />
        </Button>
      </div>

      <div className="panel mt-3 rounded-lg p-4">
        {selected ? (
          <div>
            <p className="label-xs">
              {selected.kind === "cross" ? "Cross-cutting capability" : selected.kind}
            </p>
            <h3 className="mt-1 text-xl font-semibold">{selected.label}</h3>
            {selected.guide?.definition && (
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                {selected.guide.definition}
              </p>
            )}
            <p className="mt-3 font-mono text-xs text-accent">
              {selected.kind === "cross"
                ? "Shared across Customer · Finance · People · Asset · Supply Chain"
                : [selected.domain, selected.stream].filter(Boolean).join("  →  ")}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            EZRP is the core. Follow a business domain into its value streams and guide topics;
            shared capabilities connect across every domain.
          </p>
        )}
      </div>
    </div>
  );
}
