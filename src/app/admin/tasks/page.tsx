"use client";

export const dynamic = 'force-dynamic';

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useState } from "react";
import { Plus, CheckCircle2, Circle, Clock, User, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Priority = "high" | "medium" | "low";

interface Task {
  id: number;
  title: string;
  assignee: string;
  due: string;
  priority: Priority;
  done: boolean;
}

const INITIAL_TASKS: Task[] = [
  { id: 1, title: "Fix water pump in Block A", assignee: "Mohan Lal", due: "Apr 12", priority: "high", done: false },
  { id: 2, title: "Repaint main entrance gate", assignee: "Ramesh Kumar", due: "Apr 15", priority: "medium", done: false },
  { id: 3, title: "Service all CCTV cameras", assignee: "Security Team", due: "Apr 20", priority: "high", done: false },
  { id: 5, title: "Process A-101 Water Bill Settlement", assignee: "Finance Team", due: "Today", priority: "medium", done: false },
  { id: 4, title: "Garden maintenance", assignee: "Gardener", due: "Apr 11", priority: "low", done: true },
];

const PRIORITY_CONFIG: Record<Priority, { label: string; ring: string; badge: string; glow: string }> = {
  high: { label: "High", ring: "border-red-500/50", badge: "bg-red-500/10 text-red-400", glow: "shadow-[0_0_16px_rgba(239,68,68,0.2)]" },
  medium: { label: "Medium", ring: "border-amber-500/50", badge: "bg-amber-500/10 text-amber-400", glow: "" },
  low: { label: "Low", ring: "border-emerald-500/50", badge: "bg-emerald-500/10 text-emerald-400", glow: "" },
};

export default function TasksPage() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", assignee: "", due: "", priority: "medium" as Priority });

  const toggle = (id: number) => setTasks((t) => t.map((task) => task.id === id ? { ...task, done: !task.done } : task));

  const addTask = () => {
    if (!newTask.title) return;
    setTasks((t) => [...t, { ...newTask, id: Date.now(), done: false }]);
    setShowAdd(false);
    setNewTask({ title: "", assignee: "", due: "", priority: "medium" });
  };

  const groups: Priority[] = ["high", "medium", "low"];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black font-heading text-foreground">Tasks</h1>
          <p className="text-gray-500 mt-1 font-medium">Track and assign society maintenance tasks</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="shadow-lg shadow-primary/20">
          <Plus size={16} className="mr-2" /> Create Task
        </Button>
      </div>

      <div className="space-y-10">
        {groups.map((priority) => {
          const group = tasks.filter((t) => t.priority === priority);
          if (!group.length) return null;
          const cfg = PRIORITY_CONFIG[priority];
          return (
            <div key={priority}>
              <div className="flex items-center gap-3 mb-4">
                 <div className={`w-1 h-4 rounded-full ${priority === 'high' ? 'bg-red-500' : priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                 <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">
                  {cfg.label} Priority
                </h2>
                <div className="flex-1 h-px bg-white/5" />
              </div>
              <div className="grid gap-4">
                <AnimatePresence mode="popLayout">
                  {group.map((task, i) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className={`p-5 flex items-center gap-5 glass group transition-all hover:border-white/20 ${!task.done && priority === "high" ? "border border-red-500/30" : ""}`}>
                        <button 
                          onClick={() => toggle(task.id)} 
                          className={`transition-all transform active:scale-90 ${task.done ? "text-emerald-500" : "text-gray-600 hover:text-white"}`}
                        >
                          {task.done ? <CheckCircle2 size={26} /> : <Circle size={26} />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-lg font-bold transition-all ${task.done ? "line-through text-gray-600 opacity-50" : "text-foreground group-hover:text-primary"}`}>
                            {task.title}
                          </p>
                          <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500 font-medium">
                            <span className="flex items-center gap-1.5"><User size={14} className="text-primary"/> {task.assignee}</span>
                            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-primary"/> Due {task.due}</span>
                          </div>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full hidden sm:inline-block border border-white/5 ${cfg.badge}`}>
                          {cfg.label}
                        </span>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Create New Task" className="max-w-lg">
        <div className="space-y-5 pt-2">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-black tracking-widest text-foreground opacity-60">Task Title</label>
            <Input 
              placeholder="What needs to be done?" 
              value={newTask.title} 
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} 
              className="bg-white/5 border-white/10 h-14"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-black tracking-widest text-foreground opacity-60">Assign To</label>
            <Input 
              placeholder="Staff or team name" 
              value={newTask.assignee} 
              onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })} 
              className="bg-white/5 border-white/10 h-14"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black tracking-widest text-foreground opacity-60">Due Date</label>
              <Input 
                type="date" 
                value={newTask.due} 
                onChange={(e) => setNewTask({ ...newTask, due: e.target.value })} 
                className="bg-white/5 border-white/10 h-14"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black tracking-widest text-foreground opacity-60">Priority Level</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
                className="flex h-14 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="high" className="bg-secondary text-foreground">High Priority</option>
                <option value="medium" className="bg-secondary text-foreground">Medium Priority</option>
                <option value="low" className="bg-secondary text-foreground">Low Priority</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4 pt-6">
            <Button className="flex-1 h-14 font-black uppercase tracking-widest text-xs" onClick={addTask}>Establish Task</Button>
            <Button variant="outline" className="flex-1 h-14 border-white/10 text-gray-400 font-black uppercase tracking-widest text-xs" onClick={() => setShowAdd(false)}>Discard</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
