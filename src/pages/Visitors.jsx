import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { UserPlus, QrCode, History, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { visitorAPI } from '../api';
import { useGuestStore } from '../store/guestStore';
import { Search, ShieldCheck, MapPin, Tablet } from 'lucide-react';

export default function Visitors() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { invites } = useGuestStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanCode, setScanCode] = useState('');
  const [newInvite, setNewInvite] = useState({ name: '', purpose: 'Delivery', date: new Date().toISOString().split('T')[0] });

  const isGuard = user?.role === 'guard';

  // Fetch Resident's Visitor History
  const { data: visitors, isLoading } = useQuery({
    queryKey: ['myVisitors'],
    queryFn: async () => {
      try {
        const res = await visitorAPI.getAll();
        // Filter locally for the user's unit in this mock setup
        return res.data.filter(v => v.unit === user.unit);
      } catch (err) {
        return [
          { _id: 'v1', name: 'Zomato Delivery', purpose: 'Delivery', status: 'Exited', createdAt: new Date(Date.now() - 3600000).toISOString() },
          { _id: 'v2', name: 'Amit Sharma', purpose: 'Guest', status: 'Inside', createdAt: new Date().toISOString() },
        ];
      }
    }
  });

  const generateMutation = useMutation({
    mutationFn: (data) => visitorAPI.create(data),
    onSuccess: () => {
      toast.success('Instant Invite Generated! Code: V-8812');
      setIsAdding(false);
      queryClient.invalidateQueries(['myVisitors']);
    }
  });

  const handleGenerate = (e) => {
    e.preventDefault();
    generateMutation.mutate({ ...newInvite, unit: user.unit, status: 'Pre-Approved' });
  };

  const handleVerifyScan = () => {
    const found = invites.find(i => i.qrCode === scanCode);
    if (found) {
      toast.success(`Access Granted! Guest: ${found.name} going to Flat ${found.flat}`);
      setIsScanning(false);
      setScanCode('');
    } else {
      toast.error("Invalid or Expired QR Code. Contact Resident for new Pass.");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Visitor Management</h1>
          <p className="text-muted-foreground text-sm">Pre-approve guests and track history for {user?.unit}</p>
        </div>
        {!isGuard ? (
          <Button onClick={() => setIsAdding(true)} className="gap-2 bg-primary shadow-lg hover:shadow-primary/20">
            <QrCode className="h-4 w-4" /> Generate Pre-Invite
          </Button>
        ) : (
          <Button onClick={() => setIsScanning(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 font-black">
            <Tablet className="h-4 w-4" /> SCAN VISITOR QR
          </Button>
        )}
      </div>

      {isScanning && isGuard && (
         <Card className="animate-in fade-in slide-in-from-top-4 border-emerald-500/20 shadow-2xl max-w-lg mx-auto overflow-hidden">
            <CardHeader className="bg-emerald-600 text-white text-center">
               <ShieldCheck className="h-12 w-12 mx-auto mb-2" />
               <CardTitle>Security Checkpoint</CardTitle>
               <CardDescription className="text-emerald-100">Enter QR code string from guest smartphone</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
               <div className="space-y-2">
                  <Label className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">Pre-Invite Code</Label>
                  <Input 
                    value={scanCode} 
                    onChange={e => setScanCode(e.target.value.toUpperCase())} 
                    placeholder="e.g. SS-A1B2C3D4" 
                    className="h-16 text-2xl font-black text-center tracking-[0.2em]" 
                  />
               </div>
               <Button className="w-full h-12 bg-emerald-600 font-black shadow-xl" onClick={handleVerifyScan}>
                  VERIFY ENTRY STATUS
               </Button>
            </CardContent>
            <CardFooter>
               <Button variant="ghost" className="w-full" onClick={() => setIsScanning(false)}>Cancel Scan</Button>
            </CardFooter>
         </Card>
      )}

      {isAdding && (
        <Card className="animate-in fade-in slide-in-from-bottom-2 border-primary/20 shadow-xl overflow-hidden max-w-lg mx-auto">
          <CardHeader className="text-center bg-primary/5">
             <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
                <QrCode className="h-8 w-8" />
             </div>
             <CardTitle>Instant Invite QR</CardTitle>
             <CardDescription>Generate a one-time entry code for your guest</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold opacity-70">Guest / Delivery Name</label>
                <Input value={newInvite.name} onChange={e => setNewInvite({...newInvite, name: e.target.value})} placeholder="e.g. Amazon, John Doe" className="h-11" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm font-bold opacity-70">Purpose</label>
                    <select className="w-full h-11 px-3 rounded-md border bg-background" value={newInvite.purpose} onChange={e => setNewInvite({...newInvite, purpose: e.target.value})}>
                       <option>Guest</option>
                       <option>Delivery</option>
                       <option>Maintenance</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold opacity-70">Valid Date</label>
                    <Input type="date" value={newInvite.date} onChange={e => setNewInvite({...newInvite, date: e.target.value})} className="h-11" />
                 </div>
              </div>
              <Button type="submit" className="w-full h-11 font-bold text-lg mt-4 shadow-md">Generate Code & Share</Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
             <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>Cancel</Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
             <History className="h-5 w-5 text-muted-foreground" />
             Recent Visitors
          </h2>
          {visitors?.length > 0 ? visitors.map((v) => (
             <Card key={v._id} className="hover:border-primary/20 transition-all shadow-sm group">
                <CardContent className="p-4 flex items-center justify-between">
                   <div className="flex items-center gap-4 min-w-0">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${v.status === 'Inside' ? 'bg-emerald-100 text-emerald-600 animate-pulse' : 'bg-muted/50 text-muted-foreground'}`}>
                         <UserPlus className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                         <h4 className="font-bold truncate">{v.name}</h4>
                         <p className="text-xs text-muted-foreground">{v.purpose} • {new Date(v.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                      </div>
                   </div>
                   <div className="text-right shrink-0">
                      <Badge variant={v.status === 'Inside' ? 'default' : 'secondary'} className={v.status === 'Inside' ? 'bg-emerald-500' : ''}>
                         {v.status}
                      </Badge>
                      {v.status === 'Inside' && (
                         <p className="text-[10px] text-emerald-600 font-bold mt-1 tracking-tighter uppercase">Currently in your unit</p>
                      )}
                   </div>
                </CardContent>
             </Card>
          )) : (
             <div className="py-20 text-center border-2 border-dashed rounded-xl bg-muted/20">
                <UserPlus className="h-12 w-12 mx-auto mb-2 opacity-10" />
                <p className="text-muted-foreground italic">No visitor logs found for your unit.</p>
             </div>
          )}
        </div>

        <div className="space-y-6">
           <Card className="shadow-md bg-primary text-primary-foreground border-none">
              <CardHeader className="pb-2">
                 <CardTitle className="text-lg flex items-center gap-2">
                    <QrCode className="h-5 w-5" /> Quick Share
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <p className="text-xs opacity-90 leading-relaxed">
                    Always share a digital invite for hassle-free entry at the gate. Guards will scan the code and let guests in instantly.
                 </p>
                 <div className="bg-white p-2 rounded-lg w-fit mx-auto shadow-inner">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=SMARTSOC-INVITE" alt="Sample QR" className="h-24 w-24 opacity-30 grayscale" />
                 </div>
              </CardContent>
           </Card>

           <Card className="shadow-sm border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                 <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Gate Alerts
                 </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                 You will receive a notification if a delivery or visitor arrives at the gate without a pre-approved code.
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
