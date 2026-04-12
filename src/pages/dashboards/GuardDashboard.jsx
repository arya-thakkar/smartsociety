import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Shield, 
  FileText, 
  ListTodo, 
  Users, 
  Bell, 
  Mic, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  ScanLine
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { announcementAPI, taskAPI, logAPI } from '../../api';
import { MOCK_TASKS, MOCK_LOGS } from '../../data/mockData';

export default function GuardDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Fetch Announcements
  const { data: announcements } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const res = await announcementAPI.getAll();
      return res.data.slice(0, 2);
    }
  });

  // REAL API FETCH: Get live society tasks
  const { data: realTasks } = useQuery({
    queryKey: ['society-tasks'],
    queryFn: async () => {
      const res = await taskAPI.getAll();
      return res.data.tasks;
    }
  });

  // REAL API FETCH: Get live gate logs
  const { data: realLogs } = useQuery({
    queryKey: ['gate-logs'],
    queryFn: async () => {
      const res = await logAPI.getAll();
      return res.data.logs;
    }
  });

  // Hybrid Data
  const allTasks = [...(realTasks || []), ...MOCK_TASKS];
  const allLogs = [...(realLogs || []), ...MOCK_LOGS];

  const guardTasks = allTasks.filter(t => t.assignedTo === 'guard' || t.assignedTo === 'both');
  const highPriorityTasks = guardTasks
    .filter(t => t.status !== 'Completed')
    .sort((a, b) => (b.priority === 'High' ? -1 : 1))
    .slice(0, 3);

  const stats = [
    { label: 'Entries Today', value: allLogs.length, icon: FileText, color: 'text-blue-600' },
    { label: 'Active Tasks', value: guardTasks.filter(t => t.status !== 'Completed').length, icon: ListTodo, color: 'text-orange-600' },
    { label: 'Pending Visitors', value: '4', icon: Users, color: 'text-emerald-600' },
  ];

  return (
    <div className="p-4 md:p-6 space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
             <Shield className="h-8 w-8 text-primary" /> Security Hub
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Hello, {user?.name}. Everything is secure at Gate 1.</p>
        </div>
        <div className="flex gap-3">
           <Button className="bg-emerald-600 font-black shadow-xl animate-pulse" onClick={() => navigate('/scanner')}>
              <ScanLine className="mr-2 h-4 w-4" /> SCAN VISITOR
           </Button>
           <Button variant="outline" className="font-bold gap-2" onClick={() => navigate('/logs')}>
              <Mic className="h-4 w-4" /> Voice Log
           </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((s, i) => (
          <Card key={i} className="shadow-lg border-none hover:scale-105 transition-transform">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</CardTitle>
                <s.icon className={`h-5 w-5 ${s.color}`} />
             </CardHeader>
             <CardContent>
                <div className="text-3xl font-black">{s.value}</div>
             </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Urgent AI Priority Tasks */}
        <div className="lg:col-span-7 space-y-6">
           <Card className="shadow-xl border-none">
              <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between">
                 <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                       <AlertCircle className="h-5 w-5 text-red-500" /> AI Priority List
                    </CardTitle>
                    <CardDescription>Most urgent security tasks</CardDescription>
                 </div>
                 <Button variant="ghost" size="sm" className="font-bold text-xs" onClick={() => navigate('/tasks')}>View All</Button>
              </CardHeader>
              <CardContent className="p-0">
                 {highPriorityTasks.length > 0 ? (
                    <div className="divide-y">
                       {highPriorityTasks.map((task) => (
                          <div key={task.id} className={`p-5 flex items-center justify-between gap-4 group hover:bg-muted/30 transition-all ${task.priority === 'High' ? 'bg-red-50 border-l-4 border-l-red-500' : ''}`}>
                             <div className="flex gap-4">
                                <div className={`p-3 rounded-full ${task.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                   <AlertCircle className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                   <h4 className="font-black text-sm">{task.title}</h4>
                                   <p className="text-xs text-muted-foreground line-clamp-1">{task.description}</p>
                                   <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-muted-foreground/50">
                                      <Clock className="h-3 w-3" /> ASAP
                                   </div>
                                </div>
                             </div>
                             <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100"><ArrowRight className="h-4 w-4" /></Button>
                          </div>
                       ))}
                    </div>
                 ) : (
                    <div className="p-12 text-center opacity-30 italic font-medium">All tasks cleared.</div>
                 )}
              </CardContent>
           </Card>

           <Card className="shadow-lg transition-all hover:shadow-xl">
              <CardHeader className="bg-blue-600 text-white rounded-t-xl">
                 <CardTitle className="text-lg">Recent Visitors</CardTitle>
              </CardHeader>
              <CardContent className="p-0 divide-y">
                 {logs.slice(0, 3).map((v) => (
                    <div key={v.id} className="p-4 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 bg-muted flex items-center justify-center font-bold text-xs uppercase">{v.name.charAt(0)}</Avatar>
                          <div>
                             <p className="text-sm font-bold">{v.name}</p>
                             <p className="text-[10px] font-medium text-muted-foreground tracking-widest uppercase">{v.unit} • {v.timestamp}</p>
                          </div>
                       </div>
                       <Badge variant={v.status === 'Inside' ? 'default' : 'secondary'} className="text-[10px] font-bold">{v.status}</Badge>
                    </div>
                 ))}
                 <Button variant="ghost" className="w-full text-xs font-bold text-primary" onClick={() => navigate('/logs')}>See Full Log</Button>
              </CardContent>
           </Card>
        </div>

        {/* Announcements & Quick Info */}
        <div className="lg:col-span-5 space-y-6">
           <Card className="bg-primary text-primary-foreground shadow-2xl overflow-hidden border-none">
              <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" /> Announcements
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 {announcements?.length > 0 ? announcements.map((a) => (
                    <div key={a._id} className="bg-white/10 p-4 rounded-xl space-y-1">
                       <p className="font-black text-sm">{a.title}</p>
                       <p className="text-xs opacity-70 line-clamp-2">{a.content}</p>
                    </div>
                 )) : (
                    <div className="p-8 text-center opacity-40 italic">No new notices for security.</div>
                 )}
              </CardContent>
           </Card>

           <div className="grid grid-cols-2 gap-4">
              <Card className="bg-orange-50 border-orange-200 shadow-sm">
                 <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-black uppercase text-orange-600">Police Contact</CardTitle>
                 </CardHeader>
                 <CardContent className="text-lg font-black text-orange-800">100</CardContent>
              </Card>
              <Card className="bg-emerald-50 border-emerald-200 shadow-sm">
                 <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-black uppercase text-emerald-600">Fire Dept</CardTitle>
                 </CardHeader>
                 <CardContent className="text-lg font-black text-emerald-800">101</CardContent>
              </Card>
           </div>
        </div>
      </div>
    </div>
  );
}

// Minimal Avatar hack since the UI package doesn't define it
function Avatar({ className, children }) {
  return <div className={`rounded-full overflow-hidden ${className}`}>{children}</div>;
}
