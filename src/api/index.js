import axios from 'axios';

const api = axios.create({
  baseURL: 'https://smartsociety-1.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper: check if the current session is using the demo mock token
export const isDemoMode = () => {
  try {
    const stored = JSON.parse(localStorage.getItem('auth_store') || '{}');
    return stored.token === 'mock-token';
  } catch {
    return false;
  }
};

// Add Authorization header for real users only
api.interceptors.request.use((config) => {
  try {
    const stored = JSON.parse(localStorage.getItem('auth_store') || '{}');
    const token = stored.token;
    if (token && token !== 'mock-token') {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const societyAPI = {
  create: (data) => api.post('/society', data),
  join: (data) => api.post('/society/join', data),
};

export const memberAPI = {
  getAll: () => api.get('/members'),
  updateRole: (id, role) => api.patch(`/members/${id}/role`, { role }),
};

export const complaintAPI = {
  getAll: () => api.get('/complaints'),
  create: (data) => api.post('/complaints', data),
  updateStatus: (id, status) => api.patch(`/complaints/${id}`, { status }),
};

export const visitorAPI = {
  getAll: () => api.get('/visitors'),
  create: (data) => api.post('/visitors', data),
  checkout: (id) => api.patch(`/visitors/${id}/checkout`),
};

export const announcementAPI = {
  getAll: () => api.get('/announcements'),
  create: (data) => api.post('/announcements', data),
};

export const postAPI = {
  getAll: () => api.get('/posts'),
  create: (data) => api.post('/posts', data),
  like: (id) => api.post(`/posts/${id}/like`),
};

export const taskAPI = {
  getAll: () => api.get('/tasks'),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.patch(`/tasks/${id}`, data),
};

export const logAPI = {
  getAll: (params) => api.get('/logs', { params }),
  create: (data) => api.post('/logs', data),
};

export const statisticsAPI = {
  getAdminStats: () => api.get('/stats/admin'),
  getResidentStats: () => api.get('/stats/resident'),
  getGuardStats: () => api.get('/stats/guard'),
};

export const meetingAPI = {
  getAll: () => api.get('/meetings'),
  create: (data) => api.post('/meetings', data),
};

export default api;
