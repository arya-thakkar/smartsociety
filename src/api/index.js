import axios from 'axios';

const api = axios.create({
  baseURL: 'https://smartsociety-1.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Interceptor for Token & Demo Mode handling
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token') || JSON.parse(localStorage.getItem('auth_store') || '{}').token;
  
  // AI Feature: Demo Mode Detection
  // If we're using a mock token, we don't want to hit the real production server 
  // and get 401/404 errors. We short-circuit to let the UI's catch-blocks handle it.
  if (token === 'mock-token') {
    return Promise.reject({
      message: 'Demo Mode: Bypassing real network call',
      isDemo: true
    });
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
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
