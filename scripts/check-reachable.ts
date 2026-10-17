/**
 * Fails if a guide cannot be reached from the /start areas picker.
 *
 * The picker lists every ERP module with its descendants (module view) and
 * every topic on a value stream (stream view). A guide in neither is
 * invisible to the scoping tool. Guides with no ERP domain (the programme
 * method and library pages) are exempt: they are not an area a client replaces.
 */
import { childrenOf, guides, pillars } from "../src/content/guides";

const reachable = new Set<string>();
const walk = (slug: string) => {
  reachable.add(slug);
  childrenOf(slug).forEach((kid) => walk(kid.slug));
};
pillars.filter((p) => p.domain && p.domain !== "Delivery").forEach((p) => walk(p.slug));
guides.filter((g) => g.streams.length > 0).forEach((g) => reachable.add(g.slug));

const orphans = guides.filter(
  (g) => g.domain !== null && g.domain !== "Delivery" && !reachable.has(g.slug),
);
const checked = guides.filter((g) => g.domain !== null && g.domain !== "Delivery").length;
console.log(`${checked - orphans.length}/${checked} ERP guides reachable from /start`);
if (orphans.length > 0) {
  console.error(`Unreachable:\n${orphans.map((g) => `  ${g.slug} (${g.level})`).join("\n")}`);
  process.exit(1);
}
