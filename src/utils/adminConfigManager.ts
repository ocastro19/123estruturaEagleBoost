// Sistema de Gerenciamento de Configurações Administrativas Globais
// Garante persistência total das configurações independente de sessão, dispositivo ou usuário

import React from 'react';

export interface AdminConfig {
  // Configurações Gerais
  siteName: string;
  siteUrl: string;
  trackingEnabled: boolean;
  emailNotifications: boolean;
  slackWebhook: string;
  apiKey: string;
  dataRetention: string;
  timezone: string;
  
  // Configurações de Página
  pageTitle: string;
  pageDescription: string;
  faviconUrl: string;
  
  // Configurações de Comportamento
  autoSave: boolean;
  syncInterval: number; // em minutos
  backupEnabled: boolean;
  
  // Configurações de Segurança
  sessionTimeout: number; // em minutos
  maxLoginAttempts: number;
  
  // Configurações de Interface
  theme: 'dark' | 'light';
  language: 'pt' | 'en';
  
  // Timestamp da última atualização
  lastUpdated: number;
  configVersion: string;
}

const DEFAULT_ADMIN_CONFIG: AdminConfig = {
  siteName: 'EAGLEBOOST',
  siteUrl: 'https://eagleboost.com',
  trackingEnabled: true,
  emailNotifications: true,
  slackWebhook: '',
  apiKey: 'eb_live_1234567890abcdef',
  dataRetention: '90',
  timezone: 'America/New_York',
  pageTitle: 'EAGLEBOOST - Analytics & Tracking',
  pageDescription: 'Plataforma avançada de analytics e rastreamento para seu negócio',
  faviconUrl: '/favicon.ico',
  autoSave: true,
  syncInterval: 5,
  backupEnabled: true,
  sessionTimeout: 60,
  maxLoginAttempts: 5,
  theme: 'dark',
  language: 'pt',
  lastUpdated: Date.now(),
  configVersion: '1.0.0'
};

class AdminConfigManager {
  private config: AdminConfig;
  private listeners: Array<(config: AdminConfig) => void> = [];
  private syncTimer: number | null = null;
  private backupTimer: number | null = null;
  
  // Chaves de armazenamento para múltiplas camadas
  private readonly STORAGE_KEYS = {
    primary: 'eagleboost_admin_config',
    backup: 'eagleboost_admin_config_backup',
    session: 'eagleboost_admin_config_session',
    global: 'eagleboost_admin_config_global'
  };

  constructor() {
    console.log('🔧 AdminConfigManager: Inicializando sistema de configurações globais...');
    this.config = this.loadConfig();
    // Desabilitado para manter configurações do usuário
    // this.initializeAutoSync();
    // this.initializeBackupSystem();
    this.setupGlobalAccess();
    console.log('✅ AdminConfigManager: Sistema inicializado com sucesso (sync automático desabilitado)');
  }

  /**
   * Carrega configurações com sistema de fallback em múltiplas camadas
   */
  private loadConfig(): AdminConfig {
    console.log('📥 AdminConfigManager: Carregando configurações...');
    
    // Tenta carregar da camada primária
    let config = this.loadFromStorage(this.STORAGE_KEYS.primary);
    
    if (!config) {
      console.log('⚠️ Configuração primária não encontrada, tentando backup...');
      // Tenta carregar do backup
      config = this.loadFromStorage(this.STORAGE_KEYS.backup);
    }
    
    if (!config) {
      console.log('⚠️ Backup não encontrado, tentando sessão...');
      // Tenta carregar da sessão
      config = this.loadFromStorage(this.STORAGE_KEYS.session, 'sessionStorage');
    }
    
    if (!config) {
      console.log('⚠️ Nenhuma configuração encontrada, usando padrão...');
      // Usa configuração padrão
      config = { ...DEFAULT_ADMIN_CONFIG };
    }
    
    // Preserva configurações do usuário sem merge forçado com padrão
    // Apenas adiciona propriedades que não existem
    const mergedConfig = { ...DEFAULT_ADMIN_CONFIG, ...config };
    
    // Salva apenas se não existir configuração
    if (!config) {
      this.saveToAllLayers(mergedConfig);
    }
    
    console.log('✅ AdminConfigManager: Configurações carregadas:', mergedConfig.siteName);
    return mergedConfig;
  }

  /**
   * Carrega configuração de um storage específico
   */
  private loadFromStorage(key: string, storageType: 'localStorage' | 'sessionStorage' = 'localStorage'): AdminConfig | null {
    try {
      const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
      const stored = storage.getItem(key);
      
      if (stored) {
        const parsed = JSON.parse(stored) as AdminConfig;
        console.log(`📦 Configuração carregada de ${storageType}:`, key);
        return parsed;
      }
    } catch (error) {
      console.warn(`❌ Erro ao carregar de ${storageType}:`, error);
    }
    
    return null;
  }

  /**
   * Salva configurações em todas as camadas de armazenamento
   */
  private saveToAllLayers(config: AdminConfig): void {
    const configWithTimestamp = {
      ...config,
      lastUpdated: Date.now()
    };
    
    try {
      // Salva no localStorage (primário)
      localStorage.setItem(this.STORAGE_KEYS.primary, JSON.stringify(configWithTimestamp));
      
      // Salva no backup
      localStorage.setItem(this.STORAGE_KEYS.backup, JSON.stringify(configWithTimestamp));
      
      // Salva na sessão
      sessionStorage.setItem(this.STORAGE_KEYS.session, JSON.stringify(configWithTimestamp));
      
      // Salva globalmente no window
      (window as any).eagleboostAdminConfig = configWithTimestamp;
      
      console.log('💾 AdminConfigManager: Configurações salvas em todas as camadas');
      
    } catch (error) {
      console.error('❌ AdminConfigManager: Erro ao salvar configurações:', error);
    }
  }

  /**
   * Inicializa sistema de sincronização automática
   */
  private initializeAutoSync(): void {
    if (this.config.autoSave && this.config.syncInterval > 0) {
      this.syncTimer = window.setInterval(() => {
        this.syncConfig();
      }, this.config.syncInterval * 60 * 1000); // Converte minutos para ms
      
      console.log(`🔄 AdminConfigManager: Auto-sync ativado (${this.config.syncInterval} min)`);
    }
  }

  /**
   * Inicializa sistema de backup automático
   */
  private initializeBackupSystem(): void {
    if (this.config.backupEnabled) {
      // Backup a cada 30 minutos
      this.backupTimer = window.setInterval(() => {
        this.createBackup();
      }, 30 * 60 * 1000);
      
      console.log('🛡️ AdminConfigManager: Sistema de backup ativado');
    }
  }

  /**
   * Configura acesso global às configurações (apenas para desenvolvimento)
   */
  private setupGlobalAccess(): void {
    // Disponibiliza globalmente apenas em desenvolvimento
    if (process.env.NODE_ENV === 'development' || window.location.hostname.includes('localhost') || window.location.hostname.includes('bolt')) {
      (window as any).getAdminConfig = () => this.getConfig();
      (window as any).setAdminConfig = (updates: Partial<AdminConfig>) => this.updateConfig(updates);
      (window as any).resetAdminConfig = () => this.resetToDefault();
      console.log('🌐 AdminConfigManager: Acesso global configurado (desenvolvimento)');
    }
    
  }

  /**
   * Sincroniza configurações entre todas as camadas
   */
  private syncConfig(): void {
    console.log('🔄 AdminConfigManager: Sincronizando configurações...');
    
    // Verifica se há configurações mais recentes em outras camadas
    const primaryConfig = this.loadFromStorage(this.STORAGE_KEYS.primary);
    const backupConfig = this.loadFromStorage(this.STORAGE_KEYS.backup);
    const sessionConfig = this.loadFromStorage(this.STORAGE_KEYS.session, 'sessionStorage');
    
    const configs = [primaryConfig, backupConfig, sessionConfig].filter(Boolean) as AdminConfig[];
    
    if (configs.length > 0) {
      // Encontra a configuração mais recente
      const latestConfig = configs.reduce((latest, current) => 
        current.lastUpdated > latest.lastUpdated ? current : latest
      );
      
      // Se encontrou uma configuração mais recente, atualiza
      if (latestConfig.lastUpdated > this.config.lastUpdated) {
        console.log('📥 AdminConfigManager: Configuração mais recente encontrada, atualizando...');
        this.config = latestConfig;
        this.saveToAllLayers(this.config);
        this.notifyListeners();
      }
    }
    
    // Sempre salva a configuração atual para garantir sincronização
    this.saveToAllLayers(this.config);
  }

  /**
   * Cria backup das configurações
   */
  private createBackup(): void {
    try {
      const backupKey = `${this.STORAGE_KEYS.backup}_${Date.now()}`;
      localStorage.setItem(backupKey, JSON.stringify(this.config));
      
      // Mantém apenas os últimos 5 backups
      this.cleanupOldBackups();
      
      console.log('🛡️ AdminConfigManager: Backup criado:', backupKey);
    } catch (error) {
      console.error('❌ AdminConfigManager: Erro ao criar backup:', error);
    }
  }

  /**
   * Remove backups antigos para economizar espaço
   */
  private cleanupOldBackups(): void {
    try {
      const backupKeys: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`${this.STORAGE_KEYS.backup}_`)) {
          backupKeys.push(key);
        }
      }
      
      // Ordena por timestamp (mais recente primeiro)
      backupKeys.sort((a, b) => {
        const timestampA = parseInt(a.split('_').pop() || '0');
        const timestampB = parseInt(b.split('_').pop() || '0');
        return timestampB - timestampA;
      });
      
      // Remove backups antigos (mantém apenas os 5 mais recentes)
      if (backupKeys.length > 5) {
        const toRemove = backupKeys.slice(5);
        toRemove.forEach(key => localStorage.removeItem(key));
        console.log(`🧹 AdminConfigManager: ${toRemove.length} backups antigos removidos`);
      }
    } catch (error) {
      console.error('❌ AdminConfigManager: Erro na limpeza de backups:', error);
    }
  }

  /**
   * Notifica todos os listeners sobre mudanças
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener({ ...this.config });
      } catch (error) {
        console.error('❌ AdminConfigManager: Erro ao notificar listener:', error);
      }
    });
  }

  // ========== MÉTODOS PÚBLICOS ==========

  /**
   * Obtém a configuração atual
   */
  getConfig(): AdminConfig {
    return { ...this.config };
  }

  /**
   * Atualiza configurações (merge com existentes)
   */
  updateConfig(updates: Partial<AdminConfig>): void {
    console.log('🔄 AdminConfigManager: Atualizando configurações:', Object.keys(updates));
    
    this.config = {
      ...this.config,
      ...updates,
      lastUpdated: Date.now()
    };
    
    this.saveToAllLayers(this.config);
    this.notifyListeners();
    
    console.log('✅ AdminConfigManager: Configurações atualizadas com sucesso');
  }

  /**
   * Substitui configuração completamente
   */
  setConfig(newConfig: AdminConfig): void {
    console.log('🔄 AdminConfigManager: Substituindo configuração completa');
    
    this.config = {
      ...newConfig,
      lastUpdated: Date.now()
    };
    
    this.saveToAllLayers(this.config);
    this.notifyListeners();
    
    console.log('✅ AdminConfigManager: Configuração substituída com sucesso');
  }

  /**
   * Reseta para configuração padrão
   */
  resetToDefault(): void {
    console.log('🔄 AdminConfigManager: Resetando para configuração padrão');
    
    this.config = {
      ...DEFAULT_ADMIN_CONFIG,
      lastUpdated: Date.now()
    };
    
    this.saveToAllLayers(this.config);
    this.notifyListeners();
    
    console.log('✅ AdminConfigManager: Reset concluído');
  }

  /**
   * Subscreve para receber notificações de mudanças
   */
  subscribe(listener: (config: AdminConfig) => void): () => void {
    this.listeners.push(listener);
    console.log('👂 AdminConfigManager: Novo listener adicionado');
    
    // Retorna função para cancelar subscrição
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
        console.log('👋 AdminConfigManager: Listener removido');
      }
    };
  }

  /**
   * Força sincronização manual
   */
  forcSync(): void {
    console.log('🔄 AdminConfigManager: Sincronização forçada iniciada');
    this.syncConfig();
  }

  /**
   * Exporta configurações como JSON
   */
  exportConfig(): string {
    return JSON.stringify(this.config, null, 2);
  }

  /**
   * Importa configurações de JSON
   */
  importConfig(jsonConfig: string): boolean {
    try {
      const imported = JSON.parse(jsonConfig) as Partial<AdminConfig>;
      const mergedConfig = { ...DEFAULT_ADMIN_CONFIG, ...imported };
      this.setConfig(mergedConfig);
      console.log('✅ AdminConfigManager: Configurações importadas com sucesso');
      return true;
    } catch (error) {
      console.error('❌ AdminConfigManager: Erro ao importar configurações:', error);
      return false;
    }
  }

  /**
   * Obtém estatísticas do sistema
   */
  getStats(): {
    configVersion: string;
    lastUpdated: Date;
    listenersCount: number;
    autoSyncEnabled: boolean;
    backupEnabled: boolean;
  } {
    return {
      configVersion: this.config.configVersion,
      lastUpdated: new Date(this.config.lastUpdated),
      listenersCount: this.listeners.length,
      autoSyncEnabled: !!this.syncTimer,
      backupEnabled: !!this.backupTimer
    };
  }

  /**
   * Limpa todos os dados (use com cuidado!)
   */
  clearAllData(): void {
    console.log('🗑️ AdminConfigManager: Limpando todos os dados...');
    
    // Remove de todos os storages
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    
    // Remove backups
    this.cleanupOldBackups();
    
    // Remove do window
    delete (window as any).eagleboostAdminConfig;
    
    // Reseta para padrão
    this.resetToDefault();
    
    console.log('✅ AdminConfigManager: Todos os dados limpos');
  }

  /**
   * Destructor - limpa timers
   */
  destroy(): void {
    if (this.syncTimer) {
      window.clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
    
    if (this.backupTimer) {
      window.clearInterval(this.backupTimer);
      this.backupTimer = null;
    }
    
    console.log('🔧 AdminConfigManager: Destruído');
  }
}

// Instância global do gerenciador
export const adminConfigManager = new AdminConfigManager();

// Hook React para usar as configurações
export const useAdminConfig = () => {
  const [config, setConfig] = React.useState<AdminConfig>(adminConfigManager.getConfig());
  
  React.useEffect(() => {
    const unsubscribe = adminConfigManager.subscribe(setConfig);
    return unsubscribe;
  }, []);
  
  return {
    config,
    updateConfig: adminConfigManager.updateConfig.bind(adminConfigManager),
    resetConfig: adminConfigManager.resetToDefault.bind(adminConfigManager),
    exportConfig: adminConfigManager.exportConfig.bind(adminConfigManager),
    importConfig: adminConfigManager.importConfig.bind(adminConfigManager),
    getStats: adminConfigManager.getStats.bind(adminConfigManager)
  };
};

// Disponibiliza globalmente para debug
if (typeof window !== 'undefined') {
  (window as any).adminConfigManager = adminConfigManager;
}

export default adminConfigManager;