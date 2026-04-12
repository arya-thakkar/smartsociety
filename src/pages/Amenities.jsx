import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useAmenityStore } from '../store/amenityStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Waves, Dumbbell, Home, Trophy, Clock, CheckCircle2, XCircle, Info, Send, CalendarDays, Inbox, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { VoiceInput } from '../components/ui/VoiceInput';

const iconMap = {
  Waves: Waves,
  Dumbbell: Dumbbell,
  Home: Home,
  Trophy: Trophy
};

export default function Amenities() {
  const { user } = useAuthStore();
  const { amenities, requests, requestBooking, updateRequestStatus } = useAmenityStore();
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({ date: '', slot: '', note: '' });

  const isAdmin = user?.role === 'admin';
  const myRequests = requests.filter(r => r.userId === user?.id);
  const pendingRequests = requests.filter(r => r.status === 'Pending');

  const handleBooking = (e) => {
    e.preventDefault();
    requestBooking({
      ...bookingDetails,
      amenityId: selectedAmenity.id,
      amenityName: selectedAmenity.name,
      userId: user.id,
      userName: user.name,
      unit: user.unit
    });
    toast.success(`Booking request for ${selectedAmenity.name} sent to Admin!`);
    setSelectedAmenity(null);
    setBookingDetails({ date: '', slot: '', note: '' });
  };

  const handleStatusChange = (id, status) => {
    updateRequestStatus(id, status);
    toast[status === 'Approved' ? 'success' : 'error'](`Request #${id.slice(-4)} has been ${status.toLowerCase()}.`);
  };

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-600">
                 <Trophy className="h-8 w-8" />
              </div>
              Society Amenities
           </h1>
           <p className="text-muted-foreground text-sm font-medium">Premium facilities for residents</p>
        </div>
        {isAdmin && (
           <Badge variant="outline" className="h-10 px-4 border-2 border-primary/20 bg-primary/5 text-primary font-black uppercase tracking-widest gap-2">
              <Inbox className="h-4 w-4" /> Admin Control Active
           </Badge>
        )}
      </div>

      <Tabs defaultValue="list" className="w-full">
         <TabsList className="bg-muted/50 p-1 mb-6">
            <TabsTrigger value="list" className="font-bold">Available Facilities</TabsTrigger>
            <TabsTrigger value="my-bookings" className="font-bold">
               {isAdmin ? "Request Inbox" : "My Bookings"}
               {isAdmin && pendingRequests.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                     {pendingRequests.length}
                  </span>
               )}
            </TabsTrigger>
         </TabsList>

         <TabsContent value="list" className="space-y-8 animate-in slide-in-from-left-4 duration-500">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
               {amenities.map((amenity) => {
                  const Icon = iconMap[amenity.icon] || Info;
                  return (
                     <Card key={amenity.id} className="hover:shadow-2xl transition-all border-none shadow-lg group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                        <CardHeader className="relative">
                           <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:rotate-12 transition-transform">
                              <Icon className="h-6 w-6" />
                           </div>
                           <CardTitle className="text-xl font-black tracking-tight">{amenity.name}</CardTitle>
                           <CardDescription className="text-xs font-medium leading-relaxed">{amenity.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-3">
                              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                 <span>Operational Slots</span>
                                 <Clock className="h-3 w-3" />
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                 {amenity.slots.map((s, i) => (
                                    <Badge key={i} variant="secondary" className="text-[10px] bg-muted/50 font-bold">{s}</Badge>
                                 ))}
                              </div>
                           </div>
                        </CardContent>
                        <CardFooter className="pt-2">
                           <Button 
                             className="w-full font-black text-xs uppercase tracking-widest shadow-lg group-hover:shadow-primary/20 transition-all"
                             onClick={() => setSelectedAmenity(amenity)}
                           >
                              Reserve Slot
                           </Button>
                        </CardFooter>
                     </Card>
                  );
               })}
            </div>

            {selectedAmenity && (
               <Card className="max-w-xl mx-auto border-2 border-primary/20 shadow-2xl animate-in zoom-in-95 duration-300">
                  <CardHeader className="bg-primary text-white flex flex-row justify-between items-center">
                     <div>
                        <CardTitle>Booking for {selectedAmenity.name}</CardTitle>
                        <CardDescription className="text-white/70">Fill details for AI approval routing</CardDescription>
                     </div>
                     <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => setSelectedAmenity(null)}>
                        <XCircle className="h-5 w-5" />
                     </Button>
                  </CardHeader>
                  <CardContent className="pt-8 px-8">
                     <form onSubmit={handleBooking} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Select Date</label>
                              <input 
                                type="date" 
                                required
                                className="w-full p-2.5 rounded-lg border bg-background font-bold text-sm"
                                value={bookingDetails.date}
                                onChange={e => setBookingDetails({...bookingDetails, date: e.target.value})}
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Preferred Slot</label>
                              <select 
                                required
                                className="w-full p-2.5 rounded-lg border bg-background font-bold text-sm"
                                value={bookingDetails.slot}
                                onChange={e => setBookingDetails({...bookingDetails, slot: e.target.value})}
                              >
                                 <option value="">Select Slot</option>
                                 {selectedAmenity.slots.map((s, i) => (
                                    <option key={i} value={s}>{s}</option>
                                 ))}
                              </select>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between items-center">
                              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Note for Admin (Optional)</label>
                              <VoiceInput onResult={(text) => setBookingDetails({...bookingDetails, note: text})} />
                           </div>
                           <textarea 
                             className="w-full min-h-[100px] p-3 rounded-xl border bg-background text-sm resize-none font-medium"
                             placeholder="e.g. Birthday celebration for family"
                             value={bookingDetails.note}
                             onChange={e => setBookingDetails({...bookingDetails, note: e.target.value})}
                           />
                        </div>
                        <Button type="submit" className="w-full h-12 bg-primary font-black shadow-xl">
                           SUBMIT REQUEST <Send className="ml-2 h-4 w-4" />
                        </Button>
                     </form>
                  </CardContent>
               </Card>
            )}
         </TabsContent>

         <TabsContent value="my-bookings" className="animate-in slide-in-from-right-4 duration-500">
            <Card className="shadow-2xl border-none">
               <CardHeader className="bg-muted/30 border-b">
                  <CardTitle>{isAdmin ? "Administrative Inbox" : "My Reserve History"}</CardTitle>
                  <CardDescription>Track status of applications for society facilities</CardDescription>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="divide-y max-h-[600px] overflow-y-auto">
                     {(isAdmin ? requests : myRequests).length > 0 ? (isAdmin ? requests : myRequests).map((req) => (
                        <div key={req.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/20 transition-all">
                           <div className="flex items-center gap-5">
                              <div className={`p-4 rounded-2xl ${req.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : req.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                 <CalendarDays className="h-6 w-6" />
                              </div>
                              <div className="space-y-1">
                                 <h4 className="font-extrabold text-lg flex items-center gap-2">
                                    {req.amenityName}
                                    <Badge className={`${req.status === 'Approved' ? 'bg-emerald-500' : req.status === 'Rejected' ? 'bg-red-500' : 'bg-orange-500'}`}>
                                       {req.status}
                                    </Badge>
                                 </h4>
                                 <div className="flex flex-wrap gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {req.slot} on {req.date}</span>
                                    {isAdmin && (
                                       <span className="flex items-center gap-1 border-l pl-4 font-black text-foreground">{req.userName} ({req.unit})</span>
                                    )}
                                 </div>
                                 {req.note && <p className="text-sm italic text-muted-foreground mt-2 border-l-2 pl-3 py-1 bg-muted/30 rounded-r-lg">"{req.note}"</p>}
                              </div>
                           </div>
                           
                           {isAdmin && req.status === 'Pending' && (
                              <div className="flex gap-2">
                                 <Button 
                                   variant="outline" 
                                   size="sm" 
                                   className="text-red-600 border-red-200 hover:bg-red-50 font-bold"
                                   onClick={() => handleStatusChange(req.id, 'Rejected')}
                                 >
                                    <XCircle className="h-4 w-4 mr-1"/> Reject
                                 </Button>
                                 <Button 
                                   size="sm" 
                                   className="bg-emerald-600 hover:bg-emerald-700 font-bold shadow-lg shadow-emerald-500/20"
                                   onClick={() => handleStatusChange(req.id, 'Approved')}
                                 >
                                    <CheckCircle2 className="h-4 w-4 mr-1"/> Grant Access
                                 </Button>
                              </div>
                           )}

                           {req.status === 'Approved' && (
                              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                                 <ShieldCheck className="h-3 w-3" /> Digital Pass Active
                              </div>
                           )}
                        </div>
                     )) : (
                        <div className="py-32 text-center flex flex-col items-center justify-center opacity-30">
                           <Inbox className="h-16 w-16 mb-4" />
                           <p className="font-black uppercase tracking-[0.4em]">No Requests Found</p>
                        </div>
                     )}
                  </div>
               </CardContent>
            </Card>
         </TabsContent>
      </Tabs>
    </div>
  );
}
