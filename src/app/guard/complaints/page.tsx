"use client";

export const dynamic = 'force-dynamic';

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { MessageSquare, CheckCircle, AlertTriangle, ShieldAlert, Sparkles, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CURRENT = [
  { id: 1, title: "Suspicious vehicle perimeter loitering", status: "Critical", date: "Today, 02:00 AM", priority: "high" },
  { id: 2, title: "Tactical CCTV degradation – D wing", status: "In-Progress", date: "Yesterday, 22:45 PM", priority: "medium" },
];

export default function GuardComplaints() {
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState("");

  return (
    <div className="space-y-12 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black font-heading tracking-tight text-white uppercase tracking-widest">
            Protocol <span className="text-primary tracking-normal">Incidents</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium italic">Standardized reporting for security deviations</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="rounded-2xl h-14 px-8 shadow-glow-primary font-black uppercase tracking-widest text-xs gap-3 bg-primary text-black"
        >
          {showForm ? <X size={16} /> : <AlertTriangle size={16} />}
          {showForm ? "Abort Report" : "Raise Breach Incident"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="p-8 glass-card border-white/5 border-l-4 border-l-primary space-y-6">
                  <div className="flex items-center gap-3 text-primary">
                    <Sparkles size={18} />
                    <h2 className="text-xl font-black uppercase tracking-widest text-white">Generate Intelligence Report</h2>
                  </div>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary min-h-[150px] resize-none font-medium"
                    placeholder="Provide precise details for tactical review..."
                  />
                  <div className="flex gap-4">
                    <Button 
                      className="h-14 px-8 font-black uppercase tracking-widest text-xs shadow-glow-primary"
                      disabled={!text}
                      onClick={() => {
                        setShowForm(false);
                        setText("");
                      }}
                    >
                      <Send size={16} className="mr-2" /> Dispatch Report
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="h-14 px-8 font-black uppercase tracking-widest text-xs text-gray-500"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 flex items-center gap-3">
               <ShieldAlert size={14} className="text-primary" /> Active Investigation Threads
            </h3>
            {CURRENT.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-6 glass-card border-white/5 flex items-start gap-6 group hover:border-primary/20 transition-all">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 group-hover:text-primary transition-all">
                    <MessageSquare size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                       <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors tracking-tight">{c.title}</h4>
                       <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${c.priority === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                          {c.status}
                       </span>
                    </div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                       <Sparkles size={12} className="text-primary" /> Logged {c.date}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
           <Card className="p-8 glass-card border-white/5 bg-gradient-to-br from-indigo-500/10 to-transparent">
              <h3 className="text-lg font-black text-white tracking-tight uppercase tracking-widest flex items-center gap-3">
                 <ShieldAlert size={20} className="text-primary" />
                 Escalation Path
              </h3>
              <p className="text-sm text-gray-500 mt-4 leading-relaxed font-medium">
                 All high-priority incidents are automatically dispatched to the **Society Secretary** and **Central Command**. Ensure data integrity in every report.
              </p>
           </Card>

           <div className="p-8 rounded-[2rem] border border-white/5 bg-white/[0.02] flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
                 <CheckCircle size={40} />
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-widest tracking-widest">Protocol Integrity</h4>
              <p className="text-xs text-gray-500 font-bold mt-2 uppercase tracking-widest leading-relaxed">
                 You have resolved <span className="text-emerald-500">12</span> incident threads this month. Standing score: <span className="text-primary">98%</span>.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
