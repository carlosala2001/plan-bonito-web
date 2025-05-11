
import React from "react";

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
        
        <div className="mx-auto max-w-5xl relative rounded-lg overflow-hidden shadow-lg animate-on-scroll opacity-0 translate-y-8">
          <div className="aspect-[16/9] bg-slate-900 relative">
            <img 
              src="/lovable-uploads/ee4da66e-481d-4a1f-9fa1-8a56254620d6.png" 
              alt="Mapa global de ubicaciones de ZenoScale" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent"></div>
          </div>
          
          {/* Puntos de ubicación con efecto de pulso */}
          <div className="absolute top-[35%] left-[25%]">
            <div className="h-3 w-3 bg-white rounded-full relative z-10">
              <div className="absolute inset-0 bg-white/50 rounded-full animate-pulse-slow"></div>
            </div>
          </div>
          <div className="absolute top-[28%] left-[48%]">
            <div className="h-3 w-3 bg-white rounded-full relative z-10">
              <div className="absolute inset-0 bg-white/50 rounded-full animate-pulse-slow"></div>
            </div>
          </div>
          <div className="absolute top-[36%] left-[73%]">
            <div className="h-3 w-3 bg-white rounded-full relative z-10">
              <div className="absolute inset-0 bg-white/50 rounded-full animate-pulse-slow"></div>
            </div>
          </div>
          <div className="absolute top-[70%] left-[83%]">
            <div className="h-3 w-3 bg-white rounded-full relative z-10">
              <div className="absolute inset-0 bg-white/50 rounded-full animate-pulse-slow"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalMap;
