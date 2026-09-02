"use client";

import * as React from "react";
import { Wand2, Plus, X } from "lucide-react";

import { extractPalette } from "@/lib/extract-palette";
import { Button } from "@/components/ui/button";

export interface ColorPaletteValue {
  mode: "auto" | "custom";
  colors: string[];
}

export const DEFAULT_COLOR_PALETTE: ColorPaletteValue = {
  mode: "auto",
  colors: [],
};

export interface ColorPaletteControlsProps {
  /** Preview URL of the primary product photo, if one is uploaded. */
  sourceImageUrl: string | null;
  value: ColorPaletteValue;
  onChange: (value: ColorPaletteValue) => void;
  className?: string;
}

export function ColorPaletteControls({
  sourceImageUrl,
  value,
  onChange,
  className,
}: ColorPaletteControlsProps) {
  const [detecting, setDetecting] = React.useState(false);

  const detect = async () => {
    if (!sourceImageUrl) return;
    setDetecting(true);
    try {
      const colors = await extractPalette(sourceImageUrl);
      onChange({ mode: "custom", colors });
    } finally {
      setDetecting(false);
    }
  };

  const setMode = (mode: ColorPaletteValue["mode"]) => {
    onChange({ ...value, mode });
  };

  const setColor = (index: number, color: string) => {
    const colors = [...value.colors];
    colors[index] = color;
    onChange({ ...value, colors });
  };

  const removeColor = (index: number) => {
    onChange({ ...value, colors: value.colors.filter((_, i) => i !== index) });
  };

  const addColor = () => {
    if (value.colors.length >= 6) return;
    onChange({ ...value, colors: [...value.colors, "#808080"] });
  };

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-foreground">
          Color palette
        </span>
        <div className="flex gap-1.5" role="radiogroup" aria-label="Palette mode">
          <button
            type="button"
            role="radio"
            aria-checked={value.mode === "auto"}
            onClick={() => setMode("auto")}
            className={
              "rounded-[var(--radius-control)] border px-2.5 py-1 font-mono text-xs transition-colors duration-[var(--duration-hover)] " +
              (value.mode === "auto"
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-muted-foreground")
            }
          >
            Auto
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={value.mode === "custom"}
            onClick={() => setMode("custom")}
            className={
              "rounded-[var(--radius-control)] border px-2.5 py-1 font-mono text-xs transition-colors duration-[var(--duration-hover)] " +
              (value.mode === "custom"
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-muted-foreground")
            }
          >
            Custom
          </button>
        </div>
      </div>

      {value.mode === "auto" && (
        <p className="mt-2 text-xs text-muted-foreground">
          Nomi will choose colors that fit the product and creative direction.
        </p>
      )}

      {value.mode === "custom" && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {value.colors.map((color, i) => (
            <div key={i} className="group relative">
              <label className="block size-9 cursor-pointer overflow-hidden rounded-full border border-border">
                <span className="sr-only">Edit color {i + 1}</span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(i, e.target.value)}
                  className="size-full cursor-pointer border-none p-0"
                  style={{ backgroundColor: color }}
                />
              </label>
              <button
                type="button"
                onClick={() => removeColor(i)}
                aria-label={`Remove color ${i + 1}`}
                className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full border border-border bg-background text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="size-2.5" aria-hidden="true" />
              </button>
            </div>
          ))}

          {value.colors.length < 6 && (
            <button
              type="button"
              onClick={addColor}
              aria-label="Add a color"
              className="flex size-9 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground transition-colors duration-[var(--duration-hover)] hover:border-muted-foreground hover:text-foreground"
            >
              <Plus className="size-3.5" aria-hidden="true" />
            </button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5"
            disabled={!sourceImageUrl || detecting}
            onClick={detect}
          >
            <Wand2 className="size-3.5" aria-hidden="true" />
            {detecting ? "Detecting…" : "Detect from photo"}
          </Button>
        </div>
      )}
    </div>
  );
}