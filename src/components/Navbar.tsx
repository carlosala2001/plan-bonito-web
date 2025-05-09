
import React, { useState, useEffect } from "react";
import { ExternalLink, Moon, Sun, Shield, Server, Users, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navbar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <nav className={cn(
      "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
      scrolled ? "shadow-md py-2" : "py-4"
    )}>
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2 group">
            <img 
              src="/lovable-uploads/b8769afe-6011-4dd7-8441-94ca0e5dfa92.png" 
              alt="ZenoScale Logo" 
              className="h-10 w-10 transition-transform group-hover:scale-110" 
            />
            <span className="text-xl font-bold gradient-text">ZenoScale</span>
          </a>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-md hover:bg-muted/50 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-4">
          <a 
            href="https://dash.zenoscale.es/"
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm hover:text-primary hover:underline transition-all group"
          >
            <Server className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
            <span>Acceso Plataforma</span>
            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <a 
            href="https://panel.zenoscale.es/"
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm hover:text-primary hover:underline transition-all group"
          >
            <Activity className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
            <span>Panel</span>
            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <a 
            href="https://status.zenoscale.es/"
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm hover:text-primary hover:underline transition-all group"
          >
            <Users className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
            <span>Status Panel</span>
            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <a 
            href="https://metalpanel.zenoscale.es/"
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm hover:text-primary hover:underline transition-all group"
          >
            <Server className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
            <span>MetalScale</span>
            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <Link 
            to="/admin/login"
            className="flex items-center gap-1 text-sm hover:text-primary hover:underline transition-all group"
          >
            <Shield className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
            <span>Admin</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="mr-2 transition-transform hover:scale-110"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button 
            className="bg-gradient-zenoscale hover:shadow-lg hover:scale-105 transition-all" 
            size="sm"
            onClick={() => window.open('https://dash.zenoscale.es/', '_blank')}
          >
            Empezar Ahora
          </Button>
        </div>
        
        {/* Mobile menu */}
        <div className={`absolute top-full left-0 right-0 bg-background shadow-lg transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}>
          <div className="container py-4 flex flex-col space-y-4">
            <a 
              href="https://dash.zenoscale.es/"
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 hover:bg-muted/50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Server className="h-4 w-4" />
              <span>Acceso Plataforma</span>
              <ExternalLink className="h-3 w-3 ml-auto" />
            </a>
            <a 
              href="https://panel.zenoscale.es/"
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 hover:bg-muted/50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Activity className="h-4 w-4" />
              <span>Panel</span>
              <ExternalLink className="h-3 w-3 ml-auto" />
            </a>
            <a 
              href="https://status.zenoscale.es/"
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 hover:bg-muted/50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Users className="h-4 w-4" />
              <span>Status Panel</span>
              <ExternalLink className="h-3 w-3 ml-auto" />
            </a>
            <a 
              href="https://metalpanel.zenoscale.es/"
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 hover:bg-muted/50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Server className="h-4 w-4" />
              <span>MetalScale</span>
              <ExternalLink className="h-3 w-3 ml-auto" />
            </a>
            <Link 
              to="/admin/login"
              className="flex items-center gap-2 px-4 py-2 hover:bg-muted/50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Shield className="h-4 w-4" />
              <span>Admin</span>
            </Link>
            <div className="flex items-center justify-between px-4 py-2">
              <span>Tema</span>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
            <Button 
              className="bg-gradient-zenoscale mx-4" 
              onClick={() => {
                window.open('https://dash.zenoscale.es/', '_blank');
                setMobileMenuOpen(false);
              }}
            >
              Empezar Ahora
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
