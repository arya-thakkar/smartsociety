// src/data/mockData.js - Premium Seed Data for Demo Mode

export const MOCK_MEMBERS = [
  { _id: 'm1', name: 'Dr. Rajesh Khanna', role: 'admin', unit: 'A-101', photoUrl: 'https://i.pravatar.cc/150?u=m1' },
  { _id: 'm2', name: 'Mrs. Suman Bajaj', role: 'resident', unit: 'B-204', photoUrl: 'https://i.pravatar.cc/150?u=m2' },
  { _id: 'm3', name: 'Vikram Singh', role: 'guard', unit: 'Gate 1', photoUrl: 'https://i.pravatar.cc/150?u=m3' },
  { _id: 'm4', name: 'Ananya Iyer', role: 'resident', unit: 'C-502', photoUrl: 'https://i.pravatar.cc/150?u=m4' },
  { _id: 'm5', name: 'Suresh Raina', role: 'resident', unit: 'A-305', photoUrl: 'https://i.pravatar.cc/150?u=m5' },
  { _id: 'm6', name: 'Amitabh Shah', role: 'admin', unit: 'B-101', photoUrl: 'https://i.pravatar.cc/150?u=m6' },
  { _id: 'm7', name: 'Rohan Deshmukh', role: 'guard', unit: 'Gate 2', photoUrl: 'https://i.pravatar.cc/150?u=m7' },
];

export const MOCK_POSTS = [
  {
    _id: 'p1',
    content: "The annual Garden Party is scheduled for this Sunday at 5 PM. Everyone is invited! 🌸",
    sentiment: 'Positive',
    author: { name: 'Dr. Rajesh Khanna', unit: 'A-101' },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    likes: ['m2', 'm4', 'm5'],
    trending: true
  },
  {
    _id: 'p2',
    content: "Reminder: Water supply will be limited tomorrow morning from 9 AM to 11 AM due to tank cleaning.",
    sentiment: 'Neutral',
    author: { name: 'Amitabh Shah', unit: 'B-101' },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    likes: ['m3'],
    trending: false
  },
  {
    _id: 'p3',
    content: "Just saw the new security cameras being installed. Feels much safer now! Great job management team.",
    sentiment: 'Positive',
    author: { name: 'Ananya Iyer', unit: 'C-502' },
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    likes: ['m1', 'm2', 'm5', 'm6'],
    trending: true
  }
];

export const MOCK_TASKS = [
  {
    _id: 't1',
    title: 'Monthly Maintenance Audit',
    description: 'Verify all pending maintenance bills for the month of April.',
    priority: 'HIGH',
    status: 'Pending',
    type: 'financial',
    assignedTo: 'admin',
    deadline: '2026-04-15'
  },
  {
    _id: 't2',
    title: 'CCTV Camera Calibration',
    description: 'Ensure all new cameras at Gate 2 are correctly aligned and recording.',
    priority: 'MEDIUM',
    status: 'In Progress',
    type: 'security',
    assignedTo: 'guard',
    deadline: '2026-04-13'
  },
  {
    _id: 't3',
    title: 'Pool Water Treatment',
    description: 'Scheduled chlorination and filter cleaning for the main swimming pool.',
    priority: 'LOW',
    status: 'Pending',
    type: 'service',
    assignedTo: 'both',
    deadline: '2026-04-20'
  }
];

export const MOCK_LOGS = [
  {
    _id: 'l1',
    action: 'entry',
    note: '[AI Parsed] Visitor: Rahul (Zomato), Unit: B-204. Purpose: Food Delivery.',
    verifiedBy: { name: 'Vikram Singh' },
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    _id: 'l2',
    action: 'entry',
    note: '[AI Parsed] Visitor: Mrs. Desai, Unit: A-101. Purpose: Personal Visit.',
    verifiedBy: { name: 'Rohan Deshmukh' },
    createdAt: new Date(Date.now() - 5400000).toISOString(),
  },
  {
    _id: 'l3',
    action: 'exit',
    note: 'Delivery agent exited Gate 2.',
    verifiedBy: { name: 'Rohan Deshmukh' },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  }
];

export const MOCK_COMPLAINTS = [
  {
    _id: 'c1',
    subject: 'Elevator Noise in B-Block',
    description: 'The lift makes a grinding noise during the night. It might need lubrication.',
    category: 'Maintenance',
    unit: 'B-402',
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    _id: 'c2',
    subject: 'Unauthorized Parking',
    description: 'A white SUV (MH-01-XX-1234) is consistently parking in my spot in the visitor area.',
    category: 'Security',
    unit: 'C-101',
    status: 'In Progress',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    _id: 'c3',
    subject: 'Clubhouse AC Leakage',
    description: 'Water is dripping from the split unit in the gym area.',
    category: 'Maintenance',
    unit: 'Clubhouse',
    status: 'Resolved',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];
