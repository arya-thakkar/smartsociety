import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Building, Plus, LogIn, ArrowRight, LogOut } from 'lucide-react';
import { toast } from 'sonner';

import { societyAPI } from '../api';
import { useMutation } from '@tanstack/react-query';

export default function SocietySetup() {
  const { user, setSociety, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const [view, setView] = useState('choice'); // 'choice', 'create', 'join'
  const [societyName, setSocietyName] = useState('');
  const [societyAddress, setSocietyAddress] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const createMutation = useMutation({
    mutationFn: (data) => societyAPI.create(data),
    onSuccess: (res) => {
      const { society, user: updatedUser } = res.data;
      toast.success(`Society ${society.name} created!`);
      // Update local storage and store with real data from backend
      updateUser(updatedUser);
      setSociety(society._id, society.name, society.inviteCode);
      navigate(`/dashboard/admin`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create society');
    }
  });

  const joinMutation = useMutation({
    mutationFn: (code) => societyAPI.join({ inviteCode: code }),
    onSuccess: (res) => {
      const { society, user: updatedUser } = res.data;
      toast.success('Joined society successfully!');
      // Update local storage and store with real data from backend
      updateUser(updatedUser);
      setSociety(society._id, society.name, society.inviteCode);
      navigate(`/dashboard/resident`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Invalid invite code or server error');
    }
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!societyName || !societyAddress) {
      toast.error('Please fill in all details');
      return;
    }
    createMutation.mutate({ name: societyName, address: societyAddress });
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (!inviteCode) {
      toast.error('Please enter an invite code');
      return;
    }
    joinMutation.mutate(inviteCode);
  };

  if (view === 'choice') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4 relative">
        <Button 
          variant="ghost" 
          className="absolute top-6 right-6 text-muted-foreground hover:text-destructive font-bold gap-2"
          onClick={() => { logout(); navigate('/login'); }}
        >
          <LogOut className="h-4 w-4" /> Exit to Login
        </Button>
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-300">
          {/* Create Society Option */}
          <Card className="hover:border-primary/50 transition-all cursor-pointer group shadow-lg" onClick={() => setView('create')}>
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Start a Society</CardTitle>
              <CardDescription>
                Register your residential society as an Administrator. You will be able to manage members and staff.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground">
                Begin as Admin <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Join Society Option */}
          <Card className="hover:border-primary/50 transition-all cursor-pointer group shadow-lg" onClick={() => setView('join')}>
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <LogIn className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Join a Society</CardTitle>
              <CardDescription>
                Access your society dashboard by entering the invite code shared with you by your society admin.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground">
                Join as Resident <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md border-primary/20 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        <CardHeader className="space-y-1 relative">
          <div className="flex justify-between items-start">
            <Button variant="ghost" className="w-fit -ml-2 mb-2 h-8 text-xs" onClick={() => setView('choice')}>
              &larr; Back to choice
            </Button>
            <Button variant="ghost" className="h-8 text-xs text-muted-foreground hover:text-destructive" onClick={() => { logout(); navigate('/login'); }}>
              Logout
            </Button>
          </div>
          <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
            <Building className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl font-bold text-center">
            {view === 'create' ? 'Create New Society' : 'Join Your Society'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {view === 'create' ? (
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="socName">Society Name</Label>
                <Input id="socName" placeholder="Emerald Heights" value={societyName} onChange={(e) => setSocietyName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socAddress">Address</Label>
                <Input id="socAddress" placeholder="Gurgaon, India" value={societyAddress} onChange={(e) => setSocietyAddress(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Syncing with Society Records...' : 'Create and Enter Dashboard'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleJoin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Enter Invite Code</Label>
                <Input id="code" placeholder="SOC-XXXX" value={inviteCode} onChange={(e) => setInviteCode(e.target.value.toUpperCase())} />
              </div>
              <Button type="submit" className="w-full" disabled={joinMutation.isPending}>
                {joinMutation.isPending ? 'Verifying Invite Code...' : 'Verify and Join'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
