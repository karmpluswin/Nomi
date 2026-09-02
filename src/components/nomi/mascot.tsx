import { Pyramid } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MascotProps {
  size?: number;
  className?: string;
}

/**
 * Placeholder mascot — Lucide's Pyramid icon, standing in until a real
 * illustrated Nomi character exists. Used sparingly: brand mark, empty
 * states, first-run, and generation-completion moments only. Never as
 * decoration beside ordinary buttons or controls.
 */
export function Mascot({ size = 20, className }: MascotProps) {
  return (
        <Pyramid
      size={size}
      strokeWidth={2}
      aria-hidden="true"
      className={cn("text-foreground", className)}
    />
  );
}