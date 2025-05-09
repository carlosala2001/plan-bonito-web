
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ctrlPanelApi } from '@/lib/api';
import { Server, Users } from 'lucide-react';

type DashboardStats = {
  servers: number;
  users: number;
  activeServers: number;
  offlineServers: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    servers: 0,
    users: 0,
    activeServers: 0,
    offlineServers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch servers count
        const serversData = await ctrlPanelApi.getServersCount();
        
        // Fetch users count
        const usersData = await ctrlPanelApi.getUsersCount();
        
        // Fetch server stats
        const serverStats = await ctrlPanelApi.getServerStats();
        
        setStats({
          servers: serversData.count || 0,
          users: usersData.count || 0,
          activeServers: serverStats.active || 0,
          offlineServers: serverStats.offline || 0,
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Error al cargar los datos del dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg">Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md border border-red-200">
        <p className="text-red-600">{error}</p>
        <p className="text-sm text-red-500 mt-2">
          Asegúrate de que la API de ctrlpanel.gg está configurada correctamente.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Servidores Totales</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.servers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Servidores registrados en la plataforma
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Usuarios registrados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Servidores Activos</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeServers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((stats.activeServers / stats.servers) * 100).toFixed(1)}% de los servidores
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Servidores Offline</CardTitle>
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.offlineServers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((stats.offlineServers / stats.servers) * 100).toFixed(1)}% de los servidores
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
