import React from "react";
import { cn } from "../../lib/utils";

function Separator({ className, ...props }) {
  return (
    <div
      role="separator"
      className={cn("h-px w-full bg-[var(--border)]", className)}
      {...props}
    />
  );
}

export { Separator };
