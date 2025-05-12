
import React, { useState, useEffect } from "react";
import { GlobeIcon, Circle } from "lucide-react";
import { publicApi } from "@/lib/api";
import { useTheme } from "@/components/ThemeProvider";

interface Node {
  id: number;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  status: string;
  last_check?: string;
}

const GlobalMap: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    const fetchNodeStatus = async () => {
      try {
        setLoading(true);
        const data = await publicApi.getNodesStatus();
        
        // Ensure nodes is always an array
        if (Array.isArray(data)) {
          setNodes(data);
        } else {
          console.error("Expected array of nodes but got:", typeof data, data);
          // Fallback to empty array if data is not an array
          setNodes([]);
          
          // Use sample data only if in development
          if (process.env.NODE_ENV === 'development') {
            setNodes([
              { id: 1, name: "North America", location: "New York", latitude: 40.7128, longitude: -74.0060, status: "online" },
              { id: 2, name: "Europe", location: "Frankfurt", latitude: 50.1109, longitude: 8.6821, status: "online" },
              { id: 3, name: "Asia", location: "Singapore", latitude: 1.3521, longitude: 103.8198, status: "online" },
              { id: 4, name: "Oceania", location: "Sydney", latitude: -33.8688, longitude: 151.2093, status: "online" },
            ]);
          }
        }
      } catch (error) {
        console.error('Error fetching node status:', error);
        // Set empty array to avoid map errors
        setNodes([]);
        
        // Use sample data only if in development
        if (process.env.NODE_ENV === 'development') {
          setNodes([
            { id: 1, name: "North America", location: "New York", latitude: 40.7128, longitude: -74.0060, status: "online" },
            { id: 2, name: "Europe", location: "Frankfurt", latitude: 50.1109, longitude: 8.6821, status: "online" },
            { id: 3, name: "Asia", location: "Singapore", latitude: 1.3521, longitude: 103.8198, status: "online" },
            { id: 4, name: "Oceania", location: "Sydney", latitude: -33.8688, longitude: 151.2093, status: "online" },
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
    switch (status) {
      case "online":
        return "#4ade80"; // green
      case "offline":
        return "#f87171"; // red
      case "maintenance":
        return "#facc15"; // yellow
      default:
        return "#a3a3a3"; // gray
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
        
        <div className="mx-auto max-w-5xl relative rounded-lg overflow-hidden shadow-lg">
          <div className="aspect-[16/9] bg-slate-900 relative">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-0"></div>

            {/* Grid lines */}
            <div className="absolute inset-0 z-0">
              <svg className="w-full h-full" viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
                <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path 
                    d="M 20 0 L 0 0 0 20" 
                    fill="none" 
                    stroke={isDarkMode ? "rgba(115, 185, 255, 0.08)" : "rgba(75, 85, 99, 0.08)"} 
                    strokeWidth="0.5"
                  />
                </pattern>
                <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                  <rect width="100" height="100" fill="url(#smallGrid)"/>
                  <path 
                    d="M 100 0 L 0 0 0 100" 
                    fill="none" 
                    stroke={isDarkMode ? "rgba(115, 185, 255, 0.15)" : "rgba(75, 85, 99, 0.15)"} 
                    strokeWidth="1"
                  />
                </pattern>
                <rect width="1000" height="500" fill="url(#grid)" />
              </svg>
            </div>

            {/* World Map */}
            <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="continentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop 
                    offset="0%" 
                    stopColor={isDarkMode ? "#73B9FF" : "#9b87f5"} 
                    stopOpacity={isDarkMode ? "0.3" : "0.2"} 
                  />
                  <stop 
                    offset="100%" 
                    stopColor={isDarkMode ? "#9b87f5" : "#73B9FF"} 
                    stopOpacity={isDarkMode ? "0.15" : "0.1"} 
                  />
                </linearGradient>
                
                {/* Glow filter for node highlights */}
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Simplified World Map */}
              <path 
                d="M170,130 Q185,115,200,110 Q215,105,230,115 Q245,125,250,140 Q255,155,250,170 Q245,185,230,195 Q215,205,200,200 Q185,195,175,180 Q165,165,170,130 Z" 
                fill="url(#continentGradient)" 
              />
              <path 
                d="M220,220 Q235,210,250,215 Q265,220,270,235 Q275,250,270,265 Q265,280,250,285 Q235,290,220,285 Q205,280,200,265 Q195,250,200,235 Q205,220,220,220 Z" 
                fill="url(#continentGradient)" 
              />
              <path 
                d="M300,150 Q315,140,330,145 Q345,150,350,165 Q355,180,350,195 Q345,210,330,215 Q315,220,300,215 Q285,210,280,195 Q275,180,280,165 Q285,150,300,150 Z" 
                fill="url(#continentGradient)" 
              />
              <path 
                d="M380,140 Q395,130,410,135 Q425,140,430,155 Q435,170,430,185 Q425,200,410,205 Q395,210,380,205 Q365,200,360,185 Q355,170,360,155 Q365,140,380,140 Z" 
                fill="url(#continentGradient)" 
              />
              <path 
                d="M420,240 Q435,230,450,235 Q465,240,470,255 Q475,270,470,285 Q465,300,450,305 Q435,310,420,305 Q405,300,400,285 Q395,270,400,255 Q405,240,420,240 Z" 
                fill="url(#continentGradient)" 
              />
              <path 
                d="M540,180 Q555,170,570,175 Q585,180,590,195 Q595,210,590,225 Q585,240,570,245 Q555,250,540,245 Q525,240,520,225 Q515,210,520,195 Q525,180,540,180 Z" 
                fill="url(#continentGradient)" 
              />
              <path 
                d="M650,240 Q665,230,680,235 Q695,240,700,255 Q705,270,700,285 Q695,300,680,305 Q665,310,650,305 Q635,300,630,285 Q625,270,630,255 Q635,240,650,240 Z" 
                fill="url(#continentGradient)" 
              />
              <path 
                d="M750,300 Q765,290,780,295 Q795,300,800,315 Q805,330,800,345 Q795,360,780,365 Q765,370,750,365 Q735,360,730,345 Q725,330,730,315 Q735,300,750,300 Z" 
                fill="url(#continentGradient)" 
              />

              {/* Connection lines between nodes */}
              {Array.isArray(nodes) && nodes.map((node, i) => {
                const x1 = ((node.longitude + 180) / 360) * 1000;
                const y1 = ((90 - node.latitude) / 180) * 500;
                
                return (Array.isArray(nodes) && nodes.slice(i + 1).map(targetNode => {
                  const x2 = ((targetNode.longitude + 180) / 360) * 1000;
                  const y2 = ((90 - targetNode.latitude) / 180) * 500;
                  
                  return (
                    <path
                      key={`${node.id}-${targetNode.id}`}
                      d={`M ${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.min(y1, y2) - 50} ${x2} ${y2}`}
                      fill="none"
                      stroke={isDarkMode ? "rgba(155, 135, 245, 0.3)" : "rgba(155, 135, 245, 0.2)"}
                      strokeWidth="1"
                      strokeDasharray="5,5"
                    >
                      <animate attributeName="stroke-dashoffset" from="0" to="20" dur="3s" repeatCount="indefinite" />
                    </path>
                  );
                }));
              })}

              {/* Node locations */}
              {Array.isArray(nodes) && nodes.map((node) => {
                // Convert lat/long to SVG coordinates
                const x = ((node.longitude + 180) / 360) * 1000;
                const y = ((90 - node.latitude) / 180) * 500;
                
                return (
                  <g key={node.id}>
                    {/* Outer pulse effect */}
                    <circle 
                      cx={x} 
                      cy={y} 
                      r="15" 
                      fill="none" 
                      stroke={getStatusColor(node.status)} 
                      strokeWidth="1.5" 
                      opacity="0.3"
                    >
                      <animate attributeName="r" from="15" to="25" dur="3s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.3" to="0" dur="3s" repeatCount="indefinite" />
                    </circle>
                    
                    {/* Status indicator */}
                    <circle 
                      cx={x} 
                      cy={y} 
                      r="8" 
                      fill={getStatusColor(node.status)} 
                      opacity="0.8"
                      filter="url(#glow)"
                    >
                      <animate attributeName="opacity" from="0.8" to="0.4" dur="2s" repeatCount="indefinite" />
                    </circle>
                    
                    {/* Center point */}
                    <circle cx={x} cy={y} r="4" fill="white" />
                    
                    {/* Node label */}
                    <text 
                      x={x} 
                      y={y + 25} 
                      textAnchor="middle" 
                      fontSize="12" 
                      fill={isDarkMode ? "white" : "#333"}
                      className="text-xs font-medium"
                    >
                      {node.name}
                    </text>
                  </g>
                );
              })}
            </svg>
            
            {/* Overlay for glow effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-slate-900/30 z-20"></div>
          </div>
          
          {/* Legend */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 to-transparent z-30">
            <div className="flex items-center text-white gap-2">
              <GlobeIcon className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium">Servidores optimizados en {Array.isArray(nodes) ? nodes.length : 0} regiones globales</p>
            </div>
            
            {/* Status legend */}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <Circle className="h-3 w-3 fill-green-400 text-green-400" />
                <span className="text-xs text-gray-300">Online</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Circle className="h-3 w-3 fill-red-400 text-red-400" />
                <span className="text-xs text-gray-300">Offline</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Circle className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-300">Mantenimiento</span>
              </div>
            </div>
          </div>
          
          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-40">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-white font-medium">Cargando datos de los servidores...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GlobalMap;
