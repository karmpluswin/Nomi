"use client";

import * as React from "react";
import Image from "next/image";

export interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  /** Set true only when this instance is above the fold on initial load. */
  priority?: boolean;
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "Original",
  afterLabel = "Generated",
  className,
  priority = false,
}: BeforeAfterSliderProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState(50); // percent, 0–100
  const draggingRef = React.useRef(false);

  const updateFromClientX = React.useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    draggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 4;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPosition((p) => Math.max(0, p - step));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPosition((p) => Math.min(100, p + step));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPosition(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPosition(100);
    }
  };

  return (
    <div
      ref={containerRef}
      className={
        "relative aspect-[4/5] w-full touch-none overflow-hidden rounded-[var(--radius-image)] border border-border select-none " +
        (className ?? "")
      }
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* After — full image, base layer */}
      <div className="absolute inset-0">
        <Image
          src={afterSrc}
          alt={afterLabel}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
          draggable={false}
          priority={priority}
        />
      </div>

      {/* Before — clipped to the current position, sits on top */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={beforeSrc}
          alt={beforeLabel}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
          priority={priority}
          draggable={false}
        />
      </div>

      {/* Corner labels */}
      <span className="absolute top-3 left-3 rounded-[var(--radius-control)] bg-background/80 px-2 py-1 font-mono text-[11px] text-foreground">
        {beforeLabel}
      </span>
      <span className="absolute top-3 right-3 rounded-[var(--radius-control)] bg-background/80 px-2 py-1 font-mono text-[11px] text-foreground">
        {afterLabel}
      </span>

      {/* Divider line */}
      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-background shadow-[0_0_0_1px_rgba(0,0,0,0.25)]"
        style={{ left: `${position}%` }}
      />

      {/* Draggable handle — the actual keyboard-focusable control */}
      <div
        role="slider"
        tabIndex={0}
        aria-label="Comparison position"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        onKeyDown={handleKeyDown}
        className="absolute top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-border bg-background shadow-md outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
        style={{ left: `${position}%` }}
      >
        <svg
          width="14"
          height="10"
          viewBox="0 0 14 10"
          fill="none"
          className="text-foreground"
        >
          <path
            d="M4 1L1 5L4 9M10 1L13 5L10 9"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
