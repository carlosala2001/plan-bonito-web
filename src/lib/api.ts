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
  },
  
  // Node management
  getNodes: async () => {
    try {
      const response = await api.get('/admin/nodes');
      return response.data;
    } catch (error) {
      console.error('Error fetching nodes:', error);
      throw error;
    }
  },
  
  createNode: async (nodeData: { name: string; location: string; latitude: number; longitude: number }) => {
    try {
      const response = await api.post('/admin/nodes', nodeData);
      toast.success('Nodo creado correctamente');
      return response.data;
    } catch (error) {
      console.error('Error creating node:', error);
      throw error;
    }
  },
  
  deleteNode: async (id: number) => {
    try {
      const response = await api.delete(`/admin/nodes/${id}`);
      toast.success('Nodo eliminado correctamente');
      return response.data;
    } catch (error) {
      console.error('Error deleting node:', error);
      throw error;
    }
  },
  
  updateNodeStatus: async (id: number, status: string) => {
    try {
      const response = await api.put(`/admin/nodes/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating node status:', error);
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

// HetrixTools API (would be implemented in production)
export const hetrixToolsApi = {
  // In production this would make real API calls to HetrixTools
  // For now it returns mock data
  getNodesStatus: async (apiKey: string) => {
    try {
      // In production this would be a real API call
      // const response = await axios.get('https://api.hetrixtools.com/v2/monitors/', {
      //   headers: { Authorization: `Bearer ${apiKey}` }
      // });
      // return response.data;
      
      // Mock data
      return {
        nodes: [
          { id: 1, name: "North America", location: "New York", latitude: 40.7128, longitude: -74.0060, status: "online" },
          { id: 2, name: "Europe", location: "Frankfurt", latitude: 50.1109, longitude: 8.6821, status: "online" },
          { id: 3, name: "Asia", location: "Singapore", latitude: 1.3521, longitude: 103.8198, status: "online" },
          { id: 4, name: "Oceania", location: "Sydney", latitude: -33.8688, longitude: 151.2093, status: "maintenance" },
        ]
      };
    } catch (error) {
      console.error('Error fetching HetrixTools data:', error);
      throw error;
    }
  }
};
