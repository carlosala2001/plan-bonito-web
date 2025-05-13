
import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import { 
  LayoutDashboard, 
  LogOut, 
  User, 
  Globe, 
  Server, 
  Settings, 
  Mail, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/ThemeProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  hasSubItems?: boolean;
  expanded?: boolean;
  onClick?: () => void;
  className?: string;
}

const NavItem: React.FC<NavItemProps> = ({ 
  to, 
  icon, 
  label, 
  active, 
  hasSubItems, 
  expanded, 
  onClick,
  className 
}) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 text-sm transition-all rounded-md",
      active 
        ? "bg-primary/10 text-primary font-medium" 
        : "hover:bg-primary/5",
      className
    )}
  >
    <span className="text-lg">{icon}</span>
    <span className="flex-1">{label}</span>
    {hasSubItems && (
      expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />
    )}
  </Link>
);

const AdminLayout: React.FC = () => {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-muted/20">
      {/* Mobile header */}
      <div className="sm:hidden flex items-center justify-between p-4 bg-background border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        >
          <Menu size={20} />
        </Button>
        <h2 className="text-lg font-semibold">ZenoScale Admin</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.username}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={toggleTheme}>
              {theme === "dark" ? "Modo Claro" : "Modo Oscuro"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-red-500">
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 sm:hidden z-40"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 w-64 bg-background border-r shadow-sm z-50 transition-transform duration-300 ease-in-out transform",
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0",
        !sidebarOpen && "sm:w-20"
      )}>
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="p-4 flex items-center justify-between">
            {sidebarOpen ? (
              <h2 className="text-xl font-bold">ZenoScale Admin</h2>
            ) : (
              <div className="mx-auto">
                <span className="text-2xl font-bold">Z</span>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="sm:flex hidden" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <ChevronRight size={20} /> : <ChevronRight size={20} className="rotate-180" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="sm:hidden flex" 
              onClick={() => setMobileSidebarOpen(false)}
            >
              <X size={20} />
            </Button>
          </div>

          <Separator />

          {/* Navigation links */}
          <div className="flex-1 py-4 overflow-y-auto">
            <div className="px-3 space-y-1">
              <NavItem 
                to="/admin" 
                icon={<LayoutDashboard size={20} />} 
                label="Dashboard" 
                active={isActive("/admin")}
                className={!sidebarOpen ? "justify-center px-0" : ""}
              />
              <NavItem 
                to="/admin/hetrixtools" 
                icon={<Globe size={20} />} 
                label="HetrixTools" 
                active={isActive("/admin/hetrixtools")}
                className={!sidebarOpen ? "justify-center px-0" : ""}
              />
            </div>
          </div>

          {/* Sidebar footer */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User size={20} />
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user?.username}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              )}
            </div>
            
            <div className={cn("flex gap-2", !sidebarOpen && "flex-col")}>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleTheme} 
                className={cn("flex-1", !sidebarOpen && "px-0")}
              >
                {sidebarOpen ? (theme === "dark" ? "Modo Claro" : "Modo Oscuro") : "🌓"}
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleLogout} 
                className={cn("flex-1", !sidebarOpen && "px-0")}
              >
                {sidebarOpen ? "Cerrar sesión" : <LogOut size={16} />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={cn(
        "flex-1 overflow-hidden transition-all duration-300 ease-in-out",
        sidebarOpen ? "sm:ml-64" : "sm:ml-20",
      )}>
        <header className="h-16 bg-background border-b flex items-center px-6">
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Panel de Administración</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">Volver al sitio</Link>
            </Button>
          </div>
        </header>
        
        <main className="h-[calc(100vh-64px)] overflow-auto">
          <div className="container mx-auto p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
