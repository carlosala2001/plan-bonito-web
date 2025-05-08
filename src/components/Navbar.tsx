
import React from "react";
import { ExternalLink, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

const Navbar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2">
            <img src="/lovable-uploads/b8769afe-6011-4dd7-8441-94ca0e5dfa92.png" alt="ZenoScale Logo" className="h-10 w-10" />
            <span className="text-xl font-bold gradient-text">ZenoScale</span>
          </a>
        </div>
        
        <div className="flex items-center gap-4">
          <a 
            href="https://dash.zenoscale.es/"
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm hover:text-primary hover:underline"
          >
            Acceso Plataforma <ExternalLink className="h-3 w-3" />
          </a>
          <a 
            href="https://panel.zenoscale.es/"
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm hover:text-primary hover:underline"
          >
            Panel <ExternalLink className="h-3 w-3" />
          </a>
          <a 
            href="https://status.zenoscale.es/"
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm hover:text-primary hover:underline"
          >
            Status Panel <ExternalLink className="h-3 w-3" />
          </a>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="mr-2"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button 
            className="bg-gradient-zenoscale" 
            size="sm"
            onClick={() => window.open('https://dash.zenoscale.es/', '_blank')}
          >
            Empezar Ahora
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
