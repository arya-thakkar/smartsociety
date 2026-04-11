"use client";

import { Card } from "@/components/ui/Card";
import { 
  Users, AlertCircle, Building2, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Activity, 
  Bell, Smartphone, ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";

const STATS = [
  { label: "Total Members", value: "1,284", icon: Users, trend: "+12%", color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Active Complaints", value: "12", icon: AlertCircle, trend: "-4%", color: "text-amber-400", bg: "bg-amber-500/10" },
  { label: "Revenue", value: "₹4.2L", icon: TrendingUp, trend: "+8%", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Occupancy", value: "98%", icon: Building2, trend: "Stable", color: "text-purple-400", bg: "bg-purple-500/10" },
];

const QUICK_ACTIONS = [
  { name: "Broadcast Msg", icon: Bell, desc: "Notify all residents" },
  { name: "Verify Guest", icon: ShieldCheck, desc: "Instant clearance" },
  { name: "Staff Entry", icon: Smartphone, desc: "Digital attendance" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-12 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black font-heading text-foreground tracking-tight">
            Society <span className="text-primary tracking-normal">Snapshot</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Monday, April 11 • <span className="text-emerald-500">Normal Operations</span></p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2 group cursor-pointer hover:border-primary/30 transition-all">
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-xs font-bold text-gray-400 group-hover:text-white uppercase tracking-widest">Main Gate Live</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6 glass-card group border-white/5 hover:border-primary/20">
              <div className="flex justify-between items-start">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-500`}>
                  <stat.icon size={24} />
                </div>
                {typeof stat.trend === 'string' && stat.trend.includes('+') && (
                   <span className="text-[10px] font-black text-emerald-500 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-lg">
                      <ArrowUpRight size={12} /> {stat.trend}
                   </span>
                )}
              </div>
              <div className="mt-6">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-3xl font-black text-foreground">{stat.value}</h3>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-black font-heading text-foreground uppercase tracking-widest">Ongoing Activities</h2>
              <button className="text-xs font-bold text-primary hover:underline">View Intel</button>
           </div>
           
           <Card className="glass-card divide-y divide-white/5 overflow-hidden">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 flex items-start gap-6 hover:bg-white/[0.02] transition-colors group">
                  <div className="mt-1 h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <Activity size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-bold text-foreground">A-101 Water Bill Payment</p>
                      <span className="text-[10px] font-black text-gray-600 uppercase">2m ago</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 font-medium italic">Confirmed via Razorpay Gateway</p>
                  </div>
                </div>
              ))}
           </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
           <h2 className="text-xl font-black font-heading text-foreground uppercase tracking-widest">Rapid Control</h2>
           <div className="grid gap-4">
              {QUICK_ACTIONS.map((action, i) => (
                <motion.button
                  key={action.name}
                  whileHover={{ x: 8 }}
                  className="w-full text-left p-5 glass-card flex items-center gap-5 border-white/5 hover:border-primary/20 group"
                >
                  <div className="p-3 rounded-xl bg-white/5 text-gray-400 group-hover:text-primary transition-colors border border-white/5 group-hover:border-primary/20">
                    <action.icon size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-foreground group-hover:text-primary transition-colors">{action.name}</p>
                    <p className="text-xs text-gray-500 font-medium">{action.desc}</p>
                  </div>
                </motion.button>
              ))}
           </div>
           
           <Card className="p-8 bg-primary/10 border-primary/20 rounded-3xl relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12 transition-all group-hover:rotate-0">
                 <ShieldCheck size={140} />
              </div>
              <h3 className="text-lg font-black text-primary">Need Support?</h3>
              <p className="text-sm text-primary/70 mt-1 font-bold">Priority line for society admins is active.</p>
              <button className="mt-6 w-full py-3 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-primary transition-all shadow-glow-primary">
                Call Concierge
              </button>
           </Card>
        </div>
      </div>
    </div>
  );
}
