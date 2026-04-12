import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Wallet, CreditCard, Download, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Ledger() {
  const { user } = useAuthStore();
  const [isPaying, setIsPaying] = useState(false);

  const transactions = [
    { id: 't1', month: 'October 2026', type: 'Maintenance', amount: 4500, status: 'Unpaid', dueDate: '2026-10-10' },
    { id: 't2', month: 'September 2026', type: 'Maintenance', amount: 4500, status: 'Paid', date: '2026-09-02' },
    { id: 't3', month: 'August 2026', type: 'Clubhouse Event', amount: 1200, status: 'Paid', date: '2026-08-15' },
    { id: 't4', month: 'August 2026', type: 'Maintenance', amount: 4500, status: 'Paid', date: '2026-08-01' },
  ];

  const handlePay = () => {
    setIsPaying(true);
    setTimeout(() => {
      toast.success('Payment successfully processed! Receipt sent to your email.');
      setIsPaying(false);
    }, 2000);
  };

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wallet className="h-8 w-8 text-purple-500" />
            My Personal Ledger
          </h1>
          <p className="text-muted-foreground text-sm">Unit {user?.unit} • Payment history and upcoming dues</p>
        </div>
        <Button variant="outline" className="gap-2 shadow-sm">
           <Download className="h-4 w-4" /> Download Statement
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
         <Card className="shadow-lg bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-none md:col-span-2">
            <CardHeader className="pb-2">
               <CardTitle className="text-lg opacity-80 font-medium">Outstanding Balance</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex justify-between items-end">
                  <div>
                    <div className="text-5xl font-bold mb-1">₹4,500.00</div>
                    <p className="text-xs opacity-70 flex items-center gap-1">
                       <Calendar className="h-3 w-3" /> Due date: Oct 10, 2026
                    </p>
                  </div>
                  <Button 
                    className="bg-white text-purple-600 hover:bg-white/90 px-8 font-bold h-12 shadow-xl" 
                    onClick={handlePay}
                    disabled={isPaying}
                  >
                     {isPaying ? 'Processing...' : 'Pay Now'}
                  </Button>
               </div>
            </CardContent>
            <div className="px-6 py-4 bg-black/10 flex items-center justify-between text-xs">
               <span className="flex items-center gap-2">
                  <CreditCard className="h-3 w-3" /> HDFC Bank **** 8945
               </span>
               <span className="opacity-70">Auto-pay disabled</span>
            </div>
         </Card>

         <Card className="shadow-sm border-emerald-500/20 bg-emerald-500/5 h-fit self-center">
            <CardHeader className="pb-1">
               <CardTitle className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Rewards Points</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-3xl font-bold text-emerald-700">842</div>
               <p className="text-[10px] text-emerald-600 font-medium uppercase mt-1">Ready to redeem at clubhouse</p>
            </CardContent>
         </Card>
      </div>

      <div className="space-y-4">
         <h2 className="text-xl font-bold">Billing History</h2>
         <Card className="shadow-md overflow-hidden">
            <CardContent className="p-0">
               <div className="overflow-x-auto">
                  <Table>
                     <TableHeader>
                        <TableRow className="bg-muted hover:bg-muted">
                           <TableHead className="font-bold">Billing Cycle</TableHead>
                           <TableHead className="font-bold">Description</TableHead>
                           <TableHead className="font-bold">Amount</TableHead>
                           <TableHead className="font-bold">Status</TableHead>
                           <TableHead className="font-bold text-right">Receipt</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {transactions.map((t) => (
                           <TableRow key={t.id} className="hover:bg-muted/30 transition-colors">
                              <TableCell className="font-semibold text-sm">{t.month}</TableCell>
                              <TableCell className="text-xs text-muted-foreground">{t.type}</TableCell>
                              <TableCell className="font-bold">₹{t.amount}</TableCell>
                              <TableCell>
                                 <Badge variant={t.status === 'Paid' ? 'default' : 'destructive'} className={t.status === 'Paid' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                                    {t.status}
                                 </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                 {t.status === 'Paid' ? (
                                    <Button variant="ghost" size="sm" className="h-8 gap-2 opacity-70 hover:opacity-100">
                                       <ExternalLink className="h-3 w-3" /> View
                                    </Button>
                                 ) : (
                                    <span className="text-[10px] text-muted-foreground uppercase font-bold pr-2">Awaiting</span>
                                 )}
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
