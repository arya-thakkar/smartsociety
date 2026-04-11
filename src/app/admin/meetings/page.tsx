"use client";

export const dynamic = 'force-dynamic';

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useState } from "react";
import { Plus, Mic, Brain, Calendar, Clock, Users, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const MEETINGS = [
  { id: 1, title: "Monthly Maintenance Review", date: "Apr 15, 2026", time: "6:00 PM", attendees: 28, hasSummary: true },
  { id: 2, title: "Water Scarcity & Pipeline Discussion", date: "Apr 5, 2026", time: "7:00 PM", attendees: 42, hasSummary: true },
  { id: 3, title: "Festival Committee Planning", date: "Mar 28, 2026", time: "6:30 PM", attendees: 15, hasSummary: false },
];

export default function MeetingsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const simulateAI = () => {
    setAiLoading(true);
    setTimeout(() => setAiLoading(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black font-heading text-foreground">Meetings</h1>
          <p className="text-gray-500 mt-1 font-medium">Record, summarize, and manage society meetings</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="shadow-lg shadow-primary/20">
          <Plus size={16} className="mr-2" /> New Meeting
        </Button>
      </div>

      <div className="space-y-4">
        {MEETINGS.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6 flex items-center justify-between gap-6 flex-wrap glass group hover:border-primary/20 transition-all">
              <div className="flex items-center gap-5">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                  <Calendar className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{m.title}</h3>
                  <div className="flex items-center flex-wrap gap-x-5 gap-y-1 mt-1 text-sm text-gray-500 font-medium">
                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-primary"/> {m.date}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-primary"/> {m.time}</span>
                    <span className="flex items-center gap-1.5"><Users size={14} className="text-primary"/> {m.attendees} Attendees</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {m.hasSummary ? (
                  <Link href={`/admin/meetings/${m.id}`}>
                    <Button size="sm" variant="outline" className="border-primary/20 text-primary hover:bg-primary/10 gap-2 font-bold px-4">
                      <Sparkles size={14} /> View AI Summary
                    </Button>
                  </Link>
                ) : (
                  <Button size="sm" onClick={simulateAI} className="gap-2 font-bold px-4">
                    <Brain size={14} /> Generate AI Summary
                  </Button>
                )}
                <button className="p-2.5 rounded-xl bg-white/5 text-gray-600 hover:text-white transition-colors">
                   <ArrowRight size={20} />
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {aiLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <Card className="p-12 text-center glass space-y-6 max-w-sm">
              <div className="relative mx-auto w-20 h-20">
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-full" 
                 />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="text-primary w-10 h-10 animate-pulse" />
                 </div>
              </div>
              <div>
                <p className="text-xl font-black text-foreground uppercase tracking-widest">AI Reasoning</p>
                <p className="text-sm text-gray-500 mt-2 font-medium">Distilling meeting audio into concise action items and decisions...</p>
              </div>
              <div className="flex gap-2 justify-center">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div key={i} className="w-2.5 h-2.5 rounded-full bg-primary"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Schedule New Meeting" className="max-w-lg">
        <div className="space-y-5 pt-2">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500">Meeting Title</label>
            <Input placeholder="What is the agenda?" className="bg-white/5 border-white/10" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black tracking-widest text-gray-500">Date</label>
              <Input type="date" className="bg-white/5 border-white/10" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black tracking-widest text-gray-500">Time</label>
              <Input type="time" className="bg-white/5 border-white/10" />
            </div>
          </div>
          <div className="group border-2 border-dashed border-white/5 hover:border-primary/30 rounded-2xl p-8 flex flex-col items-center text-center gap-3 bg-white/[0.02] transition-all cursor-pointer">
            <div className="p-4 rounded-full bg-white/5 text-gray-500 group-hover:bg-primary/20 group-hover:text-primary transition-all">
               <Mic size={32} />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Upload or Record Audio</p>
              <p className="text-xs text-gray-500 mt-1 max-w-[200px]">AI will generate minutes, key decisions and specific action items automatically</p>
            </div>
            <Button size="sm" variant="outline" className="mt-2 border-white/10 text-gray-400 group-hover:border-primary/30 group-hover:text-white">Upload Audio File</Button>
          </div>
          <div className="flex gap-3 pt-4">
             <Button className="flex-1 h-12">Confirm Schedule</Button>
             <Button variant="outline" className="flex-1 h-12 border-white/10 text-gray-400" onClick={() => setShowCreate(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
