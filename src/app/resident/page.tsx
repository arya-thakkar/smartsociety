"use client";

export const dynamic = 'force-dynamic';

import { Card } from "@/components/ui/Card";
import { 
  Megaphone, MessageSquare, CalendarDays, 
  ArrowRight, ShieldCheck, Activity, 
  Clock, MapPin, Plus, Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import NextLink from "next/link";

const ANNOUNCEMENTS = [
  { id: 1, title: "Annual General Meeting", date: "Today, 6:00 PM", desc: "Please join the AGM meeting at the Community Hall to discuss society budget.", priority: "high", href: "/resident/meetings" },
  { id: 2, title: "Elevator Maintenance", date: "Apr 12, 10:00 AM", desc: "Block B elevator will be out of service for routine inspection.", priority: "low", href: "/resident/tasks" },
];

const AMENITIES = [
  { name: "Gymnasium", status: "Available", booked: "12/20", icon: Activity },
  { name: "Pool", status: "Closed", booked: "30/30", icon: Activity },
];

export default function ResidentDashboard() {
  const router = useRouter();

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black font-heading text-foreground tracking-tight">
            Resident <span className="text-primary tracking-normal">Portal</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Welcome back, <span className="text-white">John Doe</span> (A-101)</p>
        </div>
        <div className="flex gap-4">
           <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Society Systems Online</span>
           </div>
        </div>
      </div>

      {/* Announcements (Top - Prominent) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
           <h2 className="text-xl font-black font-heading text-foreground uppercase tracking-widest flex items-center gap-3">
             <Megaphone className="text-primary" size={20} />
             Society Broadcasts
           </h2>
           <span className="text-[10px] font-black text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20">2 ACTIVE</span>
        </div>
        <div className="grid gap-4">
          {ANNOUNCEMENTS.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`p-6 glass-card border-white/5 group hover:border-primary/30 transition-all relative overflow-hidden ${a.priority === 'high' ? 'bg-primary/10' : ''}`}>
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                       <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{a.title}</h3>
                       {a.priority === 'high' && <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />}
                    </div>
                    <p className="text-sm text-gray-400 mt-2 font-medium leading-relaxed max-w-3xl">{a.desc}</p>
                    <div className="flex items-center gap-4 mt-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                       <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary"/> {a.date}</span>
                       <span className="flex items-center gap-1.5"><MapPin size={12} className="text-primary"/> Main Hall</span>
                    </div>
                  </div>
                  <NextLink href={a.href} className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-600 hover:text-white transition-all border border-transparent hover:border-white/10 group-hover:border-primary/50 group-hover:text-primary">
                    <ArrowRight size={18} />
                  </NextLink>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Amenities & Complaints Grid */}
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-black font-heading text-foreground uppercase tracking-widest flex items-center gap-3">
                <CalendarDays className="text-primary" size={20} />
                Facility Bookings
              </h2>
              <NextLink href="/resident/amenities">
                <Button variant="ghost" className="text-primary font-bold text-xs uppercase tracking-widest gap-2">Explore All <ArrowRight size={14} /></Button>
              </NextLink>
           </div>
           
           <div className="grid sm:grid-cols-2 gap-4">
              {AMENITIES.map((amn, i) => (
                <Card key={i} className="p-6 glass-card border-white/5 hover:border-primary/20 transition-all group">
                   <div className="flex justify-between items-start">
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <amn.icon size={20} />
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${amn.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                        {amn.status}
                      </span>
                   </div>
                   <h3 className="text-lg font-bold text-foreground mt-4">{amn.name}</h3>
                   <div className="flex items-center justify-between mt-2 text-xs font-bold text-gray-500">
                      <span>Occupancy</span>
                      <span className="text-white">{amn.booked}</span>
                   </div>
                   <div className="w-full bg-white/5 rounded-full h-1 mt-2 overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '60%' }} />
                   </div>
                </Card>
              ))}
           </div>
        </div>

        <div className="space-y-6">
           <h2 className="text-xl font-black font-heading text-foreground uppercase tracking-widest flex items-center gap-3">
             <MessageSquare className="text-primary" size={20} />
             My Complaints
           </h2>
           <Card className="p-8 glass-card border-white/5 flex flex-col items-center text-center group transition-all">
              <div className="h-20 w-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/10 transition-all">
                 <ShieldCheck size={36} className="text-gray-600 group-hover:text-emerald-500 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-foreground tracking-tight">System All-Clear</h3>
              <p className="text-sm text-gray-500 mt-2 font-medium">You have no active complaints. Society operations are healthy.</p>
              <NextLink href="/resident/complaints" className="w-full">
                <Button className="mt-8 w-full rounded-2xl h-14 font-black uppercase tracking-widest text-xs shadow-glow-primary">
                  File New Complaint
                </Button>
              </NextLink>
           </Card>

           <Card className="relative overflow-hidden group p-1 h-32 rounded-3xl cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative h-full w-full bg-background/40 backdrop-blur-md rounded-[1.4rem] border border-white/10 flex items-center justify-center gap-4">
                 <Sparkles className="text-primary" size={24} />
                 <div className="text-left">
                    <p className="text-sm font-black text-foreground uppercase tracking-widest">AI Concierge</p>
                    <p className="text-[10px] text-gray-400 font-bold">Ask anything about the society</p>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
