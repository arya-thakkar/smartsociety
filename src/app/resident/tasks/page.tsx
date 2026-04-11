"use client";

export const dynamic = 'force-dynamic';

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { 
  Plus, CheckCircle2, Circle, Clock, 
  User, ClipboardList, PenTool, Sparkles,
  Search, Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Priority = "high" | "medium" | "low";

interface ResidentTask {
  id: number;
  title: string;
  category: string;
  status: "pending" | "resolved";
  createdAt: string;
  priority: Priority;
}

const INITIAL_TASKS: ResidentTask[] = [
  { id: 1, title: "Leaky tap in Master Bathroom", category: "Plumbing", status: "pending", createdAt: "2h ago", priority: "high" },
  { id: 2, title: "Flickering balcony lights", category: "Electrical", status: "resolved", createdAt: "Yesterday", priority: "medium" },
  { id: 3, title: "Elevator Maintenance", category: "Infrastructure", status: "pending", createdAt: "Today", priority: "low" },
];

export default function ResidentTasksPage() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", category: "", priority: "medium" as Priority });

  const addTask = () => {
    if (!newTask.title) return;
    setTasks((t) => [
      { id: Date.now(), title: newTask.title, category: newTask.category, status: "pending", createdAt: "Just now", priority: newTask.priority },
      ...t
    ]);
    setShowAdd(false);
    setNewTask({ title: "", category: "", priority: "medium" });
  };

  return (
    <div className="space-y-12 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-foreground">
        <div>
          <h1 className="text-4xl font-black font-heading tracking-tight">Service <span className="text-primary tracking-normal">Requests</span></h1>
          <p className="text-gray-500 mt-2 font-medium italic">Assign maintenance tasks and track resolution status</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="rounded-2xl h-14 px-8 shadow-glow-primary font-black uppercase tracking-widest text-xs gap-3">
          <PenTool size={16} /> Assign New Task
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-black font-heading text-foreground uppercase tracking-widest flex items-center gap-3">
                <ClipboardList className="text-primary" size={20} />
                Request History
              </h2>
              <div className="flex gap-2">
                 <button className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                    <Filter size={16} />
                 </button>
              </div>
           </div>

           <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {tasks.map((task, i) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className={`p-5 flex items-center gap-6 glass-card group transition-all border-white/5 hover:border-primary/20 ${task.status === 'resolved' ? 'opacity-60' : ''}`}>
                       <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
                         task.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-white/5 text-gray-600 border-white/10 group-hover:border-primary/30 group-hover:text-primary'
                       }`}>
                          {task.status === 'resolved' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                       </div>
                       
                       <div className="flex-1 min-w-0">
                          <h4 className={`text-lg font-bold tracking-tight ${task.status === 'resolved' ? 'line-through text-gray-500' : 'text-foreground group-hover:text-primary transition-colors'}`}>
                            {task.title}
                          </h4>
                          <div className="flex items-center gap-4 mt-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                             <span className="flex items-center gap-1.5"><Sparkles size={12} className="text-primary"/> {task.category}</span>
                             <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary"/> {task.createdAt}</span>
                          </div>
                       </div>

                       <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                         task.priority === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-red-500/5' :
                         task.priority === 'medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                         'bg-white/5 text-gray-500 border-white/10'
                       }`}>
                          {task.priority}
                       </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>
        </div>

        <div className="space-y-8">
           <Card className="p-8 glass-card border-white/5 bg-primary/5 relative overflow-hidden group">
              <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:opacity-20 transition-all rotate-12 group-hover:rotate-0">
                 <PenTool size={160} className="text-primary" />
              </div>
              <h3 className="text-xl font-black text-primary tracking-tight">Need Maintenance?</h3>
              <p className="text-sm text-primary/70 mt-2 font-bold leading-relaxed">Society staff is ready to assist. Most residential requests are resolved within 24 hours.</p>
              <Button onClick={() => setShowAdd(true)} className="mt-8 w-full h-14 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-xs shadow-glow-primary">
                Instant Request
              </Button>
           </Card>

           <div className="space-y-4">
              <h3 className="text-sm font-black text-foreground uppercase tracking-[0.2em] px-2">Support Channels</h3>
              <div className="grid gap-3">
                 {['Electrician', 'Plumber', 'Janitor'].map((role) => (
                    <div key={role} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group cursor-pointer hover:border-primary/30 transition-all">
                       <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">{role} Team</span>
                       <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                          <User size={16} />
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Assign Maintenance Task" className="max-w-xl">
         <div className="space-y-6 pt-2">
            <div className="space-y-2">
               <label className="text-[10px] uppercase font-black tracking-widest text-foreground opacity-60">Request Title</label>
               <Input 
                 placeholder="e.g. Bathroom sink leakage" 
                 value={newTask.title}
                 onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                 className="bg-white/5 border-white/10 h-14" 
               />
            </div>
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-foreground opacity-60">Category</label>
                  <Input 
                    placeholder="e.g. Plumbing" 
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    className="bg-white/5 border-white/10 h-14" 
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-foreground opacity-60">Urgency</label>
                  <select 
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-bold text-foreground focus:outline-none focus:border-primary transition-all"
                  >
                     <option value="high" className="bg-secondary">High Priority</option>
                     <option value="medium" className="bg-secondary">Medium Priority</option>
                     <option value="low" className="bg-secondary">Low Priority</option>
                  </select>
               </div>
            </div>
            <div className="flex gap-4 pt-6">
               <Button onClick={addTask} className="flex-1 h-16 font-black uppercase tracking-widest text-xs shadow-glow-primary">Initialize Request</Button>
               <Button variant="outline" className="flex-1 h-16 border-white/10 text-gray-400 font-black uppercase tracking-widest text-xs" onClick={() => setShowAdd(false)}>Abort</Button>
            </div>
         </div>
      </Modal>
    </div>
  );
}
