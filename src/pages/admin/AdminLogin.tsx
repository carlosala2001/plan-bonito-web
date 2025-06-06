
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';

type LoginFormData = {
  email: string;
  password: string;
};

type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const AdminLogin: React.FC = () => {
  const { login, registerFirstUser, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const [isFirstUser, setIsFirstUser] = useState(false);
  const [isCheckingFirstUser, setIsCheckingFirstUser] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const loginForm = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    }
  });
  
  const registerForm = useForm<RegisterFormData>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });

  useEffect(() => {
    // Check if authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/admin');
    }
    
    // Check if this is the first user
    const checkFirstUser = async () => {
      try {
        setApiError(null);
        const response = await api.get('/admin/check-first-user');
        setIsFirstUser(response.data.isFirstUser);
      } catch (error) {
        console.error('Error checking first user:', error);
        setApiError('No se pudo conectar con el servidor. Asegúrate de que el servidor backend esté en ejecución.');
      } finally {
        setIsCheckingFirstUser(false);
      }
    };
    
    checkFirstUser();
  }, [isAuthenticated, navigate]);

  const handleLogin = async (data: LoginFormData) => {
    try {
      setApiError(null);
      await login(data.email, data.password);
      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    
    try {
      setApiError(null);
      await registerFirstUser(data.email, data.username, data.password);
      navigate('/admin');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  if (isCheckingFirstUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-muted/30 to-background dark:from-slate-900/80 dark:to-background">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-lg">Verificando conexión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-b from-muted/30 to-background dark:from-slate-900/80 dark:to-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-zenoscale opacity-10"></div>
          <div className="relative z-10">
            <CardTitle className="text-2xl">{isFirstUser ? 'Registro de administrador' : 'Iniciar sesión'}</CardTitle>
            <CardDescription>
              {isFirstUser 
                ? 'Crea tu cuenta de administrador para comenzar' 
                : 'Introduce tus credenciales para acceder al panel de administración'}
            </CardDescription>
          </div>
          
          {apiError && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-center gap-2 text-yellow-700">
              <AlertTriangle size={18} />
              <p className="text-sm">{apiError}</p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isFirstUser ? (
            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input 
                  id="username" 
                  {...registerForm.register('username')} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  {...registerForm.register('email')} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  id="password" 
                  type="password" 
                  {...registerForm.register('password')} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  {...registerForm.register('confirmPassword')} 
                  required 
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-zenoscale hover:brightness-105 transition-all">Registrarse</Button>
            </form>
          ) : (
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  {...loginForm.register('email')} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  id="password" 
                  type="password" 
                  {...loginForm.register('password')} 
                  required 
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-zenoscale hover:brightness-105 transition-all">Iniciar sesión</Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Panel de administración ZenoScale
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
