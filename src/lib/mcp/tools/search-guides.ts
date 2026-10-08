import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { guides } from "@/content/guides";

const toSummary = (g: (typeof guides)[number]) => ({
  slug: g.slug,
  topic: g.topic,
  parent: g.parent,
  domain: g.domain,
  categories: g.categories.map((c) => c),
  definition: g.definition,
  url: `https://ezrp.io/guides/${g.slug}`,
});

export default defineTool({
  name: "search_guides",
  title: "Search guides",
  description: "Search the EZRP ERP and digital transformation guide library by keyword, domain or category.",
  inputSchema: {
    query: z.string().max(200).optional().describe("Keywords, e.g. 'accounts payable'."),
    domain: z.string().max(100).optional().describe("Business domain name to filter by."),
    category: z.string().max(50).optional().describe("Category such as Process, Module, Local-AU."),
    limit: z.number().int().min(1).max(50).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, domain, category, limit }) => {
    const terms = (query ?? "").toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 1);
    const results = guides
      .filter((g) => !domain || g.domain?.toLowerCase() === domain.toLowerCase())
      .filter((g) => !category || g.categories.some((c) => c.toLowerCase() === category.toLowerCase()))
      .map((g) => {
        const text = [g.topic, g.definition ?? "", g.workflow.join(" "), g.parent ?? ""].join(" ").toLowerCase();
        const s = terms.reduce((n, t) => (text.includes(t) ? n + t.length : n), 0);
        return { g, s };
      })
      .filter((r) => terms.length === 0 || r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, limit ?? 15)
      .map((r) => toSummary(r.g));
    return {
      content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      structuredContent: { guides: results },
    };
  },
});
