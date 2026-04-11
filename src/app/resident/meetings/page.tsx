"use client";

export const dynamic = 'force-dynamic';

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { 
  Presentation, Users, Video, Clock, 
  Key, Radio, Signal, ArrowRight,
  ShieldAlert, Sparkles, Hash, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MEETINGS = [
  { id: 1, title: "Annual General Meeting", host: "Society Secretary", time: "Today, 6:30 PM", type: "Hybrid", status: "ongoing", code: "AGM-2026" },
  { id: 2, title: "Garden Subcommittee", host: "Landscape Team", time: "Tomorrow, 10:00 AM", type: "Online", status: "scheduled", code: "GRD-91" },
];

export default function ResidentMeetingsPage() {
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  const handleJoin = () => {
    if (!joinCode) return;
    alert(`Connecting to meeting ${joinCode} via encrypted channel...`);
    setShowJoin(false);
    setJoinCode("");
  };

  return (
    <div className="space-y-12 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-foreground">
        <div>
          <h1 className="text-4xl font-black font-heading tracking-tight">Society <span className="text-primary tracking-normal">Sessions</span></h1>
          <p className="text-gray-500 mt-2 font-medium italic">Join administrative briefings and cooperative society meetings</p>
        </div>
        <Button onClick={() => setShowJoin(true)} className="rounded-2xl h-14 px-8 shadow-glow-primary font-black uppercase tracking-widest text-xs gap-3">
          <Key size={16} /> Enter Meeting Code
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-black font-heading text-foreground uppercase tracking-widest flex items-center gap-3">
                <Video className="text-primary" size={20} />
                Available Streamings
              </h2>
           </div>

           <div className="space-y-6">
              {MEETINGS.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-8 glass-card border-white/5 group hover:border-primary/30 transition-all relative overflow-hidden">
                    {m.status === 'ongoing' && (
                       <div className="absolute top-0 right-0 px-6 py-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest animate-pulse">
                          LIVE NOW
                       </div>
                    )}
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                       <div className="flex items-start gap-6">
                          <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center shrink-0 border shadow-premium transition-all duration-500 ${
                            m.status === 'ongoing' ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-white/5 border-white/10 text-gray-500'
                          }`}>
                             {m.status === 'ongoing' ? <Radio className="animate-pulse" size={28} /> : <Presentation size={28} />}
                          </div>
                          <div className="space-y-2">
                             <div className="flex items-center gap-3">
                                <h3 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">{m.title}</h3>
                             </div>
                             <p className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <Users size={14} className="text-primary/50" /> Hosted by {m.host}
                             </p>
                             <div className="flex items-center gap-5 mt-4 text-[11px] font-black uppercase tracking-[0.15em] text-gray-400">
                                <span className="flex items-center gap-2"><Clock size={14} className="text-primary" /> {m.time}</span>
                                <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5"><Signal size={14} className="text-emerald-500" /> {m.type} Link</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-4">
                          <div className="hidden lg:flex flex-col items-end mr-4">
                             <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Access Key</p>
                             <p className="text-sm font-mono text-primary font-bold">{m.code}</p>
                          </div>
                          <Button className={`h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs shadow-glow-primary transform active:scale-95 transition-all ${
                            m.status === 'ongoing' ? 'bg-primary text-primary-foreground' : 'bg-white/10 border-white/10 text-gray-400 opacity-50 cursor-not-allowed'
                          }`}>
                             Join Virtual Room
                          </Button>
                       </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
           </div>
        </div>

        <div className="space-y-8">
           <Card className="p-8 glass-card border-white/5 bg-indigo-500/5 relative overflow-hidden group">
              <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-20 transition-all rotate-12 group-hover:rotate-0">
                 <Video size={180} className="text-primary" />
              </div>
              <h3 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                <ShieldAlert size={18} className="text-primary" />
                Security Protocol
              </h3>
              <p className="text-sm text-gray-400 mt-3 font-medium leading-relaxed">Residents cannot create new sessions. Meetings are restricted to administrative authorization only. Contact the Secretary for guest access links.</p>
           </Card>

           <div className="p-8 rounded-[2rem] border border-white/5 bg-white/[0.02] space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Archived Briefings</h4>
              <div className="space-y-4">
                 {[1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-600 group-hover:text-primary transition-colors">
                             <Presentation size={18} />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">March Budget Review</p>
                             <p className="text-[10px] font-medium text-gray-600">Mar 15, 2026</p>
                          </div>
                       </div>
                       <ChevronRight size={18} className="text-gray-800 group-hover:text-primary transition-all" />
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      <Modal isOpen={showJoin} onClose={() => setShowJoin(false)} title="Join Secure Session" className="max-w-md">
         <div className="space-y-6 pt-4 text-center">
            <div className="h-20 w-20 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
               <Hash size={32} className="text-primary" />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] uppercase font-black tracking-widest text-foreground opacity-60">Enter 6-Digit Meeting Key</label>
               <Input 
                 placeholder="e.g. AGM-2026" 
                 value={joinCode}
                 onChange={(e) => setJoinCode(e.target.value)}
                 className="bg-white/5 border-white/10 h-16 text-center text-xl font-mono tracking-widest" 
               />
            </div>
            <p className="text-[10px] text-gray-500 font-bold leading-relaxed px-6 uppercase tracking-wider">
               Encryption will be established once you enter the authorized room key.
            </p>
            <Button onClick={handleJoin} className="w-full h-16 font-black uppercase tracking-widest text-xs shadow-glow-primary mt-4">
               Authorize & Connect
            </Button>
         </div>
      </Modal>
    </div>
  );
}
