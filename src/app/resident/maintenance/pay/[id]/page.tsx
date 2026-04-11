"use client";

export const dynamic = 'force-dynamic';

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  ShieldCheck, CreditCard, Landmark, 
  Smartphone, ArrowLeft, Loader2, 
  CheckCircle2, Lock, Zap
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Script from "next/script";

// Define the Razorpay interface for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RazorpayCheckoutPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [step, setStep] = useState<'checkout' | 'processing' | 'success' | 'error'>('checkout');
  const [method, setMethod] = useState<'razorpay' | null>('razorpay');
  const [errorMessage, setErrorMessage] = useState("");

  const initializeRazorpay = async () => {
    try {
      setStep('processing');

      // 1. Create order on our backend
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 4500, currency: "INR" }),
      });

      const orderData = await res.json();

      if (!res.ok) throw new Error(orderData.error || "Failed to create order");

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Smart Society",
        description: `Maintenance Payment - ${params.id}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          // Payment Success Callback
          localStorage.setItem(`payment_${params.id}`, 'paid');
          setStep('success');
        },
        prefill: {
          name: "Resident Name",
          email: "resident@smartsociety.com",
          contact: "9999999999",
        },
        theme: {
          color: "#FACC15",
        },
        modal: {
          ondismiss: function() {
            setStep('checkout');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Initialization failed");
      setStep('error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 transition-all">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <AnimatePresence mode="wait">
        {step === 'checkout' && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg"
          >
            <Card className="overflow-hidden border-0 shadow-2xl bg-[#0F172A] rounded-[2.5rem] relative">
              <div className="bg-[#1C2434] p-8 flex items-center justify-between border-b border-white/5">
                 <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                       <ArrowLeft size={18} />
                    </button>
                    <div>
                       <h2 className="text-xl font-bold text-white tracking-tight">Smart Society</h2>
                       <p className="text-[10px] font-black text-primary uppercase tracking-widest">RAZORPAY SECURE GATEWAY</p>
                    </div>
                 </div>
                 <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center p-2">
                    <Zap className="text-primary fill-current" size={24} />
                 </div>
              </div>

              <div className="p-10 space-y-10">
                 <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/5 border-dashed">
                    <div>
                       <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Payable Intensity</p>
                       <p className="text-3xl font-black text-white mt-1">₹4,500.00</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Registry ID</p>
                       <p className="text-sm font-bold text-gray-300 mt-1 uppercase font-mono">{params.id}</p>
                    </div>
                 </div>

                 <div className="p-8 rounded-[1.8rem] bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-5">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center shrink-0">
                       <ShieldCheck size={24} />
                    </div>
                    <div>
                       <h3 className="text-xs font-black text-white uppercase tracking-widest mb-1">Standard Encryption</h3>
                       <p className="text-[10px] text-gray-500 font-bold leading-relaxed uppercase tracking-widest">
                          Integrating with Razorpay Standard Checkout Protocol. All banking interactions are externalized and secured.
                       </p>
                    </div>
                 </div>

                 <Button 
                    onClick={initializeRazorpay}
                    className="w-full h-18 rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-glow-primary py-4 mt-4 bg-primary text-black"
                  >
                    Launch Razorpay Gateway
                 </Button>

                 <div className="flex items-center justify-center gap-3 text-[10px] font-black text-gray-600 uppercase tracking-widest opacity-60">
                    <Lock size={12} /> Test Mode Authorization Active
                 </div>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center space-y-8"
          >
            <div className="relative">
               <div className="h-32 w-32 rounded-full border-4 border-white/5 border-t-primary animate-spin" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck size={40} className="text-primary animate-pulse" />
               </div>
            </div>
            <div className="space-y-2">
               <h2 className="text-2xl font-black text-white uppercase tracking-widest">Engaging Encryption</h2>
               <p className="text-gray-500 font-medium tracking-wide">Initializing secure handshake with Razorpay...</p>
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md text-center"
          >
            <Card className="p-12 glass-card border-emerald-500/20 bg-emerald-500/5 space-y-8 rounded-[3rem]">
               <div className="h-24 w-24 rounded-[2.5rem] bg-emerald-500 shadow-glow-primary flex items-center justify-center mx-auto text-white">
                  <CheckCircle2 size={48} />
               </div>
               <div className="space-y-3">
                  <h2 className="text-3xl font-black text-white uppercase tracking-widest">Payment Synchronized</h2>
                  <p className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">Society Registry Updated</p>
               </div>
               <Button onClick={() => router.push('/resident/maintenance')} className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-xs bg-emerald-500 hover:bg-emerald-400 text-white shadow-glow-primary">
                  Return to Dashboard
               </Button>
            </Card>
          </motion.div>
        )}

        {step === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md text-center"
          >
             <Card className="p-10 glass-card border-red-500/20 bg-red-500/5 space-y-6 rounded-[2.5rem]">
                <div className="h-16 w-16 rounded-2xl bg-red-500/20 border border-red-500 text-red-500 flex items-center justify-center mx-auto">
                   <Lock size={32} />
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-widest">Protocol Failure</h2>
                <p className="text-sm text-gray-500 font-medium">{errorMessage}</p>
                <Button onClick={() => setStep('checkout')} variant="outline" className="w-full h-14 border-white/10 text-white">
                   Retry Handshake
                </Button>
             </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { cn } from "@/lib/utils";
