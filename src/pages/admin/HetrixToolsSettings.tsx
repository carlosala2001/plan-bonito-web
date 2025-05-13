
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hetrixToolsApi } from "@/lib/api";
import { toast } from "sonner";
import { Globe, ShieldCheck, AlertTriangle } from "lucide-react";

const HetrixToolsSettings = () => {
  const [apiKey, setApiKey] = useState("");
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const queryClient = useQueryClient();

  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['hetrixtools-settings'],
    queryFn: hetrixToolsApi.getHetrixToolsSettings,
  });

  const { mutate: saveApiKey, isPending: isSaving } = useMutation({
    mutationFn: hetrixToolsApi.saveHetrixToolsApiKey,
    onSuccess: () => {
      toast.success("API Key guardada correctamente");
      queryClient.invalidateQueries({ queryKey: ['hetrixtools-settings'] });
      setApiKey("");
    },
    onError: (error) => {
      toast.error("Error al guardar la API Key");
      console.error("Error saving API key:", error);
    }
  });

  const testConnection = async () => {
    try {
      setIsTestingConnection(true);
      const keyToTest = apiKey || (settings?.apiKey || '');
      
      if (!keyToTest) {
        toast.error("Por favor ingrese una API Key para probar");
        setIsTestingConnection(false);
        return;
      }
      
      await hetrixToolsApi.testHetrixToolsConnection(keyToTest);
      toast.success("Conexión exitosa con HetrixTools");
    } catch (error) {
      toast.error("Error al conectar con HetrixTools");
      console.error("Connection test error:", error);
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Configuración de HetrixTools</h1>
          <p className="text-muted-foreground mt-1">
            Conecta tu cuenta de HetrixTools para monitorizar tus servidores
          </p>
        </div>
        <Globe className="h-12 w-12 text-primary/50" />
      </div>

      <Tabs defaultValue="api-key" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="api-key">API Key</TabsTrigger>
          <TabsTrigger value="monitors">Monitores</TabsTrigger>
        </TabsList>
        
        <TabsContent value="api-key" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>API Key de HetrixTools</CardTitle>
                  <CardDescription>
                    Configura tu API Key para conectar con HetrixTools
                  </CardDescription>
                </div>
                <ShieldCheck className="h-8 w-8 text-primary/50" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Para obtener tu API Key, inicia sesión en tu cuenta de HetrixTools y ve a 
                  <span className="font-medium"> API &gt; API Settings</span>.
                </p>
                
                {settings?.isConfigured && (
                  <div className="flex items-center p-3 bg-primary/5 rounded-md border">
                    <div className="flex-1">
                      <p className="font-medium">API Key Actual</p>
                      <p className="text-sm text-muted-foreground break-all">{settings.apiKey}</p>
                      <p className="text-xs mt-1">
                        Última actualización: {new Date(settings.lastUpdated).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-emerald-500 mr-2"></div>
                      <span className="text-sm">Configurada</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="apiKey" className="text-sm font-medium">
                    Nueva API Key
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="apiKey"
                      placeholder="Ingresa tu API Key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                    <Button 
                      onClick={() => saveApiKey(apiKey)}
                      disabled={isSaving || !apiKey}
                    >
                      Guardar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex justify-between items-center w-full">
                <div className="text-sm text-muted-foreground">
                  Prueba la conexión para verificar que tu API Key funciona correctamente
                </div>
                <Button 
                  variant="outline" 
                  onClick={testConnection}
                  disabled={isTestingConnection}
                >
                  {isTestingConnection ? "Probando..." : "Probar Conexión"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="monitors" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Monitores de HetrixTools</CardTitle>
              <CardDescription>
                Visualiza y gestiona los monitores de tus servidores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!settings?.isConfigured ? (
                <div className="flex items-center justify-center p-12 border rounded-md">
                  <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">API Key no configurada</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Configura tu API Key de HetrixTools para ver tus monitores
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p>Implementa aquí la lista de monitores de HetrixTools</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HetrixToolsSettings;
