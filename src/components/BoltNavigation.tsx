import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Home, Users, BarChart3, Settings, Eye, Play } from 'lucide-react';

interface BoltNavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const BoltNavigation: React.FC<BoltNavigationProps> = ({ currentPage, onPageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // GARANTIA: Detecta se está no ambiente Bolt com verificação rigorosa
  const isBoltEnvironment = React.useMemo(() => {
    const hostname = window.location.hostname.toLowerCase();
    const isBolt = hostname.includes('bolt') || 
                   hostname.includes('localhost') ||
                   hostname.includes('webcontainer') ||
                   hostname.includes('local-credentialless') ||
                   hostname.includes('stackblitz') ||
                   hostname.includes('gitpod') ||
                   hostname.includes('127.0.0.1') ||
                   hostname.includes('0.0.0.0');
    
    console.log('🔒 GARANTIA Bolt Button:', {
      hostname: hostname,
      isBoltEnvironment: isBolt,
      willShowButton: isBolt
    });
    
    return isBolt;
  }, []);

  // GARANTIA: Se não estiver no Bolt, não renderiza o menu (verificação dupla)
  if (!isBoltEnvironment) {
    // GARANTIA: Só força mostrar em casos muito específicos
    const forceShow = process.env.NODE_ENV === 'development' || 
                     localStorage.getItem('force_bolt_nav') === 'true' ||
                     window.location.search.includes('bolt_nav=true');
    
    console.log('🔒 GARANTIA: Botão Bolt não será mostrado em produção:', {
      hostname: window.location.hostname,
      forceShow: forceShow,
      nodeEnv: process.env.NODE_ENV
    });
    
    if (!forceShow) {
      return null;
    }
  }

  const pages = [
    { id: 'main', name: 'Main Page', icon: Home, description: 'Página principal da landing page', path: '/' },
    { id: 'admin', name: 'Admin Panel', icon: Settings, description: 'Painel administrativo com analytics', path: '/admin' }
  ];

  const handlePageChange = (page: any) => {
    onPageChange(page.id);
    navigate(page.path);
    setIsOpen(false);
  };
  return (
    <>
      {/* Floating Menu Button */}
      <div className="fixed top-4 right-4 z-[9999]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          title="Bolt Navigation Menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Menu */}
      {isOpen && (
        <div className="fixed top-16 right-4 z-[9998] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden w-80">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
            <h3 className="text-white font-bold text-lg">🚀 Bolt Navigation</h3>
            <p className="text-purple-100 text-sm">Visualize diferentes seções</p>
          </div>

          {/* Menu Items */}
          <div className="max-h-96 overflow-y-auto">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => handlePageChange(page)}
                className={`w-full text-left p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                  currentPage === page.id ? 'bg-purple-50 border-l-4 border-l-purple-600' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    currentPage === page.id ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <page.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold text-sm ${
                      currentPage === page.id ? 'text-purple-700' : 'text-gray-900'
                    }`}>
                      {page.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">{page.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-3 text-center">
            <p className="text-xs text-gray-500">
              Menu visível apenas no ambiente Bolt
            </p>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9997] bg-black/20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};