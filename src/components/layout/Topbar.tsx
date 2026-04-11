"use client";

import { Bell, LogOut, Menu, Shield, User, Ghost } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface TopbarProps {
  userName: string;
  onMenuClick?: () => void;
}

export const Topbar = ({ userName, onMenuClick }: TopbarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  // Determine current role from pathname
  const currentRole = pathname.includes('/admin') ? 'ADMIN' : 
                      pathname.includes('/resident') ? 'RESIDENT' : 
                      pathname.includes('/guard') ? 'GUARD' : 'ACCESS PORTAL';

  const handleLogout = () => {
    localStorage.removeItem("user_role");
    router.push("/login");
  };

  return (
    <header className="h-16 bg-secondary text-secondary-foreground sticky top-0 z-30 border-b border-white/5 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-6">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-gray-400 hover:bg-white/5 rounded-xl md:hidden transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Static Role Badge */}
        <div className="flex items-center gap-3 px-5 py-2.5 bg-white/[0.03] border border-white/10 rounded-2xl shadow-premium">
          <div className="flex items-center gap-2.5">
             <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
             <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-200">
                {currentRole}
             </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2.5 text-gray-400 hover:bg-white/5 rounded-xl transition-all group">
          <Bell size={20} className="group-hover:text-primary transition-colors" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary border-2 border-secondary" />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-white/5">
          <div className="flex flex-col items-end hidden sm:block">
            <p className="text-xs font-black text-foreground uppercase tracking-tight">{userName}</p>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{currentRole.toLowerCase()} member</p>
          </div>
          <div className="h-10 w-10 min-w-[40px] rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary font-black text-sm shadow-premium">
            {userName.charAt(0)}
          </div>
          <button 
            onClick={handleLogout}
            className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all tooltip"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
