"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";

export type ReferenceType = "brand" | "style" | "environment" | "other";

export interface ReferenceImage {
  id: string;
  file: File;
  previewUrl: string;
  type: ReferenceType;
}

const TYPE_LABELS: Record<ReferenceType, string> = {
  brand: "Brand / Logo",
  style: "Style inspiration",
  environment: "Environment",
  other: "Other",
};

const MAX_REFERENCES = 3;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export interface ReferenceImagesProps {
  value: ReferenceImage[];
  onChange: (refs: ReferenceImage[]) => void;
  className?: string;
}

export function ReferenceImages({
  value,
  onChange,
  className,
}: ReferenceImagesProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const addFile = (file: File | undefined) => {
    if (!file || value.length >= MAX_REFERENCES) return;
    if (!ACCEPTED_TYPES.includes(file.type)) return;

    onChange([
      ...value,
      {
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        type: "other",
      },
    ]);
  };

  const remove = (id: string) => {
    const target = value.find((r) => r.id === id);
    if (target) URL.revokeObjectURL(target.previewUrl);
    onChange(value.filter((r) => r.id !== id));
  };

  const setType = (id: string, type: ReferenceType) => {
    onChange(value.map((r) => (r.id === id ? { ...r, type } : r)));
  };

  React.useEffect(() => {
    return () => {
      value.forEach((r) => URL.revokeObjectURL(r.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-foreground">
          Reference images
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          optional — {value.length}/{MAX_REFERENCES}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Brand assets, style inspiration, or an environment shot — anything
        that gives Nomi extra visual context.
      </p>

      <div className="mt-3 grid grid-cols-3 gap-3">
        {value.map((ref) => (
          <div
            key={ref.id}
            className="relative overflow-hidden rounded-[var(--radius-image)] border border-border"
          >
            <div className="relative aspect-square w-full">
              <Image
                src={ref.previewUrl}
                alt={`${TYPE_LABELS[ref.type]} reference`}
                fill
                sizes="120px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => remove(ref.id)}
                aria-label="Remove reference image"
                className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-background/90 text-foreground"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </div>
            <select
              value={ref.type}
              onChange={(e) => setType(ref.id, e.target.value as ReferenceType)}
              aria-label="Reference image type"
              className="w-full border-t border-border bg-card px-2 py-1.5 font-mono text-[10px] text-muted-foreground outline-none"
            >
              {(Object.keys(TYPE_LABELS) as ReferenceType[]).map((t) => (
                <option key={t} value={t}>
                  {TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
        ))}

        {value.length < MAX_REFERENCES && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            aria-label="Add a reference image"
            className="flex aspect-square w-full flex-col items-center justify-center gap-1.5 rounded-[var(--radius-image)] border border-dashed border-border text-muted-foreground transition-colors duration-[var(--duration-hover)] hover:border-muted-foreground hover:text-foreground"
          >
            <Plus className="size-4" aria-hidden="true" />
            <span className="text-[11px]">Add</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(e) => {
          addFile(e.target.files?.[0]);
          if (inputRef.current) inputRef.current.value = "";
        }}
      />
    </div>
  );
}