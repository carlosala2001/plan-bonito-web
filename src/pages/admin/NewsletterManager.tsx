
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zohoMailApi } from '@/lib/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Send,
  Loader2,
  Mail,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const NewsletterManager = () => {
  const queryClient = useQueryClient();
  const [newsletterData, setNewsletterData] = useState({
    subject: '',
    content: '',
    testEmail: '',
  });

  const {
    data: subscribers,
    isLoading: isLoadingSubscribers,
    isError: isErrorSubscribers,
  } = useQuery({
    queryKey: ['newsletter-subscribers'],
    queryFn: zohoMailApi.getNewsletterSubscribers,
  });

  const sendNewsletterMutation = useMutation({
    mutationFn: zohoMailApi.sendNewsletter,
    onSuccess: () => {
      // Only reset subject and content after a real send, not a test send
      if (!newsletterData.testEmail) {
        setNewsletterData(prev => ({
          ...prev,
          subject: '',
          content: '',
        }));
      }
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewsletterData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendTestEmail = () => {
    if (!newsletterData.subject || !newsletterData.content || !newsletterData.testEmail) {
      return;
    }

    sendNewsletterMutation.mutate({
      subject: newsletterData.subject,
      content: newsletterData.content,
      testEmail: newsletterData.testEmail,
    });
  };

  const handleSendNewsletter = () => {
    if (!newsletterData.subject || !newsletterData.content) {
      return;
    }

    if (window.confirm('¿Estás seguro de que quieres enviar este boletín a todos los suscriptores?')) {
      sendNewsletterMutation.mutate({
        subject: newsletterData.subject,
        content: newsletterData.content,
      });
    }
  };

  const activeSubscribers = subscribers?.filter(sub => sub.is_active) || [];
  const inactiveSubscribers = subscribers?.filter(sub => !sub.is_active) || [];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión del Boletín</h1>
      </div>

      <Tabs defaultValue="compose">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="compose">Componer Boletín</TabsTrigger>
          <TabsTrigger value="subscribers">
            Suscriptores{' '}
            {subscribers && (
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium">
                {activeSubscribers.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="compose" className="pt-4">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-primary" />
                Crear Boletín
              </CardTitle>
              <CardDescription>
                Compone y envía un boletín a tus suscriptores.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="subject">Asunto</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Asunto del boletín"
                    value={newsletterData.subject}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Contenido</Label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Contenido del boletín (permite HTML)"
                    value={newsletterData.content}
                    onChange={handleInputChange}
                    className="min-h-[300px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Puedes utilizar HTML para dar formato a tu boletín. Incluye imágenes, enlaces y estilos.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="flex items-center w-full gap-2">
                <Input
                  id="testEmail"
                  name="testEmail"
                  placeholder="Email de prueba"
                  value={newsletterData.testEmail}
                  onChange={handleInputChange}
                />
                <Button
                  variant="outline"
                  onClick={handleSendTestEmail}
                  disabled={
                    sendNewsletterMutation.isPending ||
                    !newsletterData.subject ||
                    !newsletterData.content ||
                    !newsletterData.testEmail
                  }
                >
                  {sendNewsletterMutation.isPending && newsletterData.testEmail ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Enviar Prueba
                </Button>
              </div>
              <div className="flex w-full justify-end">
                <Button
                  onClick={handleSendNewsletter}
                  disabled={
                    sendNewsletterMutation.isPending ||
                    !newsletterData.subject ||
                    !newsletterData.content
                  }
                >
                  {sendNewsletterMutation.isPending && !newsletterData.testEmail ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Enviar a {activeSubscribers.length} suscriptores
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="subscribers" className="pt-4">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Suscriptores
              </CardTitle>
              <CardDescription>
                Listado de suscriptores al boletín.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingSubscribers ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : isErrorSubscribers ? (
                <div className="flex justify-center items-center py-8 text-red-500">
                  <AlertCircle className="h-6 w-6 mr-2" />
                  Error al cargar los suscriptores
                </div>
              ) : subscribers && subscribers.length > 0 ? (
                <Tabs defaultValue="active">
                  <TabsList className="mb-4">
                    <TabsTrigger value="active">
                      Activos ({activeSubscribers.length})
                    </TabsTrigger>
                    <TabsTrigger value="inactive">
                      Inactivos ({inactiveSubscribers.length})
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="active">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Fecha de suscripción</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activeSubscribers.map(subscriber => (
                            <TableRow key={subscriber.id}>
                              <TableCell>{subscriber.email}</TableCell>
                              <TableCell>{subscriber.name || '-'}</TableCell>
                              <TableCell>
                                <span className="flex items-center">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                  Activo
                                </span>
                              </TableCell>
                              <TableCell>
                                {format(new Date(subscriber.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="inactive">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Fecha de suscripción</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {inactiveSubscribers.map(subscriber => (
                            <TableRow key={subscriber.id}>
                              <TableCell>{subscriber.email}</TableCell>
                              <TableCell>{subscriber.name || '-'}</TableCell>
                              <TableCell>
                                <span className="flex items-center">
                                  <XCircle className="h-4 w-4 text-red-500 mr-1" />
                                  Inactivo
                                </span>
                              </TableCell>
                              <TableCell>
                                {format(new Date(subscriber.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No hay suscriptores registrados.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewsletterManager;
