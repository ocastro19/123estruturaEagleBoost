import React, { useState } from 'react';
import { 
  Facebook, 
  Chrome, 
  Eye, 
  BarChart3, 
  CheckCircle, 
  XCircle, 
  Settings,
  Copy,
  ExternalLink
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  status: 'connected' | 'disconnected' | 'error';
  pixelId?: string;
  lastSync?: string;
  events?: number;
}

export const Integrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'facebook',
      name: 'Facebook Pixel',
      description: 'Track conversions and optimize Facebook ads',
      icon: Facebook,
      status: 'connected',
      pixelId: '1234567890123456',
      lastSync: '2 minutes ago',
      events: 1247
    },
    {
      id: 'google',
      name: 'Google Analytics',
      description: 'Comprehensive website analytics and tracking',
      icon: Chrome,
      status: 'connected',
      pixelId: 'GA-XXXXXXXXX-X',
      lastSync: '5 minutes ago',
      events: 2156
    },
    {
      id: 'hotjar',
      name: 'Hotjar',
      description: 'Heatmaps and user session recordings',
      icon: Eye,
      status: 'disconnected',
      pixelId: '',
      lastSync: 'Never',
      events: 0
    },
    {
      id: 'utmfy',
      name: 'UTMfy',
      description: 'Advanced UTM tracking and attribution',
      icon: BarChart3,
      status: 'error',
      pixelId: 'utm_12345',
      lastSync: '1 hour ago',
      events: 892
    }
  ]);

  const [showPixelModal, setShowPixelModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowPixelModal(true);
  };

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: 'disconnected' as const, pixelId: '', events: 0 }
        : integration
    ));
  };

  const copyPixelCode = (integration: Integration) => {
    const pixelCode = generatePixelCode(integration);
    navigator.clipboard.writeText(pixelCode);
    // Show toast notification
  };

  const generatePixelCode = (integration: Integration) => {
    switch (integration.id) {
      case 'facebook':
        return `<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${integration.pixelId}');
fbq('track', 'PageView');
</script>`;
      case 'google':
        return `<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${integration.pixelId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${integration.pixelId}');
</script>`;
      case 'hotjar':
        return `<!-- Hotjar Tracking Code -->
<script>
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${integration.pixelId},hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>`;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-8 text-white bg-slate-900 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Integrações</h1>
        <p className="text-slate-400">Gerencie seus pixels de rastreamento e integrações de analytics</p>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <div key={integration.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${
                  integration.status === 'connected' ? 'bg-green-900/30' :
                  integration.status === 'error' ? 'bg-red-900/30' : 'bg-slate-700'
                }`}>
                  <integration.icon className={`w-6 h-6 ${
                    integration.status === 'connected' ? 'text-green-600' :
                    integration.status === 'error' ? 'text-red-600' : 'text-slate-400'
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{integration.name}</h3>
                  <p className="text-sm text-slate-400">{integration.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {integration.status === 'connected' && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {integration.status === 'error' && (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                {integration.status === 'disconnected' && (
                  <div className="w-5 h-5 rounded-full bg-slate-500"></div>
                )}
              </div>
            </div>

            {/* Status Info */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Status:</span>
                <span className={`font-medium ${
                  integration.status === 'connected' ? 'text-green-600' :
                  integration.status === 'error' ? 'text-red-600' : 'text-slate-400'
                }`}>
                  {integration.status === 'connected' ? 'Conectado' :
                   integration.status === 'error' ? 'Erro' : 'Desconectado'}
                </span>
              </div>
              
              {integration.pixelId && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Pixel ID:</span>
                  <span className="font-mono text-white">{integration.pixelId}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Última Sincronização:</span>
                <span className="text-white">{integration.lastSync}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Eventos Hoje:</span>
                <span className="font-semibold text-white">{integration.events}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {integration.status === 'disconnected' ? (
                <button
                  onClick={() => handleConnect(integration)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Conectar
                </button>
              ) : (
                <>
                  <button
                    onClick={() => copyPixelCode(integration)}
                    className="flex-1 bg-slate-700 text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copiar Código
                  </button>
                  <button
                    onClick={() => handleDisconnect(integration.id)}
                    className="px-4 py-2 text-red-400 border border-red-700 rounded-lg hover:bg-red-900/20 transition-colors"
                  >
                    Desconectar
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Integration Guide */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Integration Guide</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-white">Facebook Pixel</h4>
            <p className="text-sm text-slate-400">
              Track conversions, optimize ads, and build custom audiences. Essential for Facebook advertising campaigns.
            </p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-white">Google Analytics</h4>
            <p className="text-sm text-slate-400">
              Comprehensive website analytics including traffic sources, user behavior, and conversion tracking.
            </p>
          </div>
          
          <div className="border-l-4 border-orange-500 pl-4">
            <h4 className="font-semibold text-white">Hotjar</h4>
            <p className="text-sm text-slate-400">
              Understand user behavior with heatmaps, session recordings, and feedback polls.
            </p>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-semibold text-white">UTMfy</h4>
            <p className="text-sm text-slate-400">
              Advanced UTM parameter tracking and attribution modeling for better campaign insights.
            </p>
          </div>
        </div>
      </div>

      {/* Pixel Setup Modal */}
      {showPixelModal && selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              Conectar {selectedIntegration.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Pixel ID
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
                  placeholder="Enter your pixel ID"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPixelModal(false)}
                  className="flex-1 px-4 py-2 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    // Handle connection logic
                    setShowPixelModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Conectar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};