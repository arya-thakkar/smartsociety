"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
}

export const Button = ({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-2xl font-black uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary-light shadow-[0_0_20px_rgba(250,204,21,0.2)]",
    secondary: "bg-white/5 text-foreground border border-white/10 hover:bg-white/10 hover:border-white/20",
    outline: "border-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground shadow-glow-primary",
    ghost: "hover:bg-white/5 text-gray-400 hover:text-white",
    danger: "bg-accent-error/20 text-accent-error border border-accent-error/20 hover:bg-accent-error hover:text-white",
    success: "bg-accent-success/20 text-accent-success border border-accent-success/20 hover:bg-accent-success hover:text-white",
  };

  const sizes = {
    sm: "h-10 px-5 text-[10px]",
    md: "h-12 px-7 text-xs",
    lg: "h-14 px-10 text-sm",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -2 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
};
