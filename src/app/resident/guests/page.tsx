"use client";

export const dynamic = 'force-dynamic';

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { 
  QrCode, UserPlus, ShieldCheck, Share2, 
  MapPin, Clock, Calendar, AlertCircle,
  Copy, Smartphone, ScanFace, Activity,
  Zap, ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResidentGuestsPage() {
  const [guestName, setGuestName] = useState("");
  const [showQR, setShowQR] = useState(false);

  const generatePass = () => {
    if (!guestName) return;
    setShowQR(true);
  };

  return (
    <div className="space-y-12 pb-10">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-foreground">
        <div>
          <h1 className="text-4xl font-black font-heading tracking-tight text-white uppercase tracking-widest">
            Guest <span className="text-primary tracking-normal font-heading">Clearance</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium italic">Generate secure digital entry permits for authorized visitors</p>
        </div>
        <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 shadow-premium">
           <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.6)]" />
           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Security Mesh Online</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-12">
        {/* Pass Generation Form */}
        <section className="lg:col-span-3 space-y-10">
           <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-primary shadow-premium">
                 <UserPlus size={28} />
              </div>
              <div>
                 <h2 className="text-2xl font-black font-heading text-white uppercase tracking-widest">Register Visitor</h2>
                 <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1 italic">Initiate guest authorization protocol</p>
              </div>
           </div>

           <Card className="p-10 glass-card border-white/5 space-y-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-all">
                 <Activity size={120} className="text-primary" />
              </div>
              
              <div className="space-y-3">
                 <label className="text-[10px] uppercase font-black tracking-widest text-gray-500">Legal Guest Designation</label>
                 <Input 
                   placeholder="e.g. Michael Scofield" 
                   value={guestName}
                   onChange={(e) => setGuestName(e.target.value)}
                   className="bg-white/5 border-white/10 h-16 text-xl font-black text-white placeholder-gray-800" 
                 />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black tracking-widest text-gray-500">Estimated Arrival Date</label>
                    <Input type="date" className="bg-white/5 border-white/10 h-16 text-white font-bold" defaultValue="2026-04-11" />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black tracking-widest text-gray-500">Scheduled Time Window</label>
                    <Input type="time" className="bg-white/5 border-white/10 h-16 text-white font-bold" defaultValue="18:30" />
                 </div>
              </div>

              <div className="pt-6">
                 <Button onClick={generatePass} className="w-full h-16 rounded-[1.8rem] font-black uppercase tracking-widest text-xs shadow-glow-primary gap-4">
                    <QrCode size={22} /> Deploy Digital Clearance Pass
                 </Button>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-[1.8rem] bg-amber-500/10 border border-primary/20 shadow-premium">
                 <div className="h-10 w-10 rounded-xl bg-primary text-black flex items-center justify-center shrink-0">
                    <Zap size={20} />
                 </div>
                 <p className="text-[11px] text-primary/80 font-black uppercase tracking-widest leading-relaxed">
                    Clearance is valid for 240 minutes post-arrival. <br/> Integrated gate protocol will trigger resident notification upon successful scan.
                 </p>
              </div>
           </Card>
        </section>

        {/* Pass Preview (QR) */}
        <section className="lg:col-span-2 flex flex-col items-center justify-center min-h-[500px]">
           <AnimatePresence mode="wait">
              {showQR ? (
                <motion.div
                  key="qr-pass"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="w-full max-w-md"
                >
                  <Card className="p-1 glass-card border-primary/30 rounded-[3.5rem] overflow-hidden bg-gradient-to-br from-primary/20 via-primary/5 to-transparent shadow-glow-primary/20">
                     <div className="bg-[#080B14]/60 backdrop-blur-3xl rounded-[3.3rem] p-10 space-y-10 flex flex-col items-center relative overflow-hidden">
                        {/* Background HUD elements */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #FACC15 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                        
                        <div className="text-center space-y-2 relative z-10">
                           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Biometric Entry Pass</p>
                           <h3 className="text-3xl font-black text-white tracking-tight uppercase">{guestName || 'GUEST PASS'}</h3>
                        </div>

                        {/* Premium QR Container */}
                        <motion.div 
                           className="relative p-8 bg-white rounded-[2.5rem] shadow-[0_0_40px_rgba(250,204,21,0.3)] group cursor-pointer hover:scale-105 transition-all"
                           whileHover={{ rotate: 1 }}
                        >
                           <div className="p-3 border-4 border-gray-100 rounded-2xl">
                              <QrCode size={200} className="text-black" />
                           </div>
                           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/60 backdrop-blur-sm rounded-[2.5rem]">
                              <ShieldCheck size={64} className="text-primary drop-shadow-2xl" />
                           </div>
                           {/* Scanning Line Animation */}
                           <motion.div 
                              className="absolute top-0 left-0 right-0 h-1 bg-primary/40 shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                              animate={{ y: [0, 260] }}
                              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                           />
                        </motion.div>

                        <div className="space-y-6 w-full relative z-10">
                           <Card className="p-6 rounded-[1.8rem] bg-white/[0.03] border border-white/5 space-y-4">
                              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
                                 <span>Host Protocol</span>
                                 <span className="text-emerald-500 flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Account Verified
                                 </span>
                              </div>
                              <div className="flex items-center gap-5">
                                 <div className="h-12 w-12 rounded-2xl bg-primary text-black flex items-center justify-center font-black text-lg shadow-glow-primary">JD</div>
                                 <div className="text-left">
                                    <p className="text-lg font-black text-white tracking-tight leading-none">John Doe</p>
                                    <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest mt-2 flex items-center gap-2 italic">
                                       <MapPin size={12} className="text-primary/50" /> Unit A-101 • Orion Mesh
                                    </p>
                                 </div>
                              </div>
                           </Card>

                           <div className="grid grid-cols-2 gap-4">
                              <Button variant="outline" className="h-16 rounded-[1.5rem] border-white/5 text-gray-500 gap-3 font-black uppercase tracking-widest text-[9px] hover:text-white transition-all">
                                 <Share2 size={16} /> Link Transfer
                              </Button>
                              <Button variant="outline" className="h-16 rounded-[1.5rem] border-white/5 text-gray-500 gap-3 font-black uppercase tracking-widest text-[9px] hover:text-white transition-all">
                                 <Copy size={16} /> Pass ID
                              </Button>
                           </div>
                        </div>
                     </div>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="qr-placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center text-center space-y-10 p-12 opacity-30 group"
                >
                  <div className="h-48 w-48 rounded-[3.5rem] border-4 border-dashed border-white/5 flex items-center justify-center relative">
                     <ScanFace size={80} className="text-white/20" />
                     <motion.div 
                        className="absolute inset-0 border-2 border-primary/20 rounded-[3.5rem]"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                     />
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-2xl font-black text-gray-700 uppercase tracking-widest">Protocol Pending</h3>
                     <p className="text-sm text-gray-800 font-bold uppercase tracking-widest max-w-[300px] leading-relaxed italic">Input visitor credentials to generate a mesh-encrypted security clearance permit.</p>
                  </div>
                </motion.div>
              )}
           </AnimatePresence>
        </section>
      </div>

      {/* Security Advisory Footer */}
      <Card className="p-10 border-white/5 bg-primary/5 rounded-[3rem] relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:opacity-10 transition-all rotate-12 group-hover:rotate-0">
             <ShieldAlert size={200} />
          </div>
          <div className="relative z-10 flex items-start gap-8">
             <div className="h-16 w-16 rounded-[2rem] bg-primary text-black flex items-center justify-center shrink-0 shadow-glow-primary">
                <ShieldCheck size={32} />
             </div>
             <div className="space-y-3 max-w-2xl">
                <h3 className="text-xl font-black text-white tracking-tight uppercase tracking-widest">Clearance Protocol</h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed italic">
                   All digital passes are cryptographically linked to the primary host residency. Unauthorized redistribution of entry permits is logged. Gate scanners will perform biometric-OR checks against the generated permit ID.
                </p>
             </div>
          </div>
      </Card>
    </div>
  );
}
