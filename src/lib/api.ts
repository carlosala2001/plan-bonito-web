
import axios from 'axios';

// Create an axios instance with default configuration
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const ctrlPanelApi = {
  // Get servers count
  getServersCount: async () => {
    try {
      const response = await api.get('/ctrlpanel/servers/count');
      return response.data;
    } catch (error) {
      console.error('Error fetching servers count:', error);
      throw error;
    }
  },
  
  // Get users count
  getUsersCount: async () => {
    try {
      const response = await api.get('/ctrlpanel/users/count');
      return response.data;
    } catch (error) {
      console.error('Error fetching users count:', error);
      throw error;
    }
  },
  
  // Get server statistics
  getServerStats: async () => {
    try {
      const response = await api.get('/ctrlpanel/servers/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching server stats:', error);
      throw error;
    }
  }
};
