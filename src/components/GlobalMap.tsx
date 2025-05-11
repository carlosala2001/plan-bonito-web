
import React from "react";
import { GlobeIcon } from "lucide-react";

const GlobalMap: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-muted/30 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Nuestras Ubicaciones</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            ZenoScale crece y amplía constantemente su lista de ubicaciones, lo que garantiza que podamos atender a usuarios de todo el mundo.
          </p>
        </div>
        
        <div className="mx-auto max-w-5xl relative rounded-lg overflow-hidden shadow-lg">
          <div className="aspect-[16/9] bg-slate-900 relative">
            {/* Mapa estilizado */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 z-0">
              {/* Líneas del mapa */}
              <svg className="w-full h-full opacity-20" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,225 C133,125 266,325 400,225 C533,125 666,325 800,225" stroke="rgba(123,108,246,0.5)" strokeWidth="0.5" fill="none" />
                <path d="M0,200 C133,100 266,300 400,200 C533,100 666,300 800,200" stroke="rgba(123,108,246,0.5)" strokeWidth="0.5" fill="none" />
                <path d="M0,250 C133,150 266,350 400,250 C533,150 666,350 800,250" stroke="rgba(123,108,246,0.5)" strokeWidth="0.5" fill="none" />
                <path d="M0,175 C133,75 266,275 400,175 C533,75 666,275 800,175" stroke="rgba(123,108,246,0.5)" strokeWidth="0.5" fill="none" />
                <path d="M0,275 C133,175 266,375 400,275 C533,175 666,375 800,275" stroke="rgba(123,108,246,0.5)" strokeWidth="0.5" fill="none" />
                <path d="M0,150 C133,50 266,250 400,150 C533,50 666,250 800,150" stroke="rgba(123,108,246,0.5)" strokeWidth="0.5" fill="none" />
                <path d="M0,300 C133,200 266,400 400,300 C533,200 666,400 800,300" stroke="rgba(123,108,246,0.5)" strokeWidth="0.5" fill="none" />
              </svg>
              
              {/* Continentes estilizados */}
              <svg className="w-full h-full absolute inset-0" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
                {/* América */}
                <path d="M150,100 Q170,120 160,140 Q150,160 170,180 Q190,200 180,220 Q170,240 180,260 Q190,280 200,300 Q210,320 220,340" 
                  stroke="#73B9FF" strokeWidth="1.5" fill="none" />
                {/* Europa y África */}
                <path d="M400,100 Q410,120 420,140 Q430,160 420,180 Q410,200 420,220 Q430,240 440,260 Q450,280 460,300" 
                  stroke="#73B9FF" strokeWidth="1.5" fill="none" />
                {/* Asia y Oceanía */}
                <path d="M550,120 Q570,140 580,160 Q590,180 600,200 Q610,220 600,240 Q590,260 600,280 Q610,300 620,320" 
                  stroke="#73B9FF" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
            
            {/* Overlay para el efecto de brillo */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10"></div>
            
            {/* Puntos de ubicación con efecto de pulso */}
            <div className="absolute top-[30%] left-[25%] z-20">
              <div className="h-3 w-3 bg-white rounded-full animate-pulse">
                <div className="h-6 w-6 bg-white/30 rounded-full absolute -top-1.5 -left-1.5 animate-ping opacity-75"></div>
              </div>
            </div>
            <div className="absolute top-[25%] left-[48%] z-20">
              <div className="h-3 w-3 bg-white rounded-full animate-pulse">
                <div className="h-6 w-6 bg-white/30 rounded-full absolute -top-1.5 -left-1.5 animate-ping opacity-75"></div>
              </div>
            </div>
            <div className="absolute top-[30%] left-[73%] z-20">
              <div className="h-3 w-3 bg-white rounded-full animate-pulse">
                <div className="h-6 w-6 bg-white/30 rounded-full absolute -top-1.5 -left-1.5 animate-ping opacity-75"></div>
              </div>
            </div>
            <div className="absolute top-[65%] left-[83%] z-20">
              <div className="h-3 w-3 bg-white rounded-full animate-pulse">
                <div className="h-6 w-6 bg-white/30 rounded-full absolute -top-1.5 -left-1.5 animate-ping opacity-75"></div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 to-transparent z-30">
            <div className="flex items-center text-white gap-2">
              <GlobeIcon className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium">Servidores optimizados en 4 regiones globales</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalMap;
