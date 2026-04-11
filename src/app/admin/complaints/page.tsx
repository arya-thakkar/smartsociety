"use client";

export const dynamic = 'force-dynamic';

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useState } from "react";
import { MessageSquare, Megaphone, Plus, Filter, Pin, ArrowRight, User, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const COMPLAINTS = [
  { id: 1, title: "Water Leakage in Basement", by: "Rohan Sharma", flat: "A-101", date: "Apr 10", status: "open" },
  { id: 2, title: "Lift not working in B block", by: "Priya Mehta", flat: "B-203", date: "Apr 9", status: "in-progress" },
  { id: 3, title: "Garbage not picked up for 3 days", by: "Karan Patel", flat: "C-305", date: "Apr 8", status: "open" },
  { id: 4, title: "Noise complaint from D wing", by: "Anjali Singh", flat: "A-404", date: "Apr 7", status: "resolved" },
];

const ANNOUNCEMENTS = [
  { id: 101, title: "AGM on April 15th", body: "All residents are requested to attend the Annual General Meeting at the Community Hall.", date: "Apr 10", pinned: true },
  { id: 102, title: "Water Shutdown – Apr 12", body: "Water supply will be interrupted from 10 AM to 2 PM for annual pipeline maintenance.", date: "Apr 9", pinned: false },
  { id: 103, title: "No Parking: Main Gate Area", body: "Heavy vehicle movement expected. No personal vehicles to be parked near the main gate on Apr 13.", date: "Apr 8", pinned: false },
];

const STATUS_STYLES: Record<string, string> = {
  open: "bg-red-500/10 text-red-500",
  "in-progress": "bg-amber-500/10 text-amber-500",
  resolved: "bg-emerald-500/10 text-emerald-500",
};

export default function CommunicationsPage() {
  const [activeTab, setActiveTab] = useState<"complaints" | "announcements">("complaints");
  const [showForm, setShowForm] = useState<"complaint" | "announcement" | null>(null);
  const [complaintFilter, setComplaintFilter] = useState("all");

  const filteredComplaints = complaintFilter === "all" 
    ? COMPLAINTS 
    : COMPLAINTS.filter(c => c.status === complaintFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Communications</h1>
          <p className="text-gray-500 mt-1">Manage announcements and resident complaints</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowForm("announcement")} variant="outline" className="border-white/10 text-gray-400 hover:text-white">
            <Megaphone size={16} className="mr-2" /> New Announcement
          </Button>
          <Button onClick={() => setShowForm("complaint")}>
            <Plus size={16} className="mr-2" /> Add Complaint
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-white/[0.03] border border-white/5 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab("complaints")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "complaints" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-500 hover:text-gray-300"}`}
        >
          <MessageSquare size={16} />
          Complaints
          <span className="ml-1 px-1.5 py-0.5 rounded-lg bg-white/10 text-[10px]">{COMPLAINTS.length}</span>
        </button>
        <button
          onClick={() => setActiveTab("announcements")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "announcements" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-500 hover:text-gray-300"}`}
        >
          <Megaphone size={16} />
          Announcements
          <span className="ml-1 px-1.5 py-0.5 rounded-lg bg-white/10 text-[10px]">{ANNOUNCEMENTS.length}</span>
        </button>
      </div>

      {/* Form Dialogs */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <Card className="w-full max-w-lg p-8 glass relative">
              <h2 className="text-xl font-bold text-foreground mb-6">
                {showForm === "complaint" ? "Create New Complaint" : "Create New Announcement"}
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground opacity-70">Title</label>
                  <Input placeholder="Enter a descriptive title..." className="bg-white/5 border-white/10 text-foreground" />
                </div>
                {showForm === "announcement" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-foreground opacity-70">Body Content</label>
                    <textarea 
                      className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Write the full announcement..."
                    />
                  </div>
                )}
                {showForm === "complaint" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-foreground opacity-70">Description</label>
                    <textarea 
                      className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Describe the issue..."
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-4 mt-8">
                <Button className="flex-1" onClick={() => setShowForm(null)}>Create {showForm}</Button>
                <Button variant="outline" className="flex-1 border-white/10 text-gray-400" onClick={() => setShowForm(null)}>Cancel</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {activeTab === "complaints" ? (
          <motion.div
            key="complaints"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-2">
              <Filter size={16} className="text-gray-500 shrink-0" />
              {(["all", "open", "in-progress", "resolved"]).map((f) => (
                <button
                  key={f}
                  onClick={() => setComplaintFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${complaintFilter === f ? "bg-primary text-white border-primary" : "text-gray-500 border-white/10 hover:border-white/20"}`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="grid gap-3">
              {filteredComplaints.map((c) => (
                <Card key={c.id} className="p-0 glass overflow-hidden group hover:border-primary/30 transition-all">
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div>
                        <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">{c.title}</h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <User size={14} />
                          <span>{c.by}</span>
                          <span className="opacity-30">•</span>
                          <span>Flat {c.flat}</span>
                          <span className="opacity-30">•</span>
                          <span>{c.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[c.status as keyof typeof STATUS_STYLES]}`}>
                        {c.status}
                      </span>
                      <button className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-white transition-colors">
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="announcements"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {ANNOUNCEMENTS.map((a) => (
              <Card key={a.id} className={`p-6 glass relative overflow-hidden group hover:border-primary/30 transition-all ${a.pinned ? "border-l-4 border-primary" : ""}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl ${a.pinned ? "bg-primary/20 text-primary" : "bg-white/5 text-gray-500"}`}>
                    {a.pinned ? <Pin size={20} /> : <AlertCircle size={20} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{a.title}</h3>
                      <span className="text-xs text-gray-500 font-medium">{a.date}</span>
                    </div>
                    <p className="mt-2 text-gray-400 leading-relaxed max-w-3xl">{a.body}</p>
                    <div className="mt-4 flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      <button className="hover:text-primary transition-colors">Edit</button>
                      <button className="hover:text-red-500 transition-colors text-red-500/50">Delete</button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
