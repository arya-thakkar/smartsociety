import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { MessageSquare, Plus, CheckCircle2, Clock, AlertTriangle, Send, History, Search, User, X, Mic } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { complaintAPI } from '../api';
import { VoiceInput } from '../components/ui/VoiceInput';
import { MOCK_COMPLAINTS } from '../data/mockData';

export default function Complaints() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newComplaint, setNewComplaint] = useState({ subject: '', description: '', category: 'Maintenance' });

  const isAdmin = user?.role === 'admin';

  // REAL API FETCH: Get live grievances
  const { data: realComplaintsRes, isLoading } = useQuery({
    queryKey: ['complaints'],
    queryFn: async () => {
      const res = await complaintAPI.getAll();
      return res.data.complaints; // Fix: Extract the array
    }
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div className="h-10 w-64 bg-muted animate-pulse rounded-lg" />
        {[1, 2, 3].map(i => (
          <Card key={i} className="h-32 bg-muted animate-pulse border-none rounded-2xl" />
        ))}
      </div>
    );
  }

  // Combine Real + Mock
  const complaints = [
    ...(realComplaintsRes || []),
    ...MOCK_COMPLAINTS
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const createMutation = useMutation({
    mutationFn: (data) => complaintAPI.create(data),
    onSuccess: () => {
      toast.success('Complaint filed successfully with Management!');
      setIsAdding(false);
      setNewComplaint({ subject: '', description: '', category: 'Maintenance' });
      queryClient.invalidateQueries(['complaints']);
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => complaintAPI.updateStatus(id, status),
    onSuccess: () => {
      toast.success('Complaint status updated');
      queryClient.invalidateQueries(['complaints']);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({ ...newComplaint, unit: user?.unit || 'N/A' });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved': return <Badge className="bg-emerald-500 hover:bg-emerald-600 shadow-sm border-none px-3">Resolved</Badge>;
      case 'In Progress': return <Badge className="bg-blue-500 hover:bg-blue-600 shadow-sm border-none px-3">In Progress</Badge>;
      default: return <Badge variant="secondary" className="px-3">Pending Action</Badge>;
    }
  };

  const filteredComplaints = complaints?.filter(c => 
    c.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
             <div className="bg-red-500/10 p-2 rounded-xl">
                <AlertTriangle className="h-8 w-8 text-red-500" />
             </div>
             Grievance Center
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Official channel for society issues and escalation</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="gap-2 shadow-xl bg-red-600 hover:bg-red-700 text-white font-bold h-12 px-6">
          <Plus className="h-5 w-5" /> Raise New Complaint
        </Button>
      </div>

      {isAdding && (
        <Card className="animate-in fade-in slide-in-from-bottom-5 border-red-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />
          <CardHeader className="flex flex-row justify-between items-center bg-red-500/5">
             <div>
                <CardTitle className="text-xl">File a Grievance</CardTitle>
                <CardDescription>Your request will be directly routed to the Secretary / Management</CardDescription>
             </div>
             <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)} className="text-muted-foreground hover:text-red-500"><X className="h-5 w-5" /></Button>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Short Summary</Label>
                  <Input required value={newComplaint.subject} onChange={e => setNewComplaint({...newComplaint, subject: e.target.value})} placeholder="e.g. Broken pipe in lobby" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Direct To / Category</Label>
                  <select 
                    className="w-full p-2.5 rounded-lg border bg-background text-sm font-medium"
                    value={newComplaint.category}
                    onChange={e => setNewComplaint({...newComplaint, category: e.target.value})}
                  >
                    <option value="Maintenance">General Maintenance</option>
                    <option value="Security">Security Team</option>
                    <option value="Sanitation">Housekeeping / Sanitation</option>
                    <option value="Secretary">Society Secretary / Management</option>
                    <option value="Finance">Billing / Finance Department</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                   <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Detailed Description</Label>
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-muted-foreground uppercase">AI Voice assist</span>
                      <VoiceInput onResult={(text) => setNewComplaint({...newComplaint, description: newComplaint.description + ' ' + text})} />
                   </div>
                </div>
                <Textarea required value={newComplaint.description} onChange={e => setNewComplaint({...newComplaint, description: e.target.value})} placeholder="Provide as much detail as possible. Use AI voice for no typing..." rows={4} />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700 font-bold px-10">Send to Management <Send className="h-4 w-4 ml-2" /></Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="relative mb-8">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by topic or unit..." 
          className="pl-9 h-12 shadow-sm border-primary/10" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredComplaints?.length > 0 ? filteredComplaints.map((item) => (
          <Card key={item._id} className="hover:border-primary/30 transition-all shadow-sm border-l-4 border-l-red-500 overflow-hidden group">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 flex-1 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                       <div className="p-2 rounded-lg bg-muted text-red-600">
                          <AlertTriangle className="h-5 w-5" />
                       </div>
                       <div>
                          <h3 className="font-extrabold text-lg leading-tight">{item.subject}</h3>
                          <div className="flex items-center gap-4 mt-1 text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                             <span className="flex items-center gap-1"><User className="h-3 w-3" /> Unit {item.unit}</span>
                             <span className="flex items-center gap-1"><History className="h-3 w-3" /> {new Date(item.createdAt).toLocaleDateString()}</span>
                             <span className="text-red-500">{item.category}</span>
                          </div>
                       </div>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed bg-muted/40 p-3 rounded-lg border border-dashed">{item.description}</p>
                </div>
                {isAdmin && item.status !== 'Resolved' && (
                  <div className="bg-muted/30 border-l p-4 flex md:flex-col gap-2 shrink-0 items-center justify-center">
                     <Button 
                       size="sm" 
                       variant="outline" 
                       className="w-full font-bold text-[10px] uppercase tracking-tighter"
                       onClick={() => updateStatusMutation.mutate({ id: item._id, status: 'In Progress' })}
                     >
                       Mark In Progress
                     </Button>
                     <Button 
                       size="sm" 
                       className="bg-emerald-600 hover:bg-emerald-700 w-full font-bold text-[10px] uppercase tracking-tighter"
                       onClick={() => updateStatusMutation.mutate({ id: item._id, status: 'Resolved' })}
                     >
                       <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Mark Resolved
                     </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="text-center py-24 border-4 border-dashed rounded-[40px] bg-muted/20 opacity-50">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-10" />
            <p className="text-muted-foreground font-black italic uppercase tracking-widest">Safe & Clear: No active grievances reported.</p>
          </div>
        )}
      </div>
    </div>
  );
}
