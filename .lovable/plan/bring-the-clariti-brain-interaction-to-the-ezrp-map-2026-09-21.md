# Bring the Clariti brain interaction to the EZRP map

## Goal
Replace the rigid concentric-ring presentation with the more organic, living knowledge-network treatment used in the Clariti brain, while keeping EZRP’s existing dark blueprint identity and guide content.

## Changes
- Rework the guide map into an organic three-tier node network rather than evenly spaced radial rings.
- Give pillars, guides, and sub-guides distinct node sizes and label visibility, with quieter detail labels until their branch is active.
- Add the Clariti-style ambient motion: subtle drifting nodes, spring-like connections, occasional softly illuminated paths, and reduced-motion support.
- Let people hover or focus a node to illuminate its immediate branch and fade unrelated content.
- Let people drag individual nodes to explore the structure while keeping existing node navigation intact.
- Keep the existing EZRP information panel and zoom/reset controls, adapted to the new interaction where needed.
- Tune the map for desktop and mobile so labels remain readable and the network stays within its frame.

## Technical details
- Update only `src/components/GuideMap.tsx` and the map-specific semantic tokens/utilities in `src/styles.css` if needed.
- Derive the graph from the existing guide taxonomy; no content, routes, or data models change.
- Use SVG refs plus `requestAnimationFrame` for lightweight node motion, following the proven Clariti pattern without copying its branding.
- Verify keyboard focus, reduced motion, map links, desktop layout, and mobile layout in the running preview.
