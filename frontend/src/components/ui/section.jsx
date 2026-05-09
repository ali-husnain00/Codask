import React from "react";
import { cn } from "../../lib/utils";

export function Section({ className, ...props }) {
  return (
    <section
      className={cn(
        "py-16 border-t border-[var(--border)]",
        className
      )}
      {...props}
    />
  );
}
