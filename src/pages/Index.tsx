
import React from "react";
import PlanCarousel from "@/components/PlanCarousel";
import PlanComparison from "@/components/PlanComparison";
import AboutZenoScale from "@/components/AboutZenoScale";
import SupportedGames from "@/components/SupportedGames";
import Navbar from "@/components/Navbar";
import { ChevronDownIcon, RocketIcon, ServerIcon, ShieldIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const Index = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Ensure the component is properly mounted
  React.useEffect(() => {
    console.log("Index component mounted");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <img 
                src="/lovable-uploads/b8769afe-6011-4dd7-8441-94ca0e5dfa92.png" 
                alt="ZenoScale Logo" 
                className="h-24 w-24" 
              />
            </div>
            <h1 className="mb-6 animate-fade-in text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Packs <span className="gradient-text">ZenoScale</span> de Alto Rendimiento
            </h1>
            <p className="mb-8 animate-fade-in text-lg text-muted-foreground opacity-0" style={{ animationDelay: "0.2s" }}>
              Hosting especializado en videojuegos con tecnología propia de automatización con IA, escalabilidad total y atención humana con mentalidad gamer.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 justify-center">
              <Button 
                onClick={() => scrollToSection('planes')}
                className="animate-fade-in rounded-full bg-gradient-zenoscale px-6 py-3 font-medium text-white opacity-0 shadow-lg transition-all hover:shadow-xl hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                style={{ animationDelay: "0.4s" }}
              >
                Ver Packs <ChevronDownIcon className="ml-2 inline-block h-5 w-5" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('https://panel.zenoscale.es/', '_blank')}
                className="animate-fade-in rounded-full px-6 py-3 font-medium opacity-0 shadow-sm transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                style={{ animationDelay: "0.6s" }}
              >
                Acceder al Panel
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-12 bg-muted/30 dark:bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card dark:bg-card/50 hover:shadow-md transition-all">
              <div className="mb-4 bg-primary/10 dark:bg-primary/20 p-3 rounded-full">
                <RocketIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Alto Rendimiento</h3>
              <p className="text-muted-foreground">Servidores dedicados optimizados para juegos con virtualización eficiente</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card dark:bg-card/50 hover:shadow-md transition-all">
              <div className="mb-4 bg-primary/10 dark:bg-primary/20 p-3 rounded-full">
                <ServerIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Escalabilidad Total</h3>
              <p className="text-muted-foreground">Flexibilidad para aumentar recursos según tus necesidades sin complicaciones</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card dark:bg-card/50 hover:shadow-md transition-all">
              <div className="mb-4 bg-primary/10 dark:bg-primary/20 p-3 rounded-full">
                <ShieldIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Seguridad Garantizada</h3>
              <p className="text-muted-foreground">Protección DDoS, backups diarios y 99.9% de uptime garantizado</p>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Carousel Section */}
      <section id="planes" className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Nuestros Packs</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Explora nuestras opciones y encuentra el pack que mejor se adapte a tus necesidades
            </p>
          </div>
          <PlanCarousel />
        </div>
      </section>
      
      {/* Supported Games Section */}
      <SupportedGames />

      {/* About ZenoScale Section */}
      <AboutZenoScale />

      {/* Comparison Table */}
      <section id="comparativa" className="py-12 md:py-16 bg-muted/30 dark:bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Comparativa de Packs</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Compara las especificaciones y características de todos nuestros packs para tomar la mejor decisión
            </p>
          </div>
          <div className="gradient-border p-6">
            <PlanComparison />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">Empieza a jugar hoy mismo</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Configura tu servidor en minutos y disfruta de la mejor experiencia de juego con ZenoScale
            </p>
            <Button 
              className="rounded-full bg-gradient-zenoscale px-8 py-6 text-lg font-medium text-white shadow-lg transition-all hover:shadow-xl hover:brightness-105"
              onClick={() => window.open('https://dash.zenoscale.es/', '_blank')}
            >
              Crear mi servidor ahora
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/20 dark:bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src="/lovable-uploads/b8769afe-6011-4dd7-8441-94ca0e5dfa92.png" alt="ZenoScale Logo" className="h-10 w-10 mr-2" />
              <span className="font-bold">ZenoScale</span>
            </div>
            
            <div className="flex gap-6">
              <a href="https://dash.zenoscale.es/" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary">
                Plataforma
              </a>
              <a href="https://panel.zenoscale.es/" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary">
                Panel
              </a>
              <a href="https://status.zenoscale.es/" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary">
                Status
              </a>
            </div>
            
            <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
              © 2025 ZenoScale. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
