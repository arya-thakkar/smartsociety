import { create } from 'zustand';

export const useLogStore = create((set) => ({
  logs: JSON.parse(localStorage.getItem('gate_logs') || '[]'),
  
  addLog: (entry) => set((state) => {
    const newLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      status: 'Inside',
      ...entry
    };
    const newLogs = [newLog, ...state.logs];
    localStorage.setItem('gate_logs', JSON.stringify(newLogs));
    return { logs: newLogs };
  }),

  markExit: (id) => set((state) => {
    const newLogs = state.logs.map(log => 
      log.id === id ? { ...log, status: 'Exited', exitTime: new Date().toLocaleTimeString() } : log
    );
    localStorage.setItem('gate_logs', JSON.stringify(newLogs));
    return { logs: newLogs };
  })
}));

// Seed some initial logs
if (useLogStore.getState().logs.length === 0) {
  useLogStore.getState().addLog({
    type: 'Guest',
    name: 'Rahul Khanna',
    unit: 'B-402',
    vehicle: 'MH-01-AX-9988',
    purpose: 'Visiting friend'
  });
  useLogStore.getState().addLog({
    type: 'Delivery',
    name: 'Swiggy Executive',
    unit: 'A-1201',
    vehicle: 'Two-Wheeler',
    purpose: 'Food Delivery'
  });
}
