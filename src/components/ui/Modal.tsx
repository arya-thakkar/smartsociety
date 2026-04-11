"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export const Modal = ({ isOpen, onClose, title, children, className }: ModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          
          {/* Modal Content container to help with centering */}
          <div className="flex items-center justify-center min-h-full w-full pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              transition={{ type: "spring", duration: 0.6, bounce: 0.2 }}
              className={cn(
                "relative z-10 w-full max-w-xl glass-card border border-white/10 shadow-premium overflow-hidden pointer-events-auto",
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 p-6 lg:p-8">
                <h2 className="text-xl font-black font-heading text-foreground tracking-tight uppercase tracking-[0.1em]">{title}</h2>
                <button
                  onClick={onClose}
                  className="rounded-xl p-2.5 text-gray-500 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Body */}
              <div className="p-6 lg:p-10">{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
