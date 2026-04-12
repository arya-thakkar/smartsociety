import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Bell, Plus, Megaphone, Calendar, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementAPI } from '../api';

export default function Announcements() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: '', content: '', priority: 'Normal' });
  const [searchTerm, setSearchTerm] = useState('');

  const isAdmin = user?.role === 'admin';

  // Fetch Announcements
  const { data: notices, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      try {
        const res = await announcementAPI.getAll();
        return res.data;
      } catch (err) {
        return [
          { _id: '1', title: 'Water Tank Cleaning', content: 'Scheduled for Sunday from 10 AM to 2 PM.', priority: 'High', createdAt: new Date().toISOString() },
          { _id: '2', title: 'Annual General Meeting', content: 'Our AGM will be held on Oct 30th at the Clubhouse.', priority: 'Normal', createdAt: new Date(Date.now() - 86400000).toISOString() },
        ];
      }
    }
  });

  const createMutation = useMutation({
    mutationFn: (data) => announcementAPI.create(data),
    onSuccess: () => {
      toast.success('Announcement posted!');
      setIsAdding(false);
      setNewNotice({ title: '', content: '', priority: 'Normal' });
      queryClient.invalidateQueries(['announcements']);
    }
  });

  const handlePost = (e) => {
    e.preventDefault();
    createMutation.mutate(newNotice);
  };

  const filteredNotices = notices?.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Megaphone className="h-8 w-8 text-primary" />
            Society Board
          </h1>
          <p className="text-muted-foreground text-sm">Vital updates and announcements for all residents</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setIsAdding(true)} className="gap-2 shadow-md">
            <Plus className="h-4 w-4" /> Post Announcement
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Filter announcements..." 
          className="pl-9 h-11" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isAdding && (
        <Card className="animate-in fade-in slide-in-from-top-4 border-primary/20 shadow-xl overflow-hidden">
          <CardHeader className="bg-primary/5">
            <CardTitle>Create New Announcement</CardTitle>
            <CardDescription>This will be visible to all society members.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handlePost} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} placeholder="Announcement Headline" />
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <select 
                    className="w-full p-2 rounded-md border bg-background h-10"
                    value={newNotice.priority}
                    onChange={e => setNewNotice({...newNotice, priority: e.target.value})}
                  >
                    <option>Normal</option>
                    <option>High</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Message Content</Label>
                <Textarea value={newNotice.content} onChange={e => setNewNotice({...newNotice, content: e.target.value})} placeholder="Detailed information..." rows={4} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button type="submit">Publish Now</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {filteredNotices?.length > 0 ? filteredNotices.map((item) => (
          <Card key={item._id} className={`hover:shadow-md transition-all border-l-4 ${item.priority === 'High' ? 'border-l-destructive' : 'border-l-primary'}`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center flex-wrap gap-2">
                    <h3 className="font-bold text-xl">{item.title}</h3>
                    {item.priority === 'High' && <Badge variant="destructive" className="animate-pulse">URGENT</Badge>}
                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">
                      {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </Badge>
                  </div>
                  <p className="text-foreground/80 leading-relaxed max-w-3xl whitespace-pre-wrap">{item.content}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                   <Bell className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/20">
            <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-10" />
            <p className="text-muted-foreground">No announcements match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
