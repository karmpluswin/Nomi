"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";

const CTA_IMAGE = "https://picsum.photos/seed/nomi-final-cta/1000/1250";

export function FinalCta() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-(--container-default) px-6 py-24 md:px-8 md:py-32">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
                        transition={{
              duration: prefersReducedMotion ? 0.01 : 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <h2 className="text-3xl leading-[1.15] font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Give us one photo.
              <br />
              We&apos;ll give you four ways to sell it.
            </h2>
            <div className="mt-10">
              <Button size="lg" className="h-11 px-6 text-[0.95rem]" asChild>
                <Link href="/create">Create your first ad ↗</Link>
              </Button>
            </div>
          </motion.div>

                          <motion.div
                  initial={{ opacity: prefersReducedMotion ? 1 : 0, scale: prefersReducedMotion ? 1 : 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: prefersReducedMotion ? 0.01 : 0.4,
                    delay: prefersReducedMotion ? 0 : 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
            className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-image)] border border-border"
          >
            <Image
              src={CTA_IMAGE}
              alt="A finished Nomi advertisement"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}