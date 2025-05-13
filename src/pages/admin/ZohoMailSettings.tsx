
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zohoMailApi } from '@/lib/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2, XCircle, Mail, Link } from 'lucide-react';

const ZohoMailSettings = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    host: '',
    port: 587,
    username: '',
    password: '',
    fromEmail: '',
    fromName: ''
  });
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['zohomail-settings'],
    queryFn: zohoMailApi.getZohoMailSettings,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        host: settings.host || '',
        port: settings.port || 587,
        username: settings.username || '',
        password: '',
        fromEmail: settings.fromEmail || '',
        fromName: settings.fromName || ''
      });
    }
  }, [settings]);

  const saveSettingsMutation = useMutation({
    mutationFn: zohoMailApi.saveZohoMailSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zohomail-settings'] });
      setFormData(prev => ({
        ...prev,
        password: '' // Clear password after saving
      }));
      setTestResult(null);
    }
  });

  const testConnectionMutation = useMutation({
    mutationFn: zohoMailApi.testZohoMailConnection,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'port' ? parseInt(value) : value
    }));
  };

  const handleTestConnection = async () => {
    const { host, username, fromEmail, fromName } = formData;
    const password = formData.password || (settings?.isConfigured ? 'current-password' : '');
    
    if (!host || !username || !fromEmail || !fromName || !password) {
      setTestResult({ success: false, message: 'Todos los campos son requeridos' });
      return;
    }

    setIsTestingConnection(true);
    setTestResult(null);

    try {
      await testConnectionMutation.mutateAsync(formData);
      setTestResult({ success: true, message: 'Conexión exitosa' });
    } catch (error) {
      setTestResult({ success: false, message: 'Error de conexión. Verifica las credenciales SMTP.' });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSaveSettings = () => {
    const { host, username, fromEmail, fromName } = formData;
    const password = formData.password || (settings?.isConfigured ? 'current-password' : '');
    
    if (!host || !username || !fromEmail || !fromName) {
      setTestResult({ success: false, message: 'Todos los campos son requeridos excepto la contraseña si ya está configurada' });
      return;
    }

    const dataToSend = {
      ...formData,
      password: password === 'current-password' ? '' : password
    };

    saveSettingsMutation.mutate(dataToSend);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Configuración de Zoho Mail</h1>
      </div>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="mr-2 h-5 w-5 text-primary" />
            Configuración SMTP
          </CardTitle>
          <CardDescription>
            Configura la conexión con Zoho Mail para enviar correos desde la aplicación.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="host">Servidor SMTP</Label>
                  <Input
                    id="host"
                    name="host"
                    type="text"
                    placeholder="smtp.zoho.com"
                    value={formData.host}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="port">Puerto</Label>
                  <Input
                    id="port"
                    name="port"
                    type="number"
                    placeholder="587"
                    value={formData.port}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="username">Nombre de usuario</Label>
                  <Input
                    id="username"
                    name="username"
                    type="email"
                    placeholder="tu@correo.com"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Contraseña {settings?.isConfigured && '(guardada)'}</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder={settings?.isConfigured ? '••••••••••••••••••' : 'Contraseña'}
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fromEmail">Correo del remitente</Label>
                  <Input
                    id="fromEmail"
                    name="fromEmail"
                    type="email"
                    placeholder="noreply@tudominio.com"
                    value={formData.fromEmail}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fromName">Nombre del remitente</Label>
                  <Input
                    id="fromName"
                    name="fromName"
                    type="text"
                    placeholder="ZenoScale"
                    value={formData.fromName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {testResult && (
                <div className={`p-4 rounded-md ${testResult.success ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'}`}>
                  <div className="flex items-center">
                    {testResult.success ? (
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 mr-2 text-red-500" />
                    )}
                    <span>{testResult.message}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-4">
                <Button
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={isTestingConnection}
                >
                  {isTestingConnection && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isTestingConnection ? 'Probando...' : 'Probar Conexión'}
                </Button>
                <Button
                  onClick={handleSaveSettings}
                  disabled={saveSettingsMutation.isPending || isTestingConnection}
                >
                  {saveSettingsMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {saveSettingsMutation.isPending ? 'Guardando...' : 'Guardar Configuración'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Link className="mr-2 h-5 w-5 text-primary" />
            Ayuda para configurar Zoho Mail
          </CardTitle>
          <CardDescription>
            Enlaces útiles y documentación para configurar tu cuenta de Zoho Mail.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-4 space-y-2">
            <li>
              <a
                href="https://www.zoho.com/mail/help/zoho-smtp.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Documentación oficial de SMTP de Zoho Mail
              </a>
            </li>
            <li>
              <a
                href="https://www.zoho.com/mail/help/outgoing-server-settings.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Configuración del servidor de salida de Zoho Mail
              </a>
            </li>
            <li>
              <a
                href="https://accounts.zoho.com/home#security/app_password"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Generar contraseña de aplicación (recomendado)
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ZohoMailSettings;
