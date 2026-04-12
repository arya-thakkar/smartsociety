import { create } from 'zustand';

const loadTasks = () => {
  try {
    const data = localStorage.getItem('society_tasks');
    return data ? JSON.parse(data) : [
      { id: 't1', title: 'Q3 Maintenance Payment', description: 'Mandatory quarterly maintenance for all A and B block units.', deadline: '2026-10-30', assignedTo: 'resident', status: 'Pending', type: 'financial', amount: 4500 },
      { id: 't2', title: 'Gate CCTV Inspection', description: 'Thorough check of all perimeter cameras and backup servers.', deadline: '2026-10-15', assignedTo: 'guard', status: 'In Progress', type: 'service' }
    ];
  } catch (e) {
    return [];
  }
};

export const useTaskStore = create((set) => ({
  tasks: loadTasks(),
  addTask: (task) => set((state) => {
    const newTasks = [{ ...task, id: Date.now().toString(), status: 'Pending' }, ...state.tasks];
    localStorage.setItem('society_tasks', JSON.stringify(newTasks));
    return { tasks: newTasks };
  }),
  updateTaskStatus: (id, status, userName) => set((state) => {
    const newTasks = state.tasks.map(t => 
      t.id === id ? { ...t, status, completedBy: userName, completedAt: new Date().toISOString() } : t
    );
    localStorage.setItem('society_tasks', JSON.stringify(newTasks));
    return { tasks: newTasks };
  }),
  deleteTask: (id) => set((state) => {
    const newTasks = state.tasks.filter(t => t.id !== id);
    localStorage.setItem('society_tasks', JSON.stringify(newTasks));
    return { tasks: newTasks };
  })
}));
