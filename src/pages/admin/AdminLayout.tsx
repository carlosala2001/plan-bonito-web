
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, LogOut, User } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 text-white">
        <div className="p-4">
          <h2 className="text-xl font-bold">ZenoScale Admin</h2>
          <div className="mt-6 flex flex-col gap-2">
            <Link to="/admin">
              <div className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700 rounded">
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </div>
            </Link>
          </div>
        </div>
        <div className="mt-auto p-4 border-t border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <User size={18} />
            <span>{user?.username}</span>
          </div>
          <Button onClick={handleLogout} variant="destructive" size="sm" className="w-full">
            <LogOut size={18} className="mr-2" /> Cerrar sesión
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white border-b p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Panel de administración</h1>
            <Link to="/">
              <Button variant="outline" size="sm">
                Volver al sitio
              </Button>
            </Link>
          </div>
        </header>
        
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
