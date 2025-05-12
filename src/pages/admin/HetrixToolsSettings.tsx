
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ctrlPanelApi } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AlertCircle, CheckCircle, Key } from "lucide-react";

const apiKeySchema = z.object({
  apiKey: z.string().min(8, {
    message: "La clave API debe tener al menos 8 caracteres."
  }),
});

type FormValues = z.infer<typeof apiKeySchema>;

const HetrixToolsSettings = () => {
  const queryClient = useQueryClient();
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  // Get current HetrixTools settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['hetrixtools-settings'],
    queryFn: ctrlPanelApi.getHetrixToolsSettings,
    retry: 1,
  });

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      apiKey: "",
    },
  });

  // Save API key mutation
  const saveApiKey = useMutation({
    mutationFn: (apiKey: string) => ctrlPanelApi.saveHetrixToolsApiKey(apiKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hetrixtools-settings'] });
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Error al guardar la clave API");
    },
  });

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    saveApiKey.mutate(data.apiKey);
  };

  // Test connection
  const testConnection = async () => {
    try {
      setIsTestingConnection(true);
      await ctrlPanelApi.getHetrixToolsMonitors();
      toast.success("Conexión exitosa con la API de HetrixTools");
    } catch (error) {
      toast.error("Error al conectar con la API de HetrixTools. Verifica tu clave API.");
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Configuración de HetrixTools</h1>
      <p className="text-muted-foreground">
        Configura la integración con la API de HetrixTools para monitorear el estado de tus servidores.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" /> API de HetrixTools
          </CardTitle>
          <CardDescription>
            HetrixTools proporciona servicios de monitoreo de disponibilidad y rendimiento para tus servidores.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-20 flex items-center justify-center">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : settings?.isConfigured ? (
            <div className="space-y-4">
              <Alert className="bg-muted/50">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle>Clave API configurada</AlertTitle>
                <AlertDescription>
                  La clave API de HetrixTools está configurada y lista para usar.
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Clave API:</span> {settings.apiKey}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Última actualización:</span> {new Date(settings.lastUpdated).toLocaleString()}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={testConnection}
                  disabled={isTestingConnection}
                >
                  {isTestingConnection ? "Probando..." : "Probar conexión"}
                </Button>
                <Button
                  onClick={() => {
                    form.reset({ apiKey: "" });
                  }}
                >
                  Cambiar clave API
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Clave API no configurada</AlertTitle>
                <AlertDescription>
                  Es necesario configurar una clave API de HetrixTools para monitorear tus servidores.
                </AlertDescription>
              </Alert>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clave API de HetrixTools</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ingresa tu clave API de HetrixTools" 
                            {...field} 
                            autoComplete="off"
                          />
                        </FormControl>
                        <FormDescription>
                          Puedes obtener tu clave API en el panel de HetrixTools.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={saveApiKey.isPending}
                    >
                      {saveApiKey.isPending ? "Guardando..." : "Guardar clave API"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-muted/20 flex flex-col items-start text-sm text-muted-foreground">
          <p>Para obtener una clave API de HetrixTools:</p>
          <ol className="list-decimal list-inside ml-2 space-y-1 mt-2">
            <li>Regístrate en <a href="https://hetrixtools.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">HetrixTools.com</a></li>
            <li>Ve a tu panel de control y busca la sección de API</li>
            <li>Genera una nueva clave API con los permisos necesarios</li>
            <li>Copia la clave API y pégala en el formulario anterior</li>
          </ol>
        </CardFooter>
      </Card>
    </div>
  );
};

export default HetrixToolsSettings;
