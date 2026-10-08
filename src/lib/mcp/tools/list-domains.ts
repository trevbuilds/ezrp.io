import { defineTool } from "@lovable.dev/mcp-js";
import { allBusinessDomains, guides, streamsInDomain } from "@/content/guides";

export default defineTool({
  name: "list_domains",
  title: "List domains",
  description: "List EZRP business domains with their value streams and guide counts.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const domains = allBusinessDomains.map((d) => ({
      domain: String(d),
      streams: streamsInDomain(d).map((s) => String(s)),
      guideCount: guides.filter((g) => g.domain === d).length,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(domains, null, 2) }],
      structuredContent: { domains },
    };
  },
});
