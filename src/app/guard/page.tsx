"use client";

export const dynamic = "force-dynamic";

import { Card } from "@/components/ui/Card";
import { ShieldCheck, Activity, Camera, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function GuardDashboard() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  // ✅ START CAMERA (REAL CONTROL)
  const startScanner = async () => {
    setIsScanning(true);

    const html5QrCode = new Html5Qrcode("reader");
    scannerRef.current = html5QrCode;

    try {
      await html5QrCode.start(
        { facingMode: "environment" }, // back camera
        {
          fps: 10,
          qrbox: 250,
        },
        (decodedText) => {
          setScanResult(decodedText);
          stopScanner();
        },
        () => { }
      );
    } catch (err) {
      console.error("Camera start failed:", err);
    }
  };

  // 🛑 STOP CAMERA
  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err) {
        console.error(err);
      }
    }
    setIsScanning(false);
  };

  // 🔁 RESET
  const resetScanner = async () => {
    setScanResult(null);
    await startScanner();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">
          Security Scanner
        </h1>
      </div>

      <Card className="p-10 flex flex-col items-center justify-center min-h-[60vh]">

        <AnimatePresence mode="wait">

          {/* 🔴 INITIAL STATE */}
          {!isScanning && !scanResult && (
            <motion.div
              key="start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-6"
            >
              <Camera size={48} className="text-primary" />

              <button
                onClick={startScanner}
                className="px-6 py-3 bg-primary text-black rounded-xl font-bold"
              >
                Open Camera
              </button>
            </motion.div>
          )}

          {/* 🟡 SCANNING */}
          {isScanning && (
            <motion.div
              key="scanner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-md"
            >
              <div
                id="reader"
                className="w-full h-[300px] bg-black rounded-xl"
              />
            </motion.div>
          )}

          {/* 🟢 RESULT */}
          {scanResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-6"
            >
              <ShieldCheck size={48} className="text-green-500" />

              <h2 className="text-white text-xl">Verified</h2>

              <p className="text-primary font-mono">
                {scanResult}
              </p>

              <button
                onClick={resetScanner}
                className="px-6 py-3 bg-primary text-black rounded-xl"
              >
                Scan Again
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </Card>
    </div>
  );
}