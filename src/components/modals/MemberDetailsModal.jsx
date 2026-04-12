import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { X, User, Phone, Briefcase, Heart } from 'lucide-react';

export default function MemberDetailsModal({ member, onClose }) {
  if (!member) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border rounded-2xl w-full max-w-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-4 top-4 z-10" 
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="bg-primary/10 p-8 flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 border-4 border-background mb-4">
            <AvatarImage src={member.photoUrl} />
            <AvatarFallback className="text-3xl uppercase">{member.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold">{member.name}</h2>
          <div className="flex gap-2 mt-2">
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
              {member.role}
            </span>
            <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
              Unit {member.unit}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Family Section */}
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-primary" />
              Family Members
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {member.familyMembers?.length > 0 ? (
                member.familyMembers.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border bg-muted/30">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={m.photoUrl} />
                      <AvatarFallback>{m.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.relation}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic col-span-2">No family members listed.</p>
              )}
            </div>
          </div>

          {/* House Help Section */}
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Briefcase className="h-5 w-5 text-primary" />
              House Help / Private Staff
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {member.houseHelp?.length > 0 ? (
                member.houseHelp.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border bg-muted/30">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={m.photoUrl} />
                      <AvatarFallback>{m.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{m.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{m.task}</span>
                        {m.phone && (
                          <span className="flex items-center gap-1">
                            • <Phone className="h-3 w-3" /> {m.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic col-span-2">No house help/staff listed.</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-muted/50 border-t flex justify-end">
          <Button onClick={onClose} variant="secondary">Close Details</Button>
        </div>
      </div>
    </div>
  );
}
