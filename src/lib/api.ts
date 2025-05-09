
import axios from 'axios';
import { toast } from "sonner";

// Create an axios instance with default configuration
export const api = axios.create({
  // Use window.location.origin to work in both development and production environments
  baseURL: `${window.location.origin}/api`,
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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      toast.error('Error de red. Por favor, verifica tu conexión.');
      return Promise.reject(error);
    }

    // Handle HTTP errors
    const { status, data } = error.response;

    if (status === 401) {
      toast.error('Sesión expirada. Por favor, inicia sesión de nuevo.');
      localStorage.removeItem('admin_token');
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    } else if (status === 403) {
      toast.error('No tienes permisos para realizar esta acción.');
    } else if (status === 404) {
      toast.error('El recurso solicitado no existe.');
    } else if (status >= 500) {
      toast.error('Error del servidor. Por favor, inténtalo más tarde.');
    } else {
      toast.error(data?.error || 'Ha ocurrido un error.');
    }

    return Promise.reject(error);
  }
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
  },
  
  // Get API keys
  getApiKeys: async () => {
    try {
      const response = await api.get('/admin/api-keys');
      return response.data;
    } catch (error) {
      console.error('Error fetching API keys:', error);
      throw error;
    }
  },
  
  // Create new API key
  createApiKey: async (keyData: { name: string; key_value: string }) => {
    try {
      const response = await api.post('/admin/api-keys', keyData);
      toast.success('Clave API creada correctamente');
      return response.data;
    } catch (error) {
      console.error('Error creating API key:', error);
      throw error;
    }
  },
  
  // Delete API key
  deleteApiKey: async (id: number) => {
    try {
      const response = await api.delete(`/admin/api-keys/${id}`);
      toast.success('Clave API eliminada correctamente');
      return response.data;
    } catch (error) {
      console.error('Error deleting API key:', error);
      throw error;
    }
  }
};

export const publicApi = {
  // Get public servers count
  getServersCount: async () => {
    try {
      const response = await api.get('/public/servers/count');
      return response.data;
    } catch (error) {
      console.error('Error fetching public servers count:', error);
      throw error;
    }
  },
  
  // Get public users count
  getUsersCount: async () => {
    try {
      const response = await api.get('/public/users/count');
      return response.data;
    } catch (error) {
      console.error('Error fetching public users count:', error);
      throw error;
    }
  }
};
