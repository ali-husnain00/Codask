import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors border",
  {
  variants: {
    variant: {
      default: "border-transparent bg-[var(--primary)] text-[var(--primary-foreground)]",
      secondary: "border-transparent bg-[var(--secondary)] text-[var(--secondary-foreground)]",
      outline: "text-[var(--text)] border-[var(--border)]",
      success: "border-transparent bg-[var(--success)]/20 text-[var(--success)]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
