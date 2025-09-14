// Serviço de Sincronização Automática para Configurações Administrativas
// Monitora e sincroniza configurações em tempo real entre todas as instâncias

import { adminConfigManager, AdminConfig } from './adminConfigManager';

interface SyncEvent {
  type: 'config_update' | 'config_reset' | 'config_import';
  timestamp: number;
  source: string;
  data?: Partial<AdminConfig>;
}

class AdminSyncService {
  private isActive: boolean = false;
  private syncChannel: BroadcastChannel | null = null;
  private storageListener: ((e: StorageEvent) => void) | null = null;
  private visibilityListener: (() => void) | null = null;
  private heartbeatTimer: number | null = null;
  private lastSyncTime: number = 0;
  
  private readonly CHANNEL_NAME = 'eagleboost_admin_sync';
  private readonly HEARTBEAT_INTERVAL = 30000; // 30 segundos
  private readonly SYNC_DEBOUNCE = 1000; // 1 segundo

  constructor() {
    console.log('🔄 AdminSyncService: Inicializando serviço de sincronização...');
    this.initialize();
  }

  /**
   * Inicializa o serviço de sincronização
   */
  private initialize(): void {
    if (typeof window === 'undefined') {
      console.warn('⚠️ AdminSyncService: Window não disponível, sincronização desabilitada');
      return;
    }

    this.setupBroadcastChannel();
    this.setupStorageListener();
    this.setupVisibilityListener();
    this.setupHeartbeat();
    this.isActive = true;
    
    console.log('✅ AdminSyncService: Serviço inicializado com sucesso');
  }

  /**
   * Configura BroadcastChannel para comunicação entre abas/janelas
   */
  private setupBroadcastChannel(): void {
    try {
      this.syncChannel = new BroadcastChannel(this.CHANNEL_NAME);
      
      this.syncChannel.onmessage = (event) => {
        this.handleSyncMessage(event.data as SyncEvent);
      };
      
      console.log('📡 AdminSyncService: BroadcastChannel configurado');
    } catch (error) {
      console.warn('⚠️ AdminSyncService: BroadcastChannel não suportado:', error);
    }
  }

  /**
   * Configura listener para mudanças no localStorage
   */
  private setupStorageListener(): void {
    this.storageListener = (event: StorageEvent) => {
      if (event.key && event.key.includes('eagleboost_admin_config')) {
        console.log('📥 AdminSyncService: Mudança detectada no localStorage:', event.key);
        this.debouncedSync();
      }
    };
    
    window.addEventListener('storage', this.storageListener);
    console.log('👂 AdminSyncService: Storage listener configurado');
  }

  /**
   * Configura listener para mudanças de visibilidade da página
   */
  private setupVisibilityListener(): void {
    this.visibilityListener = () => {
      if (!document.hidden) {
        console.log('👁️ AdminSyncService: Página ficou visível, sincronizando...');
        this.forcSync();
      }
    };
    
    document.addEventListener('visibilitychange', this.visibilityListener);
    console.log('👁️ AdminSyncService: Visibility listener configurado');
  }

  /**
   * Configura heartbeat para sincronização periódica
   */
  private setupHeartbeat(): void {
    this.heartbeatTimer = window.setInterval(() => {
      this.performHeartbeat();
    }, this.HEARTBEAT_INTERVAL);
    
    console.log(`💓 AdminSyncService: Heartbeat configurado (${this.HEARTBEAT_INTERVAL}ms)`);
  }

  /**
   * Executa heartbeat - sincronização periódica
   */
  private performHeartbeat(): void {
    if (!this.isActive) return;
    
    console.log('💓 AdminSyncService: Executando heartbeat...');
    
    // Força sincronização do adminConfigManager
    adminConfigManager.forcSync();
    
    // Envia ping para outras instâncias
    this.broadcastSync({
      type: 'config_update',
      timestamp: Date.now(),
      source: this.getInstanceId()
    });
  }

  /**
   * Sincronização com debounce para evitar chamadas excessivas
   */
  private debouncedSync = this.debounce(() => {
    this.forcSync();
  }, this.SYNC_DEBOUNCE);

  /**
   * Função de debounce
   */
  private debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: number;
    return (...args: Parameters<T>) => {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => func(...args), wait);
    };
  }

  /**
   * Manipula mensagens de sincronização recebidas
   */
  private handleSyncMessage(syncEvent: SyncEvent): void {
    const now = Date.now();
    
    // Ignora mensagens muito antigas (mais de 5 minutos)
    if (now - syncEvent.timestamp > 5 * 60 * 1000) {
      console.log('⏰ AdminSyncService: Mensagem muito antiga ignorada');
      return;
    }
    
    // Ignora mensagens da própria instância
    if (syncEvent.source === this.getInstanceId()) {
      return;
    }
    
    console.log('📨 AdminSyncService: Mensagem de sincronização recebida:', syncEvent.type);
    
    switch (syncEvent.type) {
      case 'config_update':
        this.handleConfigUpdate(syncEvent);
        break;
      case 'config_reset':
        this.handleConfigReset();
        break;
      case 'config_import':
        this.handleConfigImport(syncEvent);
        break;
    }
  }

  /**
   * Manipula atualização de configuração
   */
  private handleConfigUpdate(syncEvent: SyncEvent): void {
    // Força sincronização do adminConfigManager
    adminConfigManager.forcSync();
    
    console.log('🔄 AdminSyncService: Configuração sincronizada via broadcast');
  }

  /**
   * Manipula reset de configuração
   */
  private handleConfigReset(): void {
    console.log('🔄 AdminSyncService: Reset de configuração detectado');
    adminConfigManager.forcSync();
  }

  /**
   * Manipula importação de configuração
   */
  private handleConfigImport(syncEvent: SyncEvent): void {
    console.log('📥 AdminSyncService: Importação de configuração detectada');
    adminConfigManager.forcSync();
  }

  /**
   * Transmite evento de sincronização
   */
  private broadcastSync(syncEvent: SyncEvent): void {
    if (!this.syncChannel) return;
    
    try {
      this.syncChannel.postMessage(syncEvent);
      console.log('📡 AdminSyncService: Evento transmitido:', syncEvent.type);
    } catch (error) {
      console.error('❌ AdminSyncService: Erro ao transmitir evento:', error);
    }
  }

  /**
   * Obtém ID único da instância
   */
  private getInstanceId(): string {
    if (!(window as any).eagleboostInstanceId) {
      (window as any).eagleboostInstanceId = `instance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    return (window as any).eagleboostInstanceId;
  }

  // ========== MÉTODOS PÚBLICOS ==========

  /**
   * Força sincronização imediata
   */
  forcSync(): void {
    if (!this.isActive) return;
    
    const now = Date.now();
    
    // Evita sincronizações muito frequentes
    if (now - this.lastSyncTime < 500) {
      console.log('⏱️ AdminSyncService: Sincronização muito frequente, ignorando');
      return;
    }
    
    this.lastSyncTime = now;
    
    console.log('🔄 AdminSyncService: Sincronização forçada iniciada');
    
    // Força sincronização do adminConfigManager
    adminConfigManager.forcSync();
    
    // Notifica outras instâncias
    this.broadcastSync({
      type: 'config_update',
      timestamp: now,
      source: this.getInstanceId()
    });
  }

  /**
   * Notifica sobre atualização de configuração
   */
  notifyConfigUpdate(updates: Partial<AdminConfig>): void {
    console.log('📢 AdminSyncService: Notificando atualização de configuração');
    
    this.broadcastSync({
      type: 'config_update',
      timestamp: Date.now(),
      source: this.getInstanceId(),
      data: updates
    });
  }

  /**
   * Notifica sobre reset de configuração
   */
  notifyConfigReset(): void {
    console.log('📢 AdminSyncService: Notificando reset de configuração');
    
    this.broadcastSync({
      type: 'config_reset',
      timestamp: Date.now(),
      source: this.getInstanceId()
    });
  }

  /**
   * Notifica sobre importação de configuração
   */
  notifyConfigImport(): void {
    console.log('📢 AdminSyncService: Notificando importação de configuração');
    
    this.broadcastSync({
      type: 'config_import',
      timestamp: Date.now(),
      source: this.getInstanceId()
    });
  }

  /**
   * Ativa o serviço de sincronização
   */
  activate(): void {
    if (this.isActive) return;
    
    console.log('🟢 AdminSyncService: Ativando serviço...');
    this.initialize();
  }

  /**
   * Desativa o serviço de sincronização
   */
  deactivate(): void {
    if (!this.isActive) return;
    
    console.log('🔴 AdminSyncService: Desativando serviço...');
    
    this.isActive = false;
    
    // Remove listeners
    if (this.storageListener) {
      window.removeEventListener('storage', this.storageListener);
      this.storageListener = null;
    }
    
    if (this.visibilityListener) {
      document.removeEventListener('visibilitychange', this.visibilityListener);
      this.visibilityListener = null;
    }
    
    // Limpa timers
    if (this.heartbeatTimer) {
      window.clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    
    // Fecha canal
    if (this.syncChannel) {
      this.syncChannel.close();
      this.syncChannel = null;
    }
    
    console.log('✅ AdminSyncService: Serviço desativado');
  }

  /**
   * Obtém status do serviço
   */
  getStatus(): {
    isActive: boolean;
    hasChannel: boolean;
    instanceId: string;
    lastSyncTime: Date;
  } {
    return {
      isActive: this.isActive,
      hasChannel: !!this.syncChannel,
      instanceId: this.getInstanceId(),
      lastSyncTime: new Date(this.lastSyncTime)
    };
  }

  /**
   * Destructor
   */
  destroy(): void {
    console.log('🔧 AdminSyncService: Destruindo serviço...');
    this.deactivate();
  }
}

// Instância global do serviço de sincronização
export const adminSyncService = new AdminSyncService();

// Integração desabilitada para manter configurações do usuário
// Comentado para evitar sincronizações automáticas indesejadas
/*
if (typeof window !== 'undefined') {
  // Intercepta métodos do adminConfigManager para notificar sincronização
  const originalUpdateConfig = adminConfigManager.updateConfig.bind(adminConfigManager);
  const originalResetToDefault = adminConfigManager.resetToDefault.bind(adminConfigManager);
  const originalImportConfig = adminConfigManager.importConfig.bind(adminConfigManager);
  
  adminConfigManager.updateConfig = function(updates: Partial<AdminConfig>) {
    originalUpdateConfig(updates);
    adminSyncService.notifyConfigUpdate(updates);
  };
  
  adminConfigManager.resetToDefault = function() {
    originalResetToDefault();
    adminSyncService.notifyConfigReset();
  };
  
  adminConfigManager.importConfig = function(jsonConfig: string): boolean {
    const result = originalImportConfig(jsonConfig);
    if (result) {
      adminSyncService.notifyConfigImport();
    }
    return result;
  };
  
  // Disponibiliza globalmente para debug
  (window as any).adminSyncService = adminSyncService;
}
*/

export default adminSyncService;