"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";

interface PipelineNode {
  label: string;
  detail: string;
  highlight?: boolean;
}

const NODES: PipelineNode[] = [
  { label: "Product image + description", detail: "input" },
  { label: "Structured ad brief", detail: "analysis" },
  { label: "Creative direction", detail: "planning" },
  { label: "Your AI provider", detail: "gemini / openai / fal", highlight: true },
  { label: "4 finished advertisements", detail: "output" },
];

export function AiPipeline() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="providers" className="border-b border-border">
      <div className="mx-auto max-w-(--container-default) px-6 py-20 md:px-8 md:py-28">
        <div className="mb-16 max-w-2xl md:mb-20">
          <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
            How a generation actually runs
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Nomi doesn&apos;t just send your photo to a model.
          </h2>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">
            Every generation passes through a structured pipeline before it
            ever reaches an AI provider — and it&apos;s your provider, on
            your key. Nomi never charges for a generation.
          </p>
        </div>

        {/* Desktop — horizontal pipeline */}
        <div className="hidden items-stretch md:flex">
          {NODES.map((node, i) => (
            <div key={node.label} className="flex flex-1 items-stretch">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                                transition={{
                  duration: prefersReducedMotion ? 0.01 : 0.4,
                  delay: prefersReducedMotion ? 0 : i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={
                  "flex flex-1 flex-col justify-center rounded-[var(--radius-card-sm)] border px-4 py-5 " +
                  (node.highlight
                    ? "border-foreground bg-card"
                    : "border-border bg-card")
                }
              >
                <span className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
                  {node.detail}
                </span>
                <span className="mt-1.5 text-sm font-medium text-foreground">
                  {node.label}
                </span>
              </motion.div>

              {i < NODES.length - 1 && (
                <div className="flex w-10 shrink-0 items-center justify-center">
                                    <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile — vertical pipeline */}
        <div className="flex flex-col md:hidden">
          {NODES.map((node, i) => (
            <div key={node.label} className="flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                                                transition={{
                  duration: prefersReducedMotion ? 0.01 : 0.4,
                  delay: prefersReducedMotion ? 0 : i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={
                  "rounded-[var(--radius-card-sm)] border px-4 py-4 " +
                  (node.highlight
                    ? "border-foreground bg-card"
                    : "border-border bg-card")
                }
              >
                <span className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
                  {node.detail}
                </span>
                <span className="mt-1 block text-sm font-medium text-foreground">
                  {node.label}
                </span>
              </motion.div>

              {i < NODES.length - 1 && (
                <div className="flex h-8 items-center justify-center">
                  <div className="h-full w-px bg-border" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}