import { create } from 'zustand';

export const useGuestStore = create((set) => ({
  invites: JSON.parse(localStorage.getItem('guest_invites')) || [
    { id: 'g1', name: 'Robert Fox', date: '2026-04-12', vehicle: 'MH 12 AB 1234', flat: 'A-101', resident: 'John Resident', qrCode: 'GUEST-1234-A101', status: 'Pre-Approved' }
  ],
  
  addInvite: (invite) => set((state) => {
    const newInvites = [{ ...invite, id: Date.now().toString(), status: 'Pre-Approved' }, ...state.invites];
    localStorage.setItem('guest_invites', JSON.stringify(newInvites));
    return { invites: newInvites };
  }),

  removeInvite: (id) => set((state) => {
    const updated = state.invites.filter(i => i.id !== id);
    localStorage.setItem('guest_invites', JSON.stringify(updated));
    return { invites: updated };
  })
}));
