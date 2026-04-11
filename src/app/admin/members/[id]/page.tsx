"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, User, Mail, Phone, MapPin, Shield, UserCheck, UserX, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Mock data for individual member and family
const MEMBER_DATA: any = {
  "1": {
    name: "Rohan Sharma",
    flat: "A-101",
    email: "rohan@example.com",
    phone: "+91 98765 43210",
    role: "Resident",
    joinDate: "Jan 12, 2024",
    family: [
      { id: "f1", name: "Suman Sharma", relation: "Spouse", age: 34, occupation: "Software Engineer" },
      { id: "f2", name: "Aryan Sharma", relation: "Son", age: 12, occupation: "Student" },
      { id: "f3", name: "Ishani Sharma", relation: "Daughter", age: 8, occupation: "Student" },
      { id: "f4", name: "O.P. Sharma", relation: "Father", age: 65, occupation: "Retired" },
    ]
  },
  "2": {
    name: "Priya Mehta",
    flat: "B-203",
    email: "priya@example.com",
    phone: "+91 98765 43211",
    role: "Admin",
    joinDate: "Feb 05, 2024",
    family: [
      { id: "f5", name: "Vikram Mehta", relation: "Spouse", age: 36, occupation: "Architect" },
      { id: "f6", name: "Kaira Mehta", relation: "Daughter", age: 5, occupation: "Student" },
    ]
  }
};

export default function MemberDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = params.id;
  const member = MEMBER_DATA[id] || MEMBER_DATA["1"]; // Default to 1 if not found for demo

  return (
    <div className="space-y-6">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-foreground transition-colors group mb-2"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Members</span>
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-8 text-center glass relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-primary/20" />
            <div className="relative z-10">
              <div className="h-24 w-24 rounded-3xl bg-primary/15 border border-primary/20 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                <span className="text-4xl font-bold text-primary">{member.name.charAt(0)}</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-1">{member.name}</h1>
              <p className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary mb-6">
                {member.role}
              </p>

              <div className="space-y-4 text-left border-t border-white/5 pt-6">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold">Flat Number</p>
                    <p className="text-foreground font-medium">{member.flat}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold">Email Address</p>
                    <p className="text-foreground font-medium">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold">Phone Number</p>
                    <p className="text-foreground font-medium">{member.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold">Joined Since</p>
                    <p className="text-foreground font-medium">{member.joinDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <Shield size={18} className="text-primary" />
              Administrative Actions
            </h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2 border-primary/20 text-primary hover:bg-primary/5">
                <UserCheck size={16} /> Make Admin
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 border-white/10 text-gray-400 hover:bg-white/5">
                <Shield size={16} /> Assign Role
              </Button>
              <Button variant="danger" className="w-full justify-start gap-2 bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20">
                <UserX size={16} /> Suspend Member
              </Button>
            </div>
          </Card>
        </div>

        {/* Family Members Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Family Information</h2>
            <Button size="sm" variant="outline" className="border-white/10 text-gray-400">Add Family Member</Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {member.family.map((f: any, i: number) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-5 glass hover:border-primary/30 transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-primary font-bold text-lg group-hover:bg-primary group-hover:text-white transition-colors">
                      {f.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-foreground">{f.name}</h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                          {f.relation}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{f.occupation}</p>
                      <p className="text-xs text-gray-400 mt-2">{f.age} years old</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="p-6 glass">
            <h3 className="font-bold text-foreground mb-4">Resident Documents</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {['Address Proof', 'Identity Card', 'Vehicle Reg'].map((doc) => (
                <div key={doc} className="p-4 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-primary/50 hover:text-primary transition-all cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <User size={20} />
                  </div>
                  <span className="text-xs font-medium">{doc}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
