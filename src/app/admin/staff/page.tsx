"use client";

export const dynamic = 'force-dynamic';

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { Plus, Phone, MapPin, Search, Filter, PhoneForwarded } from "lucide-react";
import { motion } from "framer-motion";

const STAFF = [
  { id: 1, name: "Sunita Devi", role: "Maid", phone: "+91 98765 43210", flat: "A Wing", avatar: "S" },
  { id: 2, name: "Ramesh Kumar", role: "Plumber", phone: "+91 87654 32109", flat: "All Blocks", avatar: "R" },
  { id: 3, name: "Geeta Bai", role: "Cook", phone: "+91 76543 21098", flat: "B Wing", avatar: "G" },
  { id: 4, name: "Mohan Lal", role: "Electrician", phone: "+91 65432 10987", flat: "Maintenance", avatar: "M" },
];

export default function StaffPage() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black font-heading text-foreground tracking-tight">Staff <span className="text-primary tracking-normal">Network</span></h1>
          <p className="text-gray-500 mt-2 font-medium italic">Monitor and manage society service personnel and maintenance crews</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="rounded-2xl h-12 px-8 shadow-glow-primary font-black uppercase tracking-widest text-xs">
          <Plus size={16} className="mr-2" /> Add Staff Profile
        </Button>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {STAFF.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, ease: "easeOut" }}
          >
            <Card className="p-0 glass-card group border-white/5 hover:border-primary/20 overflow-hidden">
               <div className="p-8 flex flex-col items-center text-center">
                  <div className="relative mb-6">
                     <div className="h-24 w-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-4xl font-black text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 transform group-hover:-rotate-6">
                        {s.avatar}
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 border-4 border-background" title="Online" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{s.name}</h3>
                    <div className="inline-flex items-center px-4 py-1 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                      {s.role}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 w-full">
                     <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-500 py-2 rounded-xl bg-white/[0.02]">
                        <MapPin size={14} className="text-primary/60" />
                        {s.flat}
                     </div>
                     <a 
                      href={`tel:${s.phone}`} 
                      className="w-full h-12 rounded-2xl bg-white/5 flex items-center justify-center gap-3 text-sm font-black text-foreground hover:bg-primary hover:text-primary-foreground transition-all border border-white/5 hover:border-primary shadow-lg shadow-black/20"
                    >
                      <PhoneForwarded size={16} />
                      {s.phone}
                    </a>
                  </div>
               </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Register Service Profile" className="max-w-xl">
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-foreground">Personnel Name</label>
              <Input placeholder="Full legal name" className="bg-white/5 border-white/10 h-14" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-foreground">Service Role</label>
              <Input placeholder="e.g. Electrician" className="bg-white/5 border-white/10 h-14" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-foreground">Contact Registry</label>
            <Input placeholder="+91 00000 00000" type="tel" className="bg-white/5 border-white/10 h-14" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-foreground">Operation Area</label>
            <Input placeholder="e.g. A Wing, All Blocks" className="bg-white/5 border-white/10 h-14" />
          </div>
          <div className="flex gap-4 pt-6">
             <Button className="flex-1 h-14 font-black uppercase tracking-widest text-xs">Authorize Personnel</Button>
             <Button variant="outline" className="flex-1 h-14 border-white/10 text-gray-400 font-black uppercase tracking-widest text-xs" onClick={() => setShowAdd(false)}>Discard</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
