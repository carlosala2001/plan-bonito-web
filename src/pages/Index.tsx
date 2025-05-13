
import React from "react";
import Navbar from "@/components/Navbar";
import StatisticsSection from "@/components/StatisticsSection";
import PlanCarousel from "@/components/PlanCarousel";
import PlanComparison from "@/components/PlanComparison";
import SupportedGames from "@/components/SupportedGames";
import AboutZenoScale from "@/components/AboutZenoScale";
import PanelPreview from "@/components/PanelPreview";
import GlobalMap from "@/components/GlobalMap";
import NewsletterSubscribe from "@/components/NewsletterSubscribe";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { publicApi } from "@/lib/api";

const Index: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Use the public API to get the plans for the homepage
  const [plans, setPlans] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadPlans = async () => {
      try {
        const plansData = await publicApi.getPlans('hosting');
        // Make sure plansData is an array
        if (Array.isArray(plansData)) {
          setPlans(plansData);
        } else {
          console.error('API did not return an array for plans:', plansData);
          // Set to empty array instead of undefined
          setPlans([]);
        }
      } catch (error) {
        console.error('Error loading plans:', error);
        setPlans([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlans();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-zenoscale-purple/10 to-zenoscale-blue/10 pointer-events-none"></div>
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-zenoscale bg-clip-text text-transparent">Servidores de Juegos</span> <br />
              Rápidos y Económicos
            </h1>
            <p className="text-lg md:text-xl mb-8 text-muted-foreground">
              Hosting de calidad con soporte en español 24/7 y precios sin competencia
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-zenoscale">
                <a href="#plans">Ver Planes</a>
              </Button>
              <Button size="lg" variant="outline" onClick={toggleTheme}>
                Cambiar a modo {theme === "dark" ? "claro" : "oscuro"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <StatisticsSection />

      {/* Plans Section */}
      <section id="plans" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Planes</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Soluciones flexibles para cada tipo de proyecto, con recursos garantizados y precios competitivos
            </p>
          </div>

          <div className="mb-16">
            <PlanCarousel />
          </div>

          {/* Only render PlanComparison if we have plans or if loading is complete */}
          {(!isLoading) && (
            <PlanComparison plans={Array.isArray(plans) ? plans : []} />
          )}
        </div>
      </section>

      {/* Supported Games Section */}
      <SupportedGames />

      {/* Panel Preview Section */}
      <PanelPreview />

      {/* About Section */}
      <AboutZenoScale />

      {/* Global Map Section */}
      <GlobalMap />

      {/* Newsletter Section */}
      <NewsletterSubscribe />

      {/* Footer */}
      <footer className="py-8 bg-muted/30 dark:bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">ZenoScale</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Hosting de calidad con soporte en español 24/7 y precios sin competencia.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/metalscale" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    MetalScale - Servidores Dedicados
                  </a>
                </li>
                <li>
                  <a href="/zenovps" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    ZenoVPS - Servidores Virtuales
                  </a>
                </li>
                <li>
                  <a href="#plans" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Planes de Hosting
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Soporte 24/7
              </p>
              <a href="mailto:info@zenoscale.com" className="text-sm text-primary hover:underline">
                info@zenoscale.com
              </a>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-muted text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ZenoScale. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
