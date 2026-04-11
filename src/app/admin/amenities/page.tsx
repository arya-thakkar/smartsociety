"use client";

export const dynamic = 'force-dynamic';

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, X, Dumbbell, Waves, Building2, 
  Calendar, Clock, ArrowRight, ChevronRight, 
  Activity, Sparkles, AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { aiEngine, Booking, ResidentProfile } from "@/lib/aiEngine";

const AMENITIES = [
  { id: 1, name: "Gymnasium", icon: Dumbbell, available: true, capacity: 20, booked: 12 },
  { id: 2, name: "Swimming Pool", icon: Waves, available: true, capacity: 30, booked: 25 },
  { id: 3, name: "Community Hall", icon: Building2, available: false, capacity: 100, booked: 100 },
];

// Mock Resident Profiles for AI Decision Making
const RESIDENT_PROFILES: Record<string, ResidentProfile> = {
  "Priya Mehta": { name: "Priya Mehta", role: "Admin", monthlyUsageCount: 4, lastUsageDate: "2026-04-05" },
  "Rohan Sharma": { name: "Rohan Sharma", role: "Resident", monthlyUsageCount: 1, lastUsageDate: "2026-03-20" },
  "Anjali Singh": { name: "Anjali Singh", role: "Resident", monthlyUsageCount: 8, lastUsageDate: "2026-04-10" },
};

const INITIAL_BOOKINGS: Booking[] = [
  { id: 1, resident: "Priya Mehta", amenity: "Community Hall", date: "Apr 15, 2026", time: "6PM – 10PM", status: "pending", requestedAt: "2026-04-11T09:00:00Z" },
  { id: 2, resident: "Rohan Sharma", amenity: "Gymnasium", date: "Apr 12, 2026", time: "7AM – 8AM", status: "pending", requestedAt: "2026-04-11T10:30:00Z" },
  { id: 3, resident: "Anjali Singh", amenity: "Swimming Pool", date: "Apr 13, 2026", time: "5PM – 6PM", status: "approved", requestedAt: "2026-04-10T14:00:00Z", reasoning: "Manual early approval." },
];

export default function AmenitiesPage() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [isProcessing, setIsProcessing] = useState(false);

  const updateStatus = (id: number, status: any) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const runAIProcessor = () => {
    setIsProcessing(true);
    
    // Simulate complex AI processing time
    setTimeout(() => {
      setBookings(prev => {
        const pending = prev.filter(b => b.status === "pending");
        const approved = prev.filter(b => b.status === "approved" || b.status === "rejected");
        
        const processed = aiEngine.processPending(pending, approved, RESIDENT_PROFILES);
        
        return prev.map(original => {
          const update = processed.find(p => p.id === original.id);
          return update ? update : original;
        });
      });
      setIsProcessing(false);
    }, 1800);
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black font-heading tracking-tight text-white uppercase tracking-widest">Amenities <span className="text-primary tracking-normal">Status</span></h1>
          <p className="text-gray-500 mt-2 font-medium italic">Live utility metrics and AI-driven facility management</p>
        </div>
        <div className="flex gap-4">
           <Button 
            onClick={runAIProcessor} 
            disabled={isProcessing}
            className="rounded-2xl h-12 px-8 shadow-glow-primary font-black uppercase tracking-widest text-xs gap-3 bg-primary text-primary-foreground hover:bg-white hover:text-primary transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <Activity size={16} className="animate-spin" />
            ) : (
              <Sparkles size={16} />
            )}
            {isProcessing ? "Analyzing Requests..." : "Run AI Auto-Processor"}
          </Button>
        </div>
      </div>

      {/* Amenity Status Grid */}
      <div className="grid gap-8 sm:grid-cols-3">
        {AMENITIES.map((a, i) => {
          const pct = Math.round((a.booked / a.capacity) * 100);
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, ease: "easeOut" }}
            >
              <Card className="p-8 space-y-8 glass-card hover:border-primary/40 transition-all group relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12 translate-x-4 -translate-y-4">
                   <a.icon size={120} />
                </div>
                <div className="flex justify-between items-start relative z-10">
                  <div className="p-4 rounded-3xl bg-white/5 border border-white/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all transform group-hover:-translate-y-1 shadow-premium">
                    <a.icon size={28} />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border shadow-lg ${a.available ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5" : "bg-red-500/10 text-red-500 border-red-500/20 shadow-red-500/5"}`}>
                    {a.available ? "Operational" : "Capacity Full"}
                  </span>
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors tracking-tight">{a.name}</h3>
                  <div className="flex items-center gap-3 mt-3">
                     <div className="flex -space-x-2">
                        {[1,2,3].map(i => <div key={i} className="h-6 w-6 rounded-full border-2 border-secondary bg-slate-800" />)}
                     </div>
                     <p className="text-xs text-gray-500 font-black uppercase tracking-widest leading-none mt-1">{a.booked} / {a.capacity} slots</p>
                  </div>
                </div>
                <div className="space-y-3 relative z-10">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-600">
                      <span>Utilisation</span>
                      <span className={pct >= 100 ? "text-red-500" : pct >= 70 ? "text-amber-500" : "text-emerald-500"}>{pct}%</span>
                   </div>
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full transition-all duration-1000 ${pct >= 100 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Booking Requests */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
             <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-primary">
                <Activity size={24} />
             </div>
             <div>
              <h2 className="text-2xl font-black font-heading text-foreground tracking-tight uppercase tracking-widest">Booking Intel</h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">AI-assisted residency traffic monitoring</p>
             </div>
          </div>
        </div>
        
        <div className="space-y-4 pb-12">
          {bookings.map((b, i) => {
            const isAIProcessed = b.reasoning && (b.status === "approved" || b.status === "rejected" || b.status === "waitlisted");
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`p-3 pl-6 flex flex-col lg:flex-row lg:items-center justify-between gap-8 glass-card border-white/5 hover:border-white/10 transition-all ${isAIProcessed ? 'ring-1 ring-primary/20' : ''}`}>
                  <div className="flex items-center gap-6 flex-1">
                    <div className="h-14 w-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center font-black text-gray-600 text-xl group-hover:text-primary group-hover:border-primary/20 transition-all shadow-premium">
                      {b.resident.charAt(0)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{b.resident}</h4>
                        {b.score && (
                          <span className="text-[10px] font-black bg-white/5 px-2 py-0.5 rounded-lg text-gray-500 border border-white/5">
                            SCORE: {b.score}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center flex-wrap gap-x-6 gap-y-2 text-[11px] text-gray-500 font-black uppercase tracking-[0.15em]">
                         <span className="flex items-center gap-2 opacity-80"><Building2 size={14} className="text-primary"/> {b.amenity}</span>
                         <span className="flex items-center gap-2 opacity-80"><Calendar size={14} className="text-primary"/> {b.date}</span>
                         <span className="flex items-center gap-2 opacity-80"><Clock size={14} className="text-primary"/> {b.time}</span>
                      </div>
                      
                      {b.reasoning && (
                        <div className="flex items-start gap-2 text-xs font-medium text-emerald-400/80 italic mt-2 animate-in fade-in slide-in-from-left-2 transition-all">
                           <Sparkles size={14} className="shrink-0 mt-0.5 text-primary" />
                           <span>AI Logic: {b.reasoning}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-4 px-4 lg:px-6 py-2 lg:py-0 border-t lg:border-t-0 border-white/5">
                    {b.status === "pending" ? (
                      <div className="flex gap-3">
                         <button 
                          onClick={() => updateStatus(b.id, "approved")}
                          className="h-12 px-8 rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                        >
                          <Check size={16} /> Authorize
                        </button>
                        <button 
                          onClick={() => updateStatus(b.id, "rejected")}
                          className="h-12 px-8 rounded-2xl bg-white/5 text-gray-400 border border-white/10 hover:border-red-500/30 hover:text-red-500 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                        >
                          <X size={16} /> Deny
                        </button>
                      </div>
                    ) : (
                      <div className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-2xl border transition-all ${b.status === "approved" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-glow-primary/5" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>
                        {b.status === "approved" ? <Check size={14} /> : <X size={14} />}
                        {b.status} Protocol {isAIProcessed && <span className="ml-1 opacity-50 text-[8px]">(AI)</span>}
                      </div>
                    )}
                    <button className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-600 hover:text-white transition-all border border-transparent hover:border-white/10 group-hover:translate-x-1">
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
