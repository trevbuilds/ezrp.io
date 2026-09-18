import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";

import { guides } from "@/content/guides";

const Body = z.object({
  question: z.string().min(1).max(2000),
});

function score(guideText: string, terms: string[]) {
  const haystack = guideText.toLowerCase();
  return terms.reduce((sum, t) => (haystack.includes(t) ? sum + t.length : sum), 0);
}

function retrieve(question: string) {
  const terms = question
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2);

  const ranked = guides
    .map((g) => {
      const text = [
        g.topic,
        g.definition ?? "",
        g.workflow.join(" "),
        g.categories.join(" "),
        g.parent ?? "",
      ].join(" ");
      return { guide: g, s: score(text, terms) };
    })
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 10);

  return ranked.map(({ guide }) =>
    [
      `TOPIC: ${guide.topic}`,
      `PAGE: /guides/${guide.slug}`,
      guide.parent ? `PARENT: ${guide.parent}` : "PARENT: none (top-level pillar)",
      `CATEGORIES: ${guide.categories.join(", ") || "none recorded"}`,
      `DEFINITION: ${guide.definition ?? "none recorded"}`,
      `WORKFLOW: ${guide.workflow.length ? guide.workflow.join(" -> ") : "none recorded"}`,
    ].join("\n"),
  );
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) {
          return new Response("AI is not configured yet.", { status: 500 });
        }

        const parsed = Body.safeParse(await request.json());
        if (!parsed.success) {
          return new Response("Please send a question.", { status: 400 });
        }

        const context = retrieve(parsed.data.question);

        const lovable = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey: key,
          headers: {
            "Lovable-API-Key": key,
            "X-Lovable-AIG-SDK": "vercel-ai-sdk",
          },
        });

        const result = streamText({
          model: lovable.responses("openai/gpt-6-astra"),
          system: [
            "You are the EZRP guide assistant for ezrp.io.",
            "Answer ONLY from the guide records supplied below.",
            "Never invent definitions, workflow steps, or guides that are not listed.",
            "If the records do not cover the question, say plainly that the library does not cover it yet and suggest the closest recorded topic.",
            "Keep answers to a short paragraph plus, when useful, the recorded workflow steps as a list.",
            "Always finish with a 'Sources:' line listing the guide titles and their /guides/<slug> paths you used.",
            "",
            "GUIDE RECORDS:",
            context.length ? context.join("\n\n") : "(no matching records)",
          ].join("\n"),
          prompt: parsed.data.question,
          providerOptions: {
            openai: {
              forceReasoning: true,
              reasoningEffort: "low",
              reasoningSummary: "auto",
              store: false,
              include: ["reasoning.encrypted_content"],
            },
          },
        });

        return result.toTextStreamResponse();
      },
    },
  },
});
