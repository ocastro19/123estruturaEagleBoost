import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MousePointer, 
  TrendingUp, 
  Eye,
  Clock,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { realTimeTracker, VisitorData } from '../../utils/realTimeTracker';

interface MetricCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
}

// Dados reais serão calculados dinamicamente

export const Dashboard: React.FC = () => {
  const [realVisitors, setRealVisitors] = useState<VisitorData[]>([]);
  const [todayStats, setTodayStats] = useState({
    totalVisitors: 0,
    totalPageViews: 0,
    totalClicks: 0
  });
  const [liveVisitors, setLiveVisitors] = useState(0);

  // Load real data
  useEffect(() => {
    const updateRealData = () => {
      const activeVisitors = realTimeTracker.getActiveVisitors();
      const stats = realTimeTracker.getTodayStats();
      
      setRealVisitors(activeVisitors);
      setTodayStats(stats);
      setLiveVisitors(activeVisitors.length);
    };

    // Update immediately
    updateRealData();

    // Update every 5 seconds
    const interval = setInterval(updateRealData, 5000);
    return () => clearInterval(interval);
  }, []);

  const [metrics, setMetrics] = useState<MetricCard[]>([
    {
      title: 'Total Visitors',
      value: todayStats.totalVisitors.toString(),
      change: '',
      changeType: 'neutral',
      icon: Users
    },
    {
      title: 'Page Views',
      value: todayStats.totalPageViews.toString(),
      change: '',
      changeType: 'neutral',
      icon: Eye
    },
    {
      title: 'Total Clicks',
      value: todayStats.totalClicks.toString(),
      change: '',
      changeType: 'neutral',
      icon: MousePointer
    },
    {
      title: 'Active Now',
      value: liveVisitors.toString(),
      change: 'Live',
      changeType: 'positive',
      icon: Clock
    }
  ]);

  // Update metrics when stats change
  useEffect(() => {
    setMetrics([
      {
        title: 'Total Visitors',
        value: todayStats.totalVisitors.toString(),
        change: '',
        changeType: 'neutral',
        icon: Users
      },
      {
        title: 'Page Views',
        value: todayStats.totalPageViews.toString(),
        change: '',
        changeType: 'neutral',
        icon: Eye
      },
      {
        title: 'Total Clicks',
        value: todayStats.totalClicks.toString(),
        change: '',
        changeType: 'neutral',
        icon: MousePointer
      },
      {
        title: 'Active Now',
        value: liveVisitors.toString(),
        change: 'Live',
        changeType: 'positive',
        icon: Clock
      }
    ]);
  }, [todayStats, liveVisitors]);

  return (
    <div className="space-y-8 text-white bg-slate-900 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Painel</h1>
        <p className="text-slate-400">Monitore o desempenho da sua campanha EAGLEBOOST</p>
      </div>

      {/* Live Visitors */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white border border-blue-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Visitantes ao Vivo</h2>
            <p className="text-3xl font-bold">{liveVisitors}</p>
          </div>
          <div className="relative">
            <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-4 h-4 bg-white rounded-full animate-ping"></div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">{metric.title}</p>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <p className={`text-sm ${
                  metric.changeType === 'positive' ? 'text-green-600' : 
                  metric.changeType === 'negative' ? 'text-red-600' : 'text-slate-400'
                }`}>
                  {metric.change} desde ontem
                </p>
              </div>
              <div className="p-3 bg-blue-900/30 rounded-lg">
                <metric.icon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Traffic Chart */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Visão Geral do Tráfego</h3>
          <div className="flex items-center justify-center h-[300px]">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">Dados de Tráfego Real</p>
              <p className="text-slate-500 text-sm mt-2">Os gráficos aparecerão quando houver visitantes suficientes</p>
            </div>
          </div>
        </div>

        {/* Device Distribution */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Distribuição por Dispositivo</h3>
          <div className="flex items-center justify-center h-[300px]">
            <div className="text-center">
              <div className="flex justify-center gap-4 mb-4">
                <Smartphone className="w-8 h-8 text-slate-500" />
                <Monitor className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-slate-400 text-lg">Dados de Dispositivos Reais</p>
              <p className="text-slate-500 text-sm mt-2">A distribuição será calculada com base nos visitantes reais</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Atividade Recente</h3>
        <div className="space-y-4">
          {[
            { action: 'Novo visitante do Brasil', time: 'há 2 minutos', type: 'success' },
            { action: 'Clique em botão rastreado', time: 'há 15 minutos', type: 'info' },
            { action: 'Facebook Pixel disparado', time: 'há 23 minutos', type: 'neutral' },
            { action: 'Novo visitante do Google', time: 'há 1 hora', type: 'neutral' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-700">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'success' ? 'bg-green-500' :
                activity.type === 'info' ? 'bg-blue-500' : 'bg-slate-400'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{activity.action}</p>
                <p className="text-xs text-slate-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};