"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "@/components/nomi/before-after-slider";

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-(--container-default) px-6 pt-20 pb-24 md:px-8 md:pt-28 md:pb-32">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.52,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <h1 className="text-4xl leading-[1.1] font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Turn a product photo into an ad people notice.
            </h1>

            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              Generate polished creative directions from one image, without
              opening a design tool.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button size="lg" className="h-11 px-6 text-[0.95rem]" asChild>
                <Link href="/create">Create an ad ↗</Link>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="h-11 px-4 text-[0.95rem]"
                asChild
              >
                <Link href="#examples">See examples</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.52,
              delay: prefersReducedMotion ? 0 : 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mx-auto w-full max-w-sm md:mx-0 md:ml-auto"
          >
            <BeforeAfterSlider
              beforeSrc="/beforeImage.png"
              afterSrc="/afterImage.jpg"
              priority
            />
            <p className="mt-3 text-center font-mono text-xs text-muted-foreground">
              drag to compare
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
