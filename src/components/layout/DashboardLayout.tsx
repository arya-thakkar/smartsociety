"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "admin" | "resident" | "guard";
  userName?: string;
}

export const DashboardLayout = ({
  children,
  role,
  userName = "User",
}: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Dynamic Background Accents */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <Sidebar 
        role={role} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className="relative z-10 flex flex-col min-h-screen md:pl-64 transition-all duration-300">
        <Topbar 
          userName={userName} 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />
        
        <main className="flex-1 p-4 md:p-8 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-7xl mx-auto space-y-10"
          >
            {children}
          </motion.div>
        </main>

        <footer className="p-8 border-t border-white/5 opacity-30 text-[10px] font-bold uppercase tracking-[0.3em] text-center">
          Secure Multi-Tenant Society Protocol v2.4.0
        </footer>
      </div>

      {/* Mobile Sidebar Close logic is inherited from Sidebar overlay */}
    </div>
  );
};
