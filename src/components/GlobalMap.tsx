
import React, { useState, useEffect } from "react";
import { GlobeIcon, Circle } from "lucide-react";

interface Node {
  id: number;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  status: string;
}

const GlobalMap: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([
    { id: 1, name: "North America", location: "New York", latitude: 40.7128, longitude: -74.0060, status: "online" },
    { id: 2, name: "Europe", location: "Frankfurt", latitude: 50.1109, longitude: 8.6821, status: "online" },
    { id: 3, name: "Asia", location: "Singapore", latitude: 1.3521, longitude: 103.8198, status: "online" },
    { id: 4, name: "Oceania", location: "Sydney", latitude: -33.8688, longitude: 151.2093, status: "online" },
  ]);

  // For production, this would fetch real data from HetrixTools API
  useEffect(() => {
    // This would be replaced with an actual API call in production
    // const fetchNodeStatus = async () => {
    //   try {
    //     const response = await fetch('/api/admin/nodes/status');
    //     const data = await response.json();
    //     setNodes(data);
    //   } catch (error) {
    //     console.error('Error fetching node status:', error);
    //   }
    // };
    // 
    // fetchNodeStatus();
    // const interval = setInterval(fetchNodeStatus, 60000);
    // return () => clearInterval(interval);
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
          <h2 className="mb-4 text-3xl font-bold md:text-4xl bg-clip-text text-transparent bg-gradient-zenoscale">Nuestras Ubicaciones</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            ZenoScale crece y amplía constantemente su lista de ubicaciones, lo que garantiza que podamos atender a usuarios de todo el mundo con la mejor experiencia posible.
          </p>
        </div>
        
        <div className="mx-auto max-w-5xl relative rounded-lg overflow-hidden shadow-lg">
          <div className="aspect-[16/9] bg-slate-900 relative">
            {/* Fondo del mapa con efecto de profundidad */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-0"></div>

            {/* Grid lines */}
            <div className="absolute inset-0 z-0">
              <svg className="w-full h-full" viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
                <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(115, 185, 255, 0.05)" strokeWidth="0.5"/>
                </pattern>
                <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                  <rect width="100" height="100" fill="url(#smallGrid)"/>
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(115, 185, 255, 0.1)" strokeWidth="1"/>
                </pattern>
                <rect width="1000" height="500" fill="url(#grid)" />
              </svg>
            </div>

            {/* Mapa Mundial con Continentes */}
            <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
              {/* Continentes con gradiente */}
              <defs>
                <linearGradient id="continentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#73B9FF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#9b87f5" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              <g fill="url(#continentGradient)">
                {/* América del Norte */}
                <path d="M 150 80 C 180 70, 220 100, 210 150 C 200 200, 150 220, 130 250 C 110 280, 100 320, 120 350 L 200 350 L 230 270 L 280 230 L 250 150 L 220 120 L 190 100 Z" />
                
                {/* América del Sur */}
                <path d="M 200 350 C 220 380, 250 400, 260 440 L 280 460 L 300 440 L 310 400 L 290 370 L 270 350 L 230 340 Z" />
                
                {/* Europa */}
                <path d="M 420 100 C 450 90, 480 110, 490 140 C 500 170, 480 200, 460 220 C 440 240, 430 260, 450 280 L 480 290 L 500 270 L 520 250 L 540 230 L 530 200 L 510 170 L 500 150 L 480 120 Z" />
                
                {/* África */}
                <path d="M 450 280 C 470 290, 490 310, 500 340 C 510 370, 520 400, 510 430 L 490 450 L 470 430 L 450 410 L 430 390 L 420 360 L 410 330 L 430 300 Z" />
                
                {/* Asia */}
                <path d="M 540 100 C 570 90, 600 100, 630 120 C 660 140, 690 160, 720 190 C 750 220, 780 250, 770 290 C 760 330, 730 350, 700 330 C 670 310, 650 280, 620 260 C 590 240, 560 220, 540 200 L 520 180 L 510 150 Z" />
                
                {/* Oceanía */}
                <path d="M 750 320 C 780 310, 810 330, 840 350 C 870 370, 890 400, 880 430 L 850 450 L 820 440 L 790 420 L 770 390 L 760 360 Z" />
              </g>

              {/* Puntos de ubicación con estados */}
              {nodes.map((node, index) => {
                // Convert lat/long to SVG coordinates (simple projection)
                const x = ((node.longitude + 180) / 360) * 1000;
                const y = ((90 - node.latitude) / 180) * 500;
                
                return (
                  <g key={node.id}>
                    {/* Halo exterior pulsante */}
                    <circle cx={x} cy={y} r="15" fill="none" stroke={getStatusColor(node.status)} strokeWidth="1.5" opacity="0.3">
                      <animate attributeName="r" from="15" to="25" dur="3s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.3" to="0" dur="3s" repeatCount="indefinite" />
                    </circle>
                    
                    {/* Círculo de estado */}
                    <circle cx={x} cy={y} r="8" fill={getStatusColor(node.status)} opacity="0.8">
                      <animate attributeName="opacity" from="0.8" to="0.4" dur="2s" repeatCount="indefinite" />
                    </circle>
                    
                    {/* Punto central */}
                    <circle cx={x} cy={y} r="4" fill="white" />
                  </g>
                );
              })}

              {/* Líneas de conexión entre nodos */}
              {nodes.map((node, i) => {
                const x1 = ((node.longitude + 180) / 360) * 1000;
                const y1 = ((90 - node.latitude) / 180) * 500;
                
                return nodes.slice(i + 1).map(targetNode => {
                  const x2 = ((targetNode.longitude + 180) / 360) * 1000;
                  const y2 = ((90 - targetNode.latitude) / 180) * 500;
                  
                  return (
                    <path
                      key={`${node.id}-${targetNode.id}`}
                      d={`M ${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.min(y1, y2) - 50} ${x2} ${y2}`}
                      fill="none"
                      stroke="rgba(155, 135, 245, 0.3)"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                    >
                      <animate attributeName="stroke-dashoffset" from="0" to="20" dur="3s" repeatCount="indefinite" />
                    </path>
                  );
                });
              })}
            </svg>
            
            {/* Overlay para efecto de brillo */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-slate-900/30 z-20"></div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 to-transparent z-30">
            <div className="flex items-center text-white gap-2">
              <GlobeIcon className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium">Servidores optimizados en 4 regiones globales</p>
            </div>
            
            {/* Leyenda de estados */}
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
        </div>
      </div>
    </section>
  );
};

export default GlobalMap;
