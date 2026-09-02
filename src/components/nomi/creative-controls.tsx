"use client";

export type CreativeDirection =
  | "auto"
  | "minimal"
  | "editorial"
  | "luxury"
  | "bold";

export type AdFormat = "square" | "portrait-4-5" | "story" | "other";

const DIRECTIONS: { id: CreativeDirection; label: string }[] = [
  { id: "auto", label: "Auto" },
  { id: "minimal", label: "Minimal" },
  { id: "editorial", label: "Editorial" },
  { id: "luxury", label: "Luxury" },
  { id: "bold", label: "Bold" },
];

const FORMATS: { id: AdFormat; label: string; ratio: string }[] = [
  { id: "square", label: "Instagram square", ratio: "1:1" },
  { id: "portrait-4-5", label: "4:5", ratio: "4:5" },
  { id: "story", label: "Story / vertical", ratio: "9:16" },
  { id: "other", label: "Other", ratio: "—" },
];

export interface CreativeControlsValue {
  direction: CreativeDirection;
  format: AdFormat;
}

export interface CreativeControlsProps {
  value: CreativeControlsValue;
  onChange: (value: CreativeControlsValue) => void;
  className?: string;
}

function ChipGroup<T extends string>({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: { id: T; label: string }[];
  selected: T;
  onSelect: (id: T) => void;
}) {
  return (
    <div>
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div
        role="radiogroup"
        aria-label={label}
        className="mt-2 flex flex-wrap gap-1.5"
      >
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={selected === opt.id}
            onClick={() => onSelect(opt.id)}
            className={
              "rounded-[var(--radius-control)] border px-3 py-1.5 text-sm transition-colors duration-[var(--duration-hover)] " +
              (selected === opt.id
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground")
            }
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CreativeControls({
  value,
  onChange,
  className,
}: CreativeControlsProps) {
  return (
    <div className={"flex flex-col gap-5 " + (className ?? "")}>
      <ChipGroup
        label="Creative direction"
        options={DIRECTIONS}
        selected={value.direction}
        onSelect={(direction) => onChange({ ...value, direction })}
      />
      <ChipGroup
        label="Ad format"
        options={FORMATS.map(({ id, label }) => ({ id, label }))}
        selected={value.format}
        onSelect={(format) => onChange({ ...value, format })}
      />
    </div>
  );
}

export const DEFAULT_CREATIVE_CONTROLS: CreativeControlsValue = {
  direction: "auto",
  format: "portrait-4-5",
};