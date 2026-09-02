"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

import {
  CreativeControls,
  DEFAULT_CREATIVE_CONTROLS,
  type CreativeControlsValue,
} from "@/components/nomi/creative-controls";
import {
  TextControls,
  DEFAULT_TEXT_CONTROLS,
  type TextControlsValue,
} from "@/components/nomi/text-controls";
import {
  TypographyControls,
  DEFAULT_TYPOGRAPHY_CONTROLS,
  type TypographyControlsValue,
} from "@/components/nomi/typography-controls";
import {
  ColorPaletteControls,
  DEFAULT_COLOR_PALETTE,
  type ColorPaletteValue,
} from "@/components/nomi/color-palette-controls";

export interface AdvancedControlsValue {
  creative: CreativeControlsValue;
  text: TextControlsValue;
  typography: TypographyControlsValue;
  palette: ColorPaletteValue;
}

export const DEFAULT_ADVANCED_CONTROLS: AdvancedControlsValue = {
  creative: DEFAULT_CREATIVE_CONTROLS,
  text: DEFAULT_TEXT_CONTROLS,
  typography: DEFAULT_TYPOGRAPHY_CONTROLS,
  palette: DEFAULT_COLOR_PALETTE,
};

export interface AdvancedControlsProps {
  value: AdvancedControlsValue;
  onChange: (value: AdvancedControlsValue) => void;
  sourceImageUrl: string | null;
  className?: string;
}

export function AdvancedControls({
  value,
  onChange,
  sourceImageUrl,
  className,
}: AdvancedControlsProps) {
  const [open, setOpen] = React.useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="advanced-controls-panel"
        className="flex w-full items-center justify-between rounded-[var(--radius-control)] border border-border px-3 py-2.5 text-sm text-foreground transition-colors duration-[var(--duration-hover)] hover:bg-muted"
      >
        <span>Advanced direction, text, typography, colors</span>
        <ChevronDown
          aria-hidden="true"
          className={
            "size-4 text-muted-foreground transition-transform duration-[var(--duration-hover)] " +
            (open ? "rotate-180" : "")
          }
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="advanced-controls-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.28,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="overflow-hidden"
          >
            <div className="mt-4 flex flex-col gap-6 rounded-[var(--radius-card-sm)] border border-border bg-card p-4">
              <CreativeControls
                value={value.creative}
                onChange={(creative) => onChange({ ...value, creative })}
              />
              <TextControls
                value={value.text}
                onChange={(text) => onChange({ ...value, text })}
              />
              <TypographyControls
                value={value.typography}
                onChange={(typography) => onChange({ ...value, typography })}
              />
              <ColorPaletteControls
                sourceImageUrl={sourceImageUrl}
                value={value.palette}
                onChange={(palette) => onChange({ ...value, palette })}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}