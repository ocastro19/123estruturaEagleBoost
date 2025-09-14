import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  MousePointer, 
  Settings, 
  Eye, 
  TrendingUp,
  Activity,
  Zap,
  Edit3,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../utils/authService';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navigation = [
    { name: 'Painel', href: '/admin', icon: BarChart3 },
    { name: 'Tráfego ao Vivo', href: '/admin/live', icon: Activity },
    { name: 'Editor de Conteúdo', href: '/admin/content', icon: Edit3 },
    { name: 'Registros', href: '/admin/logs', icon: TrendingUp },
    { name: 'Integrações', href: '/admin/integrations', icon: Zap },
    { name: 'Configurações', href: '/admin/settings', icon: Settings },
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  const isActive = (href: string) => location.pathname === href;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 border-r border-slate-700">
        <div className="flex h-16 items-center justify-center border-b border-slate-700">
          <h1 className="text-xl font-bold text-blue-400">EAGLEBOOST Admin</h1>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              return (
                <li key={item.name}>
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-900/50 text-blue-300 border border-blue-700'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <div className="p-8 min-h-screen bg-slate-900">
          <Outlet />
        </div>
      </div>
    </div>
  );
};