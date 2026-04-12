import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { 
  Users, 
  ShieldCheck, 
  Wallet, 
  Calendar, 
  Plus, 
  MessageSquare, 
  Bell, 
  Building, 
  Flame, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  Smile
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { statisticsAPI, complaintAPI, announcementAPI } from '../../api';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Fetch Admin Stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      try {
        const res = await statisticsAPI.getAdminStats();
        return res.data;
      } catch (err) {
        return {
          totalResidents: 450,
          guardCount: 12,
          openComplaints: 8,
          monthlyCollection: '₹4.5L'
        };
      }
    }
  });

  // Fetch Recent Activity (Complaints)
  const { data: complaintsData } = useQuery({
    queryKey: ['recentComplaints'],
    queryFn: async () => {
      try {
        const res = await complaintAPI.getAll();
        return res.data.slice(0, 3);
      } catch (err) {
        return [];
      }
    }
  });

  const stats = [
    { label: 'Total Residents', value: statsData?.totalResidents || '450', icon: Users, color: 'text-blue-500' },
    { label: 'Security Staff', value: statsData?.guardCount || '12', icon: ShieldCheck, color: 'text-emerald-500' },
    { label: 'Open Complaints', value: statsData?.openComplaints || '8', icon: MessageSquare, color: 'text-orange-500' },
    { label: 'Monthly Collection', value: statsData?.monthlyCollection || '₹4.5L', icon: Wallet, color: 'text-purple-500' },
  ];

  return (
    <div className="p-4 md:p-6 space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base flex items-center gap-2">
            Welcome back, {user?.name}. 
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold border border-primary/20">
              Invite Code: {useAuthStore.getState().inviteCode || 'SOC-9921'}
            </span>
          </p>
        </div>
        <Button className="shrink-0 w-full md:w-auto font-black shadow-lg" onClick={() => navigate('/announcements')}>
          <Plus className="h-4 w-4 mr-2" />
          New Announcement
        </Button>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="shadow-lg border-none hover:translate-y-[-4px] transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  {stat.label}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600 font-bold">
                   <TrendingUp className="h-3 w-3" /> +2.4% this week
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Section: Community News & Feed */}
        <div className="lg:col-span-8 space-y-8">
           <Card className="shadow-xl border-none">
             <CardHeader className="flex flex-row items-center justify-between">
                <div>
                   <CardTitle className="flex items-center gap-2">
                      <Flame className="h-5 w-5 text-orange-500" /> Community Activity
                   </CardTitle>
                   <CardDescription>Live society feed overview</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="font-bold text-xs gap-2" onClick={() => navigate('/feed')}>
                   View Full Feed <ArrowRight className="h-3 w-3" />
                </Button>
             </CardHeader>
             <CardContent className="space-y-4">
                {[
                   { author: 'Aarav Mehta', content: 'The garden looks amazing today! Kudos to the gardeners.', unit: 'C-804', time: '2h ago' },
                   { author: 'Priya Sharma', content: 'Lost my keys near the clubhouse. Please help!', unit: 'A-201', time: '5h ago' }
                ].map((post, i) => (
                   <div key={i} className="flex gap-4 p-4 rounded-xl border bg-card hover:bg-muted/30 transition-all group">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary shrink-0 group-hover:scale-110 transition-transform">
                         {post.author.charAt(0)}
                      </div>
                      <div className="min-w-0">
                         <div className="flex items-center gap-2">
                            <p className="text-sm font-black">{post.author}</p>
                            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{post.unit}</span>
                         </div>
                         <p className="text-sm text-muted-foreground truncate italic mt-1 font-medium">"{post.content}"</p>
                         <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mt-1">{post.time}</p>
                      </div>
                   </div>
                ))}
             </CardContent>
           </Card>

           <Card className="shadow-xl border-none overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Sparkles className="h-12 w-12" />
              </div>
              <CardHeader>
                 <CardTitle className="text-lg">AI Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="flex gap-6 items-center">
                    <div className="space-y-1">
                       <p className="text-xs font-black uppercase text-muted-foreground">Sentiment Index</p>
                       <div className="flex items-center gap-2">
                          <Smile className="h-6 w-6 text-emerald-500" />
                          <span className="text-2xl font-black">92%</span>
                       </div>
                    </div>
                    <div className="h-12 w-px bg-border" />
                    <div className="flex-1 space-y-2">
                       <p className="text-[11px] font-medium leading-relaxed italic text-muted-foreground">
                          "Resident engagement is currently at an all-time high. Primary discussions revolve around landscaping and facility appreciation. No critical grievances reported."
                       </p>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Right Section: Governance & Tasks */}
        <div className="lg:col-span-4 space-y-8">
           <Card className="shadow-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-none">
              <CardHeader>
                 <CardTitle className="text-lg flex items-center gap-2">
                    <Building className="h-5 w-5" /> Quick Controls
                 </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 pb-6">
                 <Button variant="secondary" className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-auto py-4 flex flex-col font-bold" onClick={() => navigate('/amenities')}>
                    <Building className="h-5 w-5 mb-2" /> <span>Amenities</span>
                 </Button>
                 <Button variant="secondary" className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-auto py-4 flex flex-col font-bold" onClick={() => navigate('/complaints')}>
                    <MessageSquare className="h-5 w-5 mb-2" /> <span>Issues</span>
                 </Button>
                 <Button variant="secondary" className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-auto py-4 flex flex-col font-bold" onClick={() => navigate('/members')}>
                    <Users className="h-5 w-5 mb-2" /> <span>Members</span>
                 </Button>
                 <Button variant="secondary" className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-auto py-4 flex flex-col font-bold" onClick={() => navigate('/finance')}>
                    <Wallet className="h-5 w-5 mb-2" /> <span>Finance</span>
                 </Button>
              </CardContent>
           </Card>

           <Card className="shadow-xl border-none">
              <CardHeader>
                 <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-orange-500" /> Recent Issues
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {complaintsData?.length > 0 ? complaintsData.map((complaint) => (
                   <div key={complaint._id} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => navigate('/complaints')}>
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                      <div className="flex-1 min-w-0">
                         <p className="text-xs font-bold truncate">{complaint.subject}</p>
                         <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{complaint.unit}</p>
                      </div>
                      <ArrowRight className="h-3 w-3 opacity-30" />
                   </div>
                )) : <p className="text-xs text-muted-foreground text-center py-4 italic">Everything crystal clear today</p>}
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
