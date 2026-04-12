import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { 
  ScanLine, 
  ShieldCheck, 
  ShieldAlert, 
  User, 
  Car, 
  Home, 
  Calendar, 
  ChevronRight, 
  Camera,
  XCircle,
  CheckCircle2
} from 'lucide-react';
import { useGuestStore } from '../store/guestStore';
import { useLogStore } from '../store/logStore';
import { toast } from 'sonner';

export default function Scanner() {
  const [scanValue, setScanValue] = useState('');
  const [guestData, setGuestData] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const { invites } = useGuestStore();
  const { addLog } = useLogStore();

  const handleScan = (e) => {
    e.preventDefault();
    if (!scanValue) return;

    setIsVerifying(true);
    setTimeout(() => {
       // Search in the global приглашение store
       const match = invites.find(inv => inv.qrCode === scanValue || scanValue.includes(inv.qrCode));
       
       if (match) {
          setGuestData(match);
          toast.success('GUEST IDENTIFIED: Pre-approved Entry Found');
       } else {
          setGuestData({ error: 'INVALID PASS: This code does not exist in our secure records.' });
          toast.error('ACCESS DENIED: Invalid or Expired Pass');
       }
       setIsVerifying(false);
    }, 1500);
  };

  const handleGrantEntry = () => {
     addLog({
        type: 'Guest (QR)',
        name: guestData.name,
        unit: guestData.flat,
        vehicle: guestData.vehicle || 'NONE',
        purpose: 'Pre-Approved QR Entry'
     });
     toast.success(`Entry granted for ${guestData.name}. Log updated.`);
     setGuestData(null);
     setScanValue('');
  };

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-4xl mx-auto pb-20">
      <div className="text-center space-y-2">
         <h1 className="text-3xl font-black tracking-tight flex items-center justify-center gap-3">
            <ScanLine className="h-8 w-8 text-primary" /> Pass Scanner
         </h1>
         <p className="text-muted-foreground font-medium">Scan visitor smartphone to verify pre-approved access</p>
      </div>

      {!guestData ? (
         <Card className="border-2 border-dashed border-primary/20 bg-muted/30 shadow-2xl overflow-hidden animate-in zoom-in-95">
            <CardContent className="p-12 space-y-8 flex flex-col items-center">
               <div className="relative">
                  <div className="w-64 h-64 border-4 border-primary rounded-3xl flex items-center justify-center relative overflow-hidden bg-black/5">
                     <Camera className="h-12 w-12 text-primary opacity-20" />
                     {/* Scanning Animation */}
                     <div className="absolute inset-x-0 h-1 bg-primary/50 shadow-[0_0_15px_#3b82f6] animate-scan" />
                  </div>
                  <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                  <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
               </div>

               <div className="w-full max-w-sm space-y-4">
                  <div className="space-y-2">
                     <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground text-center block">Manual Pass Code Entry</Label>
                     <Input 
                        value={scanValue}
                        onChange={(e) => setScanValue(e.target.value.toUpperCase())}
                        placeholder="e.g. SS-A1B2C3D4" 
                        className="h-14 text-2xl font-black text-center tracking-[0.2em] shadow-inner" 
                     />
                  </div>
                  <Button 
                    className="w-full h-12 bg-primary font-black shadow-xl" 
                    onClick={handleScan}
                    disabled={isVerifying || !scanValue}
                  >
                     {isVerifying ? 'VERIFYING WITH AI...' : 'VERIFY PASS'}
                  </Button>
               </div>
            </CardContent>
         </Card>
      ) : (
         <div className="animate-in slide-in-from-bottom-8 duration-500">
            {guestData.error ? (
               <Card className="border-red-500 bg-red-50 shadow-2xl overflow-hidden">
                  <CardContent className="p-12 text-center space-y-6">
                     <div className="bg-red-500 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-xl">
                        <ShieldAlert className="h-10 w-10" />
                     </div>
                     <div className="space-y-2">
                        <h2 className="text-2xl font-black text-red-900">SECURITY BREACH</h2>
                        <p className="text-red-700 font-medium">{guestData.error}</p>
                     </div>
                     <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100 font-bold" onClick={() => setGuestData(null)}>
                        TRY DIFFERENT PASS
                     </Button>
                  </CardContent>
               </Card>
            ) : (
               <Card className="border-emerald-500 bg-white shadow-2xl overflow-hidden">
                  <div className="bg-emerald-600 p-8 text-white flex justify-between items-center">
                     <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-2xl">
                           <ShieldCheck className="h-8 w-8" />
                        </div>
                        <div>
                           <h2 className="text-2xl font-black">ACCESS GRANTED</h2>
                           <p className="text-emerald-100 font-medium uppercase tracking-widest text-xs">Verified Society Invite</p>
                        </div>
                     </div>
                     <Badge className="bg-emerald-400 text-emerald-900 font-black px-4 py-1">PRE-APPROVED</Badge>
                  </div>
                  <CardContent className="p-8 grid md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-muted-foreground" />
                           </div>
                           <div>
                              <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">Visitor Name</p>
                              <p className="text-lg font-black">{guestData.name}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                              <Car className="h-6 w-6 text-muted-foreground" />
                           </div>
                           <div>
                              <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">Vehicle Details</p>
                              <p className="text-lg font-black">{guestData.vehicle || 'NO VEHICLE'}</p>
                           </div>
                        </div>
                     </div>
                     <div className="space-y-6">
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                              <Home className="h-6 w-6 text-muted-foreground" />
                           </div>
                           <div>
                              <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">Destination Flat</p>
                              <p className="text-lg font-black">UNIT {guestData.flat}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 bg-indigo-50 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-indigo-600" />
                           </div>
                           <div>
                              <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">Invited By (Host)</p>
                              <p className="text-lg font-black text-indigo-600">{guestData.resident || 'ADMIN'}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                              <Calendar className="h-6 w-6 text-muted-foreground" />
                           </div>
                           <div>
                              <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">Scheduled Arrival</p>
                              <p className="text-lg font-black">{guestData.date}</p>
                           </div>
                        </div>
                     </div>
                  </CardContent>
                  <div className="px-8 pb-6 bg-indigo-50/30">
                     <div className="p-4 bg-white border border-indigo-100 rounded-xl flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                           <ShieldCheck className="h-5 w-5 text-indigo-500" />
                           <p className="text-xs font-bold text-indigo-900">This visitor is pre-authorized by Unit {guestData.flat}</p>
                        </div>
                        <Badge variant="outline" className="border-indigo-200 text-indigo-600 bg-white">SECURE PASS</Badge>
                     </div>
                  </div>
                  <CardFooter className="bg-muted/50 p-6 flex gap-4 border-t">
                     <Button variant="ghost" className="flex-1 font-bold" onClick={() => setGuestData(null)}>RE-SCAN</Button>
                     <Button className="flex-1 bg-emerald-600 font-black h-12 shadow-xl shadow-emerald-500/20" onClick={handleGrantEntry}>
                        CONFIRM ENTRY & LOG <CheckCircle2 className="ml-2 h-4 w-4" />
                     </Button>
                  </CardFooter>
               </Card>
            )}
         </div>
      )}

      <Card className="bg-primary/5 border-primary/10 shadow-sm">
         <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2">
               <ShieldCheck className="h-4 w-4" /> Secure Verification System
            </CardTitle>
         </CardHeader>
         <CardContent className="text-xs font-medium text-muted-foreground leading-relaxed">
            The AI engine validates the pass against the society's active invite registry. Any expired or blacklisted codes will trigger a security alert.
         </CardContent>
      </Card>
    </div>
  );
}
