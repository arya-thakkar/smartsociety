"use client";

export const dynamic = 'force-dynamic';

import { Card } from "@/components/ui/Card";
import { 
  CheckCircle2, Calendar, Dumbbell, Waves, 
  Building2, Sparkles, Clock, ArrowRight,
  ShieldCheck, Activity, Info
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

const AMENITIES = [
  { id: 1, name: "Premium Gymnasium", icon: Dumbbell, available: true, slots: ["07:00 AM", "08:00 AM", "05:00 PM", "06:00 PM"], color: "emerald" },
  { id: 2, name: "Infinity Pool", icon: Waves, available: true, slots: ["06:00 AM", "07:00 AM", "04:00 PM"], color: "blue" },
  { id: 3, name: "Grand Community Hall", icon: Building2, available: false, slots: [], color: "amber" },
];

export default function ResidentAmenities() {
  const [booked, setBooked] = useState<string | null>(null);

  return (
    <div className="space-y-12 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black font-heading tracking-tight text-white uppercase tracking-widest">
            Facility <span className="text-primary tracking-normal">Access</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium italic">Schedule your session in society premium amenities</p>
        </div>
        <div className="hidden lg:flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
           <Info size={16} className="text-primary" />
           <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Bookings open 48h in advance</p>
        </div>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {booked && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-24 right-8 z-[100] w-full max-w-sm"
          >
            <Card className="p-6 bg-emerald-500 text-white shadow-glow-primary border-0 rounded-[2rem] flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                 <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Access Granted</p>
                <p className="font-bold">Reserved: {booked}</p>
              </div>
              <button onClick={() => setBooked(null)} className="ml-auto opacity-60 hover:opacity-100">
                 <CheckCircle2 size={20} />
              </button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Amenities Registry */}
      <div className="grid gap-8">
        {AMENITIES.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-1 glass-card border-white/5 group hover:border-primary/30 transition-all overflow-hidden relative">
              <div className="p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-10 bg-gradient-to-r from-white/[0.02] to-transparent">
                
                {/* Info Block */}
                <div className="flex items-start gap-6 flex-1">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-premium">
                      <a.icon size={28} />
                    </div>
                    {a.available && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors tracking-tight uppercase">{a.name}</h2>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${a.available ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>
                        {a.available ? "Ready" : "Maintenance"}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                       <span className="flex items-center gap-2"><Clock size={14} className="text-primary" /> Daily Operations</span>
                       <span className="flex items-center gap-2"><Activity size={14} className="text-primary" /> Multi-Slot Access</span>
                    </div>
                  </div>
                </div>

                {/* Slots Block */}
                {a.available && a.slots.length > 0 ? (
                  <div className="flex-1 max-w-xl">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Calendar size={12} className="text-primary" /> Establish Session Start
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {a.slots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setBooked(`${a.name} • ${slot}`)}
                          className="px-5 py-3 rounded-xl border border-white/5 bg-white/[0.03] text-sm font-bold text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/10 transition-all flex items-center gap-3"
                        >
                          <Clock size={14} className="opacity-40" />
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center lg:items-end justify-center text-center lg:text-right flex-1">
                     <p className="text-xs font-bold text-red-500/60 uppercase tracking-widest mb-1 italic">Facility Currently Offline</p>
                     <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Contact society manager for updates</p>
                  </div>
                )}

                <div className="lg:pl-8 border-l border-white/5 hidden lg:block">
                   <button className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-700 hover:text-white transition-all border border-transparent hover:border-white/10 translate-x-4">
                      <ArrowRight size={24} />
                   </button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* AI Advisory Section */}
      <Card className="relative overflow-hidden group p-10 rounded-[3rem] bg-indigo-500/5 border border-white/5 mt-12">
          <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:opacity-10 transition-all rotate-12 group-hover:rotate-0">
             <Sparkles size={180} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
             <div className="h-20 w-20 rounded-[2.5rem] bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-400/20 shadow-glow-primary">
                <ShieldCheck size={40} />
             </div>
             <div className="space-y-4 max-w-2xl">
                <h3 className="text-2xl font-black text-foreground tracking-tight uppercase tracking-widest">Intelligent Fair-Usage Policy</h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">
                   Our AI scoring engine automates session approvals. Frequent users have lower standing than first-time visitors to ensure equitable access for all residents. <span className="text-primary hover:underline cursor-pointer">View my Standing Score</span>.
                </p>
             </div>
          </div>
      </Card>
    </div>
  );
}
