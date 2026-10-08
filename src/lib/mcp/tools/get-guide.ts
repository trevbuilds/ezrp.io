import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { childrenOf, guideBySlug } from "@/content/guides";
import { loadArticle } from "@/content/article-loader";

export default defineTool({
  name: "get_guide",
  title: "Get guide",
  description: "Get one EZRP guide by slug, including its definition, workflow, child guides and full article if one exists.",
  inputSchema: { slug: z.string().min(1).max(120).describe("Guide slug, e.g. 'ap-automation'.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }) => {
    const g = guideBySlug.get(slug);
    if (!g) throw new ToolError(`No guide with slug "${slug}". Use search_guides to find one.`);
    const article = await loadArticle(slug);
    const guide = {
      slug: g.slug,
      topic: g.topic,
      parent: g.parent,
      domain: g.domain,
      categories: g.categories.map((c) => c),
      definition: g.definition,
      workflow: [...g.workflow],
      streams: [...g.streams],
      children: childrenOf(slug).map((c) => ({ slug: c.slug, topic: c.topic })),
      url: `https://ezrp.io/guides/${g.slug}`,
      article: article
        ? { intro: article.intro, body: JSON.stringify(article.blocks) }
        : null,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(guide, null, 2) }],
      structuredContent: { guide },
    };
  },
});
