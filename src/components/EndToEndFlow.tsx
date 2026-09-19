import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import type { Flow, FlowStep } from "@/content/flows";

function Step({ step, index }: { step: FlowStep; index: number }) {
  const body = (
    <>
      <span className="font-mono text-[0.625rem] text-primary">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="mt-1 block font-display text-sm font-semibold leading-tight">
        {step.label}
      </span>
      <span className="mt-1 block text-xs text-muted-foreground">{step.note}</span>
    </>
  );

  const className =
    "panel block h-full rounded p-3 transition hover:border-primary min-w-44 flex-1";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="flex min-w-44 flex-1 items-stretch gap-2"
    >
      {step.slug ? (
        <Link to="/guides/$slug" params={{ slug: step.slug }} className={className}>
          {body}
        </Link>
      ) : (
        <div className={className}>{body}</div>
      )}
      <ChevronRight className="hidden size-4 shrink-0 self-center text-border lg:block" />
    </motion.div>
  );
}

export function EndToEndFlow({ flow }: { flow: Flow }) {
  return (
    <section className="mt-10">
      <p className="label-xs">End to end</p>
      <h2 className="mt-1 text-2xl font-semibold">{flow.title}</h2>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{flow.summary}</p>

      <div className="mt-6 space-y-5">
        {flow.lanes.map((lane) => (
          <div key={lane.id} className="border-l-2 border-border pl-4">
            <div className="flex flex-wrap items-baseline gap-x-3">
              {lane.slug ? (
                <Link
                  to="/guides/$slug"
                  params={{ slug: lane.slug }}
                  className="font-display text-base font-semibold text-primary hover:underline"
                >
                  {lane.layer}
                </Link>
              ) : (
                <span className="font-display text-base font-semibold">{lane.layer}</span>
              )}
              <span className="text-xs text-muted-foreground">{lane.blurb}</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {lane.steps.map((step, i) => (
                <Step key={step.label} step={step} index={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
