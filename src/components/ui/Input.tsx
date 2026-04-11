import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        <input
          className={cn(
            "flex h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:border-white/20",
            error && "border-accent-error/50 focus-visible:ring-accent-error/50",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <span className="text-xs text-accent-error font-medium mt-1">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
