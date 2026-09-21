/**
 * Scope: what a set of chosen areas actually drags in.
 *
 * This is the question the map exists to answer. A client says "we are
 * replacing payables"; the honest answer is that they cannot change payables
 * alone, because the invoice match depends on goods receipts they do not
 * control and the purchase-order data that makes matching possible originates
 * in procurement.
 *
 * Nothing here is asserted. Every relationship is read from the model: a pick
 * sits on a stream, that stream belongs to an L1 stream, that L1 stream names
 * the modules its work actually happens in, and the considerations roll up
 * from the leaves underneath.
 */

import { guideBySlug, guides, considerationsOf, type Guide } from "./guides";
import {
  bandOfModule,
  externalPrerequisites,
  phaseSubModules,
  streamBySlug,
  subStreamsOf,
  type Band,
  type Consideration,
  type Stream,
  type SubModule,
} from "./model";

export type ScopeResult = {
  /** The topics the user chose, in the order they chose them. */
  picked: Guide[];
  /** Slugs that were asked for but are not in the taxonomy. */
  unknown: string[];
  /** L1 streams the picks sit on, directly or through a sub-stream. */
  topStreams: Stream[];
  /** Every stream in scope: those L1 streams and all their sub-streams. */
  streams: Stream[];
  /** Sub-streams pulled in that the user did not pick anything from. */
  impliedStreams: Stream[];
  /** Every topic implied by those streams, picks included. */
  topics: Guide[];
  /** Topics implied that were not picked. */
  implied: Guide[];
  /** Modules the work happens in. */
  modules: string[];
  /** Modules the picks themselves belong to. */
  pickedModules: string[];
  /** Modules dragged in by a crossing stream — the part clients miss. */
  draggedIn: string[];
  /** Bands those modules sit in. */
  bands: Band[];
  /** Considerations raised across everything in scope. */
  considerations: Consideration[];
  /** Topics in scope that carry AU-specific obligations. */
  localAu: Guide[];
  /** Sub-modules in scope, ordered into phases by their dependencies. */
  phases: SubModule[][];
  /** Prerequisites the scope relies on but does not include. */
  prerequisites: SubModule[];
  /** Hand-offs between modules that a stream forces. */
  integrations: IntegrationPoint[];
};

/**
 * An integration point is not a technical preference — it is a place where a
 * stream hands work from one module to another, so data has to cross a system
 * boundary whether anyone planned for it or not.
 */
export type IntegrationPoint = {
  stream: Stream;
  from: string;
  to: string;
  /** True when only one side of the hand-off is in the client's scope. */
  straddles: boolean;
};

/** The L1 stream a stream belongs to — itself, when it is already L1. */
export function rootStream(stream: Stream): Stream {
  if (!stream.parent) return stream;
  return streamBySlug.get(stream.parent) ?? stream;
}

const unique = <T>(values: T[]) => [...new Set(values)];

export function computeScope(slugs: string[]): ScopeResult {
  const picked: Guide[] = [];
  const unknown: string[] = [];
  slugs.forEach((slug) => {
    const guide = guideBySlug.get(slug);
    if (guide) picked.push(guide);
    else unknown.push(slug);
  });

  // The streams the picks sit on, lifted to their L1 roots.
  const pickedStreams = picked
    .flatMap((guide) => guide.streams)
    .map((slug) => streamBySlug.get(slug))
    .filter((stream): stream is Stream => Boolean(stream));

  const topStreams = unique(pickedStreams.map(rootStream).map((stream) => stream.slug))
    .map((slug) => streamBySlug.get(slug))
    .filter((stream): stream is Stream => Boolean(stream));

  // An L1 stream in scope brings its whole chain: you cannot do Invoice-to-Pay
  // without the receipts that Requisition-to-Receipt produces.
  const streams = unique(
    topStreams.flatMap((stream) => [stream, ...subStreamsOf(stream.slug)]).map((s) => s.slug),
  )
    .map((slug) => streamBySlug.get(slug))
    .filter((stream): stream is Stream => Boolean(stream));

  const streamSlugs = new Set(streams.map((stream) => stream.slug));
  const pickedStreamSlugs = new Set(pickedStreams.map((stream) => stream.slug));
  const impliedStreams = streams.filter(
    (stream) => !pickedStreamSlugs.has(stream.slug) && stream.parent !== null,
  );

  const pickedSlugs = new Set(picked.map((guide) => guide.slug));
  const topics = guides.filter(
    (guide) => pickedSlugs.has(guide.slug) || guide.streams.some((slug) => streamSlugs.has(slug)),
  );
  const implied = topics.filter((guide) => !pickedSlugs.has(guide.slug));

  const modules = unique(streams.flatMap((stream) => stream.modules));
  const pickedModules = unique(
    picked.map((guide) => guide.module).filter((module): module is string => Boolean(module)),
  );
  const draggedIn = modules.filter((module) => !pickedModules.includes(module));

  const bands = unique(
    modules.map((module) => bandOfModule(module)).filter((band): band is Band => band !== null),
  );

  // Sequence runs over sub-modules: they are the unit a team actually stands
  // up, and the level the dependency edges are declared at.
  const subModuleSlugs = unique(
    topics.map((guide) => guide.subModule).filter((slug): slug is string => Boolean(slug)),
  );
  const phases = phaseSubModules(subModuleSlugs);
  const prerequisites = externalPrerequisites(subModuleSlugs);

  // Every module boundary a stream crosses is an integration point. Where the
  // client is changing only one side of it, that is the interface most likely
  // to be missed at scoping and discovered during testing.
  const integrations: IntegrationPoint[] = streams
    .filter((stream) => stream.modules.length > 1)
    .flatMap((stream) =>
      stream.modules.slice(0, -1).map((from, index) => {
        const to = stream.modules[index + 1] as string;
        return {
          stream,
          from,
          to,
          straddles: pickedModules.includes(from) !== pickedModules.includes(to),
        };
      }),
    );

  const considerations = unique(topics.flatMap((guide) => considerationsOf(guide.slug)));
  const localAu = topics.filter((guide) => guide.scope.includes("Local-AU"));

  return {
    picked,
    unknown,
    topStreams,
    streams,
    impliedStreams,
    topics,
    implied,
    modules,
    pickedModules,
    draggedIn,
    bands,
    considerations,
    localAu,
    phases,
    prerequisites,
    integrations,
  };
}

/** Scope lives in the URL, so a scope is a link someone can send. */
export const parsePicks = (value: string | undefined): string[] =>
  (value ?? "")
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean);

export const serialisePicks = (slugs: string[]): string | undefined =>
  slugs.length ? unique(slugs).join(",") : undefined;
