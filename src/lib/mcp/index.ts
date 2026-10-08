import { defineMcp } from "@lovable.dev/mcp-js";
import searchGuides from "./tools/search-guides";
import getGuide from "./tools/get-guide";
import listDomains from "./tools/list-domains";

export default defineMcp({
  name: "ezrp",
  title: "EZRP",
  version: "0.1.0",
  instructions:
    "Read-only access to the EZRP ERP and digital transformation guide library (ezrp.io). Use `list_domains` for the structure, `search_guides` to find topics, and `get_guide` for full detail. Cite guide URLs.",
  tools: [searchGuides, getGuide, listDomains],
});
