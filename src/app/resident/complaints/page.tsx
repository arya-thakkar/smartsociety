"use client";

export const dynamic = 'force-dynamic';

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { 
  Mic, MicOff, Send, Loader2, Wand2, 
  MessageSquare, ShieldCheck, Sparkles, 
  Activity, Clock, ChevronRight, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResidentComplaints() {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleMic = () => {
    setListening((l) => !l);
    if (!listening) {
      setTimeout(() => {
        setText("The elevator in B block has not been working since yesterday morning. Multiple residents are affected especially senior citizens. Please fix it urgently.");
        setListening(false);
      }, 3000);
    }
  };

  const improveWithAI = () => {
    setAiProcessing(true);
    setTimeout(() => {
      setText("The elevator in Block B has been non-functional since yesterday morning (April 9th, 2026). This is causing significant inconvenience, particularly for senior citizens. Immediate repair is requested on priority.");
      setAiProcessing(false);
    }, 2500);
  };

  const submit = () => {
    setSubmitted(true);
    setText("");
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-foreground">
        <div>
          <h1 className="text-4xl font-black font-heading tracking-tight text-white uppercase tracking-widest">Support <span className="text-primary tracking-normal font-heading">Protocol</span></h1>
          <p className="text-gray-500 mt-2 font-medium italic">Initialize a support request or report society infrastructure deviations</p>
        </div>
        <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
           <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Response Channels Active</span>
        </div>
      </div>

      <AnimatePresence>
        {submitted && (
          <motion.div initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }}>
            <Card className="p-6 bg-emerald-500 text-white shadow-glow-primary border-0 rounded-[2rem] flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
                 <ShieldCheck size={24} />
              </div>
              <p className="font-bold">Protocol Dispatch Successful! You will be notified of resolution steps.</p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <Card className="p-10 glass-card border-white/5 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <MessageSquare size={120} />
            </div>

            <div className="flex justify-center relative z-10">
              <motion.button
                onClick={toggleMic}
                whileTap={{ scale: 0.93 }}
                animate={listening ? { 
                  boxShadow: ["0 0 0 0 rgba(239,68,68,0.4)", "0 0 0 30px rgba(239,68,68,0)", "0 0 0 0 rgba(239,68,68,0)"] 
                } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className={`w-32 h-32 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 transition-all duration-500 border-4 ${
                  listening
                    ? "bg-red-500 border-white/20 text-white"
                    : "bg-white/5 border-white/5 text-primary hover:border-primary/40"
                }`}
              >
                {listening ? <MicOff size={36} /> : <Mic size={36} />}
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {listening ? "CAPTURING" : "VOICE LOG"}
                </span>
              </motion.button>
            </div>

            <div className="space-y-4 relative z-10">
              <label className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-500">Incident Intelligence</label>
              <textarea
                className="w-full rounded-[2rem] border border-white/10 bg-white/5 px-8 py-6 text-lg font-medium text-white placeholder:text-gray-600 focus:outline-none focus:border-primary min-h-[200px] resize-none transition-all leading-relaxed"
                placeholder="Describe the issue, or utilize the Tactical Audio sphere to dictate..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <div className="flex gap-4 flex-wrap relative z-10">
              <Button 
                variant="outline" 
                onClick={improveWithAI} 
                disabled={!text || aiProcessing} 
                className="h-16 flex-1 rounded-2xl border-white/10 bg-white/5 text-gray-400 font-black uppercase tracking-widest text-xs gap-3 hover:text-primary hover:border-primary/30 transition-all"
              >
                {aiProcessing ? <Loader2 size={16} className="animate-spin text-primary" /> : <Sparkles size={16} className="text-primary" />}
                {aiProcessing ? "Processing..." : "AI Intelligence Polish"}
              </Button>
              <Button 
                onClick={submit} 
                disabled={!text || aiProcessing} 
                className="h-16 flex-1 rounded-2xl font-black uppercase tracking-widest text-xs gap-3 shadow-glow-primary"
              >
                <Send size={16} /> Submit Support Request
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="p-8 glass-card border-white/5">
            <h2 className="text-xl font-black font-heading text-white uppercase tracking-widest mb-8 flex items-center gap-3">
               <Activity size={20} className="text-primary" />
               Historical Intel
            </h2>
            <div className="space-y-4">
              {[
                { title: "Water infrastructure Leakage", status: "resolved", date: "Mar 28, 2026", priority: "high" },
                { title: "Lighting failure – Entry Sector", status: "in-progress", date: "Apr 03, 2026", priority: "medium" },
              ].map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col gap-3 p-5 rounded-[1.5rem] bg-white/[0.02] border border-white/5 group hover:border-primary/20 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                     <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{c.title}</span>
                     <ChevronRight size={14} className="text-gray-700 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-1.5 align-middle">
                       <Clock size={10} className="text-primary" /> {c.date}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      c.status === "resolved" 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {c.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="p-8 border-white/5 bg-indigo-500/5 rounded-[2rem] relative overflow-hidden group">
              <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-all rotate-12 group-hover:rotate-0">
                 <AlertCircle size={140} />
              </div>
              <div className="relative z-10 flex items-start gap-5">
                 <div className="h-10 w-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center shrink-0">
                    <AlertCircle size={24} />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-sm font-black text-foreground tracking-tight uppercase tracking-widest">Escalation Intel</h3>
                    <p className="text-[10px] text-gray-400 font-bold leading-relaxed uppercase tracking-wider">
                       Serious deviations are dispatched directly to the Society Admin and local security threads.
                    </p>
                 </div>
              </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
