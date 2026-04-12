import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line
} from 'recharts';
import { Wallet, TrendingUp, TrendingDown, Download, Filter, ArrowUpRight, ArrowDownRight, IndianRupee, PieChart as PieIcon, Activity, Zap, ShieldAlert, Droplets, ListChecks } from 'lucide-react';
import { toast } from 'sonner';
import { useTaskStore } from '../store/taskStore';
import { useAuthStore } from '../store/authStore';

const collectionData = [
  { name: 'Jan', amount: 420000, expenses: 310000 },
  { name: 'Feb', amount: 450000, expenses: 290000 },
  { name: 'Mar', amount: 480000, expenses: 340000 },
  { name: 'Apr', amount: 410000, expenses: 380000 },
  { name: 'May', amount: 500000, expenses: 320000 },
  { name: 'Jun', amount: 520000, expenses: 310000 },
];

const expenseData = [
  { name: 'Security', value: 120000, color: '#6366f1' },
  { name: 'Maint', value: 80000, color: '#10b981' },
  { name: 'Utility', value: 65000, color: '#f59e0b' },
  { name: 'Staff', value: 45000, color: '#ef4444' },
];

const serviceDistribution = [
  { name: 'Electricity', percent: 45, icon: Zap, color: 'bg-yellow-500' },
  { name: 'Security', percent: 30, icon: ShieldAlert, color: 'bg-indigo-500' },
  { name: 'Water', percent: 15, icon: Droplets, color: 'bg-blue-500' },
  { name: 'Misc', percent: 10, icon: Activity, color: 'bg-slate-500' },
];

export default function Finance() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { tasks } = useTaskStore();
  const { user } = useAuthStore();
  
  const upcomingFinancialTasks = tasks.filter(t => t.type === 'financial' && t.status !== 'Paid');

  const handleDownload = () => {
    setIsDownloading(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Generating Financial PDF Report...',
        success: () => {
          setIsDownloading(false);
          // Simulate download
          const blob = new Blob(["Society Finance Report Content"], { type: "text/plain" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "SmartSociety_Finance_Report.pdf";
          a.click();
          return 'Financial Report downloaded successfully!';
        },
        error: 'Failed to generate report',
      }
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold flex items-center gap-3 tracking-tight">
            <div className="bg-primary/10 p-2 rounded-2xl">
               <IndianRupee className="h-10 w-10 text-primary" />
            </div>
            Society Financials
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Real-time revenue, expenses and collection tracking for FY 2026-27</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            className="flex-1 md:flex-none gap-2 h-12 px-6 shadow-sm font-bold"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <Download className="h-4 w-4" /> {isDownloading ? 'Working...' : 'Export Global PDF'}
          </Button>
          <Button className="flex-1 md:flex-none gap-2 h-12 px-6 shadow-xl font-bold">
            <Filter className="h-4 w-4" /> Quarter 3 Review
          </Button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Total Collection', val: '₹28.4L', trend: '+12.5%', color: 'border-l-emerald-500', icon: TrendingUp, positive: true },
           { label: 'Total Expenses', val: '₹12.1L', trend: '-2.1%', color: 'border-l-red-500', icon: TrendingDown, positive: false },
           { label: 'Reserve Funds', val: '₹15.2L', trend: 'Stable', color: 'border-l-blue-500', icon: Wallet, positive: true },
           { label: 'Pending Dues', val: '₹1.8L', trend: '12 Units', color: 'border-l-orange-500', icon: ShieldAlert, positive: false },
         ].map((kpi, i) => (
           <Card key={i} className={`shadow-md hover:shadow-xl transition-all border-none border-l-4 ${kpi.color} group`}>
              <CardHeader className="pb-1 py-4 flex flex-row items-center justify-between">
                 <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{kpi.label}</CardTitle>
                 <kpi.icon className="h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
              </CardHeader>
              <CardContent className="pb-6">
                 <div className="text-3xl font-black">{kpi.val}</div>
                 <div className={`flex items-center gap-1 text-[10px] font-black mt-2 uppercase tracking-tighter ${kpi.positive ? 'text-emerald-500' : 'text-orange-500'}`}>
                    {kpi.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {kpi.trend} {kpi.positive ? 'growth' : 'variance'}
                 </div>
              </CardContent>
           </Card>
         ))}
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
         {/* Main Revenue vs Expense Chart */}
         <Card className="lg:col-span-2 shadow-2xl border-primary/5 overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
               <div className="flex justify-between items-center">
                  <div>
                     <CardTitle className="text-xl font-black tracking-tight">Revenue vs Daily Burn</CardTitle>
                     <CardDescription>Consolidated cashflow analysis for the last 6 months</CardDescription>
                  </div>
                  <div className="flex gap-2">
                     <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-primary" /> <span className="text-[10px] font-bold">Revenue</span></div>
                     <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-slate-400" /> <span className="text-[10px] font-bold">Expenses</span></div>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="h-[350px] w-full mt-6 pb-6">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={collectionData}>
                     <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                           <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                     <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} fontWeight={600} />
                     <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} fontWeight={600} />
                     <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', fontWeight: 'bold' }}
                        formatter={(value) => [`₹${value.toLocaleString()}`, '']}
                     />
                     <Area type="monotone" dataKey="amount" stroke="#6366f1" fillOpacity={1} fill="url(#colorRev)" strokeWidth={4} />
                     <Area type="monotone" dataKey="expenses" stroke="#94a3b8" fillOpacity={0.1} fill="#94a3b8" strokeWidth={2} />
                  </AreaChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>

         {/* Upcoming Collections Sidebar */}
         <Card className="shadow-2xl border-indigo-500/20 bg-indigo-600 text-white overflow-hidden flex flex-col">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <ListChecks className="h-4 w-4" /> Upcoming Collections
               </CardTitle>
               <CardDescription className="text-white/60 text-[10px] font-bold">Financial tasks pending society action</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto px-4 space-y-3 mt-2 pr-2 custom-scrollbar">
               {upcomingFinancialTasks.length > 0 ? upcomingFinancialTasks.map((t) => (
                  <div key={t.id} className="p-3 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm group hover:bg-white/20 transition-all cursor-pointer">
                     <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-black uppercase tracking-tighter opacity-70">Due {t.deadline}</span>
                        <div className="text-sm font-black">₹{t.amount}</div>
                     </div>
                     <p className="text-xs font-bold truncate">{t.title}</p>
                  </div>
               )) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-10">
                     <CheckCircle2 className="h-12 w-12 mb-2" />
                     <p className="text-[10px] font-black uppercase tracking-widest">No pending collections</p>
                  </div>
               )}
            </CardContent>
            <CardFooter className="bg-black/20 p-4">
                <Button className="w-full bg-white text-indigo-600 hover:bg-white/90 font-black h-10 text-xs">VIEW FULL LEDGER</Button>
            </CardFooter>
         </Card>

         {/* Distribution Summary */}
         <div className="space-y-6">
            <Card className="shadow-lg border-primary/10">
               <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-widest text-primary">
                     <PieIcon className="h-4 w-4" /> Service Distribution
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-5 pt-4">
                  {serviceDistribution.map((service, i) => (
                     <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold">
                           <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-lg ${service.color} text-white`}>
                                 <service.icon className="h-3 w-3" />
                              </div>
                              {service.name}
                           </div>
                           <span>{service.percent}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                           <div className={`h-full ${service.color}`} style={{ width: `${service.percent}%` }} />
                        </div>
                     </div>
                  ))}
               </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground shadow-xl border-none relative overflow-hidden group">
               <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity -skew-x-12" />
               <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-black uppercase tracking-widest opacity-80 italic">Critical Alert</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="text-3xl font-black mb-1">C-BLOCK LIFT</div>
                  <p className="text-xs opacity-70 font-medium">AMC Payment of ₹25,000 pending since last 48 hours.</p>
                  <Button className="w-full mt-4 bg-white text-primary hover:bg-white/90 font-black h-11">PAY NOW</Button>
               </CardContent>
            </Card>
         </div>
      </div>

      {/* Recent Ledger Audit Trail */}
      <div className="grid lg:grid-cols-4 gap-8">
         <Card className="lg:col-span-1 shadow-lg border-emerald-500/20">
            <CardHeader className="pb-2">
               <CardTitle className="text-xs font-black uppercase text-emerald-600 tracking-[0.2em]">Live Burn Rate</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-4xl font-black text-emerald-700 leading-none">₹8,400</div>
               <p className="text-[10px] text-muted-foreground font-bold mt-2 uppercase">Average daily society expenditure</p>
               <div className="mt-4 pt-4 border-t border-emerald-100 h-24">
                  <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={collectionData}>
                        <Line type="monotone" dataKey="expenses" stroke="#10b981" strokeWidth={3} dot={false} />
                     </LineChart>
                  </ResponsiveContainer>
               </div>
            </CardContent>
         </Card>

         <Card className="lg:col-span-3 shadow-lg overflow-hidden border-indigo-500/10">
            <CardHeader className="bg-indigo-500/5 py-4 border-b">
               <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-black tracking-tight">Detailed Expense Breakdown</CardTitle>
                  <Badge variant="outline" className="text-[10px] font-black tracking-[0.2em] border-indigo-200">INTERNAL USE ONLY</Badge>
               </div>
            </CardHeader>
            <CardContent className="h-[250px] py-6">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={expenseData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.1} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" fontSize={11} fontWeight={800} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '12px' }} />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                       {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                    </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>
      </div>

      <div className="text-center text-[10px] text-muted-foreground font-bold uppercase tracking-[0.5em] opacity-40 pt-10">
         End of Society Financial Statement • SmartSociety Systems v4.2
      </div>
    </div>
  );
}
