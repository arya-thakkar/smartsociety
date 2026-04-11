"use client";

export const dynamic = 'force-dynamic';

import { Card } from "@/components/ui/Card";
import { CheckCircle2, Circle, Calendar, Shield, Activity, Clock, Zap } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TASKS = [
  { id: 1, title: "Monitor main gate security baseline", priority: "high", due: "Tonight", done: false },
  { id: 2, title: "Audit basement CCTV tactical storage", priority: "high", due: "Today", done: false },
  { id: 3, title: "Maintain verified visitor registry", priority: "medium", due: "EOD", done: false },
  { id: 4, title: "Collect digital ID from delivery staff", priority: "medium", due: "Ongoing", done: true },
  { id: 5, title: "Dispatch daily patrol intelligence report", priority: "low", due: "Apr 14", done: false },
];

const P_CONFIG: Record<string, { ring: string; badge: string; glow: string; label: string }> = {
  high: { ring: "border-red-500", badge: "bg-red-500/10 text-red-400 border-red-500/20", glow: "shadow-[0_0_20px_rgba(239,68,68,0.1)]", label: "Protocol high" },
  medium: { ring: "border-amber-500", badge: "bg-amber-500/10 text-amber-400 border-amber-500/20", glow: "", label: "Standard" },
  low: { ring: "border-emerald-500", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", glow: "", label: "Routine" },
};

export default function GuardTasks() {
  const [tasks, setTasks] = useState(TASKS);
  const toggle = (id: number) => setTasks((t) => t.map((task) => task.id === id ? { ...task, done: !task.done } : task));

  return (
    <div className="space-y-12 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black font-heading tracking-tight text-white uppercase tracking-widest">
            Tactical <span className="text-primary tracking-normal font-heading">Tasks</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium italic">Operational directives for current security shift</p>
        </div>
        <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
           <Zap size={16} className="text-primary fill-current" />
           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Assignment Intel Live</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-10">
          {["high", "medium", "low"].map((priority) => {
            const group = tasks.filter((t) => t.priority === priority);
            if (!group.length) return null;
            const cfg = P_CONFIG[priority];
            return (
              <div key={priority}>
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-6 flex items-center gap-4">
                   <div className={`h-1.5 w-1.5 rounded-full ${cfg.ring.replace('border-', 'bg-')}`} />
                   {cfg.label} Priority
                </h2>
                <div className="grid gap-4">
                  {group.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Card className={`p-6 flex items-center gap-6 glass-card border-white/5 group hover:border-primary/20 transition-all ${!task.done && priority === "high" ? cfg.glow : ""}`}>
                        <button onClick={() => toggle(task.id)} className="text-gray-600 hover:text-primary transition-all duration-300 shrink-0 transform hover:scale-110">
                          {task.done ? <CheckCircle2 size={24} className="text-emerald-500" /> : <Shield size={24} className="opacity-40" />}
                        </button>
                        <div className="flex-1">
                          <p className={`text-lg font-bold tracking-tight ${task.done ? "line-through text-gray-500 opacity-60" : "text-white group-hover:text-primary"} transition-colors`}>{task.title}</p>
                          <p className="text-[10px] font-black text-gray-500 mt-1 uppercase tracking-widest flex items-center gap-2">
                             <Clock size={12} className="text-primary" /> Due: {task.due}
                          </p>
                        </div>
                        <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest border ${cfg.badge}`}>
                           {priority}
                        </span>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-8">
           <Card className="p-8 glass-card border-white/5 bg-gradient-to-br from-primary/10 to-transparent">
              <h3 className="text-lg font-black text-white tracking-tight uppercase tracking-widest flex items-center gap-3">
                 <Activity size={20} className="text-primary" />
                 Shift metrics
              </h3>
              <div className="mt-8 space-y-6">
                 <div>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Completion status</p>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-primary" style={{ width: '40%' }} />
                    </div>
                    <p className="text-[10px] font-black text-primary mt-2 uppercase tracking-widest text-right">40% Resolved</p>
                 </div>
              </div>
           </Card>

           <div className="p-8 rounded-[2rem] border border-white/5 bg-white/[0.02] flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-600 mb-6">
                 <Calendar size={32} />
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-widest">Protocol Schedule</h4>
              <p className="text-[10px] text-gray-500 font-bold mt-2 uppercase tracking-wider leading-relaxed">
                 Next rotation starts in <span className="text-primary">04h 22m</span>
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
