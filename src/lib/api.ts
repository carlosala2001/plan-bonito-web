
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
      // Only redirect if attempting to access an admin page
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/admin') && !currentPath.includes('/admin/login')) {
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
  
  // CtrlPanel API settings
  getCtrlPanelSettings: async () => {
    try {
      const response = await api.get('/admin/ctrlpanel-settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching CtrlPanel settings:', error);
      throw error;
    }
  },
  
  saveCtrlPanelSettings: async (settings: { apiKey: string; apiUrl: string }) => {
    try {
      const response = await api.post('/admin/ctrlpanel-settings', settings);
      toast.success('Configuración de CtrlPanel guardada correctamente');
      return response.data;
    } catch (error) {
      console.error('Error saving CtrlPanel settings:', error);
      throw error;
    }
  },
  
  testCtrlPanelConnection: async (settings: { apiKey: string; apiUrl: string }) => {
    try {
      const response = await api.post('/admin/ctrlpanel/test-connection', settings);
      toast.success('Conexión con CtrlPanel exitosa');
      return response.data;
    } catch (error) {
      console.error('Error testing CtrlPanel connection:', error);
      throw error;
    }
  }
};

export const hetrixToolsApi = {
  // HetrixTools API settings
  getHetrixToolsSettings: async () => {
    try {
      const response = await api.get('/admin/hetrixtools-settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching HetrixTools settings:', error);
      throw error;
    }
  },
  
  saveHetrixToolsApiKey: async (apiKey: string) => {
    try {
      const response = await api.post('/admin/hetrixtools-settings', { apiKey });
      toast.success('API Key de HetrixTools guardada correctamente');
      return response.data;
    } catch (error) {
      console.error('Error saving HetrixTools API Key:', error);
      throw error;
    }
  },
  
  testHetrixToolsConnection: async (apiKey: string) => {
    try {
      const response = await api.post('/admin/hetrixtools/test-connection', { apiKey });
      toast.success('Conexión con HetrixTools exitosa');
      return response.data;
    } catch (error) {
      console.error('Error testing HetrixTools connection:', error);
      throw error;
    }
  },
  
  getHetrixToolsMonitors: async () => {
    try {
      const response = await api.get('/admin/hetrixtools/monitors');
      return response.data;
    } catch (error) {
      console.error('Error fetching HetrixTools monitors:', error);
      throw error;
    }
  },
  
  getNodesStatus: async () => {
    try {
      const response = await api.get('/admin/nodes/status');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching HetrixTools data:', error);
      return [];
    }
  }
};

export const zohoMailApi = {
  // Zoho Mail settings
  getZohoMailSettings: async () => {
    try {
      const response = await api.get('/admin/zoho-mail-settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching Zoho Mail settings:', error);
      throw error;
    }
  },
  
  saveZohoMailSettings: async (settings: {
    host: string;
    port: number;
    username: string;
    password: string;
    fromEmail: string;
    fromName: string;
  }) => {
    try {
      const response = await api.post('/admin/zoho-mail-settings', settings);
      toast.success('Configuración de Zoho Mail guardada correctamente');
      return response.data;
    } catch (error) {
      console.error('Error saving Zoho Mail settings:', error);
      throw error;
    }
  },
  
  testZohoMailConnection: async (settings: {
    host: string;
    port: number;
    username: string;
    password: string;
    fromEmail: string;
    fromName: string;
  }) => {
    try {
      const response = await api.post('/admin/zoho-mail/test-connection', settings);
      toast.success('Conexión con Zoho Mail exitosa');
      return response.data;
    } catch (error) {
      console.error('Error testing Zoho Mail connection:', error);
      throw error;
    }
  },
  
  getNewsletterSubscribers: async () => {
    try {
      const response = await api.get('/admin/newsletter/subscribers');
      return response.data;
    } catch (error) {
      console.error('Error fetching newsletter subscribers:', error);
      throw error;
    }
  },
  
  sendNewsletter: async (data: { subject: string; content: string; testEmail?: string }) => {
    try {
      const response = await api.post('/admin/newsletter/send', data);
      toast.success(data.testEmail ? 
        'Correo de prueba enviado correctamente' : 
        'Boletín enviado correctamente a los suscriptores'
      );
      return response.data;
    } catch (error) {
      console.error('Error sending newsletter:', error);
      throw error;
    }
  }
};

export const plansApi = {
  // Plans management
  getPlans: async (type: 'hosting' | 'vps' | 'metal' = 'hosting') => {
    try {
      const response = await api.get('/admin/plans', { params: { type } });
      return response.data;
    } catch (error) {
      console.error('Error fetching plans:', error);
      throw error;
    }
  },
  
  createPlan: async (planData: any) => {
    try {
      const response = await api.post('/admin/plans', planData);
      toast.success('Plan creado correctamente');
      return response.data;
    } catch (error) {
      console.error('Error creating plan:', error);
      throw error;
    }
  },
  
  updatePlan: async (id: number, planData: any) => {
    try {
      const response = await api.put(`/admin/plans/${id}`, planData);
      toast.success('Plan actualizado correctamente');
      return response.data;
    } catch (error) {
      console.error('Error updating plan:', error);
      throw error;
    }
  },
  
  deletePlan: async (id: number) => {
    try {
      const response = await api.delete(`/admin/plans/${id}`);
      toast.success('Plan eliminado correctamente');
      return response.data;
    } catch (error) {
      console.error('Error deleting plan:', error);
      throw error;
    }
  }
};

export const pagesApi = {
  // Pages management
  getPages: async () => {
    try {
      const response = await api.get('/admin/pages');
      return response.data;
    } catch (error) {
      console.error('Error fetching pages:', error);
      throw error;
    }
  },
  
  getPage: async (slug: string) => {
    try {
      const response = await api.get(`/admin/pages/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching page:', error);
      throw error;
    }
  },
  
  createPage: async (pageData: any) => {
    try {
      const response = await api.post('/admin/pages', pageData);
      toast.success('Página creada correctamente');
      return response.data;
    } catch (error) {
      console.error('Error creating page:', error);
      throw error;
    }
  },
  
  updatePage: async (id: number, pageData: any) => {
    try {
      const response = await api.put(`/admin/pages/${id}`, pageData);
      toast.success('Página actualizada correctamente');
      return response.data;
    } catch (error) {
      console.error('Error updating page:', error);
      throw error;
    }
  },
  
  deletePage: async (id: number) => {
    try {
      const response = await api.delete(`/admin/pages/${id}`);
      toast.success('Página eliminada correctamente');
      return response.data;
    } catch (error) {
      console.error('Error deleting page:', error);
      throw error;
    }
  }
};

export const gamesApi = {
  // Supported games management
  getGames: async () => {
    try {
      const response = await api.get('/admin/games');
      return response.data;
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
  },
  
  createGame: async (formData: FormData) => {
    try {
      const response = await api.post('/admin/games', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Juego añadido correctamente');
      return response.data;
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  },
  
  updateGame: async (id: number, formData: FormData) => {
    try {
      const response = await api.put(`/admin/games/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Juego actualizado correctamente');
      return response.data;
    } catch (error) {
      console.error('Error updating game:', error);
      throw error;
    }
  },
  
  deleteGame: async (id: number) => {
    try {
      const response = await api.delete(`/admin/games/${id}`);
      toast.success('Juego eliminado correctamente');
      return response.data;
    } catch (error) {
      console.error('Error deleting game:', error);
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
      return { count: 0 };
    }
  },
  
  // Get public users count
  getUsersCount: async () => {
    try {
      const response = await api.get('/public/users/count');
      return response.data;
    } catch (error) {
      console.error('Error fetching public users count:', error);
      return { count: 0 };
    }
  },
  
  // Get public nodes status for the world map
  getNodesStatus: async () => {
    try {
      const response = await api.get('/public/nodes/status');
      // Ensure we always return an array
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.error("API response is not an array:", response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching public nodes status:', error);
      return [];
    }
  },
  
  // Get public plans
  getPlans: async (type: 'hosting' | 'vps' | 'metal' = 'hosting') => {
    try {
      const response = await api.get('/public/plans', { params: { type } });
      return response.data;
    } catch (error) {
      console.error('Error fetching public plans:', error);
      return [];
    }
  },
  
  // Get public page by slug
  getPage: async (slug: string) => {
    try {
      const response = await api.get(`/public/pages/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching public page (${slug}):`, error);
      return null;
    }
  },
  
  // Get public supported games
  getGames: async () => {
    try {
      const response = await api.get('/public/games');
      return response.data;
    } catch (error) {
      console.error('Error fetching public games:', error);
      return [];
    }
  },
  
  // Subscribe to newsletter
  subscribeNewsletter: async (data: { email: string; name?: string }) => {
    try {
      const response = await api.post('/public/newsletter/subscribe', data);
      toast.success('¡Gracias por suscribirte a nuestro boletín!');
      return response.data;
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      throw error;
    }
  }
};

