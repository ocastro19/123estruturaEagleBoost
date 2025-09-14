import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  MousePointer, 
  Globe, 
  Clock, 
  Filter,
  Search,
  Download,
  RefreshCw
} from 'lucide-react';
import { VisitorData, PageView, ClickEvent } from '../../utils/realTimeTracker';

interface LogEntry {
  id: string;
  type: 'page_view' | 'click' | 'visitor';
  timestamp: number;
  visitorId: string;
  data: VisitorData | PageView | ClickEvent;
}

export const Logs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [visitors, setVisitors] = useState<VisitorData[]>([]);

  useEffect(() => {
    loadLogs();
    const interval = setInterval(loadLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const filtered = filterLogs(logs, filterType, searchTerm);
    setFilteredLogs(filtered);
  }, [logs, filterType, searchTerm]);

  const loadLogs = () => {
    const trackingData = (window as any).trackingData;
    if (!trackingData) return;

    const allLogs: LogEntry[] = [];
    
    // Add visitor logs
    trackingData.visitors.forEach(([, visitor]: [string, VisitorData]) => {
      allLogs.push({
        id: `visitor_${visitor.id}`,
        type: 'visitor',
        timestamp: visitor.timestamp,
        visitorId: visitor.id,
        data: visitor
      });
    });

    // Add page view logs
    trackingData.pageViews.forEach((pageView: PageView) => {
      allLogs.push({
        id: `pageview_${pageView.id}`,
        type: 'page_view',
        timestamp: pageView.timestamp,
        visitorId: pageView.visitorId,
        data: pageView
      });
    });

    // Add click logs
    trackingData.clickEvents.forEach((clickEvent: ClickEvent) => {
      allLogs.push({
        id: `click_${clickEvent.id}`,
        type: 'click',
        timestamp: clickEvent.timestamp,
        visitorId: clickEvent.visitorId,
        data: clickEvent
      });
    });

    // Sort by timestamp (newest first)
    allLogs.sort((a, b) => b.timestamp - a.timestamp);
    
    setLogs(allLogs);
    if (trackingData?.visitors) {
      setVisitors(Array.from(new Map(trackingData.visitors).values()) as VisitorData[]);
    }
  };

  const filterLogs = (logs: LogEntry[], filter: string, searchTerm: string) => {
    let filtered = logs;

    // Filter by type
    if (filter !== 'all') {
      filtered = filtered.filter(log => log.type === filter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log => {
        const searchLower = searchTerm.toLowerCase();
        return (
          log.visitorId.toLowerCase().includes(searchLower) ||
          JSON.stringify(log.data).toLowerCase().includes(searchLower)
        );
      });
    }

    return filtered;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'page_view': return <Eye className="w-4 h-4 text-blue-500" />;
      case 'click': return <MousePointer className="w-4 h-4 text-green-500" />;
      case 'visitor': return <Globe className="w-4 h-4 text-purple-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'page_view': return 'bg-blue-900/20 border-blue-700';
      case 'click': return 'bg-green-900/20 border-green-700';
      case 'visitor': return 'bg-purple-900/20 border-purple-700';
      default: return 'bg-slate-800 border-slate-600';
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setFilteredLogs([]);
  };

  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eagleboost_logs_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="space-y-6 text-white bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Registros de Tráfego</h1>
          <p className="text-slate-400">Monitore a atividade do usuário e parâmetros em tempo real</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={loadLogs}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </button>
          <button
            onClick={exportLogs}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-900/30 rounded-lg">
              <Globe className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Total de Visitantes</p>
              <p className="text-2xl font-bold text-white">{visitors.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-900/30 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Visualizações</p>
              <p className="text-2xl font-bold text-white">
                {logs.filter(l => l.type === 'page_view').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-900/30 rounded-lg">
              <MousePointer className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Eventos de Clique</p>
              <p className="text-2xl font-bold text-white">
                {logs.filter(l => l.type === 'click').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Active Now</p>
              <p className="text-2xl font-bold text-white">
                {visitors.filter(v => v.isActive).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar registros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
            >
              <option value="all">All Events</option>
              <option value="visitor">New Visitors</option>
              <option value="page_view">Visualizações</option>
              <option value="click">Click Events</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">
            Registros de Atividade ({filteredLogs.length})
          </h3>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No logs found matching your criteria
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-4 rounded-lg border ${getLogColor(log.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getLogIcon(log.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white capitalize">
                          {log.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-400">
                          {formatTimestamp(log.timestamp)}
                        </span>
                      </div>
                      
                      <div className="text-sm text-slate-300 mb-2">
                        Visitor ID: <code className="bg-slate-700 px-1 rounded">{log.visitorId}</code>
                      </div>
                      
                      <div className="bg-slate-700 rounded p-2 text-xs font-mono text-slate-300 overflow-x-auto">
                        <pre>{JSON.stringify(log.data, null, 2)}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};