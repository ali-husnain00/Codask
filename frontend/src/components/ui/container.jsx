import React from "react";
import { cn } from "../../lib/utils";

export function Container({ className, ...props }) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1200px] px-6",
        className
      )}
      {...props}
    />
  );
}
