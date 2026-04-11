"use client";

export const dynamic = 'force-dynamic';

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Mic, MicOff, Send, Loader2, Sparkles, Activity, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GuardVoicePage() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [logged, setLogged] = useState(false);

  const toggleMic = () => {
    setListening((l) => !l);
    if (!listening) {
      setProcessing(true);
      setTimeout(() => {
        setText("One delivery person from Swiggy arrived at 01:15 PM for unit B-203. Verified tactical ID and established secure entry. Vehicle: Red Electric Shuttle. Exit confirmed at 01:25 PM.");
        setListening(false);
        setProcessing(false);
      }, 3000);
    }
  };

  const logEntry = () => {
    setLogged(true);
    setText("");
    setTimeout(() => setLogged(false), 5000);
  };

  return (
    <div className="space-y-12 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-foreground">
        <div>
          <h1 className="text-4xl font-black font-heading tracking-tight text-white uppercase tracking-widest">Voice <span className="text-primary tracking-normal">Intelligence</span></h1>
          <p className="text-gray-500 mt-2 font-medium italic">Speak to initialize a gate entry or protocol incident</p>
        </div>
        <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
           <Activity size={16} className="text-primary animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Audio Uplink Active</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Voice Capture Section */}
        <section className="space-y-8">
           <Card className="p-12 glass-card border-white/5 flex flex-col items-center text-center gap-10 relative overflow-hidden min-h-[50vh] justify-center">
              <div className={`absolute inset-0 bg-primary/5 transition-opacity duration-1000 ${listening ? 'opacity-100' : 'opacity-0'}`} />
              
              <div className="relative z-10 flex flex-col items-center">
                <motion.button
                  onClick={toggleMic}
                  whileTap={{ scale: 0.95 }}
                  animate={listening ? { 
                    boxShadow: [
                      "0 0 0 0 rgba(250,204,21,0.4)", 
                      "0 0 0 30px rgba(250,204,21,0)", 
                      "0 0 0 0 rgba(250,204,21,0)"
                    ] 
                  } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className={`w-40 h-40 rounded-[3rem] shadow-premium flex flex-col items-center justify-center gap-3 transition-all duration-500 border-4 ${
                    listening ? "bg-primary text-black border-white/20" : "bg-white/5 text-primary border-white/5 hover:border-primary/40"
                  }`}
                >
                  {listening ? <MicOff size={48} /> : <Mic size={48} />}
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{listening ? "RECEIVING..." : "INITIALIZE"}</span>
                </motion.button>
              </div>

              <div className="relative z-10 space-y-4">
                {processing ? (
                  <div className="flex items-center gap-3 text-sm font-black text-gray-400 uppercase tracking-widest">
                    <Loader2 size={20} className="animate-spin text-primary" />
                    Synthesizing Tactical Data...
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 font-medium max-w-xs leading-relaxed italic">
                    {listening ? "Audio is being captured and processed via society encryption." : "Tap the sphere to begin logging via voice command."}
                  </p>
                )}
              </div>
              
              {/* Audio Wave Visualization Placeholder */}
              {listening && (
                <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-center gap-1 px-10 pb-10 opacity-30">
                   {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-primary rounded-full"
                        animate={{ height: [20, Math.random() * 60 + 20, 20] }}
                        transition={{ repeat: Infinity, duration: 0.5 + Math.random() }}
                      />
                   ))}
                </div>
              )}
           </Card>
        </section>

        {/* Output Section */}
        <section className="space-y-8">
           <AnimatePresence mode="wait">
             {text ? (
               <motion.div
                 key="transcription"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
               >
                 <Card className="p-10 glass-card border-white/5 border-l-4 border-l-primary space-y-8 h-full">
                    <div className="flex items-center gap-3 text-primary">
                       <Sparkles size={20} />
                       <h2 className="text-xl font-black uppercase tracking-widest text-white">Synthesized Intel</h2>
                    </div>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-6 text-white text-lg font-medium focus:outline-none focus:border-primary min-h-[180px] resize-none leading-relaxed"
                    />
                    <div className="flex gap-4">
                      <Button className="flex-1 h-16 font-black uppercase tracking-widest text-xs shadow-glow-primary bg-primary text-black" onClick={logEntry}>
                        <Send size={16} className="mr-3" /> Commit to Logs
                      </Button>
                      <Button variant="outline" className="h-16 px-8 border-white/10 text-gray-500 font-black uppercase tracking-widest text-xs" onClick={() => setText("")}>
                         Discard
                      </Button>
                    </div>
                 </Card>
               </motion.div>
             ) : (
               <motion.div
                 key="placeholder"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
               >
                 <Card className="p-10 glass-card border-white/5 border-dashed flex flex-col items-center justify-center text-center space-y-6 min-h-[50vh]">
                    <div className="h-20 w-20 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-700">
                       <ShieldAlert size={40} />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-sm font-black text-gray-600 uppercase tracking-widest">Awaiting Transmission</h3>
                       <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest max-w-[200px] leading-relaxed">
                          Initialize the audio sphere to begin high-fidelity logging.
                       </p>
                    </div>
                 </Card>
               </motion.div>
             )}
           </AnimatePresence>

           <AnimatePresence>
             {logged && (
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                 <Card className="p-6 bg-emerald-500 text-white shadow-glow-primary border-0 rounded-2xl flex items-center gap-4">
                   <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <CheckCircle2 size={24} />
                   </div>
                   <p className="text-xs font-black uppercase tracking-widest">Intelligence Synchronized Successfully</p>
                 </Card>
               </motion.div>
             )}
           </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
