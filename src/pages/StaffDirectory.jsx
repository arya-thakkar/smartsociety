import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Phone, MessageSquare, Shield, Wrench, Trash2, Brush, Plus, UserPlus, X } from 'lucide-react';
import { toast } from 'sonner';

const initialStaff = [
  { id: 1, name: 'Ramesh Kumar', role: 'Plumber', phone: '+91 98765 43210', status: 'On Duty', icon: Wrench, color: 'text-blue-500' },
  { id: 2, name: 'Suresh Singh', role: 'Electrician', phone: '+91 98765 43211', status: 'On Duty', icon: Wrench, color: 'text-yellow-500' },
  { id: 3, name: 'Security Post A', role: 'Security', phone: '+91 98765 43212', status: 'Live', icon: Shield, color: 'text-emerald-500' },
  { id: 4, name: 'Anita Devi', role: 'Cleaning', phone: '+91 98765 43213', status: 'Off Duty', icon: Brush, color: 'text-purple-500' },
];

export default function StaffDirectory() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const [staffList, setStaffList] = useState(initialStaff);
  const [isAdding, setIsAdding] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', role: 'Security', phone: '', status: 'On Duty' });

  const handleAddStaff = (e) => {
    e.preventDefault();
    const staff = {
      ...newStaff,
      id: Date.now(),
      icon: newStaff.role === 'Security' ? Shield : Wrench,
      color: newStaff.role === 'Security' ? 'text-emerald-500' : 'text-blue-500'
    };
    setStaffList([staff, ...staffList]);
    toast.success(`${newStaff.name} added to staff directory!`);
    setIsAdding(false);
    setNewStaff({ name: '', role: 'Security', phone: '', status: 'On Duty' });
  };

  const removeStaff = (id) => {
    setStaffList(staffList.filter(s => s.id !== id));
    toast.error('Staff member removed');
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-slate-900">Maintenance Staff</h1>
          <p className="text-muted-foreground text-sm">Direct contact for society essential services</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setIsAdding(true)} className="gap-2 bg-slate-900 text-white hover:bg-slate-800 shadow-lg">
            <UserPlus className="h-4 w-4" /> Add Staff Member
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="animate-in fade-in slide-in-from-top-4 border-slate-200 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50">
             <div>
                <CardTitle>Register New Staff Member</CardTitle>
                <CardDescription>Enter details to list them in the directory</CardDescription>
             </div>
             <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)}>
                <X className="h-5 w-5" />
             </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input required value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} placeholder="e.g. Rahul Verma" />
                </div>
                <div className="space-y-2">
                  <Label>Role / Department</Label>
                  <select 
                    className="w-full h-10 px-3 rounded-md border bg-background"
                    value={newStaff.role}
                    onChange={e => setNewStaff({...newStaff, role: e.target.value})}
                  >
                    <option>Security</option>
                    <option>Plumber</option>
                    <option>Electrician</option>
                    <option>Cleaning</option>
                    <option>Gardener</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input required value={newStaff.phone} onChange={e => setNewStaff({...newStaff, phone: e.target.value})} placeholder="+91 00000 00000" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button type="submit" className="bg-slate-900 text-white px-8">Add Member</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList.map((staff) => {
          const Icon = staff.icon || (staff.role === 'Security' ? Shield : Wrench);
          return (
            <Card key={staff.id} className="hover:shadow-xl transition-all duration-300 border-slate-200/60 group relative overflow-hidden">
              <div className={`absolute top-0 right-0 h-24 w-24 -mr-8 -mt-8 rounded-full opacity-5 ${staff.color || 'bg-slate-500'} blur-2xl`} />
              <CardHeader className="flex flex-row items-center gap-4 pb-3">
                <div className={`h-12 w-12 rounded-2xl bg-slate-50 border flex items-center justify-center shrink-0 ${staff.color || 'text-slate-500'}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-bold truncate tracking-tight">{staff.name}</CardTitle>
                  <CardDescription className="font-bold text-[10px] uppercase tracking-widest text-slate-500">{staff.role}</CardDescription>
                </div>
                <Badge variant={staff.status === 'On Duty' || staff.status === 'Live' ? 'default' : 'secondary'} className={staff.status === 'On Duty' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                  {staff.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 border rounded-xl text-sm">
                  <span className="font-mono text-slate-700">{staff.phone}</span>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
              {isAdmin && (
                <div className="px-6 pb-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                   <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 h-7 text-[10px] font-bold uppercase gap-1" onClick={() => removeStaff(staff.id)}>
                      <Trash2 className="h-3 w-3" /> Remove
                   </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
