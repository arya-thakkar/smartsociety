"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  LayoutDashboard, Users, UserSquare2, Shield, CalendarDays,
  MessageSquare, CheckSquare, Presentation, Wallet, Settings,
  QrCode, ScanLine, ClipboardList, Mic
} from "lucide-react";

type NavItem = { name: string; href: string; icon: React.ElementType };

const NAV_CONFIG: Record<string, NavItem[]> = {
  admin: [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Members", href: "/admin/members", icon: Users },
    { name: "Staff", href: "/admin/staff", icon: UserSquare2 },
    { name: "Gate Logs", href: "/admin/logs", icon: Shield },
    { name: "Amenities", href: "/admin/amenities", icon: CalendarDays },
    { name: "Communications", href: "/admin/complaints", icon: MessageSquare },
    { name: "Tasks", href: "/admin/tasks", icon: CheckSquare },
    { name: "Meetings", href: "/admin/meetings", icon: Presentation },
    { name: "Finance", href: "/admin/finance", icon: Wallet },
    { name: "Profile", href: "/admin/profile", icon: Settings },
  ],
  resident: [
    { name: "Overview", href: "/resident", icon: LayoutDashboard },
    { name: "Guests", href: "/resident/guests", icon: QrCode },
    { name: "Tasks", href: "/resident/tasks", icon: CheckSquare },
    { name: "Meetings", href: "/resident/meetings", icon: Presentation },
    { name: "Amenities", href: "/resident/amenities", icon: CalendarDays },
    { name: "Maintenance", href: "/resident/maintenance", icon: Wallet },
    { name: "Complaints", href: "/resident/complaints", icon: Mic },
    { name: "Profile", href: "/resident/profile", icon: Settings },
  ],
  guard: [
    { name: "Scanner", href: "/guard", icon: ScanLine },
    { name: "Gate Logs", href: "/guard/logs", icon: ClipboardList },
    { name: "Tasks", href: "/guard/tasks", icon: CheckSquare },
    { name: "Complaints", href: "/guard/complaints", icon: MessageSquare },
    { name: "Voice Log", href: "/guard/voice", icon: Mic },
    { name: "Profile", href: "/guard/profile", icon: Settings },
  ],
};

interface SidebarProps {
  role: "admin" | "resident" | "guard";
  isOpen?: boolean;
  onClose?: () => void;
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Secretary Panel",
  resident: "Resident Panel",
  guard: "Security Panel",
};

export const Sidebar = ({ role, isOpen = false, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const items = NAV_CONFIG[role] ?? [];

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-secondary border-r border-white/5">
      <div className="h-20 flex items-center px-8 border-b border-white/5 shrink-0">
        <div className="flex-1">
          <Link href={`/${role}`} className="group cursor-pointer">
            <h1 className="text-xl font-black font-heading text-foreground tracking-tight transition-all group-hover:tracking-normal">
              Smart<span className="text-primary group-hover:text-primary-light transition-colors">Society</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
               <div className="h-1 w-1 rounded-full bg-primary" />
               <span className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                {ROLE_LABELS[role]}
              </span>
            </div>
          </Link>
        </div>
        <button
          onClick={onClose}
          className="md:hidden p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
        {items.map((item) => {
          const isRoot = item.href === `/${role}`;
          const isActive = isRoot 
            ? pathname === item.href 
            : (pathname === item.href || pathname.startsWith(`${item.href}/`));
            
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group",
                isActive
                  ? "text-primary font-bold bg-primary/10"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
              )}
            >
              <item.icon size={18} className={cn("relative z-10 shrink-0", isActive ? "text-primary" : "group-hover:text-primary transition-colors")} />
              <span className="relative z-10 text-sm tracking-wide">{item.name}</span>
              {isActive && (
                 <motion.div 
                   layoutId="active-indicator"
                   className="absolute left-0 w-1 h-5 bg-primary rounded-r-full"
                   transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                 />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-8 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-3">
           <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-gray-500">
              {role.charAt(0).toUpperCase()}
           </div>
           <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-foreground truncate">Society Admin</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Online</p>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 w-64 hidden md:block">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-30 bg-black/80 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 z-40 w-72 md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
