
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Server, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

interface StatisticsData {
  servers: number;
  users: number;
}

const StatisticsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
      }
    });
    
    const statsElement = document.getElementById('statistics-section');
    if (statsElement) observer.observe(statsElement);
    
    return () => {
      if (statsElement) observer.unobserve(statsElement);
    };
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-statistics'],
    queryFn: async () => {
      try {
        const serversResponse = await api.get('/public/servers/count');
        const usersResponse = await api.get('/public/users/count');
        
        return {
          servers: serversResponse.data.count,
          users: usersResponse.data.count
        };
      } catch (error) {
        console.error('Error fetching statistics:', error);
        throw error;
      }
    }
  });

  const animationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2
      }
    })
  };

  return (
    <section id="statistics-section" className="py-16 bg-muted/30 dark:bg-muted/10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in">Nuestra Comunidad ZenoScale</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <div 
            className={cn(
              "p-6 rounded-xl border bg-card text-center transition-all duration-500 transform",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            )}
            style={{ transitionDelay: "0ms" }}
          >
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-primary/10 dark:bg-primary/20">
                <Server className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Servidores Activos</h3>
            {isLoading ? (
              <div className="w-16 h-12 bg-muted/50 animate-pulse rounded-md mx-auto"></div>
            ) : error ? (
              <p className="text-4xl font-bold text-destructive">Error</p>
            ) : (
              <p className="text-4xl font-bold text-primary">{data?.servers || 0}</p>
            )}
            <p className="mt-2 text-muted-foreground">Servidores de juegos configurados</p>
          </div>
          
          <div 
            className={cn(
              "p-6 rounded-xl border bg-card text-center transition-all duration-500 transform",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            )}
            style={{ transitionDelay: "100ms" }}
          >
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-primary/10 dark:bg-primary/20">
                <Users className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Usuarios Registrados</h3>
            {isLoading ? (
              <div className="w-16 h-12 bg-muted/50 animate-pulse rounded-md mx-auto"></div>
            ) : error ? (
              <p className="text-4xl font-bold text-destructive">Error</p>
            ) : (
              <p className="text-4xl font-bold text-primary">{data?.users || 0}</p>
            )}
            <p className="mt-2 text-muted-foreground">Clientes satisfechos</p>
          </div>
          
          <div 
            className={cn(
              "p-6 rounded-xl border bg-card text-center transition-all duration-500 md:col-span-2 xl:col-span-1 transform",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            )}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-primary/10 dark:bg-primary/20">
                <ShieldCheck className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Soporte 24/7</h3>
            <p className="text-4xl font-bold text-primary">100%</p>
            <p className="mt-2 text-muted-foreground">Asistencia técnica y atención al cliente</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
