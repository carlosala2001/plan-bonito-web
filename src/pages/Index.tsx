
import React from "react";
import PlanCarousel from "@/components/PlanCarousel";
import PlanComparison from "@/components/PlanComparison";
import { ChevronDownIcon } from "lucide-react";

const Index = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 animate-fade-in text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Planes <span className="gradient-text">ZenoScale</span> de Alto Rendimiento
            </h1>
            <p className="mb-8 animate-fade-in text-lg text-muted-foreground opacity-0" style={{ animationDelay: "0.2s" }}>
              Descubre nuestra gama de servidores optimizados para satisfacer tus necesidades. Elige el plan perfecto para tu proyecto.
            </p>
            <button 
              onClick={() => scrollToSection('planes')}
              className="animate-fade-in rounded-full bg-gradient-zenoscale px-6 py-3 font-medium text-white opacity-0 shadow-lg transition-all hover:shadow-xl hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              style={{ animationDelay: "0.4s" }}
            >
              Ver Planes <ChevronDownIcon className="ml-2 inline-block h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Plans Carousel Section */}
      <section id="planes" className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Nuestros Planes</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Explora nuestras opciones y encuentra el plan que mejor se adapte a tus necesidades
            </p>
          </div>
          <PlanCarousel />
        </div>
      </section>

      {/* Comparison Table */}
      <section id="comparativa" className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Comparativa de Planes</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Compara las especificaciones y características de todos nuestros planes para tomar la mejor decisión
            </p>
          </div>
          <div className="gradient-border p-6">
            <PlanComparison />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 ZenoScale. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
