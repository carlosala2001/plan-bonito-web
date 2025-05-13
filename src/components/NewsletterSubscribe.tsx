
import React, { useState } from 'react';
import { publicApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const NewsletterSubscribe: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Por favor, introduce tu dirección de correo.');
      return;
    }
    
    setLoading(true);
    
    try {
      await publicApi.subscribeNewsletter({ email, name });
      setEmail('');
      setName('');
      toast.success('¡Gracias por suscribirte a nuestro boletín!');
    } catch (error: any) {
      if (error.response?.status === 400 && error.response?.data?.error === 'Email already subscribed') {
        toast.error('Este correo ya está suscrito a nuestro boletín.');
      } else {
        toast.error('Error al suscribirse. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <section className="py-16 md:py-24 bg-gradient-zenoscale text-white">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Mantente Informado</h2>
          <p className="mb-8">
            Suscríbete a nuestro boletín para recibir noticias, actualizaciones y ofertas especiales.
          </p>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 max-w-md mx-auto">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name" className="text-left text-white">Nombre (opcional)</Label>
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
              />
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email" className="text-left text-white">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
              />
            </div>
            
            <Button type="submit" variant="secondary" size="lg" disabled={loading} className="mt-2">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Suscribiendo...' : 'Suscribirse'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSubscribe;
