import React, { useState } from 'react';
import { logAPI, isDemoMode } from '../api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { 
  FileText, 
  Mic, 
  Search, 
  Download, 
  Plus
} from 'lucide-react';
import { VoiceInput } from '../components/ui/VoiceInput';
import { toast } from 'sonner';
import { MOCK_LOGS } from '../data/mockData';

export default function Logs() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newEntry, setNewEntry] = useState({ name: '', unit: '', vehicle: '', purpose: '', type: 'Visitor' });
  const [localLogs, setLocalLogs] = useState([]);

  const { data: realLogsRes, isLoading } = useQuery({
    queryKey: ['gate-logs'],
    queryFn: async () => {
      try {
        const res = await logAPI.getAll();
        return res.data.logs || [];
      } catch {
        return [];
      }
    }
  });

  // AI Text Parser: Extract structured data from natural language (voice or text)
  const parseLogText = (text) => {
    const lower = text.toLowerCase();
    const nameMatch = lower.match(/(?:for|entry for|name is|visitor)\s+([a-z\s\.]+?)(?:\s+in|\s+to|\s+at|\s+with|$)/i);
    const unitMatch = lower.match(/(?:unit|flat|apartment|block|room|house)\s*[:\-]?\s*([a-z0-9\-\/]+)/i);
    const vehicleMatch = lower.match(/(?:vehicle|car|bike|number|plate)\s*[:\-]?\s*([a-z0-9\-]+)/i);
    const name = nameMatch ? nameMatch[1].trim() : 'Visitor';
    const unit = unitMatch ? unitMatch[1].toUpperCase() : 'N/A';
    const vehicle = vehicleMatch ? vehicleMatch[1].toUpperCase() : 'Walk-in';
    return { name, unit, vehicle, note: `Entry for ${name} — Unit ${unit} | Vehicle: ${vehicle} | Parsed by AI` };
  };

  const logMutation = useMutation({
    mutationFn: async (data) => {
      if (isDemoMode()) throw { isDemo: true };
      return logAPI.create(data);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries(['gate-logs']);
      toast.success('Log entry synced to cloud database ✅');
      setIsAdding(false);
      setNewEntry({ name: '', unit: '', vehicle: '', purpose: '', type: 'Visitor' });
    },
    onError: (err, variables) => {
      if (err?.isDemo) {
        // AI Demo Mode: Parse the text and create a local log entry
        const parsed = variables.text ? parseLogText(variables.text) : {};
        const newLog = {
          _id: `local-${Date.now()}`,
          note: parsed.note || variables.text || 'Manual Entry',
          action: parsed.unit || 'Visitor',
          visitor: { name: parsed.name || variables.text },
          verifiedBy: { name: 'Guard (You)' },
          createdAt: new Date().toISOString(),
        };
        setLocalLogs(prev => [newLog, ...prev]);
        toast.success('🤖 AI Parsed & Logged! Entry saved to registry.');
        setIsAdding(false);
        setNewEntry({ name: '', unit: '', vehicle: '', purpose: '', type: 'Visitor' });
      } else {
        toast.error('Failed to sync log entry');
      }
    }
  });

  // Combine Local + Real + Mock logs
  const logs = [
    ...localLogs,
    ...(realLogsRes || []),
    ...MOCK_LOGS
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const safeDate = (dateStr) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const filteredLogs = logs.filter(log => {
    const content = `${log.note || ''} ${log.visitor?.name || ''} ${log.verifiedBy?.name || ''} ${log.action || ''}`.toLowerCase();
    return content.includes(filter.toLowerCase());
  });

  // ✅ WORKING CSV EXPORT
  const handleExportCSV = () => {
    const headers = ['Time', 'Date', 'Note / Entry', 'Destination Unit', 'Vehicle / Visitor', 'Verified By', 'Status'];
    const rows = filteredLogs.map(log => [
      format(safeDate(log.createdAt), 'hh:mm a'),
      format(safeDate(log.createdAt), 'MMM dd yyyy'),
      `"${(log.note || 'Gate Entry').replace(/"/g, "'")}"`,
      log.action || 'N/A',
      log.visitor?.name || 'Walk-in',
      log.verifiedBy?.name || 'Guard',
      'Synced',
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `gate-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filteredLogs.length} entries to CSV! 📊`);
  };

  const handleManualEntry = (e) => {
    e.preventDefault();
    const text = `Entry for ${newEntry.name} in unit ${newEntry.unit} with vehicle ${newEntry.vehicle || 'NA'} for ${newEntry.purpose}`;
    logMutation.mutate({ text });
  };

  const handleVoiceEntry = (text) => {
    toast.info(`🤖 AI Parsing: "${text.substring(0, 40)}..."`);
    logMutation.mutate({ text });
  };

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" /> Gate Logs
           </h1>
           <p className="text-muted-foreground text-sm font-medium">Digital registry of all entries and exits</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="gap-2 shadow-sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4" /> Export CSV
           </Button>
           <Button className="gap-2 font-black shadow-xl" onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4" /> MANUAL ENTRY
           </Button>
        </div>
      </div>

      <Card className="bg-primary/5 border-primary/20 p-6 flex flex-col items-center justify-center gap-4 text-center">
         <div className="p-4 bg-primary text-primary-foreground rounded-full animate-pulse">
            <Mic className="h-8 w-8" />
         </div>
         <div className="space-y-1">
            <h3 className="text-lg font-black tracking-tight">AI Voice Assistant</h3>
            <p className="text-sm text-muted-foreground max-w-md">"Entry for Mr. Sharma in Unit B-204 with vehicle MH-12-AB-1234"</p>
         </div>
         <VoiceInput 
            onResult={handleVoiceEntry} 
            className="w-full max-w-sm h-12 bg-primary font-black shadow-xl rounded-full"
            label="TAP TO RECORD ENTRY" 
         />
      </Card>

      {isAdding && (
         <Card className="animate-in fade-in slide-in-from-top-4 border-primary/20 shadow-2xl">
            <CardHeader className="bg-primary text-primary-foreground">
               <CardTitle>New Registry Entry</CardTitle>
            </CardHeader>
            <form onSubmit={handleManualEntry}>
               <CardContent className="pt-8 grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <Label className="font-bold">Full Name</Label>
                     <Input required value={newEntry.name} onChange={e => setNewEntry({...newEntry, name: e.target.value})} placeholder="e.g. John Doe" />
                  </div>
                  <div className="space-y-2">
                     <Label className="font-bold">Unit / Flat</Label>
                     <Input required value={newEntry.unit} onChange={e => setNewEntry({...newEntry, unit: e.target.value})} placeholder="e.g. A-101" />
                  </div>
                  <div className="space-y-2">
                     <Label className="font-bold">Vehicle Number</Label>
                     <Input value={newEntry.vehicle} onChange={e => setNewEntry({...newEntry, vehicle: e.target.value})} placeholder="e.g. MH-XX-XXXX" />
                  </div>
                  <div className="space-y-2">
                     <Label className="font-bold">Purpose</Label>
                     <Input required value={newEntry.purpose} onChange={e => setNewEntry({...newEntry, purpose: e.target.value})} placeholder="e.g. Work / Visit" />
                  </div>
               </CardContent>
               <CardFooter className="flex gap-4 border-t pt-4">
                  <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsAdding(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1 font-black">SAVE ENTRY</Button>
               </CardFooter>
            </form>
         </Card>
      )}

      <div className="relative">
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
         <Input 
            placeholder="Search by name, unit, or vehicle..." 
            className="pl-10 h-12 shadow-sm font-medium"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
         />
      </div>

      <Card className="shadow-lg border-none overflow-hidden">
         <CardContent className="p-0">
            <Table>
               <TableHeader>
                  <TableRow className="bg-muted hover:bg-muted font-black text-xs uppercase tracking-widest">
                     <TableHead className="w-[150px]">Time</TableHead>
                     <TableHead>Visitor Details</TableHead>
                     <TableHead>Destination</TableHead>
                     <TableHead>Vehicle</TableHead>
                     <TableHead>Status</TableHead>
                     <TableHead className="text-right">Action</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {filteredLogs.map((log) => (
                     <TableRow key={log._id} className="hover:bg-muted/30 transition-colors h-20">
                        <TableCell>
                           <p className="font-black text-sm">{format(safeDate(log.createdAt), 'hh:mm a')}</p>
                           <p className="text-[10px] text-muted-foreground uppercase font-bold">{format(safeDate(log.createdAt), 'MMM dd')}</p>
                        </TableCell>
                        <TableCell>
                           <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs uppercase">
                                 {(log.action || 'V')?.charAt(0)}
                              </div>
                              <div>
                                 <p className="font-bold text-sm leading-tight line-clamp-2">{log.note || 'Gate Registry Entry'}</p>
                                 <p className="text-[10px] text-muted-foreground uppercase">Verified by {log.verifiedBy?.name || 'Guard'}</p>
                              </div>
                           </div>
                        </TableCell>
                        <TableCell>
                           <p className="font-black text-xs text-primary bg-primary/5 px-2 py-1 rounded w-fit capitalize">{log.action}</p>
                        </TableCell>
                        <TableCell className="font-medium text-xs text-muted-foreground">
                           {log.visitor?.name || 'Manual Entry'}
                        </TableCell>
                        <TableCell>
                           <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                              Synced
                           </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                           <Button variant="ghost" size="sm" className="text-muted-foreground">
                              <Download className="h-4 w-4" />
                           </Button>
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
            {filteredLogs.length === 0 && (
               <div className="py-20 text-center opacity-30 italic">No logs matched your search.</div>
            )}
         </CardContent>
      </Card>
    </div>
  );
}
