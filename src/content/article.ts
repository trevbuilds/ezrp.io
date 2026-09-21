/**
 * Article format: one markdown file per article, parsed into ArticleBlocks.
 *
 * Prose is ordinary markdown so it can be edited by a person or by Lovable.
 * The structured sections the house template relies on — steps, Q&A, metrics —
 * would be flattened into undifferentiated text by plain markdown, so they are
 * carried in fenced blocks with a `::` field separator: readable as text, and
 * still typed once parsed.
 *
 *     ## Why it matters            -> h
 *     ### For small businesses     -> sub
 *     plain paragraph              -> p
 *     - **Term**: text             -> bullets
 *     > text                       -> callout
 *     ```steps / qa / metrics```   -> steps / qa / metrics
 *
 * Files are loaded lazily per route, so an article is fetched only when its
 * guide is opened rather than bundled into the shared chunk.
 */

export type ArticleBlock =
  | { kind: "h"; text: string }
  | { kind: "sub"; text: string }
  | { kind: "p"; text: string }
  | { kind: "bullets"; items: Array<{ term?: string; text: string }> }
  | { kind: "steps"; items: Array<{ title: string; text?: string; sub?: string[] }> }
  | { kind: "qa"; items: Array<{ title: string; question: string; plan: string }> }
  | { kind: "metrics"; items: Array<{ name: string; text: string }> }
  | { kind: "callout"; text: string };

export type Article = {
  slug: string;
  intro: string;
  blocks: ArticleBlock[];
};

const SEP = "::";

/** Frontmatter is two keys only — anything richer belongs in the taxonomy. */
function parseFrontmatter(src: string): { slug: string; intro: string; body: string } {
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(src);
  if (!match) return { slug: "", intro: "", body: src };
  const head = match[1] ?? "";
  const body = src.slice(match[0].length);
  const read = (key: string) => {
    // Supports `key: value` and a folded `key: >-` block.
    const inline = new RegExp(`^${key}:[ \\t]+(?!>)(.*)$`, "m").exec(head);
    if (inline) return (inline[1] ?? "").trim().replace(/^["']|["']$/g, "");
    // No "m" flag: with it, `$` matches end-of-line and the lazy group stops
    // at the first line of the folded block.
    const folded = new RegExp(`(?:^|\\n)${key}:[ \\t]*>-?\\n([\\s\\S]*?)(?=\\n[^ \\t]|$)`).exec(
      head,
    );
    if (!folded) return "";
    return (folded[1] ?? "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .join(" ");
  };
  return { slug: read("slug"), intro: read("intro"), body };
}

function parseFence(lang: string, lines: string[]): ArticleBlock | null {
  if (lang === "steps") {
    const items: Array<{ title: string; text?: string; sub?: string[] }> = [];
    for (const raw of lines) {
      if (/^\s+-\s+/.test(raw) && items.length > 0) {
        const last = items[items.length - 1];
        if (last) (last.sub ??= []).push(raw.replace(/^\s+-\s+/, "").trim());
        continue;
      }
      if (!raw.trim()) continue;
      const [title, ...rest] = raw.split(SEP);
      const text = rest.join(SEP).trim();
      items.push(text ? { title: title!.trim(), text } : { title: title!.trim() });
    }
    return items.length ? { kind: "steps", items } : null;
  }

  if (lang === "qa") {
    const items = lines
      .filter((l) => l.trim())
      .map((l) => {
        const [title, question, ...rest] = l.split(SEP);
        return {
          title: (title ?? "").trim(),
          question: (question ?? "").trim(),
          plan: rest.join(SEP).trim(),
        };
      });
    return items.length ? { kind: "qa", items } : null;
  }

  if (lang === "metrics") {
    const items = lines
      .filter((l) => l.trim())
      .map((l) => {
        const [name, ...rest] = l.split(SEP);
        return { name: (name ?? "").trim(), text: rest.join(SEP).trim() };
      });
    return items.length ? { kind: "metrics", items } : null;
  }

  return null;
}

export function parseArticle(src: string, fallbackSlug = ""): Article {
  const { slug, intro, body } = parseFrontmatter(src);
  const blocks: ArticleBlock[] = [];
  const lines = body.split("\n");

  let i = 0;
  let paragraph: string[] = [];
  let bullets: Array<{ term?: string; text: string }> = [];

  const flushParagraph = () => {
    const text = paragraph.join(" ").trim();
    if (text) blocks.push({ kind: "p", text });
    paragraph = [];
  };
  const flushBullets = () => {
    if (bullets.length) blocks.push({ kind: "bullets", items: bullets });
    bullets = [];
  };
  const flushAll = () => {
    flushParagraph();
    flushBullets();
  };

  while (i < lines.length) {
    const line = lines[i] ?? "";

    const fence = /^```(\w+)\s*$/.exec(line.trim());
    if (fence) {
      flushAll();
      const lang = fence[1] ?? "";
      const collected: string[] = [];
      i += 1;
      while (i < lines.length && !(lines[i] ?? "").trim().startsWith("```")) {
        collected.push(lines[i] ?? "");
        i += 1;
      }
      i += 1;
      const block = parseFence(lang, collected);
      if (block) blocks.push(block);
      continue;
    }

    if (line.startsWith("### ")) {
      flushAll();
      blocks.push({ kind: "sub", text: line.slice(4).trim() });
      i += 1;
      continue;
    }
    if (line.startsWith("## ")) {
      flushAll();
      blocks.push({ kind: "h", text: line.slice(3).trim() });
      i += 1;
      continue;
    }
    if (line.startsWith("> ")) {
      flushAll();
      blocks.push({ kind: "callout", text: line.slice(2).trim() });
      i += 1;
      continue;
    }
    if (/^-\s+/.test(line)) {
      flushParagraph();
      const item = line.replace(/^-\s+/, "");
      const termed = /^\*\*(.+?)\*\*:\s*(.*)$/.exec(item);
      bullets.push(
        termed
          ? { term: termed[1]!.trim(), text: (termed[2] ?? "").trim() }
          : { text: item.trim() },
      );
      i += 1;
      continue;
    }
    if (!line.trim()) {
      flushAll();
      i += 1;
      continue;
    }

    flushBullets();
    paragraph.push(line.trim());
    i += 1;
  }
  flushAll();

  return { slug: slug || fallbackSlug, intro, blocks };
}
