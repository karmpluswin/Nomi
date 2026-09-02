"use client";

import { Input } from "@/components/ui/input";

export interface TextControlsValue {
  headline: string;
  subheadline: string;
  cta: string;
}

export interface TextControlsProps {
  value: TextControlsValue;
  onChange: (value: TextControlsValue) => void;
  className?: string;
}

export const DEFAULT_TEXT_CONTROLS: TextControlsValue = {
  headline: "",
  subheadline: "",
  cta: "",
};

const FIELDS: { key: keyof TextControlsValue; label: string; placeholder: string; maxLength: number }[] = [
  {
    key: "headline",
    label: "Headline",
    placeholder: "Leave blank to let Nomi write it",
    maxLength: 60,
  },
  {
    key: "subheadline",
    label: "Subheadline",
    placeholder: "Optional supporting line",
    maxLength: 100,
  },
  {
    key: "cta",
    label: "Call to action",
    placeholder: "e.g. Shop now",
    maxLength: 24,
  },
];

export function TextControls({ value, onChange, className }: TextControlsProps) {
  return (
    <div className={"flex flex-col gap-4 " + (className ?? "")}>
      <span className="text-sm font-medium text-foreground">Ad copy</span>
      {FIELDS.map((field) => (
        <div key={field.key} className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between">
            <label
              htmlFor={`text-controls-${field.key}`}
              className="text-xs text-muted-foreground"
            >
              {field.label}
            </label>
            <span className="font-mono text-[11px] text-muted-foreground">
              {value[field.key].length}/{field.maxLength}
            </span>
          </div>
          <Input
            id={`text-controls-${field.key}`}
            value={value[field.key]}
            onChange={(e) =>
              onChange({
                ...value,
                [field.key]: e.target.value.slice(0, field.maxLength),
              })
            }
            placeholder={field.placeholder}
          />
        </div>
      ))}
    </div>
  );
}