"use client";

export const dynamic = 'force-dynamic';

import { Card } from "@/components/ui/Card";
import { Brain, Calendar, CheckSquare2, Users } from "lucide-react";

export default function MeetingDetail() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">Monthly Maintenance Review</h1>
        <p className="text-gray-500 mt-1 flex items-center gap-2">
          <Calendar size={14} /> Apr 15, 2026 · 6:00 PM · 28 attendees
        </p>
      </div>

      <Card className="p-6 border-l-4 border-primary">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="text-primary w-5 h-5" />
          <h2 className="font-semibold text-gray-900">AI-Generated Summary</h2>
        </div>
        <p className="text-gray-700 leading-relaxed text-sm">
          The meeting focused on recurring water supply issues in Block A and the deteriorating condition of the parking lot. 
          Members collectively agreed to hire a professional agency for long-term infrastructure audit. 
          Budget allocation for Q2 was discussed with a majority vote for 60% allocation toward civil repairs.
        </p>
      </Card>

      <div className="grid md:grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckSquare2 className="text-emerald-600 w-5 h-5" /> Key Decisions
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {["Hire civic contractor for water pipes", "Increase maintenance fund by ₹200/flat", "Install CCTV at parking lot entry"].map((d) => (
              <li key={d} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                {d}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="text-blue-600 w-5 h-5" /> Action Items
          </h3>
          <ul className="space-y-3 text-sm">
            {[
              { text: "Get 3 contractor quotes", owner: "Secretary", due: "Apr 20" },
              { text: "Send circular to all residents", owner: "Admin", due: "Apr 16" },
              { text: "CCTV vendor shortlisting", owner: "Tech Committee", due: "Apr 25" },
            ].map((a) => (
              <li key={a.text} className="flex justify-between gap-2">
                <span className="text-gray-700">{a.text}</span>
                <span className="text-xs text-gray-500 whitespace-nowrap">{a.owner} · {a.due}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Meeting Timeline</h3>
        <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
          {[
            { time: "6:00 PM", event: "Roll call & quorum confirmation" },
            { time: "6:10 PM", event: "Water supply grievances discussed" },
            { time: "6:35 PM", event: "Budget review for Q2 maintenance" },
            { time: "7:05 PM", event: "Voting on contractor hiring" },
            { time: "7:20 PM", event: "AOB and meeting closure" },
          ].map((t) => (
            <div key={t.time} className="flex items-start gap-4 pl-8 relative">
              <div className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-primary/20 border-2 border-primary" />
              <div>
                <p className="text-xs text-primary font-semibold">{t.time}</p>
                <p className="text-sm text-gray-700 mt-0.5">{t.event}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
