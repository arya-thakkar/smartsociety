import { create } from 'zustand';

const defaultAmenities = [
  { id: '1', name: 'Swimming Pool', description: 'Crystal clear water with temperature control.', slots: ['06:00 - 09:00', '16:00 - 20:00'], icon: 'Waves' },
  { id: '2', name: 'Gymnasium', description: 'State-of-the-art weights and cardio equipment.', slots: ['05:00 - 11:00', '17:00 - 22:00'], icon: 'Dumbbell' },
  { id: '3', name: 'Clubhouse', description: 'Perfect for parties and social gatherings.', slots: ['10:00 - 14:00', '16:00 - 22:00'], icon: 'Home' },
  { id: '4', name: 'Badminton Court', description: 'Indoor wooden flooring court.', slots: ['06:00 - 10:00', '16:00 - 22:00'], icon: 'Trophy' }
];

export const useAmenityStore = create((set) => ({
  amenities: JSON.parse(localStorage.getItem('society_amenities')) || defaultAmenities,
  requests: JSON.parse(localStorage.getItem('amenity_requests')) || [],
  
  updateSlots: (id, newSlots) => set((state) => {
    const updated = state.amenities.map(a => a.id === id ? { ...a, slots: newSlots } : a);
    localStorage.setItem('society_amenities', JSON.stringify(updated));
    return { amenities: updated };
  }),

  requestBooking: (request) => set((state) => {
    const newRequests = [{ ...request, id: Date.now().toString(), status: 'Pending', createdAt: new Date().toISOString() }, ...state.requests];
    localStorage.setItem('amenity_requests', JSON.stringify(newRequests));
    return { requests: newRequests };
  }),

  updateRequestStatus: (id, status) => set((state) => {
    const updated = state.requests.map(r => r.id === id ? { ...r, status } : r);
    localStorage.setItem('amenity_requests', JSON.stringify(updated));
    return { requests: updated };
  })
}));
