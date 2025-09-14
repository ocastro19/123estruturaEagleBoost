import React, { useState, useEffect } from 'react';
import { Globe, MapPin, Clock, Eye, MousePointer, Users } from 'lucide-react';
import { realTimeTracker, VisitorData } from '../../utils/realTimeTracker';

const getDeviceType = (userAgent: string): string => {
  if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
    if (/iPad/.test(userAgent)) return 'iPad';
    if (/iPhone/.test(userAgent)) return 'iPhone';
    if (/Android/.test(userAgent)) return 'Android';
    return 'Mobile';
  }
  return 'Desktop';
};

const getBrowser = (userAgent: string): string => {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'Unknown';
};

const formatTimeOnSite = (timestamp: number): string => {
  const timeOnSite = Date.now() - timestamp;
  const minutes = Math.floor(timeOnSite / 60000);
  const seconds = Math.floor((timeOnSite % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const LiveTraffic: React.FC = () => {
  const [visitors, setVisitors] = useState<VisitorData[]>([]);
  const [todayStats, setTodayStats] = useState({
    totalVisitors: 0,
    totalPageViews: 0,
    totalClicks: 0
  });

  // Load real data
  useEffect(() => {
    const updateRealData = () => {
      const activeVisitors = realTimeTracker.getActiveVisitors();
      const stats = realTimeTracker.getTodayStats();
      
      setVisitors(activeVisitors);
      setTodayStats(stats);
    };

    // Update immediately
    updateRealData();

    // Update every 5 seconds
    const interval = setInterval(updateRealData, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeVisitors = visitors.filter(v => v.isActive).length;

  return (
    <div className="space-y-8 text-white bg-slate-900 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Tráfego ao Vivo</h1>
        <p className="text-slate-400">Monitore a atividade dos visitantes em tempo real</p>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-900/30 rounded-lg">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Ativos Agora</p>
              <p className="text-2xl font-bold text-white">{activeVisitors}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-900/30 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Total Hoje</p>
              <p className="text-2xl font-bold text-white">{todayStats.totalVisitors}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-900/30 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Visualizações</p>
              <p className="text-2xl font-bold text-white">{todayStats.totalPageViews}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Visitors Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">Visitantes Ativos</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Localização
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Dispositivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Página Atual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Tempo no Site
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Origem
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
              {visitors.map((visitor) => (
                <tr key={visitor.id} className="hover:bg-slate-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        visitor.isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-400'
                      }`}></div>
                      <span className="ml-2 text-sm text-slate-300">
                        {visitor.isActive ? 'Active' : 'Idle'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-slate-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-white">{visitor.country || 'Unknown'}</div>
                        <div className="text-sm text-slate-400">{visitor.city || 'Unknown'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{getDeviceType(visitor.userAgent)}</div>
                    <div className="text-sm text-slate-400">{getBrowser(visitor.userAgent)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{visitor.currentPage}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-slate-400 mr-2" />
                      <span className="text-sm text-white">{formatTimeOnSite(visitor.timestamp)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">
                      {visitor.utmParams.utm_source || 'Direct'}
                    </div>
                    {visitor.utmParams.utm_campaign && (
                      <div className="text-sm text-slate-400">{visitor.utmParams.utm_campaign}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Atividade em Tempo Real</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {visitors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400">Nenhuma atividade recente</p>
              <p className="text-xs text-slate-500 mt-1">Os dados aparecerão quando houver visitantes reais</p>
            </div>
          ) : (
            visitors.slice(0, 10).map((visitor) => {
              const timeAgo = Math.floor((Date.now() - visitor.lastActivity) / 1000);
              const timeText = timeAgo < 60 ? 'Agora mesmo' : 
                              timeAgo < 3600 ? `${Math.floor(timeAgo / 60)} min atrás` :
                              `${Math.floor(timeAgo / 3600)}h atrás`;
              
              return (
                <div key={visitor.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-700">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    visitor.isActive ? 'bg-green-500' : 'bg-slate-400'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-white">
                      {`Visitante de ${visitor.city || 'Localização desconhecida'}${visitor.country ? `, ${visitor.country}` : ''}`}
                    </p>
                    <p className="text-xs text-slate-400">{timeText}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};