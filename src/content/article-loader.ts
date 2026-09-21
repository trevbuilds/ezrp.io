/**
 * Lazy per-article loaders. Each markdown file becomes its own chunk, so
 * opening one guide fetches that article rather than the whole corpus.
 *
 * Kept apart from ./article because `import.meta.glob` is a Vite transform —
 * the parser stays plain TypeScript and can be exercised outside a bundler.
 */

import { parseArticle, type Article } from "./article";

const files = import.meta.glob("./articles/*.md", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

export const articleSlugs = Object.keys(files).map(
  (path) => path.match(/\/([^/]+)\.md$/)?.[1] ?? "",
);

export const hasArticle = (slug: string) => `./articles/${slug}.md` in files;

export async function loadArticle(slug: string): Promise<Article | null> {
  const load = files[`./articles/${slug}.md`];
  if (!load) return null;
  return parseArticle(await load(), slug);
}
