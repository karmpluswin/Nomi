"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { CreativeCard } from "@/components/nomi/creative-card";
import { Check, Sparkles } from "lucide-react";
import { Mascot } from "@/components/nomi/mascot";

import { Button } from "@/components/ui/button";

type Phase = "input" | "processing" | "generated";

const PROCESSING_STEPS = [
  "Understanding product",
  "Building creative direction",
  "Generating variations",
  "Finishing the details",
];

// Stable placeholder seeds — swap for real assets later, nothing else changes.
const PRODUCT_PHOTO = "https://picsum.photos/seed/nomi-product/800/1000";
const RESULT_IMAGES = [
  "https://picsum.photos/seed/nomi-ad-1/700/875",
  "https://picsum.photos/seed/nomi-ad-2/700/875",
  "https://picsum.photos/seed/nomi-ad-3/700/875",
  "https://picsum.photos/seed/nomi-ad-4/700/875",
];

export function AdTransformation() {
  const [phase, setPhase] = React.useState<Phase>("input");
  const [stepIndex, setStepIndex] = React.useState(0);
  const prefersReducedMotion = useReducedMotion();

  const stepDelay = prefersReducedMotion ? 120 : 550;

  const start = () => {
    setPhase("processing");
    setStepIndex(0);
  };

  const reset = () => {
    setPhase("input");
    setStepIndex(0);
  };

  React.useEffect(() => {
    if (phase !== "processing") return;

    if (stepIndex < PROCESSING_STEPS.length - 1) {
      const timer = setTimeout(() => setStepIndex((i) => i + 1), stepDelay);
      return () => clearTimeout(timer);
    }

    const finishTimer = setTimeout(() => setPhase("generated"), stepDelay);
    return () => clearTimeout(finishTimer);
  }, [phase, stepIndex, stepDelay]);

  return (
    <section
      id="examples"
      className="border-b border-border bg-muted/40"
      aria-label="One product photo becomes four advertisements"
    >
      <div className="mx-auto max-w-(--container-default) px-6 py-20 md:px-8 md:py-28">
        <div className="mb-12 max-w-xl">
          <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
            One photo, four directions
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Watch Nomi work.
          </h2>
        </div>

        <div className="rounded-[var(--radius-container)] border border-border bg-card p-6 md:p-10">
          <span className="sr-only" role="status" aria-live="polite">
            {phase === "input" && "Ready to generate."}
            {phase === "processing" &&
              `Generating: ${PROCESSING_STEPS[stepIndex]}.`}
            {phase === "generated" && "Four advertisements generated."}
          </span>
          <AnimatePresence mode="wait">
            {phase === "input" && (
              <motion.div
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 0.24 }}
                className="flex flex-col items-center gap-8 py-8 md:flex-row md:justify-center md:gap-16"
              >
                <div className="relative aspect-[4/5] w-56 overflow-hidden rounded-[var(--radius-image)] border border-border sm:w-64">
                  <Image
                    src={PRODUCT_PHOTO}
                    alt="Example product photo"
                    fill
                    sizes="256px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
                  <p className="max-w-xs text-sm text-muted-foreground">
                    One product photo. Nomi builds a creative direction and
                    generates four finished ads from it.
                  </p>
                  <Button onClick={start} className="gap-1.5">
                    <Sparkles className="size-4" aria-hidden="true" />
                    See it transform
                  </Button>
                </div>
              </motion.div>
            )}

            {phase === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 0.24 }}
                className="flex flex-col items-center gap-8 py-12"
              >
                <div className="relative aspect-[4/5] w-40 overflow-hidden rounded-[var(--radius-image)] border border-border opacity-60">
                  <Image
                    src={PRODUCT_PHOTO}
                    alt=""
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
                <ul className="flex flex-col gap-3 font-mono text-sm">
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
                          {done && (
                            <Check className="size-2.5" aria-hidden="true" />
                          )}
                        </span>
                        <span
                          className={
                            done || active
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }
                        >
                          {step}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            )}

            {phase === "generated" && (
              <motion.div
                key="generated"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 0.24 }}
              >
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                  {RESULT_IMAGES.map((src, i) => (
                    <CreativeCard
                      key={src}
                      src={src}
                      alt={`Generated advertisement direction ${i + 1}`}
                      delay={i * 0.08}
                    />
                  ))}
                </div>
                <div className="mt-8 flex flex-col items-center gap-3">
                  <Mascot size={22} className="text-muted-foreground" />
                  <Button variant="ghost" size="sm" onClick={reset}>
                    Watch again
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
