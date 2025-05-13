
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ctrlPanelApi } from '@/lib/api';
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
import { Loader2, CheckCircle2, XCircle, KeyRound, Link } from 'lucide-react';

const CtrlPanelSettings = () => {
  const queryClient = useQueryClient();
  const [apiKey, setApiKey] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['ctrlpanel-settings'],
    queryFn: ctrlPanelApi.getCtrlPanelSettings,
  });

  useEffect(() => {
    if (settings?.apiUrl) {
      setApiUrl(settings.apiUrl);
    }
  }, [settings]);

  const saveSettingsMutation = useMutation({
    mutationFn: ctrlPanelApi.saveCtrlPanelSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ctrlpanel-settings'] });
      setApiKey('');
      setTestResult(null);
    }
  });

  const testConnectionMutation = useMutation({
    mutationFn: ctrlPanelApi.testCtrlPanelConnection,
  });

  const handleTestConnection = async () => {
    if (!apiKey && !settings?.apiKey) {
      setTestResult({ success: false, message: 'Por favor, introduce una API Key' });
      return;
    }

    if (!apiUrl) {
      setTestResult({ success: false, message: 'Por favor, introduce la URL de la API' });
      return;
    }

    setIsTestingConnection(true);
    setTestResult(null);

    try {
      await testConnectionMutation.mutateAsync({ apiKey: apiKey || settings?.apiKey, apiUrl });
      setTestResult({ success: true, message: 'Conexión exitosa' });
    } catch (error) {
      setTestResult({ success: false, message: 'Error de conexión. Verifica la API Key y URL.' });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSaveSettings = () => {
    const keyToSave = apiKey || settings?.apiKey;
    
    if (!keyToSave) {
      setTestResult({ success: false, message: 'Por favor, introduce una API Key' });
      return;
    }

    if (!apiUrl) {
      setTestResult({ success: false, message: 'Por favor, introduce la URL de la API' });
      return;
    }

    saveSettingsMutation.mutate({ apiKey: keyToSave, apiUrl });
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Configuración de CtrlPanel</h1>
      </div>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <KeyRound className="mr-2 h-5 w-5 text-primary" />
            Configuración de la API
          </CardTitle>
          <CardDescription>
            Configura la conexión con la API de CtrlPanel para obtener estadísticas e información de tus servidores.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="apiKey">API Key {settings?.apiKey && '(guardada)'}</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder={settings?.apiKey ? '••••••••••••••••••••••' : 'Introduce la API Key de CtrlPanel'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="apiUrl">URL de la API</Label>
                  <Input
                    id="apiUrl"
                    type="text"
                    placeholder="https://api.ctrlpanel.gg"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Ejemplo: https://api.ctrlpanel.gg
                  </p>
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
            Documentación de la API
          </CardTitle>
          <CardDescription>
            Enlaces útiles y documentación para trabajar con la API de CtrlPanel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-4 space-y-2">
            <li>
              <a
                href="https://docs.ctrlpanel.gg/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Documentación oficial de la API de CtrlPanel
              </a>
            </li>
            <li>
              <a
                href="https://ctrlpanel.gg/dashboard/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Generar una nueva API Key en CtrlPanel
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CtrlPanelSettings;
