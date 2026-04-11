"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const AVAILABLE_AMENITIES = ["Gym", "Swimming Pool", "Community Hall", "Tennis Court", "Park"];

export default function SetupSociety() {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
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
        transition={{ duration: 0.8 }}
        className="w-full max-w-xl relative z-10"
      >
        <Card className="p-10 border-white/5 bg-white/[0.02] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black font-heading text-foreground tracking-tight">Create New Society</h1>
            <p className="text-gray-500 mt-2 text-[10px] font-bold uppercase tracking-[0.2em]">Deployment Protocol v2.4</p>
          </div>

          <form className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Entity Name</label>
                <Input placeholder="e.g. Green Valley Residency" />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Geographical Parameters</label>
                <textarea 
                  className="flex w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 min-h-[120px] resize-none transition-all hover:border-white/20"
                  placeholder="Full physical address"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Integrated Amenities</label>
                <div className="flex flex-wrap gap-2.5">
                  {AVAILABLE_AMENITIES.map(amenity => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                        selectedAmenities.includes(amenity)
                          ? "bg-primary/20 border-primary/50 text-primary shadow-[0_0_15px_rgba(250,204,21,0.1)]"
                          : "bg-white/5 border-white/5 text-gray-500 hover:border-white/10 hover:bg-white/[0.08]"
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button className="w-full mt-4" size="lg">Initialize Society</Button>
            
            <div className="text-center pt-2 border-t border-white/5">
              <a href="/login" className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors">Abourt Protocol</a>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
