/**
 * Display names for model slugs.
 *
 * Module slugs are taxonomy identifiers — `financial-accounting`,
 * `supply-chain-management` — and showing them raw in a scope summary reads as
 * a database dump. The taxonomy already holds the proper topic name, so this
 * reads it from there rather than keeping a second list that can drift.
 */

import { guideBySlug } from "./guides";

export const moduleLabel = (slug: string): string => guideBySlug.get(slug)?.topic ?? slug;
