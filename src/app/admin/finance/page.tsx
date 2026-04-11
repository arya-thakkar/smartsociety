"use client";

export const dynamic = 'force-dynamic';

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Wallet, TrendingDown, PiggyBank, Plus, HandCoins, Wrench, ArrowUpRight, ArrowDownLeft, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/Input";

const EXPENSES = [
  { label: "Maintenance Work", amount: 45000, pct: 55 },
  { label: "Security Salary", amount: 24000, pct: 29 },
  { label: "Utilities (Water/Electric)", amount: 8000, pct: 10 },
  { label: "Miscellaneous", amount: 5000, pct: 6 },
];

const TRANSACTIONS = [
  { desc: "A-101 Water Bill Payment", type: "credit", amount: 1250, date: "Today" },
  { desc: "Maintenance Fund Collection", type: "credit", amount: 85000, date: "Apr 1" },
  { desc: "Plumbing repair – Block A", type: "debit", amount: 12000, date: "Apr 5" },
  { desc: "Security salary – March", type: "debit", amount: 24000, date: "Apr 7" },
  { desc: "Festival fund collection", type: "credit", amount: 30000, date: "Apr 8" },
  { desc: "Garden maintenance contract", type: "debit", amount: 8000, date: "Apr 10" },
];

export default function FinancePage() {
  const [showModal, setShowModal] = useState<"funds" | "maintenance" | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Finance</h1>
          <p className="text-gray-500 mt-1">Society fund overview and expense tracking</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={() => setShowModal("funds")} className="flex-1 sm:flex-none">
            <HandCoins size={16} className="mr-2" /> Request Funds
          </Button>
          <Button onClick={() => setShowModal("maintenance")} variant="outline" className="flex-1 sm:flex-none border-white/10 text-gray-400 hover:text-white">
            <Wrench size={16} className="mr-2" /> Request Maintenance
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Fund Balance", value: "₹1,24,500", icon: Wallet, color: "text-primary", bg: "bg-primary/10" },
          { label: "Total Expenses (Apr)", value: "₹82,000", icon: TrendingDown, color: "text-red-400", bg: "bg-red-500/10" },
          { label: "Reserves", value: "₹42,500", icon: PiggyBank, color: "text-emerald-400", bg: "bg-emerald-500/10" },
        ].map((s) => (
          <Card key={s.label} className="p-6 flex items-center gap-4 glass">
            <div className={`p-4 rounded-2xl ${s.bg}`}>
              <s.icon className={`w-8 h-8 ${s.color}`} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{s.label}</p>
              <p className="text-2xl font-bold font-heading text-foreground mt-0.5">{s.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 glass">
          <h2 className="font-bold text-foreground mb-6 text-xl">Expense Breakdown</h2>
          <div className="space-y-6">
            {EXPENSES.map((e) => (
              <div key={e.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300 font-medium">{e.label}</span>
                  <span className="font-bold text-foreground">₹{e.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${e.pct}%` }}
                    transition={{ duration: 1, ease: "circOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 glass">
          <h2 className="font-bold text-foreground mb-6 text-xl">Recent Transactions</h2>
          <div className="space-y-4">
            {TRANSACTIONS.map((t, i) => (
              <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-white/[0.03] transition-colors border border-transparent hover:border-white/5">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${t.type === "credit" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                    {t.type === "credit" ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{t.desc}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                      <Calendar size={12} />
                      <span>{t.date}</span>
                    </div>
                  </div>
                </div>
                <span className={`text-sm font-black shrink-0 ${t.type === "credit" ? "text-emerald-400" : "text-red-400"}`}>
                  {t.type === "credit" ? "+" : "-"}₹{t.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <Card className="w-full max-w-md p-8 glass">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {showModal === "funds" ? "Request Funds" : "General Maintenance Request"}
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Subject</label>
                  <Input placeholder="What is this for?" className="bg-white/5 border-white/10 text-foreground" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Estimated Amount (₹)</label>
                  <Input type="number" placeholder="Enter amount..." className="bg-white/5 border-white/10 text-foreground" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Additional Details</label>
                  <textarea 
                    className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-foreground focus:outline-none"
                    placeholder="Provide more context..."
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <Button className="flex-1" onClick={() => setShowModal(null)}>Submit Request</Button>
                <Button variant="outline" className="flex-1 border-white/10 text-gray-400" onClick={() => setShowModal(null)}>Cancel</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
