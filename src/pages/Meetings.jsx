import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Calendar, Clock, MapPin, Users, Plus, ChevronRight, Video, X } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { meetingAPI } from '../api';
import { MOCK_MEETINGS } from '../data/mockData';

export default function Meetings() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === 'admin';
  const [isAdding, setIsAdding] = useState(false);
  const [newMeeting, setNewMeeting] = useState({ title: '', description: '', date: '', time: '', location: '', online: false });
  const [localMeetings, setLocalMeetings] = useState([]);

  // REAL API FETCH: Get live society meetings
  const { data: realMeetingsRes, isLoading } = useQuery({
    queryKey: ['meetings'],
    queryFn: async () => {
      try {
        const res = await meetingAPI.getAll();
        return res.data.meetings || [];
      } catch {
        return [];
      }
    }
  });

  const scheduleMutation = useMutation({
    mutationFn: (data) => meetingAPI.create(data),
    onSuccess: () => {
      toast.success('Meeting scheduled and notifications sent to all residents! 📅');
      setIsAdding(false);
      setNewMeeting({ title: '', description: '', date: '', time: '', location: '', online: false });
      queryClient.invalidateQueries(['meetings']);
    },
    onError: (err, variables) => {
      if (err?.isDemo) {
        const newLocal = {
          _id: `local-${Date.now()}`,
          ...variables,
          status: 'Scheduled',
          attendees: 0,
          createdAt: new Date().toISOString(),
        };
        setLocalMeetings(prev => [newLocal, ...prev]);
        toast.success('Meeting scheduled! Notifications sent to all residents. 📅');
        setIsAdding(false);
        setNewMeeting({ title: '', description: '', date: '', time: '', location: '', online: false });
      } else {
        toast.error('Failed to schedule meeting');
      }
    }
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-5xl mx-auto flex flex-col items-center justify-center py-24">
        <Calendar className="h-12 w-12 text-indigo-300 mb-4 animate-bounce" />
        <p className="text-xl font-black text-indigo-200 tracking-widest uppercase animate-pulse">Syncing Council Agenda...</p>
      </div>
    );
  }


  // Combine Real + Local + Mock
  const meetings = [
    ...localMeetings,
    ...(realMeetingsRes || []),
    ...MOCK_MEETINGS
  ].sort((a, b) => {
    const da = new Date(b.date), db = new Date(a.date);
    return isNaN(da) ? 1 : isNaN(db) ? -1 : da - db;
  });

  const handleSchedule = (e) => {
    e.preventDefault();
    scheduleMutation.mutate(newMeeting);
  };

  const getDayDetails = (dateStr) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "DATE PENDING";
      return d.toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' });
    } catch {
      return "DATE PENDING";
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Calendar className="h-8 w-8 text-indigo-500" />
            Society Meetings
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Official governance and community discussions</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setIsAdding(true)} className="bg-indigo-600 hover:bg-indigo-700 shadow-xl gap-2 font-bold h-11">
            <Plus className="h-4 w-4" /> Schedule Meeting
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="animate-in fade-in zoom-in-95 duration-200 border-indigo-200 shadow-2xl overflow-hidden">
          <CardHeader className="bg-indigo-500 text-white flex flex-row items-center justify-between">
            <div>
              <CardTitle>Schedule New Meeting</CardTitle>
              <CardDescription className="text-indigo-100">Set agenda and venue for the community</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)} className="text-white hover:bg-indigo-600">
               <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSchedule} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold">Meeting Title</Label>
                  <Input required value={newMeeting.title} onChange={e => setNewMeeting({...newMeeting, title: e.target.value})} placeholder="e.g. Annual General Body Meeting" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Venue / Location</Label>
                  <Input required value={newMeeting.location} onChange={e => setNewMeeting({...newMeeting, location: e.target.value})} placeholder="e.g. Clubhouse Hall B" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Date</Label>
                  <Input required type="date" value={newMeeting.date} onChange={e => setNewMeeting({...newMeeting, date: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Time</Label>
                  <Input required type="time" value={newMeeting.time} onChange={e => setNewMeeting({...newMeeting, time: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Agenda / Description</Label>
                <Textarea required value={newMeeting.description} onChange={e => setNewMeeting({...newMeeting, description: e.target.value})} placeholder="Items to be discussed..." rows={3} />
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-50 border border-indigo-100 w-fit">
                 <input 
                   type="checkbox" 
                   id="online" 
                   checked={newMeeting.online} 
                   onChange={e => setNewMeeting({...newMeeting, online: e.target.checked})}
                   className="h-4 w-4 text-indigo-600 rounded" 
                 />
                 <Label htmlFor="online" className="text-indigo-700 cursor-pointer text-sm font-black">Hybrid / Online meeting link enabled</Label>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 px-8 font-black shadow-lg">Publish & Notify</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {meetings?.length > 0 ? meetings.map((meeting) => (
          <Card key={meeting._id} className={`overflow-hidden border-l-4 ${meeting.status === 'Completed' ? 'border-l-muted opacity-80' : 'border-l-indigo-500 shadow-lg'}`}>
            <CardHeader className="md:flex-row justify-between items-start gap-4">
               <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                     <h2 className="text-xl font-black tracking-tight">{meeting.title}</h2>
                     <Badge variant={meeting.status === 'Completed' ? 'secondary' : 'default'} className={meeting.status !== 'Completed' ? 'bg-indigo-500 hover:bg-indigo-600 font-bold' : 'font-bold'}>
                        {meeting.status}
                     </Badge>
                     {meeting.online && <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50"><Video className="h-3 w-3 mr-1" /> Hybrid</Badge>}
                  </div>
                  <p className="text-muted-foreground text-sm max-w-2xl">{meeting.description}</p>
               </div>
               <div className="flex -space-x-2 shrink-0">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                       {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                  <div className="h-8 w-8 rounded-full border-2 border-background bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                     +{meeting.attendees}
                  </div>
               </div>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-muted/30 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                     <div className="p-2 rounded-lg bg-background shadow-sm text-indigo-500">
                        <Calendar className="h-5 w-5" />
                     </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Date</p>
                        <p className="text-sm font-semibold">{getDayDetails(meeting.date)}</p>
                      </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="p-2 rounded-lg bg-background shadow-sm text-indigo-500">
                        <Clock className="h-5 w-5" />
                     </div>
                     <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Time</p>
                        <p className="text-sm font-semibold">{meeting.time}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="p-2 rounded-lg bg-background shadow-sm text-indigo-500">
                        <MapPin className="h-5 w-5" />
                     </div>
                     <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Venue</p>
                        <p className="text-sm font-semibold truncate">{meeting.location}</p>
                     </div>
                  </div>
               </div>
            </CardContent>
            <CardFooter className="justify-between bg-indigo-50/20 border-t py-4">
               <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground font-medium">Click to view agenda and minutes of meeting</p>
                  {meeting.online && (
                     <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase text-emerald-600">Video Link Active</span>
                     </div>
                  )}
               </div>
               <div className="flex gap-2">
                  {meeting.online && (
                     <Button 
                       className="bg-emerald-600 hover:bg-emerald-700 font-bold h-9 px-4 shadow-lg shadow-emerald-50/20"
                       onClick={() => toast.success(`Joining Secure Meeting: ${meeting.title}...`)}
                     >
                        <Video className="h-4 w-4 mr-1.5" /> JOIN NOW
                     </Button>
                  )}
                  <Button variant="ghost" size="sm" className="text-indigo-600 font-bold hover:text-indigo-700">
                     View Details <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
               </div>
            </CardFooter>
          </Card>
        )) : (
          <div className="py-20 text-center opacity-30 italic flex flex-col items-center gap-4 border-2 border-dashed rounded-3xl">
            <Calendar className="h-10 w-10" />
            <p className="font-bold tracking-widest uppercase">No meetings scheduled in the ledger.</p>
          </div>
        )}
      </div>
    </div>
  );
}
