"use client";

import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Check, X, RotateCcw } from "lucide-react";

import { Mascot } from "@/components/nomi/mascot";
import { Button } from "@/components/ui/button";

export type GenerationStatus = "queued" | "processing" | "done" | "failed";

const PROCESSING_STEPS = [
  "Understanding product",
  "Building creative direction",
  "Generating variations",
  "Finishing the details",
];

export interface GenerationProgressProps {
  status: GenerationStatus;
  /** Index into PROCESSING_STEPS — only meaningful while status is "processing". */
  stepIndex?: number;
  errorMessage?: string;
  onRetry?: () => void;
  className?: string;
}

export function GenerationProgress({
  status,
  stepIndex = 0,
  errorMessage = "Something went wrong reaching your provider.",
  onRetry,
  className,
}: GenerationProgressProps) {
  const prefersReducedMotion = useReducedMotion();
  const fade = { duration: prefersReducedMotion ? 0.01 : 0.24 };

  return (
    <div
      className={
        "flex flex-col items-center gap-6 py-12 text-center " +
        (className ?? "")
      }
    >
      <span className="sr-only" role="status" aria-live="polite">
        {status === "queued" && "Queued."}
        {status === "processing" &&
          `Generating: ${PROCESSING_STEPS[stepIndex]}.`}
        {status === "done" && "Generation complete."}
        {status === "failed" && "Generation failed."}
      </span>

      <AnimatePresence mode="wait">
        {status === "queued" && (
          <motion.div
            key="queued"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fade}
            className="flex flex-col items-center gap-3"
          >
            <span className="size-2 animate-pulse rounded-full bg-muted-foreground" />
            <p className="font-mono text-sm text-muted-foreground">
              Queued — starting shortly
            </p>
          </motion.div>
        )}

        {status === "processing" && (
          <motion.ul
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fade}
            className="flex flex-col gap-3 font-mono text-sm"
          >
            {PROCESSING_STEPS.map((step, i) => {
              const done = i < stepIndex;
              const active = i === stepIndex;
              return (
                <li
                  key={step}
                  className="flex items-center gap-2.5"
                  aria-current={active ? "step" : undefined}
                >
                  <span
                    className={
                      "flex size-4 items-center justify-center rounded-full border transition-colors duration-[var(--duration-state)] " +
                      (done
                        ? "border-foreground bg-foreground text-background"
                        : active
                          ? "border-foreground"
                          : "border-border")
                    }
                  >
                    {done && <Check className="size-2.5" aria-hidden="true" />}
                  </span>
                  <span
                    className={
                      done || active ? "text-foreground" : "text-muted-foreground"
                    }
                  >
                    {step}
                  </span>
                </li>
              );
            })}
          </motion.ul>
        )}

        {status === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: prefersReducedMotion ? 1 : 0, scale: prefersReducedMotion ? 1 : 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-col items-center gap-3"
          >
            <Mascot size={32} className="text-foreground" />
            <p className="text-sm font-medium text-foreground">
              Your ads are ready
            </p>
          </motion.div>
        )}

        {status === "failed" && (
          <motion.div
            key="failed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fade}
            className="flex flex-col items-center gap-3"
          >
            <span className="flex size-9 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10 text-destructive">
              <X className="size-4" aria-hidden="true" />
            </span>
            <p className="max-w-xs text-sm text-muted-foreground">
              {errorMessage}
            </p>
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry} className="gap-1.5">
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Try again
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}