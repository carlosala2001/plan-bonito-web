
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

type AdminUser = {
  id: number;
  username: string;
  email: string;
};

type AdminAuthContextType = {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  registerFirstUser: (email: string, username: string, password: string) => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await api.get('/admin/check-auth');
        if (response.status === 200 && response.data.user) {
          setUser({
            id: response.data.user.id,
            username: response.data.user.username,
            email: response.data.user.email
          });
        }
      } catch (error) {
        localStorage.removeItem('admin_token');
        console.error('Auth error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/admin/login', { email, password });
      if (response.data.token && response.data.user) {
        localStorage.setItem('admin_token', response.data.token);
        setUser(response.data.user);
        toast.success('Inicio de sesión exitoso');
        return response.data.user;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || 'Error de inicio de sesión';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
    toast.info('Sesión cerrada');
  };

  const registerFirstUser = async (email: string, username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/admin/register-first-user', { email, username, password });
      if (response.data.token) {
        localStorage.setItem('admin_token', response.data.token);
        setUser({
          id: response.data.user?.id || 0,
          username: response.data.user?.username || username,
          email: response.data.user?.email || email
        });
        toast.success('Registro exitoso');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.error || 'Error de registro';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        registerFirstUser,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
