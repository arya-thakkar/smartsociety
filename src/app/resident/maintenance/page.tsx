"use client";

export const dynamic = 'force-dynamic';

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  Wallet, CreditCard, Receipt, Clock, 
  CheckCircle2, AlertCircle, ArrowRight,
  ShieldCheck, Activity, Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

const INITIAL_BILLS = [
  { id: "MNT-2026-04", title: "Monthly Maintenance", cycle: "April 2026", amount: 4500, status: "pending", dueDate: "Apr 20, 2026", type: "Utility" },
  { id: "SNK-2026", title: "Annual Sinking Fund", cycle: "FY 2026-27", amount: 12000, status: "pending", dueDate: "Apr 30, 2026", type: "Capital" },
  { id: "MNT-2026-03", title: "Monthly Maintenance", cycle: "March 2026", amount: 4500, status: "paid", dueDate: "Mar 20, 2026", type: "Utility" },
];

export default function MaintenancePage() {
  const [bills, setBills] = useState(INITIAL_BILLS);

  useEffect(() => {
    // Sync with localStorage to check for newly paid bills
    const updatedBills = INITIAL_BILLS.map(bill => {
      const storedStatus = localStorage.getItem(`payment_${bill.id}`);
      if (storedStatus === 'paid') {
        return { ...bill, status: 'paid' };
      }
      return bill;
    });
    setBills(updatedBills);
  }, []);

  const pendingBills = bills.filter(b => b.status === "pending");
  const totalPending = pendingBills.reduce((acc, b) => acc + b.amount, 0);

  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-foreground">
        <div>
          <h1 className="text-4xl font-black font-heading tracking-tight text-white uppercase tracking-widest">Financial <span className="text-primary tracking-normal">Overview</span></h1>
          <p className="text-gray-500 mt-2 font-medium italic">Manage residency maintenance cycles and digital support funds</p>
        </div>
        <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
           <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Payment Gateways Secure</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <Card className="lg:col-span-1 p-8 glass-card border-white/5 bg-gradient-to-br from-primary/10 to-transparent flex flex-col justify-between">
           <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Total Outstanding</p>
              <h2 className="text-4xl font-black text-white mt-2 tracking-tight">₹{totalPending.toLocaleString()}</h2>
           </div>
           <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-400">
                 <span>Pending Cycles</span>
                 <span className="text-white">{pendingBills.length}</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-primary" style={{ 
                    width: INITIAL_BILLS.length > 0 ? `${(pendingBills.length / INITIAL_BILLS.length) * 100}%` : '0%' 
                 }} />
              </div>
           </div>
        </Card>

        <div className="lg:col-span-3 grid gap-6">
           {bills.map((bill, i) => (
             <motion.div
               key={bill.id}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: i * 0.1 }}
             >
               <Card className={cn(
                 "p-1 glass-card border-white/5 hover:border-primary/20 transition-all group overflow-hidden relative",
                 bill.status === 'paid' ? 'opacity-60' : ''
               )}>
                 <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-gradient-to-r from-white/[0.02] to-transparent">
                   <div className="flex items-center gap-6">
                      <div className={cn(
                        "h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-premium",
                        bill.status === 'pending' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      )}>
                        {bill.status === 'pending' ? <Receipt size={24} /> : <CheckCircle2 size={24} />}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                           <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{bill.title}</h3>
                           <span className="text-[9px] font-black bg-white/5 px-2 py-0.5 rounded-lg text-gray-500 border border-white/5 uppercase tracking-widest">{bill.id}</span>
                        </div>
                        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                           <span className="flex items-center gap-2">Cycle: {bill.cycle}</span>
                           <span className="flex items-center gap-2"><Clock size={12} className="text-primary"/> Due: {bill.dueDate}</span>
                        </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-8 px-6 border-l border-white/5">
                      <div className="text-right min-w-[120px]">
                         <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">Amount Due</p>
                         <p className="text-2xl font-black text-white mt-1">₹{bill.amount.toLocaleString()}</p>
                      </div>
                      {bill.status === 'pending' ? (
                        <Link href={`/resident/maintenance/pay/${bill.id}`}>
                          <Button className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs shadow-glow-primary gap-3">
                            Initiate Payment <ArrowRight size={16} />
                          </Button>
                        </Link>
                      ) : (
                        <div className="h-14 px-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                           <ShieldCheck size={16} /> Verified
                        </div>
                      )}
                   </div>
                 </div>
               </Card>
             </motion.div>
           ))}
        </div>
      </div>

      <Card className="p-10 rounded-[3rem] border border-white/5 bg-indigo-500/5 relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:opacity-10 transition-all rotate-12 group-hover:rotate-0">
             <CreditCard size={180} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
             <div className="h-20 w-20 rounded-[2.5rem] bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-400/20 shadow-glow-primary">
                <Sparkles size={40} />
             </div>
             <div className="space-y-4 max-w-2xl">
                <h3 className="text-2xl font-black text-foreground tracking-tight uppercase tracking-widest">Premium Financial Protocol</h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">
                   Society maintenance fees are used for unified facility management, security rotation, and AI engine upkeep. Payment records are cryptographically verified and synchronized with the Secretary console.
                </p>
             </div>
          </div>
      </Card>
    </div>
  );
}

import { cn } from "@/lib/utils";
