/**
 * EZRP's content in the Clariti brain's graph shape.
 *
 * The brain is a four-tier semantic graph: enterprise elements largest,
 * business capabilities beneath them, value streams beneath those, and process
 * elements smallest and most numerous. Every node carries a meaning and every
 * line is a real relationship.
 *
 * EZRP maps onto it cleanly, which is why the replica works:
 *
 *   enterprise   the eight bands
 *   capability   the twelve modules
 *   stream       the value streams, L1 and L2
 *   element      guides and their workflow steps
 *
 * The hand-placed coordinates are Clariti's own, so the silhouette is
 * identical. Anything beyond the positions they authored is generated into the
 * same brain mask with the same Halton scatter.
 *
 * The one thing that makes it read as a brain rather than a dust cloud is the
 * many-to-many links: a capability answers to several enterprise elements, and
 * a stream to several capabilities. EZRP has that natively — a stream crosses
 * every module its work happens in — so the web is real rather than styled.
 */

import { guides } from "./guides";
import { allBands, bandOfModule, streams as modelStreams, subStreamsOf } from "./model";

export type BrainTier = "enterprise" | "capability" | "stream" | "element";

export type BrainNode = {
  id: string;
  label: string;
  description: string;
  tier: BrainTier;
  x: number;
  y: number;
  parents: string[];
  streamId?: string;
  /** Where clicking the node goes. */
  href?: { to: string; params?: Record<string, string>; search?: Record<string, string> };
};

export type BrainLink = {
  id: string;
  source: string;
  target: string;
  kind: "enables" | "flow" | "sequence" | "dependency";
};

/** Clariti's authored positions, kept exactly. */
const ENTERPRISE: Array<[number, number]> = [
  [133, 146],
  [272, 77],
  [356, 224],
  [588, 164],
  [604, 290],
  [466, 389],
  [280, 417],
  [116, 319],
];
const CAPABILITY: Array<[number, number]> = [
  [205, 133],
  [227, 211],
  [342, 118],
  [424, 151],
  [518, 143],
  [556, 220],
  [501, 276],
  [536, 329],
  [437, 285],
  [385, 349],
  [329, 306],
  [275, 335],
  [198, 292],
  [294, 223],
  [211, 175],
  [153, 245],
];
const STREAM: Array<[number, number]> = [
  [188, 101],
  [181, 351],
  [576, 132],
  [535, 263],
  [365, 384],
  [449, 121],
  [452, 238],
  [330, 350],
  [132, 274],
  [190, 189],
  [327, 151],
  [242, 289],
];

function halton(value: number, base: number) {
  let result = 0;
  let fraction = 1;
  let current = value;
  while (current > 0) {
    fraction /= base;
    result += fraction * (current % base);
    current = Math.floor(current / base);
  }
  return result;
}

/** The silhouette: crown, frontal, temporal, rear and stem, less the cuts. */
function insideBrain(x: number, y: number) {
  const crown = ((x - 340) / 250) ** 2 + ((y - 200) / 155) ** 2 < 1;
  const frontal = ((x - 548) / 112) ** 2 + ((y - 222) / 132) ** 2 < 1;
  const temporal = ((x - 382) / 194) ** 2 + ((y - 333) / 92) ** 2 < 1;
  const rear = ((x - 130) / 78) ** 2 + ((y - 238) / 126) ** 2 < 1;
  const stem = ((x - 314) / 58) ** 2 + ((y - 407) / 78) ** 2 < 1;
  const faceCut = x > 596 && y > 262 + (x - 596) * 0.36;
  const lowerCut = y > 443 - Math.max(0, x - 265) * 0.035;
  const fissure = x > 450 && y > 320 && y < 337 + (560 - x) * 0.16;
  return (crown || frontal || temporal || rear || stem) && !faceCut && !lowerCut && !fissure;
}

function buildGraph() {
  const nodes: BrainNode[] = [];
  const moduleSlugs = Object.keys(Object.fromEntries(allBands.flatMap(() => []).concat()));

  // --- enterprise: the eight bands, on Clariti's own eight positions
  allBands.forEach((band, index) => {
    const at = ENTERPRISE[index] ?? [340, 200];
    nodes.push({
      id: `band:${band}`,
      label: band,
      description: `One of the eight bands the ERP is organised into.`,
      tier: "enterprise",
      x: at[0],
      y: at[1],
      parents: [],
      href: { to: "/guides", search: { domain: band } },
    });
  });

  // --- capability: the modules, answering to their band
  const modules = guides.filter((guide) => guide.parent === null && guide.module === guide.slug);
  modules.forEach((module, index) => {
    const at = CAPABILITY[index % CAPABILITY.length] ?? [340, 200];
    nodes.push({
      id: `module:${module.slug}`,
      label: module.topic,
      description: module.definition ?? `A module of the ERP.`,
      tier: "capability",
      x: at[0],
      y: at[1],
      parents: module.domain ? [`band:${module.domain}`] : [],
      href: { to: "/guides", search: { module: module.slug } },
    });
  });

  // Positions for everything Clariti did not author, inside the same mask and
  // clear of the nodes already placed.
  const reserved = nodes.map((node) => ({ x: node.x, y: node.y }));
  const candidates: Array<[number, number]> = [];
  for (let index = 1; candidates.length < 900 && index < 14000; index += 1) {
    const x = 62 + halton(index, 2) * 590;
    const y = 42 + halton(index, 3) * 408;
    if (!insideBrain(x, y)) continue;
    if (reserved.some((node) => Math.hypot(node.x - x, node.y - y) < 15)) continue;
    candidates.push([Number(x.toFixed(2)), Number(y.toFixed(2))]);
  }
  const used = new Set<number>();
  let cursor = 0;
  const nextFree = (): [number, number] => {
    while (used.has(cursor) && cursor < candidates.length) cursor += 1;
    used.add(cursor);
    return candidates[cursor] ?? [340, 200];
  };
  const claimNear = (origin: { x: number; y: number }, target: number, seed: number) => {
    let best = -1;
    let bestScore = Number.POSITIVE_INFINITY;
    candidates.forEach(([x, y], index) => {
      if (used.has(index)) return;
      const distance = Math.hypot(x - origin.x, y - origin.y);
      const bias = Math.abs(Math.sin((seed + 1) * 1.7) - Math.sin((y - origin.y) * 0.03));
      const score = Math.abs(distance - target) + bias * 7;
      if (score < bestScore) {
        bestScore = score;
        best = index;
      }
    });
    if (best === -1) return [origin.x, origin.y] as [number, number];
    used.add(best);
    return candidates[best] ?? ([origin.x, origin.y] as [number, number]);
  };

  // --- stream: every value stream, parented to each module it crosses. This
  // many-to-many is what produces the long lines across the silhouette.
  modelStreams.forEach((stream, index) => {
    const authored = stream.parent === null ? STREAM[index % STREAM.length] : undefined;
    const at = authored && index < STREAM.length ? authored : nextFree();
    const parents = stream.modules
      .filter((slug) => modules.some((module) => module.slug === slug))
      .map((slug) => `module:${slug}`);
    nodes.push({
      id: `stream:${stream.slug}`,
      label: stream.name,
      description:
        stream.modules.length > 1
          ? `Crosses ${stream.modules.length} modules — the work happens in more than one place.`
          : `A value stream inside ${bandOfModule(stream.primaryModule) ?? "the ERP"}.`,
      tier: "stream",
      x: at[0],
      y: at[1],
      parents: parents.length ? parents : [`module:${stream.primaryModule}`],
      href: { to: "/guides", search: { stream: stream.name } },
    });
  });

  const streamPosition = new Map(
    nodes.filter((node) => node.tier === "stream").map((node) => [node.id, node]),
  );

  // --- element: guides and their workflow steps, chained so the firing runs
  // in sequence the way the brain's transaction steps do.
  const placed = new Set<string>();
  modelStreams.forEach((stream) => {
    const anchor = streamPosition.get(`stream:${stream.slug}`);
    if (!anchor) return;
    const attached = guides.filter(
      (guide) =>
        guide.streams.includes(stream.slug) &&
        guide.parent !== null &&
        guide.slug !== guide.module &&
        !placed.has(guide.slug),
    );
    attached.forEach((guide, guideIndex) => {
      placed.add(guide.slug);
      const [gx, gy] = claimNear(anchor, 22 + guideIndex * 4.4, guideIndex);
      nodes.push({
        id: `guide:${guide.slug}`,
        label: guide.topic,
        description: guide.definition ?? `${guide.level ?? "Topic"} in ${stream.name}.`,
        tier: "element",
        x: gx,
        y: gy,
        parents: [`stream:${stream.slug}`],
        streamId: `stream:${stream.slug}`,
        href: { to: "/guides/$slug", params: { slug: guide.slug } },
      });
      let previous = `guide:${guide.slug}`;
      let at = { x: gx, y: gy };
      guide.workflow.forEach((step, stepIndex) => {
        const [sx, sy] = claimNear(at, 11 + stepIndex * 3.2, stepIndex + 5);
        const id = `step:${guide.slug}:${stepIndex}`;
        nodes.push({
          id,
          label: step,
          description: `Step ${stepIndex + 1} of ${guide.topic}.`,
          tier: "element",
          x: sx,
          y: sy,
          parents: [previous],
          streamId: `stream:${stream.slug}`,
          href: { to: "/guides/$slug", params: { slug: guide.slug } },
        });
        previous = id;
        at = { x: sx, y: sy };
      });
    });
  });

  const byId = new Set(nodes.map((node) => node.id));
  const links: BrainLink[] = nodes.flatMap((node) =>
    node.parents
      .filter((parent) => byId.has(parent))
      .map((parent) => ({
        id: `${parent}--${node.id}`,
        source: parent,
        target: node.id,
        kind:
          node.tier === "capability"
            ? ("enables" as const)
            : node.tier === "stream"
              ? ("flow" as const)
              : ("sequence" as const),
      })),
  );

  // The bands close a ring, as the brain's enterprise tier does.
  const ring: BrainLink[] = allBands.map((band, index) => {
    const next = allBands[(index + 1) % allBands.length] as string;
    return {
      id: `ring:${band}--${next}`,
      source: `band:${band}`,
      target: `band:${next}`,
      kind: "dependency" as const,
    };
  });

  void moduleSlugs;
  return { nodes, links: [...links, ...ring] };
}

const graph = buildGraph();

export const brainNodes = graph.nodes;
export const brainLinks = graph.links;

export const tierLabels: Array<{ tier: BrainTier; label: string }> = [
  { tier: "enterprise", label: "Band" },
  { tier: "capability", label: "Module" },
  { tier: "stream", label: "Value stream" },
  { tier: "element", label: "Guide / step" },
];
