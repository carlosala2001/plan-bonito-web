
import React, { useState, useEffect } from "react";
import { publicApi } from "@/lib/api";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface Game {
  id: number;
  name: string;
  image_url: string;
  description?: string;
}

const SupportedGames: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const result = await publicApi.getGames();
        // Ensure we're setting an array
        if (Array.isArray(result)) {
          setGames(result);
        } else {
          console.error('API returned non-array games data:', result);
          setGames([]);
        }
      } catch (error) {
        console.error('Error fetching games:', error);
        setGames([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Prepare games array for rendering, ensuring it's an array
  const gamesData = Array.isArray(games) ? games : [];

  return (
    <section id="games" className="py-16 md:py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Juegos Soportados</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ofrecemos soporte para una amplia variedad de juegos, con configuraciones optimizadas y asistencia personalizada
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-muted rounded-lg p-4 animate-pulse">
                <div className="relative w-full">
                  <div className="aspect-square bg-gray-300 rounded-md"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded mt-4 w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : gamesData.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gamesData.map((game) => (
              <div key={game.id} className="bg-card hover:bg-accent rounded-lg p-4 transition-colors group">
                <div className="relative w-full">
                  <AspectRatio ratio={1 / 1} className="bg-muted rounded-md overflow-hidden">
                    <img
                      src={game.image_url}
                      alt={game.name}
                      className="object-cover w-full h-full transition-transform group-hover:scale-105"
                    />
                  </AspectRatio>
                </div>
                <div className="text-center mt-3">
                  <h3 className="font-medium">{game.name}</h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-card rounded-lg">
            <p>No hay juegos disponibles en este momento.</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-6">
            ¿No encuentras tu juego favorito? ¡Contáctanos y lo agregaremos a nuestra lista de servidores soportados!
          </p>
        </div>
      </div>
    </section>
  );
};

export default SupportedGames;
