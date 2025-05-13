
import React, { useState, useEffect } from 'react';
import { publicApi } from '@/lib/api';
import PlanComparison from '@/components/PlanComparison';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';

const ZenoVPS: React.FC = () => {
  const [pageData, setPageData] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const { theme } = useTheme();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const pageResponse = await publicApi.getPage('zenovps');
        if (pageResponse) {
          setPageData(pageResponse);
        }
        
        const plansResponse = await publicApi.getPlans('vps');
        if (plansResponse) {
          setPlans(plansResponse);
        }
      } catch (error) {
        console.error('Error loading page data:', error);
      }
    };
    
    loadData();
  }, []);
  
  // If content is JSON, parse it
  const content = pageData?.content ? 
    (typeof pageData.content === 'string' ? JSON.parse(pageData.content) : pageData.content) : 
    { sections: [] };
  
  const renderSection = (section: any, index: number) => {
    switch (section.type) {
      case 'hero':
        return (
          <section key={index} className="relative py-20 md:py-32 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/70' : 'bg-white/70'}`}></div>
              <div className="absolute inset-0 bg-gradient-to-br from-zenoscale-purple/30 to-zenoscale-blue/30"></div>
            </div>
            <div className="container relative z-10">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gradient-zenoscale">
                  {section.title || 'ZenoVPS - Servidores Virtuales'}
                </h1>
                <p className="text-lg md:text-xl mb-8 text-muted-foreground">
                  {section.subtitle || 'Flexibilidad y control para tus proyectos'}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button size="lg" className="bg-gradient-zenoscale" asChild>
                    <a href={section.buttonUrl || '#plans'}>
                      {section.buttonText || 'Ver Planes'}
                    </a>
                  </Button>
                  <Button size="lg" variant="outline">
                    <a href="mailto:info@zenoscale.com">Contactar</a>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        );
      
      case 'features':
        return (
          <section key={index} className="py-16 md:py-24 bg-muted/30 dark:bg-muted/10">
            <div className="container">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {section.title || 'Características'}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {section.subtitle || 'Nuestros servidores VPS ofrecen gran flexibilidad y rendimiento'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(section.features || [
                  {
                    title: 'Recursos Garantizados',
                    description: 'CPU y memoria dedicados para un rendimiento consistente.'
                  },
                  {
                    title: 'Escalabilidad Instantánea',
                    description: 'Aumenta o reduce recursos según tus necesidades.'
                  },
                  {
                    title: 'Panel de Control Intuitivo',
                    description: 'Gestiona tu servidor de forma sencilla con nuestro panel personalizado.'
                  }
                ]).map((feature, i) => (
                  <div key={i} className="p-6 rounded-lg border bg-card shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      
      case 'technologies':
        return (
          <section key={index} className="py-16 md:py-24">
            <div className="container">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {section.title || 'Tecnologías Disponibles'}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {section.subtitle || 'Múltiples sistemas operativos y plantillas preconfiguradas'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                {(section.technologies || [
                  { name: 'Ubuntu', icon: '🐧' },
                  { name: 'CentOS', icon: '🐧' },
                  { name: 'Debian', icon: '🐧' },
                  { name: 'Windows', icon: '🪟' },
                  { name: 'Docker', icon: '🐳' },
                  { name: 'cPanel', icon: '🔧' }
                ]).map((tech, i) => (
                  <div key={i} className="p-4 border rounded-lg text-center bg-card">
                    <div className="text-4xl mb-2">{tech.icon}</div>
                    <h3 className="font-medium">{tech.name}</h3>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Render dynamic sections */}
        {content.sections?.map(renderSection)}
        
        {/* Plans Section */}
        <section id="plans" className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Planes VPS</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Servidores virtuales con recursos garantizados y excelente rendimiento
              </p>
            </div>
            
            {plans.length > 0 ? (
              <PlanComparison plans={plans} />
            ) : (
              <div className="text-center p-8 border rounded-lg bg-muted/10">
                <p className="text-muted-foreground">No hay planes disponibles en este momento. Por favor, contáctanos para más información.</p>
              </div>
            )}
          </div>
        </section>
        
        {/* Contact CTA */}
        <section className="py-16 md:py-20 bg-gradient-zenoscale text-white">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Necesitas una solución personalizada?</h2>
              <p className="mb-8">
                Contáctanos para obtener una cotización personalizada según tus requerimientos específicos.
              </p>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                <a href="mailto:info@zenoscale.com">Contactar Ahora</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-8 bg-muted/30 dark:bg-muted/10">
        <div className="container">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ZenoScale. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ZenoVPS;
