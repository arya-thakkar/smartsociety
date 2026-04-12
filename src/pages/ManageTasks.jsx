import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { taskAPI } from '../api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  ListTodo, 
  Plus, 
  ShieldAlert, 
  CheckCircle2, 
  IndianRupee, 
  Clock, 
  ArrowRight, 
  UserCheck, 
  AlertCircle, 
  X,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { VoiceInput } from '../components/ui/VoiceInput';
import { MOCK_TASKS } from '../data/mockData';

export default function ManageTasks() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    deadline: '', 
    assignedTo: 'resident', 
    type: 'service', 
    amount: 0
  });

  const isAdmin = user?.role === 'admin';
  const isGuard = user?.role === 'guard';

  const { data: realTasksRes, isLoading } = useQuery({
    queryKey: ['society-tasks'],
    queryFn: async () => {
      const res = await taskAPI.getAll();
      return res.data.tasks;
    }
  });

  // Combine Real + Mock
  const tasks = [
    ...(realTasksRes || []),
    ...MOCK_TASKS
  ];

  const taskMutation = useMutation({
    mutationFn: (data) => taskAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['society-tasks']);
      toast.success('Task successfully broadcasted to society!');
      setIsAdding(false);
      setNewTask({ title: '', description: '', deadline: '', assignedTo: 'resident', type: 'service', amount: 0 });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create task')
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => taskAPI.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['society-tasks']);
    }
  });

  const myTasks = tasks.filter(t => t.assignedTo === user?.role || t.assignedTo === 'both');
  const societyTasks = tasks;
  const defaulters = tasks.filter(t => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'Completed');

  const handleCreateTask = (e) => {
    e.preventDefault();
    taskMutation.mutate(newTask);
  };

  const handleMarkDone = (task) => {
    const status = task.type === 'financial' ? 'Paid' : 'Completed';
    updateStatusMutation.mutate({ id: task._id, status });
    toast.success(`Task marked as ${status}. Admin notified.`);
  };

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
             <div className="bg-primary/10 p-2 rounded-xl text-primary">
                <ListTodo className="h-8 w-8" />
             </div>
             {isGuard ? 'AI Duty List' : 'Action Center & Tasks'}
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            {isGuard ? 'Smart prioritized task list for security clearance' : 'Coordinate society logistics and payments'}
          </p>
        </div>
        {(isAdmin || user?.role === 'resident') && (
           <Button onClick={() => setIsAdding(true)} className="h-12 px-6 font-bold shadow-xl gap-2">
              <Plus className="h-5 w-5" /> {isAdmin ? 'Create Global Task' : 'Assign to Guard'}
           </Button>
        )}
      </div>

      {isGuard && (
         <Card className="bg-primary text-primary-foreground border-none shadow-2xl overflow-hidden animate-in slide-in-from-right-4">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Zap className="h-12 w-12" />
            </div>
            <CardHeader className="pb-3 text-center">
               <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center justify-center gap-2">
                  <AlertCircle className="h-5 w-5 animate-pulse" /> AI Task Intelligence Active
               </CardTitle>
               <CardDescription className="text-primary-foreground/70">Security-critical and high-priority tasks are automatically flushed to the top.</CardDescription>
            </CardHeader>
         </Card>
      )}

      {isAdding && (isAdmin || user?.role === 'resident') && (
        <Card className="animate-in fade-in slide-in-from-top-4 border-primary/20 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
           <CardHeader className="flex flex-row justify-between items-center bg-primary/5">
              <div>
                 <CardTitle>Assign New Task</CardTitle>
                 <CardDescription>Target specific roles with deadlines and AI categorization</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)}><X className="h-5 w-5" /></Button>
           </CardHeader>
           <CardContent className="pt-6">
              <form onSubmit={handleCreateTask} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <Label className="font-bold">Task Title / Required Action</Label>
                       <Input required value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="e.g. Monthly Maintenance Payment" />
                    </div>
                    <div className="space-y-2">
                       <Label className="font-bold">Assign To Role</Label>
                       <select 
                         className="w-full h-10 px-3 rounded-md border bg-background text-sm font-medium"
                         value={isAdmin ? newTask.assignedTo : 'guard'}
                         disabled={!isAdmin}
                         onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}
                       >
                          {isAdmin ? (
                             <>
                                <option value="resident">All Residents</option>
                                <option value="guard">Security Guards</option>
                                <option value="both">Both (Society-wide)</option>
                             </>
                          ) : (
                             <option value="guard">Security Guards</option>
                          )}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <Label className="font-bold">Due Deadline</Label>
                       <Input required type="date" value={newTask.deadline} onChange={e => setNewTask({...newTask, deadline: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <Label className="font-bold">Urgency (AI Priority)</Label>
                       <select 
                         className="w-full h-10 px-3 rounded-md border bg-background text-sm font-medium"
                         value={newTask.priority}
                         onChange={e => setNewTask({...newTask, priority: e.target.value})}
                       >
                          <option value="High">🔴 High (Emergency/Immediate)</option>
                          <option value="Medium">🟡 Medium (Standard Action)</option>
                          <option value="Low">🟢 Low (Flexible)</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <Label className="font-bold">Task Category</Label>
                       <select 
                         className="w-full h-10 px-3 rounded-md border bg-background text-sm font-medium"
                         value={newTask.type}
                         onChange={e => setNewTask({...newTask, type: e.target.value})}
                       >
                          <option value="financial">Financial / Payment</option>
                          <option value="service">Maintenance Work</option>
                          <option value="security">Security Protocol</option>
                       </select>
                    </div>
                 </div>

                 {newTask.type === 'financial' && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-2 animate-in slide-in-from-right-2">
                       <Label className="text-emerald-700 font-bold">Maintenance Amount (₹)</Label>
                       <Input type="number" value={newTask.amount} onChange={e => setNewTask({...newTask, amount: e.target.value})} className="bg-white border-emerald-200" />
                    </div>
                 )}

                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <Label className="font-bold">Full Instruction / Agenda</Label>
                       <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase text-muted-foreground">AI Voice Assist</span>
                          <VoiceInput onResult={(text) => setNewTask({...newTask, description: newTask.description + ' ' + text})} />
                       </div>
                    </div>
                    <textarea 
                      className="w-full min-h-[100px] p-3 rounded-xl border bg-background text-sm resize-none"
                      value={newTask.description}
                      onChange={e => setNewTask({...newTask, description: e.target.value})}
                      placeholder="Explain the task in detail. Use AI voice for hands-free mode..."
                    />
                 </div>

                 <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel Action</Button>
                    <Button type="submit" className="font-bold px-10 shadow-lg">Broadcast Task Now</Button>
                 </div>
              </form>
           </CardContent>
        </Card>
      )}

      <Tabs defaultValue={isAdmin ? "global" : "my"} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px] mb-8 bg-muted/50 p-1">
          {isAdmin && <TabsTrigger value="global" className="font-bold">Society Tasks</TabsTrigger>}
          <TabsTrigger value="my" className="font-bold">{isAdmin ? "My Assignments" : "Actions"}</TabsTrigger>
          <TabsTrigger value="sent" className="font-bold">Sent by Me</TabsTrigger>
          {isAdmin && <TabsTrigger value="defaulters" className="font-bold text-red-600">Defaulters List</TabsTrigger>}
        </TabsList>

        <TabsContent value="global" className="space-y-6">
           <div className="grid gap-4">
              {societyTasks.map((t) => (
                 <Card key={t.id} className="hover:shadow-md transition-all border-l-4 border-l-primary group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                       <div>
                          <CardTitle className="text-lg font-bold">{t.title}</CardTitle>
                          <div className="flex gap-2 mt-1">
                             <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest">{t.assignedTo}</Badge>
                             <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-widest">{t.type}</Badge>
                             <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 ml-2">
                                <Clock className="h-3 w-3" /> Due {t.deadline}
                             </span>
                          </div>
                       </div>
                       <div className="text-right">
                          <Badge className={t.status === 'Completed' || t.status === 'Paid' ? 'bg-emerald-500' : 'bg-orange-500'}>{t.status}</Badge>
                          {t.completedBy && <p className="text-[10px] text-muted-foreground mt-1">Done by: {t.completedBy}</p>}
                       </div>
                    </CardHeader>
                    <CardContent className="py-2">
                       <p className="text-sm text-muted-foreground leading-relaxed">{t.description}</p>
                    </CardContent>
                 </Card>
              ))}
           </div>
        </TabsContent>

        <TabsContent value="my" className="space-y-6">
           {myTasks.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                 {myTasks.map((t) => (
                    <Card key={t.id} className={`shadow-lg border-t-4 ${t.status === 'Completed' || t.status === 'Paid' ? 'border-t-emerald-500 opacity-60' : t.priority === 'High' ? 'border-t-red-600 bg-red-50/10' : 'border-t-primary'} animate-in zoom-in-95`}>
                       <CardHeader>
                          <div className="flex justify-between items-start">
                             <div className="space-y-1">
                                {t.priority === 'High' && (
                                   <Badge className="bg-red-600 text-white animate-bounce py-0.5">CRITICAL AI PRIORITY</Badge>
                                )}
                                <CardTitle className="text-xl font-black tracking-tight">{t.title}</CardTitle>
                             </div>
                             <div className={`p-2 rounded-xl ${t.type === 'financial' ? 'bg-emerald-100 text-emerald-700' : 'bg-primary/10 text-primary'}`}>
                                {t.type === 'financial' ? <IndianRupee className="h-5 w-5" /> : t.type === 'security' ? <ShieldCheck className="h-5 w-5" /> : <ListTodo className="h-5 w-5" />}
                             </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">{t.description}</p>
                       </CardHeader>
                       <CardContent className="space-y-4">
                          <div className={`p-4 rounded-xl border flex items-center justify-between ${t.priority === 'High' ? 'bg-red-600 text-white border-none' : new Date(t.deadline) < new Date() && t.status !== 'Completed' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-muted/30 border-dashed'}`}>
                             <div className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <Clock className="h-4 w-4" /> DEADLINE: {t.deadline}
                             </div>
                             {t.type === 'financial' && <div className="text-xl font-black">₹{t.amount}</div>}
                          </div>
                       </CardContent>
                       <CardFooter>
                          {t.status === 'Pending' || t.status === 'In Progress' ? (
                             t.type === 'financial' ? (
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold h-12 shadow-xl shadow-emerald-500/20 gap-2" onClick={() => handleMarkDone(t)}>
                                   Pay & Mark as Done <ArrowRight className="h-4 w-4" />
                                </Button>
                             ) : (
                                <Button className={`w-full font-bold h-12 shadow-xl gap-2 ${t.priority === 'High' ? 'bg-red-600 hover:bg-red-700' : ''}`} onClick={() => handleMarkDone(t)}>
                                   Mark as Actioned <CheckCircle2 className="h-4 w-4" />
                                </Button>
                             )
                          ) : (
                             <div className="w-full py-4 bg-emerald-50 text-emerald-700 rounded-xl text-center font-black flex items-center justify-center gap-2">
                                <CheckCircle2 className="h-5 w-5" /> TASK COMPLETED SUCCESSFULLY
                             </div>
                          )}
                       </CardFooter>
                    </Card>
                 ))}
              </div>
           ) : (
              <div className="text-center py-24 opacity-30">
                 <UserCheck className="h-16 w-16 mx-auto mb-4" />
                 <p className="font-black uppercase tracking-[0.3em] italic">All Clear: No pending tasks assigned to you.</p>
              </div>
           )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-6">
           <div className="grid gap-4">
              {tasks.filter(t => t.completedBy === user?.name || (t.assignedTo === 'guard' && !isAdmin)).map((t) => (
                 <Card key={t.id} className="hover:shadow-md transition-all border-l-4 border-l-blue-500 group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                       <div>
                          <CardTitle className="text-lg font-bold">{t.title}</CardTitle>
                          <div className="flex gap-2 mt-1">
                             <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest">{t.assignedTo}</Badge>
                             <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-widest">{t.type}</Badge>
                             <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 ml-2">
                                <Clock className="h-3 w-3" /> Due {t.deadline}
                             </span>
                          </div>
                       </div>
                       <Badge className={t.status === 'Completed' || t.status === 'Paid' ? 'bg-emerald-500' : 'bg-orange-500'}>{t.status}</Badge>
                    </CardHeader>
                 </Card>
              ))}
           </div>
        </TabsContent>

        <TabsContent value="defaulters" className="space-y-6">
           <Card className="border-red-500/20 shadow-xl overflow-hidden">
              <CardHeader className="bg-red-500/5 py-6">
                 <CardTitle className="flex items-center gap-2 text-red-600">
                    <ShieldAlert className="h-6 w-6" /> Overdue Penalty Tracker
                 </CardTitle>
                 <CardDescription>Residents or Staff who have crossed the task deadline without action.</CardDescription>
              </CardHeader>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
