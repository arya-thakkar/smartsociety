import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Search, UserCog, UserCheck, ShieldAlert, MoreVertical } from 'lucide-react';
import MemberDetailsModal from '../components/modals/MemberDetailsModal';
import { toast } from 'sonner';

import { memberAPI } from '../api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MOCK_MEMBERS } from '../data/mockData';

export default function Members() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);

  const isAdmin = user?.role === 'admin';
  
  // REAL API FETCH: Get live society members
  const { data: members, isLoading } = useQuery({
    queryKey: ['society-members'],
    queryFn: async () => {
      try {
        const res = await memberAPI.getAll();
        return res.data.members || res.data.data?.members || [];
      } catch (err) {
        console.error("Members API failed", err);
        return [];
      }
    }
  });

  const changeRoleMutation = useMutation({
    mutationFn: ({ id, role }) => memberAPI.updateRole(id, role),
    onSuccess: () => {
       queryClient.invalidateQueries(['society-members']);
       toast.success('Member role synced to database');
    }
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 max-w-5xl mx-auto">
        <div className="h-10 w-64 bg-muted animate-pulse rounded-lg" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 w-full bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  // Combine Real + Mock + Self
  const allMembers = [
    { ...user, _id: 'me' },
    ...(members || []),
    ...MOCK_MEMBERS.filter(mm => !(members || []).find(rm => rm.email === mm.email))
  ];

  // Remove duplicates by ID (if any)
  const uniqueMembers = Array.from(new Map(allMembers.map(m => [m._id, m])).values());

  const filteredMembers = uniqueMembers.filter(m => 
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.unit?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const changeRole = (id, newRole) => {
    if (id === 'me') {
      toast.error("You cannot change your own role.");
      return;
    }
    changeRoleMutation.mutate({ id, role: newRole });
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Society Directory</h1>
          <p className="text-muted-foreground">View and manage all residents and staff in {user?.societyName}</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or unit..." 
            className="pl-9" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredMembers.map((member) => (
          <Card key={member._id} className="hover:border-primary/40 transition-colors shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center p-4 gap-4">
                <Avatar 
                  className="h-12 w-12 border cursor-pointer hover:ring-2 ring-primary transition-all" 
                  onClick={() => setSelectedMember(member)}
                >
                  <AvatarImage src={member.photoUrl} />
                  <AvatarFallback className="uppercase font-bold">{member.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 
                      className="font-bold text-lg hover:text-primary cursor-pointer transition-colors truncate"
                      onClick={() => setSelectedMember(member)}
                    >
                      {member.name} {member._id === 'me' && <span className="text-xs text-muted-foreground">(You)</span>}
                    </h3>
                    <Badge variant={member.role === 'admin' ? 'destructive' : member.role === 'guard' ? 'default' : 'secondary'}>
                      {member.role}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Unit {member.unit || 'Office'}</p>
                </div>

                {isAdmin && member._id !== 'me' && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => changeRole(member._id, member.role === 'guard' ? 'resident' : 'guard')} 
                      className="gap-2 text-xs"
                    >
                      {member.role === 'guard' ? <UserCheck className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                      {member.role === 'guard' ? 'Make Resident' : 'Make Guard'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => changeRole(member._id, member.role === 'admin' ? 'resident' : 'admin')} 
                      className="gap-2 text-xs"
                    >
                      <UserCog className="h-3 w-3 text-primary" />
                      {member.role === 'admin' ? 'Demote' : 'Make Admin'}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredMembers.length === 0 && (
          <div className="text-center py-20 bg-muted/20 border-2 border-dashed rounded-2xl">
            <p className="text-muted-foreground">No members found matching your search.</p>
          </div>
        )}
      </div>

      {selectedMember && (
        <MemberDetailsModal 
          member={selectedMember} 
          onClose={() => setSelectedMember(null)} 
        />
      )}
    </div>
  );
}
