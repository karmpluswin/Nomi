"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Download } from "lucide-react";

export interface CreativeCardProps {
  src: string;
  alt: string;
  label?: string;
  aspectRatio?: "portrait" | "square" | "landscape";
  showDownload?: boolean;
  onDownload?: () => void;
  onImageClick?: () => void;
  className?: string;
  /** Motion entrance delay in seconds — for staggered reveals in a parent. */
  delay?: number;
}

const aspectClass: Record<NonNullable<CreativeCardProps["aspectRatio"]>, string> = {
  portrait: "aspect-[4/5]",
  square: "aspect-square",
  landscape: "aspect-[5/4]",
};

export function CreativeCard({
  src,
  alt,
  label,
  aspectRatio = "portrait",
  showDownload = false,
  onDownload,
  onImageClick,
  className,
  delay = 0,
}: CreativeCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: prefersReducedMotion ? 0.01 : 0.4,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={
        "group relative overflow-hidden rounded-[var(--radius-image)] border border-border bg-muted " +
        (className ?? "")
      }
    >
            <button
        type="button"
        onClick={onImageClick}
        disabled={!onImageClick}
        aria-label={onImageClick ? `View ${alt} larger` : undefined}
        className={`relative block w-full ${aspectClass[aspectRatio]} ${onImageClick ? "cursor-pointer" : "cursor-default"}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[var(--duration-panel)] ease-out group-hover:scale-[1.02]"
        />
      </button>

      {(label || showDownload) && (
        <div className="flex items-center justify-between gap-2 border-t border-border bg-card px-3 py-2">
          {label ? (
            <span className="truncate font-mono text-xs text-muted-foreground">
              {label}
            </span>
          ) : (
            <span />
          )}
          {showDownload && (
            <button
              type="button"
              onClick={onDownload}
              aria-label="Download"
              className="flex size-6 shrink-0 items-center justify-center rounded-[var(--radius-control)] text-muted-foreground transition-colors duration-[var(--duration-hover)] hover:bg-muted hover:text-foreground"
            >
                            <Download className="size-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}