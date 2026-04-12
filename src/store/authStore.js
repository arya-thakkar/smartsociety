import { create } from 'zustand';

// Try to load auth from localStorage
const loadAuthInfo = () => {
  try {
    const data = localStorage.getItem('auth_store');
    if (data) {
      const parsed = JSON.parse(data);
      // Ensure mock data structure is present
      return {
        ...parsed,
        societyId: parsed.societyId || null,
        societyName: parsed.societyName || null,
        inviteCode: parsed.inviteCode || null,
        mockMembers: parsed.mockMembers || [
          { _id: '1', name: 'Admin One', role: 'admin', unit: 'Main Office' },
          { _id: '2', name: 'John Resident', role: 'resident', unit: 'A-101', familyMembers: [], houseHelp: [] },
          { _id: '3', name: 'Security Sam', role: 'guard', unit: 'Gate 1' }
        ]
      };
    }
  } catch (error) {
    console.error("Failed to parse auth data", error);
  }
  return { 
    user: null, 
    token: null, 
    societyId: null, 
    societyName: null, 
    inviteCode: null,
    mockMembers: [
      { _id: '1', name: 'Admin One', role: 'admin', unit: 'Main Office' },
      { _id: '2', name: 'John Resident', role: 'resident', unit: 'A-101', familyMembers: [], houseHelp: [] },
      { _id: '3', name: 'Security Sam', role: 'guard', unit: 'Gate 1' }
    ]
  };
};

export const useAuthStore = create((set) => ({
  ...loadAuthInfo(),
  login: (user, token) => {
    set((state) => {
      const newData = { ...state, user, token };
      localStorage.setItem('auth_store', JSON.stringify(newData));
      return newData;
    });
  },
  logout: () => {
    localStorage.removeItem('auth_store');
    set({ 
      user: null, 
      token: null, 
      societyId: null, 
      societyName: null, 
      inviteCode: null 
    });
  },
  updateUser: (updatedUser) => set((state) => {
    const newData = { ...state, user: updatedUser };
    localStorage.setItem('auth_store', JSON.stringify(newData));
    return newData;
  }),
  setSociety: (societyId, societyName, inviteCode) => set((state) => {
    const newData = { ...state, societyId, societyName, inviteCode };
    localStorage.setItem('auth_store', JSON.stringify(newData));
    return newData;
  }),
  updateMockMember: (id, updates) => set((state) => {
    const newMembers = state.mockMembers.map(m => m._id === id ? { ...m, ...updates } : m);
    const newData = { ...state, mockMembers: newMembers };
    localStorage.setItem('auth_store', JSON.stringify(newData));
    return newData;
  }),
}));
