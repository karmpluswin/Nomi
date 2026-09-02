"use client";

import { motion, useReducedMotion } from "motion/react";

interface Step {
  number: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Upload",
    description: "Drop your product image.",
  },
  {
    number: "02",
    title: "Describe",
    description: "Give the product name and context.",
  },
  {
    number: "03",
    title: "Generate",
    description: "Receive multiple advertising directions.",
  },
];

export function HowItWorks() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="how-it-works" className="border-b border-border">
      <div className="mx-auto max-w-(--container-default) px-6 py-20 md:px-8 md:py-28">
        <div className="mb-16 max-w-xl md:mb-20">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            How it works.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
                            initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: prefersReducedMotion ? 0.01 : 0.4,
                delay: prefersReducedMotion ? 0 : i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={
                i > 0
                  ? "border-t border-border pt-8 md:border-t-0 md:border-l md:pt-0 md:pl-8"
                  : ""
              }
            >
              <span className="block font-mono text-5xl font-medium tracking-tight text-muted-foreground sm:text-6xl">
                {step.number}
              </span>
              <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}