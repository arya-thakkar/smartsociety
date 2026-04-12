import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../api/axios';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select } from '../components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { User, Mail, Home, Trash2, PlusCircle, Image as ImageIcon, Building } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [addingType, setAddingType] = useState('family'); // 'family' or 'help'
  const [formData, setFormData] = useState({ name: '', relation: 'Spouse', phone: '', task: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const displayUser = user;

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Name is required');
      return;
    }
    
    const newId = Date.now().toString();
    const newItem = { 
      _id: newId, 
      name: formData.name, 
      photoUrl: photoPreview || null 
    };

    if (addingType === 'family') {
      newItem.relation = formData.relation;
      const updatedUser = {
        ...displayUser,
        familyMembers: [...(displayUser.familyMembers || []), newItem]
      };
      updateUser(updatedUser);
      toast.success('Family member added locally');
    } else {
      newItem.phone = formData.phone;
      newItem.task = formData.task;
      const updatedUser = {
        ...displayUser,
        houseHelp: [...(displayUser.houseHelp || []), newItem]
      };
      updateUser(updatedUser);
      toast.success('House help added locally');
    }

    setIsAddingMode(false);
    setFormData({ name: '', relation: 'Spouse', phone: '', task: '' });
    setPhotoPreview(null);
  };

  const removeItem = (id, type) => {
    const key = type === 'family' ? 'familyMembers' : 'houseHelp';
    const updatedUser = {
      ...displayUser,
      [key]: (displayUser[key] || []).filter(m => m._id !== id)
    };
    updateUser(updatedUser);
    toast.success('Removed successfully');
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6 pb-20">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>

      {/* Society Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            Society Membership
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-xl">{displayUser?.societyName || 'Not Joined'}</p>
              <p className="text-sm text-muted-foreground">My Unit: {displayUser?.unit}</p>
            </div>
            {displayUser?.role === 'admin' && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase font-semibold">Invite Code</p>
                <code className="bg-primary/20 px-2 py-1 rounded font-mono text-primary font-bold">{displayUser?.inviteCode}</code>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your basic details and identity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
              <AvatarImage src={displayUser?.photoUrl} />
              <AvatarFallback className="text-3xl bg-primary/20 text-primary uppercase">
                {displayUser?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">{displayUser?.name}</h2>
              <div className="flex gap-2 text-sm text-muted-foreground capitalize">
                <span className="px-2 py-0.5 rounded-full bg-secondary border">{displayUser?.role}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 p-4 rounded-xl bg-muted/40 border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-background rounded-md shadow-sm">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Email Address</p>
                <p className="font-medium">{displayUser?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-background rounded-md shadow-sm">
                <Home className="h-4 w-4 text-primary" />
              </div>
              <div>
                 <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Unit / Flat</p>
                <p className="font-medium">{displayUser?.unit || 'N/A'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Family & Help Add Dialog */}
      {isAddingMode && (
        <Card className="border-primary shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <CardHeader>
            <CardTitle>Add New {addingType === 'family' ? 'Family Member' : 'House Help'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Full Name" />
                </div>
                {addingType === 'family' ? (
                  <div className="space-y-2">
                    <Label>Relation *</Label>
                    <Select value={formData.relation} onChange={e => setFormData({...formData, relation: e.target.value})}>
                      <option value="Spouse">Spouse</option>
                      <option value="Child">Child</option>
                      <option value="Parent">Parent</option>
                      <option value="Other">Other</option>
                    </Select>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>Task/Role</Label>
                      <Input value={formData.task} onChange={e => setFormData({...formData, task: e.target.value})} placeholder="e.g. Cook, Driver" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Phone number" />
                    </div>
                  </>
                )}
              </div>
              <div className="space-y-2">
                <Label>Photo</Label>
                <Input type="file" accept="image/*" onChange={handlePhotoSelect} />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsAddingMode(false)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lists - Only show for Residents */}
      {user?.role === 'resident' && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Family Members</CardTitle>
              <Button size="sm" variant="ghost" onClick={() => { setAddingType('family'); setIsAddingMode(true); }}><PlusCircle className="h-4 w-4 mr-1"/> Add</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {displayUser?.familyMembers?.length > 0 ? displayUser.familyMembers.map(m => (
                <div key={m._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                   <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={m.photoUrl} />
                      <AvatarFallback>{m.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.relation}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeItem(m._id, 'family')}><Trash2 className="h-4 w-4"/></Button>
                </div>
              )) : <p className="text-xs text-muted-foreground text-center py-4">No family members added</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">House Help / Staff</CardTitle>
              <Button size="sm" variant="ghost" onClick={() => { setAddingType('help'); setIsAddingMode(true); }}><PlusCircle className="h-4 w-4 mr-1"/> Add</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {displayUser?.houseHelp?.length > 0 ? displayUser.houseHelp.map(m => (
                <div key={m._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                   <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={m.photoUrl} />
                      <AvatarFallback>{m.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.task} • {m.phone}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeItem(m._id, 'help')}><Trash2 className="h-4 w-4"/></Button>
                </div>
              )) : <p className="text-xs text-muted-foreground text-center py-4">No house help added</p>}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
