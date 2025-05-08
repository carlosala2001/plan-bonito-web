
import React from "react";
import { Server, Shield, Cpu, Zap, Gamepad2, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const features = [
  {
    icon: <Gamepad2 className="h-6 w-6 text-primary" />,
    title: "Hosting para videojuegos",
    description: "Minecraft, Garry's Mod, Counter-Strike 2, Team Fortress 2, ARK y más juegos optimizados para el mejor rendimiento."
  },
  {
    icon: <Cpu className="h-6 w-6 text-primary" />,
    title: "Infraestructura de alto rendimiento",
    description: "Servidores dedicados en Hetzner con virtualización eficiente para máximo rendimiento y escalabilidad."
  },
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: "Automatización con IA",
    description: "Agentes inteligentes que analizan logs, recomiendan mejoras y solucionan problemas automáticamente."
  },
  {
    icon: <Server className="h-6 w-6 text-primary" />,
    title: "Panel de control avanzado",
    description: "Panel Pterodactyl personalizado con acceso completo a todas las funciones que necesitas para gestionar tu servidor."
  },
  {
    icon: <Shield className="h-6 w-6 text-primary" />,
    title: "Seguridad garantizada",
    description: "Uptime 99,9% garantizado, protección DDoS de capa 4/7, backups diarios y cifrado en accesos sensibles."
  },
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: "Soporte experto",
    description: "Atención humana personalizada a través de Discord, email y panel de soporte, con respuesta rápida."
  }
];

const AboutZenoScale: React.FC = () => {
  return (
    <section className="py-16 md:py-24 dark:bg-background" id="about">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Sobre ZenoScale</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Hosting de juegos de alto rendimiento, pensado para gamers, creadores de contenido y comunidades
          </p>
        </div>
        
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 rounded-lg border bg-card dark:bg-card/50 p-6 shadow-sm">
            <h3 className="mb-2 text-xl font-semibold">Nuestra Misión</h3>
            <p className="text-muted-foreground">
              Ofrecer soluciones de hosting potentes, flexibles y accesibles, con atención técnica cercana y herramientas automatizadas que faciliten la gestión de servidores.
            </p>
            
            <Separator className="my-6" />
            
            <h3 className="mb-2 text-xl font-semibold">Nuestra Visión</h3>
            <p className="text-muted-foreground">
              Convertirnos en el proveedor líder de hosting para comunidades de juegos en Europa, combinando tecnología avanzada, atención personalizada y automatización inteligente.
            </p>
          </div>
        </div>
        
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="rounded-lg border bg-card dark:bg-card/50 p-6 transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutZenoScale;
