import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';
import { useAmenityStore } from '../../store/amenityStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Bell, 
  MessageSquare, 
  Calendar, 
  Wallet, 
  Plus, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Users, 
  Mic, 
  ShieldCheck,
  ArrowRight,
  TrendingDown,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { announcementAPI, complaintAPI } from '../../api';
import { VoiceInput } from '../../components/ui/VoiceInput';
import { toast } from 'sonner';

export default function ResidentDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { tasks } = useTaskStore();
  const { amenities, requestBooking } = useAmenityStore();
  const [bookingNote, setBookingNote] = useState("");

  const myTasks = tasks.filter(t => (t.assignedTo === 'resident' || t.assignedTo === 'both') && t.status !== 'Completed' && t.status !== 'Paid');
  
  // Fetch Announcements
  const { data: announcements } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      try {
        const res = await announcementAPI.getAll();
        return res.data.slice(0, 3);
      } catch (err) {
        return [
          { _id: 'a1', title: 'Water Tank Cleaning', content: 'Cleaning scheduled for B-Block overhead tanks on Sunday.', createdAt: new Date().toISOString() },
          { _id: 'a2', title: 'Annual Fest Meeting', content: 'Meeting tonight at 8 PM in Clubhouse to discuss solar project.', createdAt: new Date(Date.now() - 86400000).toISOString() }
        ];
      }
    }
  });

  // Fetch Complaints (All society complaints as requested)
  const { data: complaints } = useQuery({
    queryKey: ['complaints'],
    queryFn: async () => {
      try {
        const res = await complaintAPI.getAll();
        return res.data.slice(0, 3);
      } catch (err) {
        return [
          { _id: 'c1', subject: 'Street Light Out', unit: 'A-201', createdAt: new Date().toISOString() },
          { _id: 'c2', subject: 'Late Night Noise', unit: 'C-405', createdAt: new Date(Date.now() - 43200000).toISOString() }
        ];
      }
    }
  });

  const handleQuickBook = (amenity) => {
    requestBooking({
      amenityId: amenity.id,
      amenityName: amenity.name,
      date: new Date().toISOString().split('T')[0],
      slot: amenity.slots[0],
      note: bookingNote || "Expedited booking from Dashboard",
      userId: user.id,
      userName: user.name,
      unit: user.unit
    });
    toast.success(`Booking request for ${amenity.name} sent to Admin!`);
    setBookingNote("");
  };

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto pb-20 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
             Hello, <span className="text-primary">{user?.name.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
             Welcome to your Smart Residence Dashboard • <span className="text-foreground font-bold">{user?.unit}</span>
          </p>
        </div>
        <div className="flex gap-3">
           <Button onClick={() => navigate('/complaints')} className="bg-red-600 hover:bg-red-700 shadow-xl h-12 px-6 font-bold gap-2">
              <Plus className="h-5 w-5" /> Raise Complaint
           </Button>
           <Button onClick={() => navigate('/invite-visitor')} variant="outline" className="h-12 border-2 px-6 font-bold gap-2">
              <Users className="h-5 w-5" /> Invite Guest
           </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Announcements & Complaints */}
        <div className="lg:col-span-2 space-y-8">
           {/* Financial Transparency Sidebar (Horizontal for residents) */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Society Balance', val: '₹14.2L', icon: Wallet, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'This Month Revenue', val: '₹4.8L', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Utility Burn Rate', val: '₹62k', icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50' }
              ].map((item, i) => (
                <Card key={i} className="border-none shadow-md hover:shadow-xl transition-all">
                   <CardContent className="p-5 flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${item.bg} ${item.color}`}>
                         <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                         <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{item.label}</p>
                         <p className="text-xl font-black">{item.val}</p>
                      </div>
                   </CardContent>
                </Card>
              ))}
           </div>

           {/* Announcements */}
           <Card className="shadow-2xl border-none overflow-hidden">
              <CardHeader className="bg-primary text-primary-foreground py-6">
                 <div className="flex justify-between items-center">
                    <div>
                       <CardTitle className="flex items-center gap-2">
                          <Bell className="h-5 w-5 animate-bounce" /> Society Broadcasts
                       </CardTitle>
                       <CardDescription className="text-primary-foreground/70">Vital updates from the Secretary</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" onClick={() => navigate('/announcements')}>View All</Button>
                 </div>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="divide-y">
                    {announcements?.length > 0 ? announcements.map((a) => (
                       <div key={a._id} className="p-6 hover:bg-muted/30 transition-colors flex justify-between gap-4 group">
                          <div className="space-y-1">
                             <h4 className="font-extrabold text-lg group-hover:text-primary transition-colors">{a.title}</h4>
                             <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{a.content}</p>
                             <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground pt-2 uppercase tracking-tighter italic">
                                <Clock className="h-3 w-3" /> Published {new Date(a.createdAt).toLocaleDateString()}
                             </div>
                          </div>
                          <ChevronRight className="h-5 w-5 self-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all text-primary" />
                       </div>
                    )) : (
                       <div className="p-10 text-center text-muted-foreground italic">No active announcements</div>
                    )}
                 </div>
              </CardContent>
           </Card>

           {/* Grievance Feed */}
           <Card className="shadow-2xl border-none overflow-hidden">
              <CardHeader className="bg-red-600 text-white py-6">
                 <div className="flex justify-between items-center">
                    <div>
                       <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" /> Society Grievance Feed
                       </CardTitle>
                       <CardDescription className="text-white/70">Ongoing issues reported by the community</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" onClick={() => navigate('/complaints')}>Action History</Button>
                 </div>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="divide-y divide-red-100">
                    {complaints?.map((c) => (
                       <div key={c._id} className="p-6 flex items-center justify-between hover:bg-red-50/30 transition-all">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black">
                                {c.unit.charAt(0)}
                             </div>
                             <div>
                                <h4 className="font-bold">{c.subject}</h4>
                                <p className="text-xs text-muted-foreground font-medium">Issue reported by <span className="font-bold">{c.unit}</span></p>
                             </div>
                          </div>
                          <Badge variant="outline" className="border-red-200 text-red-600 bg-red-50 text-[10px] font-bold uppercase tracking-widest">Ongoing</Badge>
                       </div>
                    ))}
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Right Column: Amenities & Tasks */}
        <div className="space-y-8">
           {/* AI Amenity Hub */}
           <Card className="shadow-2xl border-emerald-500/10 overflow-hidden bg-gradient-to-b from-emerald-50/50 to-white">
              <CardHeader className="bg-emerald-600 text-white pb-8 relative">
                 <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5" /> Amenity SmartHub
                 </CardTitle>
                 <CardDescription className="text-white/70">One-tap booking with AI Voice</CardDescription>
                 <div className="absolute -bottom-6 left-6 right-6">
                    <Card className="bg-white shadow-xl p-3 border-none flex items-center gap-3">
                       <VoiceInput onResult={(t) => setBookingNote(t)} className="bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100" />
                       <input 
                         placeholder="Speak for custom note..." 
                         className="text-xs font-bold w-full bg-transparent border-none focus:ring-0 placeholder:text-muted-foreground/50"
                         value={bookingNote}
                         onChange={e => setBookingNote(e.target.value)}
                       />
                    </Card>
                 </div>
              </CardHeader>
              <CardContent className="pt-10 space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Quick Reserve Facilities</p>
                 {amenities.slice(0, 3).map((amenity) => (
                    <div key={amenity.id} className="p-4 bg-white border border-emerald-100 rounded-2xl hover:shadow-lg transition-all flex items-center justify-between group">
                       <div className="flex items-center gap-4">
                          <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
                             <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                             <h4 className="font-bold text-sm tracking-tight">{amenity.name}</h4>
                             <p className="text-[10px] text-muted-foreground font-black uppercase">{amenity.slots[0]} Slot</p>
                          </div>
                       </div>
                       <Button size="icon" variant="ghost" className="text-emerald-600 hover:bg-emerald-50 rounded-full" onClick={() => handleQuickBook(amenity)}>
                          <ArrowUpRight className="h-5 w-5" />
                       </Button>
                    </div>
                 ))}
                 <Button variant="link" className="w-full text-emerald-600 font-black text-xs uppercase" onClick={() => navigate('/amenities')}>View 8+ Facilities</Button>
              </CardContent>
           </Card>

           {/* My Action Items */}
           <Card className="shadow-2xl border-indigo-500/10 border-t-4 border-t-indigo-600">
              <CardHeader className="pb-2">
                 <CardTitle className="text-xl font-black italic tracking-tighter flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-indigo-600" /> My Tasks
                 </CardTitle>
                 <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Pending assigned actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                 {myTasks.length > 0 ? myTasks.map((t) => (
                    <div key={t.id} className="p-4 rounded-2xl bg-muted/40 border-2 border-transparent hover:border-indigo-100 transition-all flex justify-between items-center group">
                       <div className="space-y-1">
                          <h4 className="font-bold text-sm">{t.title}</h4>
                          <span className="text-[10px] font-black bg-white/50 px-2 py-0.5 rounded text-muted-foreground">DUE {t.deadline}</span>
                       </div>
                       <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-[10px] font-bold h-8 group-hover:px-6 transition-all" onClick={() => navigate('/tasks')}>START</Button>
                    </div>
                 )) : (
                    <div className="py-12 text-center opacity-20">
                       <CheckCircle2 className="h-10 w-10 mx-auto mb-2" />
                       <p className="font-black italic uppercase tracking-widest text-xs">All Done</p>
                    </div>
                 )}
              </CardContent>
              <CardFooter className="bg-muted/30 pt-4 flex justify-between border-t border-indigo-100/50">
                 <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                    <span className="text-[10px] font-black uppercase text-indigo-700 tracking-tighter">Tasks Synced Live</span>
                 </div>
                 <Button variant="ghost" size="sm" className="text-indigo-600 font-black text-[10px] h-auto p-0 hover:bg-transparent" onClick={() => navigate('/tasks')}>VIEW ALL TASKS <ArrowRight className="h-3 w-3 ml-1" /></Button>
              </CardFooter>
           </Card>

           {/* Smart Security Card */}
           <Card className="bg-slate-900 text-white overflow-hidden relative shadow-2xl">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <ShieldCheck className="h-32 w-32" />
              </div>
              <CardHeader className="pb-2">
                 <CardTitle className="text-sm font-black uppercase tracking-[0.3em] text-emerald-400">Security Pulse</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="flex items-end gap-3">
                    <span className="text-5xl font-black">0</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pb-1">Unrecognized entries</span>
                 </div>
                 <div className="space-y-2">
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 w-[100%] animate-pulse" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Perimeter Integrity: 100%</p>
                 </div>
              </CardContent>
              <CardFooter className="pt-2">
                 <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black h-10 shadow-lg shadow-emerald-500/20" onClick={() => navigate('/invite-visitor')}>
                    REQUEST ANONYMOUS PASS
                 </Button>
              </CardFooter>
           </Card>
        </div>
      </div>
    </div>
  );
}
