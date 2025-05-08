
import React from "react";

const games = [
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
    logo: "https://static.wikia.nocookie.net/logopedia/images/4/49/Counter-Strike_2_%28Icon%29.png/revision/latest?cb=20230330015359",
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
];

const SupportedGames: React.FC = () => {
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
            <div key={index} className="flex flex-col items-center rounded-lg border bg-card dark:bg-card/50 p-6 text-center transition-all hover:shadow-md">
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
