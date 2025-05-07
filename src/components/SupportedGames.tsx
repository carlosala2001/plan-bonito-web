
import React from "react";

const games = [
  {
    name: "Minecraft",
    logo: "https://static-00.iconduck.com/assets.00/minecraft-icon-512x512-8mie91i2.png",
    description: "Java y Bedrock"
  },
  {
    name: "Garry's Mod",
    logo: "https://cdn2.steamgriddb.com/file/sgdb-cdn/icon/d61cee79700e992d33bd2ea1bff3c8d5.png",
    description: "Servidores rápidos y eficientes"
  },
  {
    name: "Counter-Strike 2",
    logo: "https://cdn.freebiesupply.com/logos/large/2x/counter-strike-global-offensive-logo-png-transparent.png",
    description: "Para comunidades y equipos"
  },
  {
    name: "Team Fortress 2",
    logo: "https://cdn2.steamgriddb.com/file/sgdb-cdn/icon/7dcf45d53e0cc16b42866341f3ae1f9f.png",
    description: "Servidores personalizables"
  },
  {
    name: "ARK: Survival Evolved",
    logo: "https://cdn2.steamgriddb.com/file/sgdb-cdn/icon/a24bb14c5c8cff28c2a34a6c81f7d1b7.png",
    description: "Alto rendimiento garantizado"
  }
];

const SupportedGames: React.FC = () => {
  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Juegos Soportados</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Hosting optimizado para los juegos más populares con configuraciones personalizadas
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
          {games.map((game, index) => (
            <div key={index} className="flex flex-col items-center rounded-lg border bg-card p-6 text-center transition-all hover:shadow-md">
              <img src={game.logo} alt={game.name} className="mb-4 h-16 w-16 object-contain" />
              <h3 className="mb-1 font-semibold">{game.name}</h3>
              <p className="text-xs text-muted-foreground">{game.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportedGames;
