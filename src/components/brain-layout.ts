/**
 * Brain-shaped layout, ported from the Clariti semantic brain.
 *
 * The shape is what makes it read as a brain rather than as a graph, and the
 * shape comes from three things: a silhouette built out of five overlapping
 * ellipses with two cuts and a fissure, a Halton sequence that scatters leaf
 * nodes evenly inside it, and very small nodes so a dense graph stays legible.
 *
 * The coordinate space is Clariti's own (viewBox 56 36 604 424) so their radii
 * and type sizes transfer directly rather than being re-derived by eye.
 *
 * What differs: Clariti hand-places every node because its graph is fixed at
 * 180. EZRP's grows with the taxonomy, so only the eight bands are placed by
 * hand — everything below them is generated into the silhouette, seeded from
 * its parent so a branch stays together.
 */

/** Anchors for the eight bands, positioned by hand inside the silhouette. */
export const BAND_ANCHORS: Record<string, { x: number; y: number }> = {
  Finance: { x: 272, y: 77 },
  "People/HCM": { x: 133, y: 146 },
  "Customer & Revenue": { x: 588, y: 164 },
  Operations: { x: 566, y: 300 },
  Assets: { x: 466, y: 389 },
  "Projects & Portfolio": { x: 280, y: 417 },
  "Data & Technology": { x: 116, y: 319 },
  Delivery: { x: 356, y: 224 },
};

/** Van der Corput / Halton — an even, non-repeating scatter. */
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

/**
 * The silhouette: crown, frontal lobe, temporal lobe, rear and stem, minus a
 * face cut, a lower cut and the lateral fissure.
 */
export function insideBrain(x: number, y: number) {
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

export type Point = { x: number; y: number };

/**
 * Every free position inside the silhouette, in Halton order, excluding a
 * margin around the hand-placed anchors so labels do not collide.
 */
export function brainCandidates(reserved: Point[], wanted = 900): Point[] {
  const points: Point[] = [];
  for (let index = 1; points.length < wanted && index < 12000; index += 1) {
    const x = 62 + halton(index, 2) * 590;
    const y = 42 + halton(index, 3) * 408;
    if (!insideBrain(x, y)) continue;
    if (reserved.some((node) => Math.hypot(node.x - x, node.y - y) < 15)) continue;
    points.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
  }
  return points;
}

/**
 * Claim the free point closest to a target distance from its parent, so a
 * branch grows outward from where it belongs instead of scattering.
 */
export function claimNear(
  candidates: Point[],
  used: Set<number>,
  origin: Point,
  targetDistance: number,
  spreadSeed: number,
): Point {
  let bestIndex = -1;
  let bestScore = Number.POSITIVE_INFINITY;
  candidates.forEach((point, index) => {
    if (used.has(index)) return;
    const distance = Math.hypot(point.x - origin.x, point.y - origin.y);
    const angleBias = Math.abs(Math.sin(spreadSeed * 1.7) - Math.sin((point.y - origin.y) * 0.03));
    const score = Math.abs(distance - targetDistance) + angleBias * 6;
    if (score < bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });
  if (bestIndex === -1) return origin;
  used.add(bestIndex);
  return candidates[bestIndex] ?? origin;
}
