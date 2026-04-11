"use client";

export const dynamic = 'force-dynamic';

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { 
  User, MapPin, Phone, Mail, 
  ShieldCheck, UserPlus, Heart, 
  Settings2, Camera, LogOut,
  ChevronRight, Building2, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAMILY_MEMBERS = [
  { name: "Jane Doe", relation: "Spouse", status: "Active" },
  { name: "Timmy Doe", relation: "Son", status: "Active" },
];

export default function ResidentProfilePage() {
  const [showAddFamily, setShowAddFamily] = useState(false);

  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-foreground">
        <div>
          <h1 className="text-4xl font-black font-heading tracking-tight">Identity <span className="text-primary tracking-normal">Profile</span></h1>
          <p className="text-gray-500 mt-2 font-medium italic">Manage your residency credentials and family registry</p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="rounded-2xl h-12 border-white/10 text-gray-400 gap-2 font-black uppercase tracking-widest text-[10px]">
              <Settings2 size={16} /> Account Security
           </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main Profile Info */}
        <section className="lg:col-span-1 space-y-8">
           <Card className="p-1 glass-card border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent">
              <div className="p-8 flex flex-col items-center text-center">
                 <div className="relative group mb-8">
                    <div className="h-32 w-32 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-5xl font-black text-primary overflow-hidden shadow-premium transition-all group-hover:scale-105 duration-500">
                       JD
                       {/* Placeholder for real photo */}
                    </div>
                    <button className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-primary text-black flex items-center justify-center shadow-glow-primary border-4 border-background hover:scale-110 transition-transform">
                       <Camera size={18} />
                    </button>
                 </div>

                 <h2 className="text-2xl font-black text-foreground tracking-tight">John Doe</h2>
                 <p className="text-sm font-black text-primary uppercase tracking-[0.3em] mt-1">Primary Resident</p>

                 <div className="mt-8 space-y-4 w-full">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                       <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                          <Building2 size={20} />
                       </div>
                       <div className="text-left">
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">Registered Unit</p>
                          <p className="text-base font-bold text-foreground mt-1">Tower A • Suite 101</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                       <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                          <Phone size={20} />
                       </div>
                       <div className="text-left">
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">Contact Line</p>
                          <p className="text-base font-bold text-foreground mt-1">+91 98765 43210</p>
                       </div>
                    </div>
                 </div>

                 <Button className="w-full mt-10 h-14 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all font-black uppercase tracking-widest text-xs gap-3">
                    <LogOut size={16} /> Sign Out of Airavat
                 </Button>
              </div>
           </Card>
        </section>

        {/* Family Registry */}
        <section className="lg:col-span-2 space-y-8">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-primary">
                    <Heart size={24} />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black font-heading text-foreground tracking-tight uppercase tracking-widest">Family Registry</h2>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Secondary residents with unit access</p>
                 </div>
              </div>
              <Button onClick={() => setShowAddFamily(true)} className="rounded-2xl h-12 px-6 shadow-glow-primary font-black uppercase tracking-widest text-[10px] gap-2">
                 <UserPlus size={16} /> Add Member
              </Button>
           </div>

           <div className="grid sm:grid-cols-2 gap-6">
              {FAMILY_MEMBERS.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-6 glass-card border-white/5 group hover:border-primary/20 transition-all flex items-center justify-between">
                     <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-black text-gray-500 group-hover:text-primary group-hover:border-primary/30 transition-all duration-500">
                           {member.name.charAt(0)}
                        </div>
                        <div>
                           <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{member.name}</h4>
                           <p className="text-[10px] font-black text-gray-500 mt-1 uppercase tracking-[0.2em]">{member.relation}</p>
                        </div>
                     </div>
                     <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        {member.status}
                     </span>
                  </Card>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => setShowAddFamily(true)}
                className="p-6 rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-3 cursor-pointer group hover:border-primary/20 transition-all text-gray-600 hover:text-primary"
              >
                 <Plus size={32} />
                 <span className="text-xs font-black uppercase tracking-widest opacity-50">Register New Member</span>
              </motion.div>
           </div>

           {/* Security Compliance */}
           <Card className="p-8 border-white/5 bg-primary/5 rounded-3xl relative overflow-hidden group">
              <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:opacity-10 transition-all rotate-12 group-hover:rotate-0">
                 <ShieldCheck size={180} />
              </div>
              <div className="relative z-10 flex items-start gap-6">
                 <div className="h-12 w-12 rounded-2xl bg-primary text-black flex items-center justify-center shrink-0 shadow-glow-primary">
                    <ShieldCheck size={28} />
                 </div>
                 <div className="space-y-2 max-w-xl">
                    <h3 className="text-lg font-black text-foreground tracking-tight uppercase tracking-widest">Residency Verification</h3>
                    <p className="text-sm text-gray-400 font-medium leading-relaxed">
                       Your profile is verified under the society Bylaws 2024. All family members registered here will automatically be granted digital QR access to society premises.
                    </p>
                 </div>
              </div>
           </Card>
        </section>
      </div>

      <Modal isOpen={showAddFamily} onClose={() => setShowAddFamily(false)} title="Register Family Profile" className="max-w-xl">
         <div className="space-y-6 pt-2">
            <div className="space-y-2">
               <label className="text-[10px] uppercase font-black tracking-widest text-foreground opacity-60">Full Legal Name</label>
               <Input placeholder="Enter member name..." className="bg-white/5 border-white/10 h-16 text-lg font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-foreground opacity-60">Relationship</label>
                  <select className="flex h-16 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-bold text-foreground focus:outline-none focus:border-primary transition-all">
                     <option className="bg-secondary">Spouse</option>
                     <option className="bg-secondary">Child</option>
                     <option className="bg-secondary">Parent</option>
                     <option className="bg-secondary">Sibling</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-foreground opacity-60">Primary Contact</label>
                  <Input placeholder="+91 00000 00000" type="tel" className="bg-white/5 border-white/10 h-16" />
               </div>
            </div>
            <div className="flex gap-4 pt-6">
               <Button className="flex-1 h-16 font-black uppercase tracking-widest text-xs shadow-glow-primary" onClick={() => setShowAddFamily(false)}>Authorize Member</Button>
               <Button variant="outline" className="flex-1 h-16 border-white/10 text-gray-400 font-black uppercase tracking-widest text-xs" onClick={() => setShowAddFamily(false)}>Abort</Button>
            </div>
         </div>
      </Modal>
    </div>
  );
}
