
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ctrlPanelApi } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Server, 
  Users, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock 
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const COLORS = ['#7B6CF6', '#73B9FF', '#38BDF8', '#22D3EE', '#2DD4BF'];

const AdminDashboard = () => {
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  
  const textColor = isDarkTheme ? "#f1f5f9" : "#334155";
  const gridColor = isDarkTheme ? "#334155" : "#e2e8f0";

  const { data: serverCount, isLoading: isLoadingServerCount } = useQuery({
    queryKey: ['servers-count'],
    queryFn: ctrlPanelApi.getServersCount,
    retry: 1,
  });

  const { data: userCount, isLoading: isLoadingUserCount } = useQuery({
    queryKey: ['users-count'],
    queryFn: ctrlPanelApi.getUsersCount,
    retry: 1,
  });

  const { data: serverStats, isLoading: isLoadingServerStats } = useQuery({
    queryKey: ['server-stats'],
    queryFn: ctrlPanelApi.getServerStats,
    retry: 1,
  });

  // Server Status Data
  const serverStatusData = serverStats ? [
    { name: 'Online', value: serverStats.online, color: '#10b981' },
    { name: 'Offline', value: serverStats.offline, color: '#ef4444' },
    { name: 'Suspended', value: serverStats.suspended, color: '#f59e0b' }
  ] : [];

  // Server Types Data
  const serverTypesData = serverStats ? Object.entries(serverStats.serverTypes || {}).map(
    ([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      count: count as number,
    })
  ) : [];
  
  // Status icons
  const statusIcons = {
    Online: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    Offline: <XCircle className="w-4 h-4 text-red-500" />,
    Suspended: <Clock className="w-4 h-4 text-amber-500" />
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Panel de Control</h1>
        <Button onClick={() => window.location.reload()}>Actualizar Datos</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-primary/10">
                <Server className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Servidores</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingServerCount ? (
              <div className="h-16 flex items-center justify-center">
                <div className="animate-pulse h-8 w-24 bg-muted rounded"></div>
              </div>
            ) : (
              <div className="text-4xl font-bold">{serverCount?.count || 0}</div>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              Servidores activos en la plataforma
            </p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Usuarios</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingUserCount ? (
              <div className="h-16 flex items-center justify-center">
                <div className="animate-pulse h-8 w-24 bg-muted rounded"></div>
              </div>
            ) : (
              <div className="text-4xl font-bold">{userCount?.count || 0}</div>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              Usuarios registrados en la plataforma
            </p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-primary/10">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Tasa de Actividad</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingServerStats ? (
              <div className="h-16 flex items-center justify-center">
                <div className="animate-pulse h-8 w-24 bg-muted rounded"></div>
              </div>
            ) : (
              <div className="text-4xl font-bold">
                {serverStats?.online && serverStats?.total
                  ? Math.round((serverStats.online / serverStats.total) * 100)
                  : 0}%
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              Porcentaje de servidores activos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Estado de los Servidores</CardTitle>
            <CardDescription>
              Distribución actual de servidores por estado
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {isLoadingServerStats ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-pulse h-48 w-48 bg-muted rounded-full"></div>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={serverStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {serverStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} servidores`, null]}
                      contentStyle={{
                        backgroundColor: isDarkTheme ? '#1e293b' : '#ffffff',
                        color: textColor,
                        border: isDarkTheme ? '1px solid #334155' : '1px solid #e2e8f0',
                        borderRadius: '6px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4 flex flex-wrap gap-3">
            {!isLoadingServerStats &&
              serverStatusData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  {statusIcons[item.name as keyof typeof statusIcons]}
                  <span className="text-sm">{item.name}: <strong>{item.value}</strong></span>
                </div>
              ))}
          </CardFooter>
        </Card>

        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Tipos de Servidores</CardTitle>
            <CardDescription>
              Distribución de servidores por juego
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {isLoadingServerStats ? (
              <div className="h-64 flex items-center justify-center">
                <div className="w-full">
                  <div className="animate-pulse h-8 bg-muted rounded mb-2"></div>
                  <div className="animate-pulse h-8 bg-muted rounded mb-2 w-3/4"></div>
                  <div className="animate-pulse h-8 bg-muted rounded mb-2 w-1/2"></div>
                  <div className="animate-pulse h-8 bg-muted rounded mb-2 w-2/3"></div>
                  <div className="animate-pulse h-8 bg-muted rounded w-1/3"></div>
                </div>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={serverTypesData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis 
                      dataKey="name"
                      tick={{ fill: textColor }}
                    />
                    <YAxis 
                      tick={{ fill: textColor }}
                    />
                    <Tooltip
                      formatter={(value) => [`${value} servidores`, 'Total']}
                      contentStyle={{
                        backgroundColor: isDarkTheme ? '#1e293b' : '#ffffff',
                        color: textColor,
                        border: isDarkTheme ? '1px solid #334155' : '1px solid #e2e8f0',
                        borderRadius: '6px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Bar dataKey="count" fill="#7B6CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* API Connection Management */}
      <Card className="border shadow-sm hover:shadow-md transition-shadow mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Conexión API CtrlPanel</CardTitle>
              <CardDescription>
                Configuración de la conexión con la API de CtrlPanel.gg
              </CardDescription>
            </div>
            <ShieldAlert className="h-6 w-6 text-amber-500" />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="keys">
            <TabsList>
              <TabsTrigger value="keys">Claves API</TabsTrigger>
              <TabsTrigger value="config">Configuración</TabsTrigger>
            </TabsList>
            <TabsContent value="keys" className="pt-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Gestiona tus claves API para conectarte a CtrlPanel.gg. Estas claves permiten obtener información sobre servidores y usuarios.
              </p>
              
              {/* API Key Management UI would go here */}
              <div className="border rounded-lg p-4 bg-muted/20">
                <p className="font-medium">Clave API Actual:</p>
                <div className="flex items-center mt-2">
                  <code className="bg-muted p-2 rounded flex-1 overflow-x-auto text-sm">
                    {/* This is just for UI demonstration. In a real app, we'd show masked keys from the database */}
                    ••••••••••••••••••••••••••••••
                  </code>
                  <div className="ml-2">
                    <Button variant="outline" size="sm">Editar</Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button className="w-full md:w-auto bg-gradient-zenoscale">
                  Agregar Nueva Clave
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="config" className="pt-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Configura los parámetros de conexión para la API de CtrlPanel.gg.
              </p>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Estado de la API</h3>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span>Conectado</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Última sincronización: Hace 5 minutos
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
