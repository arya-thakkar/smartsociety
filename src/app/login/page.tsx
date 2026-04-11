"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Shield, User, Ghost, Check } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("admin");

  const roles = [
    { id: "admin", name: "Secretary", icon: Shield, desc: "Society Management" },
    { id: "resident", name: "Resident", icon: User, desc: "Personal Portal" },
    { id: "guard", name: "Security", icon: Ghost, desc: "Gate Control" },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("user_role", role);
    router.push(`/${role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-black font-heading text-foreground tracking-tight"
          >
            Smart<span className="text-primary">Society</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 mt-3 font-medium uppercase tracking-[0.2em] text-[10px]"
          >
            Integrated Management Protocol
          </motion.p>
        </div>

        <Card className="p-10 border-white/5 bg-white/[0.02] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
           
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Authentication Domain</label>
                 <div className="grid grid-cols-3 gap-3">
                   {roles.map((r) => (
                     <button
                       key={r.id}
                       type="button"
                       onClick={() => setRole(r.id)}
                       className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all relative ${
                         role === r.id 
                           ? "border-primary/50 bg-primary/5 text-primary shadow-[0_0_20px_rgba(250,204,21,0.1)]" 
                           : "border-white/5 bg-white/5 text-gray-500 hover:border-white/10 hover:bg-white/[0.08]"
                       }`}
                     >
                        <r.icon size={20} className={role === r.id ? "text-primary" : "text-gray-400"} />
                        <span className="text-[10px] font-black uppercase tracking-wider">{r.name}</span>
                        {role === r.id && (
                          <motion.div 
                            layoutId="active-role"
                            className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center border-2 border-[#0B1221]"
                          >
                            <Check size={8} className="text-black font-black" />
                          </motion.div>
                        )}
                     </button>
                   ))}
                 </div>
               </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Identity</label>
                  <Input type="email" placeholder="name@society.com" required />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Access Protocol</label>
                  <Input type="password" placeholder="••••••••" required />
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full">
              Initiate Session
            </Button>
            
            <div className="text-center pt-2">
               <div className="flex items-center gap-4 mb-6">
                 <div className="h-[1px] flex-1 bg-white/5" />
                 <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">or</span>
                 <div className="h-[1px] flex-1 bg-white/5" />
               </div>
              <div className="flex flex-col gap-3">
                 <p className="text-xs text-gray-500">
                   System on-boarding: 
                   <a href="/setup" className="text-primary hover:text-primary-light font-black tracking-tight ml-2">CREATE SOCIETY</a>
                 </p>
                 <p className="text-xs text-gray-500">
                   Resident access: 
                   <a href="/join" className="text-primary hover:text-primary-light font-black tracking-tight ml-2">JOIN PROTOCOL</a>
                 </p>
              </div>
            </div>
          </form>
        </Card>

        <p className="text-center mt-10 text-[9px] font-bold text-gray-600 uppercase tracking-[0.4em] opacity-40">
          Smart Society Management Core v2.4.1
        </p>
      </motion.div>
    </div>
  );
}
