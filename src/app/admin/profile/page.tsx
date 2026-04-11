"use client";

export const dynamic = 'force-dynamic';

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useState } from "react";
import { UserPlus, User, Mail, Phone, MapPin, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const FAMILY = [
  { id: 1, name: "Priya Kumar", relation: "Spouse", initials: "P" },
  { id: 2, name: "Aryan Kumar", relation: "Son (Age 14)", initials: "A" },
];

export default function AdminProfile() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-heading text-foreground">My Profile</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage your personal information and family records</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="lg:col-span-2 p-8 glass space-y-8">
          <div className="flex items-center gap-6 pb-6 border-b border-white/5">
            <div className="h-24 w-24 rounded-3xl bg-primary/15 border-2 border-primary/30 flex items-center justify-center text-4xl font-black text-primary shadow-lg shadow-primary/10">
              A
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Admin Kumar</h2>
              <p className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] mt-1">Society Secretary</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-foreground/70 uppercase tracking-widest flex items-center gap-2">
                <User size={12} className="text-primary" /> Full Name
              </label>
              <Input defaultValue="Admin Kumar" className="bg-white/5 border-white/10 text-foreground" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-foreground/70 uppercase tracking-widest flex items-center gap-2">
                <Mail size={12} className="text-primary" /> Email
              </label>
              <Input defaultValue="admin@greensociety.com" type="email" className="bg-white/5 border-white/10 text-foreground" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-foreground/70 uppercase tracking-widest flex items-center gap-2">
                <Phone size={12} className="text-primary" /> Phone
              </label>
              <Input defaultValue="+91 98765 43210" className="bg-white/5 border-white/10 text-foreground" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-foreground/70 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={12} className="text-primary" /> Flat Number
              </label>
              <Input defaultValue="A-101" className="bg-white/5 border-white/10 text-foreground" />
            </div>
          </div>
          <div className="pt-4">
             <Button className="px-8 font-bold tracking-wide">Save Profile Changes</Button>
          </div>
        </Card>

        {/* Family Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black font-heading text-foreground">Family</h2>
            <Button size="sm" variant="outline" onClick={() => setShowAdd(true)} className="gap-2 border-white/10 text-gray-400 font-bold hover:text-white">
              <UserPlus size={14} /> Add
            </Button>
          </div>
          
          <div className="space-y-3">
            {FAMILY.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-4 glass flex items-center justify-between group hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-primary border border-white/10 group-hover:bg-primary group-hover:text-white transition-colors">
                      {f.initials}
                    </div>
                    <div>
                      <p className="font-bold text-foreground group-hover:text-primary transition-colors">{f.name}</p>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{f.relation}</p>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg text-gray-600 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Family Member" className="max-w-md">
        <div className="space-y-6 pt-2">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Full Name</label>
            <Input placeholder="Enter member name..." className="bg-white/5 border-white/10 text-foreground placeholder:text-gray-500 h-12" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Relationship</label>
            <Input placeholder="e.g. Spouse, Son, Mother" className="bg-white/5 border-white/10 text-foreground placeholder:text-gray-500 h-12" />
          </div>
          <div className="flex gap-3 pt-4">
            <Button className="flex-1 h-12 font-bold" onClick={() => setShowAdd(false)}>Add to Family</Button>
            <Button variant="outline" className="flex-1 h-12 border-white/10 text-gray-400 font-bold" onClick={() => setShowAdd(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
