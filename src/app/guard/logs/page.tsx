"use client";

export const dynamic = 'force-dynamic';

import { Card } from "@/components/ui/Card";
import { ArrowDownLeft, ArrowUpRight, User, ShieldCheck, Activity, Clock, Shield } from "lucide-react";
import { motion } from "framer-motion";

const LOGS = [
  { id: 1, name: "Raj Kapoor", type: "visitor", direction: "in", flat: "C-204", time: "09:12 AM" },
  { id: 2, name: "Sunita Devi", type: "staff", direction: "in", flat: "A Wing", time: "08:55 AM" },
  { id: 3, name: "Amazon Delivery", type: "visitor", direction: "out", flat: "A-402", time: "11:30 AM" },
  // Vehicle removed as per user requirement
];

const BADGE: Record<string, string> = {
  visitor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  staff: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export default function GuardLogs() {
  return (
    <div className="space-y-12 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-foreground">
        <div>
          <h1 className="text-4xl font-black font-heading tracking-tight uppercase tracking-widest text-white">Gate <span className="text-primary tracking-normal font-heading">Protocol</span></h1>
          <p className="text-gray-500 mt-2 font-medium italic">Verified log of residential entries and tactical exits</p>
        </div>
        <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
           <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Security Gate Online</span>
        </div>
      </div>

      <Card className="p-0 overflow-hidden glass-card border-white/5">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-primary">
                <Activity size={24} />
             </div>
             <div>
                <h2 className="text-xl font-black font-heading text-white uppercase tracking-widest">Today&apos;s Registry</h2>
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1">Real-time attendance monitoring</p>
             </div>
          </div>
          <div className="flex gap-2">
             <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-primary uppercase tracking-widest">
                {LOGS.length} RECORDS
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.03] text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="text-left px-8 py-6">Individual</th>
                <th className="text-left px-8 py-6">Classification</th>
                <th className="text-left px-8 py-6">Premises</th>
                <th className="text-left px-8 py-6">Vector</th>
                <th className="text-left px-8 py-6">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {LOGS.map((l, i) => (
                <motion.tr 
                  key={l.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-600 group-hover:text-primary transition-all duration-300">
                          <User size={18} />
                       </div>
                       <span className="font-bold text-foreground group-hover:text-primary transition-colors text-lg tracking-tight">{l.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${BADGE[l.type]}`}>
                      {l.type}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-bold font-mono text-gray-400 group-hover:text-white transition-colors">
                     {l.flat}
                  </td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl border ${l.direction === "in" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>
                      {l.direction === "in" ? <ShieldCheck size={14} /> : <ArrowUpRight size={14} />}
                      {l.direction === "in" ? "Secure Entry" : "Tactical Exit"}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                        <Clock size={14} className="text-primary/50" />
                        {l.time}
                     </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Security Advisory */}
      <Card className="p-8 border-white/5 bg-primary/5 rounded-[2rem] relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:opacity-10 transition-all rotate-12 group-hover:rotate-0">
             <Shield size={180} />
          </div>
          <div className="relative z-10 flex items-start gap-6">
             <div className="h-12 w-12 rounded-2xl bg-primary text-black flex items-center justify-center shrink-0 shadow-glow-primary">
                <Shield size={28} />
             </div>
             <div className="space-y-2 max-w-2xl">
                <h3 className="text-lg font-black text-foreground tracking-tight uppercase tracking-widest">Protocol Integrity</h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed italic">
                   All gate entries must be authorized via the digital resident pass system. Vehicles have been moved to the automated LPR (License Plate Recognition) track and no longer appear in manual person logs.
                </p>
             </div>
          </div>
      </Card>
    </div>
  );
}
