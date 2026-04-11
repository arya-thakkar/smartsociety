"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function JoinSociety() {
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
        transition={{ duration: 0.8 }}
        className="w-full max-w-[400px] relative z-10"
      >
        <Card className="p-10 border-white/5 bg-white/[0.02] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
          
          <div className="text-center mb-10">
            <h1 className="text-2xl font-black font-heading text-foreground tracking-tight">Join Society</h1>
            <p className="text-gray-500 mt-2 text-[10px] font-bold uppercase tracking-[0.2em]">Deployment Protocol v2.4</p>
          </div>

          <form className="space-y-8">
            <div className="space-y-4">
              <div className="space-y-2 text-center">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Resident Access Key</label>
                <Input 
                  placeholder="XXXX-XXXX" 
                  className="text-center tracking-[0.4em] font-mono text-xl uppercase py-5 h-16 border-primary/20 bg-primary/5"
                  maxLength={9}
                />
              </div>
            </div>
            
            <Button className="w-full" size="lg">Authorize Access</Button>
            
            <div className="text-center pt-2">
              <a href="/login" className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors">Terminate Request</a>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
