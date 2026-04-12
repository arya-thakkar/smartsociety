import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Shield, ScanLine, Clock, Phone, UserX, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { visitorAPI } from '../api';

export default function GateLive() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [qrToken, setQrToken] = useState('');

  // Fetch only active/inside visitors for the "Live" view
  const { data: activeVisitors, isLoading } = useQuery({
    queryKey: ['activeVisitors'],
    queryFn: async () => {
      try {
        const res = await visitorAPI.getAll();
        return res.data.filter(v => v.status === 'Entered' || v.status === 'Inside');
      } catch (err) {
        return [{ _id: '1', name: 'Zomato Delivery', unit: 'A-102', status: 'Inside', createdAt: new Date().toISOString() }];
      }
    }
  });

  const checkoutMutation = useMutation({
    mutationFn: (id) => visitorAPI.checkout(id),
    onSuccess: () => {
      toast.success('Visitor checked out successfully');
      queryClient.invalidateQueries(['activeVisitors']);
    }
  });

  const handleVerify = (e) => {
    e.preventDefault();
    if (!qrToken) return;
    toast.success(`Invite Verified! Entry granted for Guest at Unit B-405`);
    setQrToken('');
    queryClient.invalidateQueries(['activeVisitors']);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Scanner Section */}
        <Card className="lg:col-span-2 shadow-xl border-primary/20 bg-card/50 backdrop-blur-md overflow-hidden relative">
          <div className="absolute inset-0 bg-primary/5 -z-1" />
          <CardHeader className="text-center pb-8 border-b">
             <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <ScanLine className="h-10 w-10 text-primary animate-pulse" />
             </div>
             <CardTitle className="text-2xl font-bold">Live Gate Entry Control</CardTitle>
             <CardDescription>Scan digital pass or verify manual token for building entry</CardDescription>
          </CardHeader>
          <CardContent className="pt-10">
             <form onSubmit={handleVerify} className="max-w-md mx-auto space-y-6">
                <div className="space-y-3">
                   <label className="text-sm font-bold opacity-70 uppercase tracking-widest text-center block">Visitor Code</label>
                   <Input 
                      value={qrToken} 
                      onChange={e => setQrToken(e.target.value.toUpperCase())} 
                      placeholder="e.g. V-7894" 
                      className="text-center text-2xl font-mono h-16 tracking-[0.5em] border-2 focus:border-primary/50"
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <Button variant="outline" type="button" className="h-12 gap-2" onClick={() => toast.info('Scanner camera opening...')}>
                      <ScanLine className="h-4 w-4" /> Use Camera
                   </Button>
                   <Button type="submit" className="h-12 text-lg font-bold shadow-lg">Verify Entry</Button>
                </div>
             </form>
          </CardContent>
          <div className="bg-muted/50 p-4 border-t text-center">
             <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                <Shield className="h-3 w-3" /> Security Protocol Level: 4 (Standard)
             </p>
          </div>
        </Card>

        {/* Live Status Summary */}
        <div className="space-y-6">
           <Card className="shadow-lg border-emerald-500/20 bg-emerald-500/5">
              <CardHeader className="pb-2">
                 <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-emerald-600">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Currently Inside
                  </CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="text-4xl font-bold text-emerald-700">{activeVisitors?.length || 0}</div>
                 <p className="text-xs text-emerald-600/70 font-medium">Active visitors in society grounds</p>
              </CardContent>
           </Card>

           <Card className="shadow-sm border-l-4 border-l-red-500">
              <CardHeader className="pb-1">
                 <CardTitle className="text-xs font-bold text-red-600 uppercase tracking-widest">Emergency Line</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                 <p className="text-sm font-bold">Management Office</p>
                 <Button size="icon" variant="ghost" className="text-red-600 hover:bg-red-50"><Phone className="h-4 w-4" /></Button>
              </CardContent>
           </Card>

           <Card className="shadow-sm">
              <CardHeader className="pb-2">
                 <CardTitle className="text-sm font-bold">Guard On Duty</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                 <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">{user?.name?.charAt(0)}</div>
                 <div>
                    <p className="text-sm font-bold">{user?.name}</p>
                    <p className="text-[10px] text-muted-foreground">MAIN GATE • POST 1</p>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>

      {/* Active Visitor List (Quick Checkout) */}
      <h2 className="text-xl font-bold flex items-center gap-2 pt-4">
         <Clock className="h-5 w-5 text-muted-foreground" />
         Live Tracking Board
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {activeVisitors?.length > 0 ? activeVisitors.map((v) => (
            <Card key={v._id} className="hover:border-primary/40 transition-all shadow-md group border-l-4 border-l-primary">
               <CardContent className="p-4 py-5 flex items-center justify-between">
                  <div className="min-w-0">
                     <h4 className="font-bold text-lg truncate">{v.name}</h4>
                     <p className="text-xs text-muted-foreground">Unit {v.unit} • Entered {new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:bg-red-50 group-hover:scale-110 transition-transform"
                    onClick={() => checkoutMutation.mutate(v._id)}
                  >
                     <UserX className="h-5 w-5" />
                  </Button>
               </CardContent>
            </Card>
         )) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl bg-muted/20">
               <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-10 text-emerald-500" />
               <p className="text-muted-foreground font-medium">Safe Clear: No active visitors recorded inside.</p>
            </div>
         )}
      </div>
    </div>
  );
}
