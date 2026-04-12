import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const instance = axios.create({
  baseURL: 'https://smartsociety-1.onrender.com/api',
});

// Intercept requests to add token
instance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;
