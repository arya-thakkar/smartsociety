"use client";

export const dynamic = 'force-dynamic';

import { Card } from "@/components/ui/Card";
import { ArrowUpRight, ArrowDownLeft, User } from "lucide-react";

const LOGS = [
  { id: 1, name: "Delivery Boy - Zomato", type: "visitor", direction: "in", flat: "B-204", time: "10:32 AM" },
  { id: 2, name: "Sunita Devi", type: "staff", direction: "in", flat: "A Wing", time: "09:15 AM" },
  { id: 3, name: "Rahul Verma", type: "visitor", direction: "out", flat: "C-301", time: "11:00 AM" },
  { id: 4, name: "Mohan Lal", type: "staff", direction: "out", flat: "Maintenance", time: "08:50 AM" },
  { id: 6, name: "Amazon Delivery", type: "visitor", direction: "out", flat: "A-402", time: "12:05 PM" },
];

const BADGE: Record<string, string> = {
  visitor: "bg-blue-500/10 text-blue-400",
  staff: "bg-emerald-500/10 text-emerald-400",
};

export default function GateLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">Gate Logs</h1>
        <p className="text-gray-500 mt-1">Today&apos;s entry and exit records</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Total Entries Today", value: "45", color: "text-primary" },
          { label: "Visitors", value: "23", color: "text-blue-400" },
          { label: "Staff", value: "18", color: "text-emerald-400" },
        ].map((s) => (
          <Card key={s.label} className="p-6 text-center glass">
            <p className={`text-4xl font-bold font-heading ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-2 uppercase tracking-wider font-bold">{s.label}</p>
          </Card>
        ))}
      </div>

      <Card className="p-0 overflow-hidden glass">
        <div className="p-5 border-b border-white/5">
          <h2 className="font-bold text-foreground">Recent Activity</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider font-bold">
                <th className="text-left px-6 py-4 font-medium">Name</th>
                <th className="text-left px-6 py-4 font-medium">Type</th>
                <th className="text-left px-6 py-4 font-medium">Destination</th>
                <th className="text-left px-6 py-4 font-medium">Direction</th>
                <th className="text-left px-6 py-4 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <User size={16} className="text-gray-500" />
                      <span className="font-bold text-foreground">{log.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${BADGE[log.type]}`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 font-mono">{log.flat}</td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${log.direction === "in" ? "text-emerald-400" : "text-red-400"}`}>
                      {log.direction === "in" ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                      {log.direction === "in" ? "Entry" : "Exit"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
