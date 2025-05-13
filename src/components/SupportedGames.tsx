
import React, { useState, useEffect } from "react";
import { publicApi } from "@/lib/api";

interface Game {
  name: string;
  logo: string;
  description: string;
}

const SupportedGames: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesData = await publicApi.getGames();
        // Ensure gamesData is an array before setting it
        if (Array.isArray(gamesData)) {
          setGames(gamesData);
        } else {
          console.error("API returned non-array games data:", gamesData);
          // Fallback to static games if API returns non-array
          setGames([
            {
              name: "Minecraft",
              logo: "https://cdn.freebiesupply.com/logos/large/2x/minecraft-1-logo-svg-vector.svg",
              description: "Java y Bedrock"
            },
            {
              name: "Garry's Mod",
              logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Garry%27s_Mod_logo.svg/2048px-Garry%27s_Mod_logo.svg.png",
              description: "Servidores rápidos y eficientes"
            },
            {
              name: "Counter-Strike 2",
              logo: "https://cdn2.steamgriddb.com/icon/e1bd06c3f8089e7552aa0552cb387c92/32/512x512.png",
              description: "Para comunidades y equipos"
            },
            {
              name: "Team Fortress 2",
              logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Team_Fortress_2_style_logo.svg/1200px-Team_Fortress_2_style_logo.svg.png",
              description: "Servidores personalizables"
            },
            {
              name: "ARK: Survival Evolved",
              logo: "https://upload.wikimedia.org/wikipedia/fr/7/7d/Ark_Survival_Evolved_Logo.png",
              description: "Alto rendimiento garantizado"
            }
          ]);
        }
      } catch (error) {
        console.error("Error loading games:", error);
        // Fallback to static games if API fails
        setGames([
          {
            name: "Minecraft",
            logo: "https://cdn.freebiesupply.com/logos/large/2x/minecraft-1-logo-svg-vector.svg",
            description: "Java y Bedrock"
          },
          {
            name: "Garry's Mod",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Garry%27s_Mod_logo.svg/2048px-Garry%27s_Mod_logo.svg.png",
            description: "Servidores rápidos y eficientes"
          },
          {
            name: "Counter-Strike 2",
            logo: "https://cdn2.steamgriddb.com/icon/e1bd06c3f8089e7552aa0552cb387c92/32/512x512.png",
            description: "Para comunidades y equipos"
          },
          {
            name: "Team Fortress 2",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Team_Fortress_2_style_logo.svg/1200px-Team_Fortress_2_style_logo.svg.png",
            description: "Servidores personalizables"
          },
          {
            name: "ARK: Survival Evolved",
            logo: "https://upload.wikimedia.org/wikipedia/fr/7/7d/Ark_Survival_Evolved_Logo.png",
            description: "Alto rendimiento garantizado"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-muted/30 dark:bg-muted/10">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Juegos Soportados</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Cargando juegos soportados...
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex flex-col items-center rounded-lg border bg-card dark:bg-card/50 p-6 text-center transition-all hover:shadow-lg animate-pulse">
                <div className="mb-4 h-16 w-16 rounded-full bg-muted"></div>
                <div className="mb-1 h-4 w-3/4 rounded bg-muted"></div>
                <div className="h-3 w-1/2 rounded bg-muted"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 bg-muted/30 dark:bg-muted/10">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Juegos Soportados</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Hosting optimizado para los juegos más populares con configuraciones personalizadas
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
          {games.map((game, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center rounded-lg border bg-card dark:bg-card/50 p-6 text-center transition-all hover:shadow-lg overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-zenoscale-purple/20 to-zenoscale-blue/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="mb-4 h-16 w-16 flex items-center justify-center bg-muted/50 dark:bg-muted/20 rounded-full p-2 overflow-hidden">
                  <img src={game.logo} alt={game.name} className="h-full w-full object-contain" />
                </div>
                <h3 className="mb-1 font-semibold">{game.name}</h3>
                <p className="text-xs text-muted-foreground">{game.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportedGames;
