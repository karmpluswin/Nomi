"use client";

import * as React from "react";
import Image from "next/image";
import { Upload, X, ImageOff } from "lucide-react";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_EXT = ".jpg,.jpeg,.png,.webp";
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export interface ProductDropzoneProps {
  onFileSelect?: (file: File) => void;
  className?: string;
}

export function ProductDropzone({
  onFileSelect,
  className,
}: ProductDropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const validateAndSet = (file: File | undefined) => {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please use a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError("That file is too large — 10MB max.");
      return;
    }

    setError(null);
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    onFileSelect?.(file);
  };

  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    validateAndSet(e.dataTransfer.files?.[0]);
  };

  const clear = () => {
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setFileName(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={className} suppressHydrationWarning>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXT}
        className="sr-only"
        onChange={(e) => validateAndSet(e.target.files?.[0])}
      />

      {preview ? (
        <div className="relative overflow-hidden rounded-[var(--radius-image)] border border-border">
          <div className="relative aspect-[4/5] w-full">
            <Image
              src={preview}
              alt={fileName ?? "Selected product photo"}
              fill
              sizes="(min-width: 768px) 400px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-border bg-card px-3 py-2">
            <span className="truncate font-mono text-xs text-muted-foreground">
              {fileName}
            </span>
            <button
              type="button"
              onClick={clear}
              aria-label="Remove photo"
              className="flex size-7 shrink-0 items-center justify-center rounded-[var(--radius-control)] text-muted-foreground transition-colors duration-[var(--duration-hover)] hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload a product photo"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={
            "flex aspect-[4/5] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-[var(--radius-image)] border border-dashed px-6 text-center outline-none transition-colors duration-[var(--duration-hover)] " +
            (isDragOver
              ? "border-foreground bg-muted"
              : "border-border hover:border-muted-foreground") +
            " focus-visible:border-foreground focus-visible:ring-3 focus-visible:ring-ring/30"
          }
        >
          <Upload className="size-6 text-muted-foreground" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Drop a product photo here
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              or click to browse — JPG, PNG, or WEBP, up to 10MB
            </p>
          </div>
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="mt-2 flex items-center gap-1.5 text-xs text-destructive"
        >
          <ImageOff className="size-3.5" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
