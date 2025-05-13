
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const NewsletterUnsubscribe: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  
  useEffect(() => {
    const unsubscribe = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (!token) {
          setError('Token de desuscripción no proporcionado.');
          setLoading(false);
          return;
        }
        
        const response = await api.get(`/public/newsletter/unsubscribe?token=${token}`);
        
        if (response.data.success) {
          setSuccess(true);
        } else {
          setError('Error al procesar la desuscripción.');
        }
      } catch (error) {
        console.error('Error unsubscribing:', error);
        setError('Error al procesar la desuscripción. El token puede ser inválido o haber expirado.');
      } finally {
        setLoading(false);
      }
    };
    
    unsubscribe();
  }, [location.search]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl">Desuscripción al boletín</CardTitle>
            <CardDescription>
              Gestiona tu suscripción al boletín de ZenoScale
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p>Procesando tu solicitud...</p>
              </div>
            ) : success ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">¡Te has desuscrito correctamente!</h3>
                <p className="text-muted-foreground">
                  Ya no recibirás más correos de nuestro boletín.
                </p>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Error</h3>
                <p className="text-muted-foreground">
                  {error || 'Ha ocurrido un error al procesar tu solicitud.'}
                </p>
              </div>
            )}
          </CardContent>
          
          <CardFooter>
            <Button className="w-full" asChild>
              <a href="/">Volver a la página principal</a>
            </Button>
          </CardFooter>
        </Card>
      </main>
      
      <footer className="py-4 bg-muted/30 dark:bg-muted/10">
        <div className="container">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ZenoScale. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewsletterUnsubscribe;
