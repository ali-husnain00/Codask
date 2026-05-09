import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius)] border px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
  variants: {
    variant: {
      default: "border-transparent bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]",
      secondary: "border-transparent bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--surface-soft)]",
      outline: "border-[var(--border)] bg-transparent text-[var(--text)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]",
      danger: "border-transparent bg-[var(--danger)] text-[var(--destructive-foreground)] hover:bg-[var(--danger)]/90",
      ghost: "border-transparent bg-transparent text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const Button = React.forwardRef(({ className, variant, ...props }, ref) => (
  <button
    className={cn(buttonVariants({ variant }), className)}
    ref={ref}
    {...props}
  />
));

Button.displayName = "Button";

export { Button, buttonVariants };
