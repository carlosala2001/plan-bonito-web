
import React, { useState, useEffect } from "react";
import { hetrixToolsApi } from "@/lib/api";
import { useTheme } from "@/components/ThemeProvider";
import { ServerIcon, WifiIcon, CheckIcon, XIcon, AlertTriangleIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Node {
  id: number;
  name: string;
  location: string;
  status: string;
  last_check?: string;
}

const GlobalMap: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchNodeStatus = async () => {
      try {
        setLoading(true);
        const data = await hetrixToolsApi.getNodesStatus();
        
        // Ensure nodes is always an array
        if (Array.isArray(data)) {
          setNodes(data);
        } else {
          console.error("Expected array of nodes but got:", typeof data, data);
          setNodes([]);
          
          // Use sample data only if in development
          if (process.env.NODE_ENV === 'development') {
            setNodes([
              { id: 1, name: "North America", location: "New York", status: "online" },
              { id: 2, name: "Europe", location: "Frankfurt", status: "online" },
              { id: 3, name: "Asia", location: "Singapore", status: "maintenance" },
              { id: 4, name: "Oceania", location: "Sydney", status: "offline" },
            ]);
          }
        }
      } catch (error) {
        console.error('Error fetching node status:', error);
        setNodes([]);
        
        // Use sample data only if in development
        if (process.env.NODE_ENV === 'development') {
          setNodes([
            { id: 1, name: "North America", location: "New York", status: "online" },
            { id: 2, name: "Europe", location: "Frankfurt", status: "online" },
            { id: 3, name: "Asia", location: "Singapore", status: "maintenance" },
            { id: 4, name: "Oceania", location: "Sydney", status: "offline" },
          ]);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchNodeStatus();
    const interval = setInterval(fetchNodeStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "online":
        return "bg-gradient-to-r from-green-500 to-green-400";
      case "offline":
        return "bg-gradient-to-r from-red-500 to-red-400";
      case "maintenance":
        return "bg-gradient-to-r from-yellow-500 to-yellow-400";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-400";
    }
  };

  // Function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "online":
        return <CheckIcon className="h-5 w-5" />;
      case "offline":
        return <XIcon className="h-5 w-5" />;
      case "maintenance":
        return <AlertTriangleIcon className="h-5 w-5" />;
      default:
        return <ServerIcon className="h-5 w-5" />;
    }
  };

  return (
    <section className="py-12 md:py-16 bg-muted/30 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            <span className="text-foreground">Nuestras </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7B6CF6] to-[#73B9FF]">Ubicaciones</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            ZenoScale crece y amplía constantemente su lista de ubicaciones, lo que garantiza que podamos atender a usuarios de todo el mundo con la mejor experiencia posible.
          </p>
        </div>
        
        <div className="mx-auto max-w-4xl">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 font-medium">Cargando datos de los servidores...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nodes.length > 0 ? (
                nodes.map((node) => (
                  <Card 
                    key={node.id} 
                    className="overflow-hidden transition-all hover:scale-[1.02] border dark:border-slate-700"
                  >
                    <div className={`h-1.5 ${getStatusColor(node.status)}`}></div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold">{node.name}</h3>
                          <p className="text-sm text-muted-foreground">{node.location}</p>
                        </div>
                        <Badge 
                          className={`${getStatusColor(node.status)} text-white border-none flex items-center gap-1.5 px-3 py-1`}
                        >
                          {getStatusIcon(node.status)}
                          <span className="capitalize">{node.status}</span>
                        </Badge>
                      </div>
                      
                      <div className="mt-4 flex items-center gap-2">
                        <WifiIcon className="h-4 w-4 text-primary" />
                        <span className="text-sm text-muted-foreground">
                          Última comprobación: {node.last_check || "N/A"}
                        </span>
                      </div>
                      
                      <div className="mt-4 bg-gradient-to-r from-primary/10 to-secondary/10 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <ServerIcon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Servidor optimizado para juegos</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 bg-muted p-8 rounded-lg text-center">
                  <ServerIcon className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No hay servidores disponibles</h3>
                  <p className="text-muted-foreground">
                    No se pudieron cargar los datos de los servidores. Por favor, inténtelo de nuevo más tarde.
                  </p>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-8 bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-lg shadow-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold mb-1">Servidores en múltiples regiones</h3>
                <p className="text-sm text-gray-300">
                  Todos nuestros servidores cuentan con protección DDoS y 99.9% de uptime garantizado.
                </p>
              </div>
              <Badge className="bg-gradient-to-r from-[#7B6CF6] to-[#73B9FF] text-white border-none py-1.5 px-4 text-base">
                {nodes.length} Servidores Globales
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalMap;
