// UTM Tracking Utilities
export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  utm_id?: string;
}

export interface TrackingEvent {
  event_name: string;
  event_category: string;
  event_action: string;
  event_label?: string;
  value?: number;
  utm_params?: UTMParams;
}

class UTMTracker {
  // Sem parâmetros UTM padrão - apenas dados reais serão capturados

  // Captura parâmetros UTM da URL atual
  getCurrentUTMParams(): UTMParams {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams: UTMParams = {};

    const utmKeys: (keyof UTMParams)[] = [
      'utm_source',
      'utm_medium', 
      'utm_campaign',
      'utm_term',
      'utm_content',
      'utm_id'
    ];

    utmKeys.forEach(key => {
      const value = urlParams.get(key);
      if (value) {
        utmParams[key] = value;
      }
    });

    return utmParams;
  }

  // Constrói URL com parâmetros UTM
  buildTrackingURL(baseUrl: string, customUTM?: Partial<UTMParams>): string {
    const currentUTM = this.getCurrentUTMParams();
    const finalUTM = { ...currentUTM, ...customUTM };
    
    const url = new URL(baseUrl);
    
    Object.entries(finalUTM).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });

    return url.toString();
  }

  // Registra evento de tracking
  trackEvent(event: TrackingEvent): void {
    const currentUTM = this.getCurrentUTMParams();
    const trackingData = {
      ...event,
      utm_params: { ...currentUTM, ...event.utm_params },
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      referrer: document.referrer
    };

    // Log para desenvolvimento
    console.log('🎯 Tracking Event:', trackingData);

    // Aqui você pode integrar com Google Analytics, Facebook Pixel, etc.
    this.sendToAnalytics(trackingData);
  }

  // Simula envio para plataformas de analytics
  private sendToAnalytics(data: Record<string, unknown>): void {
    // Google Analytics 4 (gtag)
    if (typeof gtag !== 'undefined') {
      gtag('event', data.event_action, {
        event_category: data.event_category,
        event_label: data.event_label,
        value: data.value,
        custom_parameters: data.utm_params
      });
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
      fbq('track', data.event_name, data.utm_params);
    }

    // Envio para servidor próprio (opcional)
    this.sendToServer(data);
  }

  // Envio para servidor de analytics próprio
  private async sendToServer(data: Record<string, unknown>): Promise<void> {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.warn('Failed to send analytics to server:', error);
    }
  }

  // Rastreia cliques em elementos
  trackClick(element: string, customUTM?: Partial<UTMParams>): void {
    this.trackEvent({
      event_name: 'click',
      event_category: 'engagement',
      event_action: 'click',
      event_label: element,
      utm_params: customUTM
    });
  }

  // Rastreia visualizações de página
  trackPageView(customUTM?: Partial<UTMParams>): void {
    this.trackEvent({
      event_name: 'page_view',
      event_category: 'navigation',
      event_action: 'view',
      event_label: window.location.pathname,
      utm_params: customUTM
    });
  }

  // Rastreia interações com vídeo
  trackVideoInteraction(action: 'play' | 'pause' | 'complete' | 'click', customUTM?: Partial<UTMParams>): void {
    this.trackEvent({
      event_name: 'video_interaction',
      event_category: 'media',
      event_action: action,
      event_label: 'main_video',
      utm_params: customUTM
    });
  }
}

// Instância global do tracker
export const utmTracker = new UTMTracker();

// Hook React para usar o tracker
export const useUTMTracker = () => {
  return utmTracker;
};

// Tipos para TypeScript
declare global {
  function gtag(...args: unknown[]): void;
  function fbq(...args: unknown[]): void;
}