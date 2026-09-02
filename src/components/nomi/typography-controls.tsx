"use client";

export type FontFamily =
  | "geist"
  | "inter"
  | "playfair"
  | "fraunces"
  | "space-grotesk";

export type FontWeight = "regular" | "medium" | "semibold" | "bold";

interface FontOption {
  id: FontFamily;
  label: string;
  /** Close system-font approximation for the picker preview only —
      the real font is applied at generation time, not loaded here. */
  previewStack: string;
}

const FONTS: FontOption[] = [
  { id: "geist", label: "Geist", previewStack: "ui-sans-serif, system-ui, sans-serif" },
  { id: "inter", label: "Inter", previewStack: "ui-sans-serif, system-ui, sans-serif" },
  { id: "playfair", label: "Playfair Display", previewStack: "Georgia, 'Times New Roman', serif" },
  { id: "fraunces", label: "Fraunces", previewStack: "Georgia, serif" },
  { id: "space-grotesk", label: "Space Grotesk", previewStack: "'Trebuchet MS', ui-sans-serif, sans-serif" },
];

const WEIGHTS: { id: FontWeight; label: string; cssWeight: number }[] = [
  { id: "regular", label: "Regular", cssWeight: 400 },
  { id: "medium", label: "Medium", cssWeight: 500 },
  { id: "semibold", label: "Semibold", cssWeight: 600 },
  { id: "bold", label: "Bold", cssWeight: 700 },
];

export interface TypographyControlsValue {
  family: FontFamily;
  weight: FontWeight;
}

export const DEFAULT_TYPOGRAPHY_CONTROLS: TypographyControlsValue = {
  family: "geist",
  weight: "semibold",
};

export interface TypographyControlsProps {
  value: TypographyControlsValue;
  onChange: (value: TypographyControlsValue) => void;
  className?: string;
}

export function TypographyControls({
  value,
  onChange,
  className,
}: TypographyControlsProps) {
  const selectedWeight = WEIGHTS.find((w) => w.id === value.weight)?.cssWeight ?? 600;

  return (
    <div className={"flex flex-col gap-5 " + (className ?? "")}>
      <div>
        <span className="text-sm font-medium text-foreground">Font family</span>
        <div
          role="radiogroup"
          aria-label="Font family"
          className="mt-2 flex flex-col gap-1.5"
        >
          {FONTS.map((font) => (
            <button
              key={font.id}
              type="button"
              role="radio"
              aria-checked={value.family === font.id}
              onClick={() => onChange({ ...value, family: font.id })}
              style={{ fontFamily: font.previewStack, fontWeight: selectedWeight }}
              className={
                "flex items-center justify-between rounded-[var(--radius-control)] border px-3 py-2.5 text-left text-base transition-colors duration-[var(--duration-hover)] " +
                (value.family === font.id
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground hover:border-muted-foreground")
              }
            >
              {font.label}
              <span
                className={
                  "font-mono text-xs " +
                  (value.family === font.id
                    ? "text-background/70"
                    : "text-muted-foreground")
                }
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Aa
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="text-sm font-medium text-foreground">Weight</span>
        <div
          role="radiogroup"
          aria-label="Font weight"
          className="mt-2 flex flex-wrap gap-1.5"
        >
          {WEIGHTS.map((w) => (
            <button
              key={w.id}
              type="button"
              role="radio"
              aria-checked={value.weight === w.id}
              onClick={() => onChange({ ...value, weight: w.id })}
              className={
                "rounded-[var(--radius-control)] border px-3 py-1.5 text-sm transition-colors duration-[var(--duration-hover)] " +
                (value.weight === w.id
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground")
              }
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}