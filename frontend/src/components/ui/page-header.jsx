import React from "react";
import { cn } from "../../lib/utils";

export function PageHeader({ title, description, children, className, ...props }) {
  return (
    <div className={cn("mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center", className)} {...props}>
      <div className="space-y-1">
        <h2 className="text-[var(--foreground)] tracking-tight">{title}</h2>
        {description && <p className="text-[var(--text-muted)]">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
