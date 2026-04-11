"use client";

export const dynamic = 'force-dynamic';

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Camera, ShieldCheck, Mail, Phone, Building2, User } from "lucide-react";

export default function GuardProfile() {
  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-foreground">
        <div>
          <h1 className="text-4xl font-black font-heading tracking-tight text-white uppercase tracking-widest">Identity <span className="text-primary tracking-normal">Credentials</span></h1>
          <p className="text-gray-500 mt-2 font-medium italic">Managed security personnel authentication profile</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main Profile Info */}
        <section className="lg:col-span-1 space-y-8">
           <Card className="p-1 glass-card border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent">
              <div className="p-8 flex flex-col items-center text-center">
                 <div className="relative group mb-8">
                    <div className="h-32 w-32 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-5xl font-black text-primary overflow-hidden shadow-premium transition-all group-hover:scale-105 duration-500">
                       GS
                    </div>
                    <button className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-primary text-black flex items-center justify-center shadow-glow-primary border-4 border-background hover:scale-110 transition-transform">
                       <Camera size={18} />
                    </button>
                 </div>

                 <h2 className="text-2xl font-black text-foreground tracking-tight">Guard Smith</h2>
                 <p className="text-sm font-black text-primary uppercase tracking-[0.3em] mt-1">Security Officer</p>

                 <div className="mt-8 space-y-4 w-full">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                       <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                          <Building2 size={20} />
                       </div>
                       <div className="text-left">
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">Assigned Station</p>
                          <p className="text-base font-bold text-foreground mt-1">Main Gate • Alpha 01</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                       <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                          <ShieldCheck size={20} />
                       </div>
                       <div className="text-left">
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">Employee ID</p>
                          <p className="text-base font-bold text-foreground mt-1">GRD-0042</p>
                       </div>
                    </div>
                 </div>
              </div>
           </Card>
        </section>

        {/* Edit Section */}
        <section className="lg:col-span-2 space-y-8">
           <Card className="p-10 glass-card border-white/5">
              <h3 className="text-xl font-black text-white tracking-tight uppercase tracking-widest mb-10 flex items-center gap-3">
                 <User size={22} className="text-primary" />
                 Registration Details
              </h3>
              
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-10">
                   <div className="space-y-3">
                      <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500">Legal Name</label>
                      <Input defaultValue="Guard Smith" className="bg-white/5 border-white/10 h-16 text-lg font-bold text-white focus:border-primary transition-all" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500">Contact Number</label>
                      <Input defaultValue="+91 87654 32109" className="bg-white/5 border-white/10 h-16 text-lg font-bold text-white focus:border-primary transition-all" />
                   </div>
                </div>

                <div className="space-y-3">
                   <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500">Active Operational Shift</label>
                   <Input 
                      defaultValue="Night Tactical (10 PM – 6 AM)" 
                      readOnly 
                      className="bg-white/[0.02] border-white/5 h-16 text-lg font-bold text-gray-500 cursor-not-allowed opacity-50" 
                   />
                   <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Shift rotation is managed by administrative override</p>
                </div>

                <div className="pt-6">
                   <Button className="h-16 px-12 rounded-2xl font-black uppercase tracking-widest text-xs shadow-glow-primary bg-primary text-black hover:scale-105 transition-all">
                      Authorize Profile Update
                   </Button>
                </div>
              </div>
           </Card>

           <div className="p-8 rounded-[2rem] border border-white/5 bg-emerald-500/5 relative overflow-hidden group">
              <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:opacity-10 transition-all rotate-12 group-hover:rotate-0">
                 <ShieldCheck size={180} />
              </div>
              <div className="relative z-10 flex items-start gap-6">
                 <div className="h-12 w-12 rounded-2xl bg-emerald-500 text-black flex items-center justify-center shrink-0 shadow-glow-primary">
                    <ShieldCheck size={28} />
                 </div>
                 <div className="space-y-2 max-w-xl">
                    <h3 className="text-lg font-black text-foreground tracking-tight uppercase tracking-widest">Security Status Valid</h3>
                    <p className="text-sm text-gray-400 font-medium leading-relaxed italic">
                       Your credentials have been verified by the Central Command. Access to tactical pages and scanner is fully authorized.
                    </p>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}
