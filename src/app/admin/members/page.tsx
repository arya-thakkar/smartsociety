"use client";

export const dynamic = 'force-dynamic';

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { Users, Search, ArrowRight, Shield, UserPlus, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const MEMBERS = [
  { id: 1, name: "Rohan Sharma", flat: "A-101", family: 4, email: "rohan@example.com", role: "Resident" },
  { id: 2, name: "Priya Mehta", flat: "B-203", family: 2, email: "priya@example.com", role: "Admin" },
  { id: 3, name: "Karan Patel", flat: "C-305", family: 3, email: "karan@example.com", role: "Resident" },
  { id: 4, name: "Anjali Singh", flat: "A-404", family: 5, email: "anjali@example.com", role: "Resident" },
  { id: 5, name: "Vikram Rao", flat: "D-102", family: 1, email: "vikram@example.com", role: "Guard" },
];

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filtered = MEMBERS.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.flat.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black font-heading text-foreground tracking-tight">Members</h1>
          <p className="text-gray-500 mt-2 font-medium italic">Directory of all society residents and administrative staff</p>
        </div>
        <Button className="rounded-2xl h-12 px-6 shadow-glow-primary font-black uppercase tracking-widest text-xs">
          <UserPlus size={16} className="mr-2" /> Register Member
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Card className="flex-1 bg-white/[0.03] border-white/5 p-2 rounded-2xl flex items-center gap-3 px-5 group hover:border-primary/30 transition-all">
            <Search size={18} className="text-gray-500 group-hover:text-primary transition-colors" />
            <Input
              placeholder="Search by name, flat, or contact..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-10 text-foreground placeholder:text-gray-600 font-medium"
            />
          </Card>
          <div className="flex gap-2">
             <button className="h-14 px-6 rounded-2xl bg-white/5 border border-white/10 text-gray-500 hover:text-white flex items-center gap-2 font-bold text-xs uppercase tracking-widest transition-all">
                <Filter size={16} /> Filter
             </button>
          </div>
        </div>

        <Card className="p-0 overflow-hidden glass-card border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/[0.03] text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="text-left px-8 py-5">Profile</th>
                  <th className="text-left px-8 py-5">Premises</th>
                  <th className="text-left px-8 py-5">Unit Info</th>
                  <th className="text-left px-8 py-5">Classification</th>
                  <th className="text-left px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence>
                  {filtered.map((m, i) => (
                    <motion.tr 
                      key={m.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                      onClick={() => router.push(`/admin/members/${m.id}`)}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-primary text-base group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                            {m.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">{m.name}</p>
                            <p className="text-xs text-gray-500 font-medium">{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex flex-col">
                            <span className="text-foreground font-bold font-mono">{m.flat}</span>
                            <span className="text-[10px] text-gray-600 font-black uppercase mt-1">Primary Unit</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                           <Users size={14} className="text-primary/50" />
                           <span className="text-sm text-gray-400 font-bold">{m.family} Members</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all ${
                          m.role === "Admin" ? "bg-primary/10 text-primary border-primary/20 shadow-glow-primary/20" :
                          m.role === "Guard" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                          "bg-white/5 text-gray-500 border-white/10"
                        }`}>
                          {m.role}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-3 text-gray-700 group-hover:text-primary transition-colors">
                          <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
