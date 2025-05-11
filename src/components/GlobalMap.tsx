
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
            {/* Fondo del mapa */}
            <div className="absolute inset-0 bg-slate-900 z-0"></div>

            {/* Mapa Mundial con Puntos */}
            <svg className="w-full h-full absolute inset-0" viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
              {/* Rejilla para profundidad */}
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(115, 185, 255, 0.1)" strokeWidth="0.5" />
              </pattern>
              <rect width="1000" height="500" fill="url(#grid)" />

              {/* Continentes estilizados en el color zenoscale blue */}
              <g fill="#73B9FF" opacity="0.3">
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

              {/* Puntos de ubicación */}
              {/* Norteamérica */}
              <circle cx="180" cy="200" r="8" fill="white" className="pulse-circle">
                <animate attributeName="opacity" from="1" to="0.3" dur="2s" repeatCount="indefinite" />
              </circle>
              
              {/* Europa */}
              <circle cx="480" cy="180" r="8" fill="white" className="pulse-circle">
                <animate attributeName="opacity" from="1" to="0.3" dur="2s" repeatCount="indefinite" />
              </circle>
              
              {/* Asia */}
              <circle cx="700" cy="220" r="8" fill="white" className="pulse-circle">
                <animate attributeName="opacity" from="1" to="0.3" dur="2s" repeatCount="indefinite" />
              </circle>
              
              {/* Oceanía */}
              <circle cx="820" cy="400" r="8" fill="white" className="pulse-circle">
                <animate attributeName="opacity" from="1" to="0.3" dur="2s" repeatCount="indefinite" />
              </circle>

              {/* Halos para cada ubicación */}
              <circle cx="180" cy="200" r="12" fill="none" stroke="white" strokeWidth="1" opacity="0.5">
                <animate attributeName="r" from="8" to="20" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.5" to="0" dur="3s" repeatCount="indefinite" />
              </circle>
              
              <circle cx="480" cy="180" r="12" fill="none" stroke="white" strokeWidth="1" opacity="0.5">
                <animate attributeName="r" from="8" to="20" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.5" to="0" dur="3s" repeatCount="indefinite" />
              </circle>
              
              <circle cx="700" cy="220" r="12" fill="none" stroke="white" strokeWidth="1" opacity="0.5">
                <animate attributeName="r" from="8" to="20" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.5" to="0" dur="3s" repeatCount="indefinite" />
              </circle>
              
              <circle cx="820" cy="400" r="12" fill="none" stroke="white" strokeWidth="1" opacity="0.5">
                <animate attributeName="r" from="8" to="20" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.5" to="0" dur="3s" repeatCount="indefinite" />
              </circle>
            </svg>
            
            {/* Overlay para efecto de brillo */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent z-10"></div>
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
