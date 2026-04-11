"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLMotionProps<"div"> {
  hoverEffect?: boolean;
}

export const Card = ({ className, hoverEffect = true, children, ...props }: CardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "glass-card",
        !hoverEffect && "hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:translate-y-0",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
