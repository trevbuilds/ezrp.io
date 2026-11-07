import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";

import { loadArticle } from "@/content/article-loader";
import { guides } from "@/content/guides";

const Body = z.object({
  question: z.string().min(1).max(2000),
});

function score(guideText: string, terms: string[]) {
  const haystack = guideText.toLowerCase();
  return terms.reduce((sum, t) => (haystack.includes(t) ? sum + t.length : sum), 0);
}

async function retrieve(question: string) {
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
    .slice(0, 8);

  // Prefer article intros when present so answers cite the same language users
  // see on /guides/$slug, without inventing beyond the corpus.
  const withIntros = await Promise.all(
    ranked.map(async ({ guide }) => {
      const article = await loadArticle(guide.slug);
      return { guide, intro: article?.intro?.trim() || null };
    }),
  );

  return withIntros.map(({ guide, intro }) =>
    [
      `TOPIC: ${guide.topic}`,
      `PAGE: /guides/${guide.slug}`,
      guide.parent ? `PARENT: ${guide.parent}` : "PARENT: none (top-level pillar)",
      `CATEGORIES: ${guide.categories.join(", ") || "none recorded"}`,
      `DEFINITION: ${guide.definition ?? "none recorded"}`,
      intro ? `ARTICLE INTRO: ${intro}` : "ARTICLE INTRO: none recorded",
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
          return new Response("Please describe the change you are scoping.", { status: 400 });
        }

        const context = await retrieve(parsed.data.question);

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
            "You are the EZRP change-scoping assistant for ezrp.io.",
            "Your job is to help the user describe the change they are scoping — not to act as a generic FAQ bot.",
            "Use Australian English (organise, minimise, localisation, programme when referring to a change programme).",
            "Answer ONLY from the guide records and article intros supplied below.",
            "Never invent definitions, workflow steps, rates, thresholds, or guides that are not listed.",
            "If a DEFINITION or ARTICLE INTRO is 'none recorded', say the library has no definition yet for that topic — do not fill the gap.",
            "Clarify the change: what is in scope, what stays as-is, which modules and value streams are dragged in, and which Local-AU topics matter when Australia is involved.",
            "Map the user's description to concrete /guides/<slug> pages from the records.",
            "When useful, nudge them toward the product path: /start to capture context, /scope to see what the picks drag in, /build for draft deliverables, and /locales for Australian federal vs state obligations.",
            "Keep answers short: a clarifying paragraph, a short list of relevant guides with paths, and one next-step suggestion.",
            "Always finish with a 'Sources:' line listing the guide titles and their /guides/<slug> paths you used.",
            "If the records do not cover the change, say plainly that the library does not cover it yet, suggest the closest recorded topics, and remind them that Feedback → GitHub is the right place for corrections.",
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
