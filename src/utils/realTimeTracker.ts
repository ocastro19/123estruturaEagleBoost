// Sistema de tracking em tempo real
interface VisitorData {
  id: string;
  timestamp: number;
  userAgent: string;
  ip?: string;
  country?: string;
  city?: string;
  referrer: string;
  currentPage: string;
  utmParams: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
  };
  sessionId: string;
  isActive: boolean;
  lastActivity: number;
}

interface PageView {
  id: string;
  visitorId: string;
  page: string;
  timestamp: number;
  timeOnPage?: number;
}

interface ClickEvent {
  id: string;
  visitorId: string;
  element: string;
  page: string;
  timestamp: number;
  utmParams: Record<string, unknown>;
}

class RealTimeTracker {
  private visitors: Map<string, VisitorData> = new Map();
  private pageViews: PageView[] = [];
  private clickEvents: ClickEvent[] = [];
  private sessionId: string;
  private visitorId: string;

  constructor() {
    this.sessionId = this.generateId();
    this.visitorId = this.getOrCreateVisitorId();
    this.initializeTracking();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getOrCreateVisitorId(): string {
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = this.generateId();
      localStorage.setItem('visitor_id', visitorId);
    }
    return visitorId;
  }

  private async getLocationData(): Promise<{ country?: string; city?: string }> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return {
        country: data.country_name,
        city: data.city
      };
    } catch (error) {
      console.warn('Failed to get location data:', error);
      return {};
    }
  }

  private getUTMParams(): Record<string, string | null> {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_term: urlParams.get('utm_term'),
      utm_content: urlParams.get('utm_content')
    };
  }

  private async initializeTracking(): Promise<void> {
    const locationData = await this.getLocationData();
    
    const visitorData: VisitorData = {
      id: this.visitorId,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      country: locationData.country,
      city: locationData.city,
      referrer: document.referrer,
      currentPage: window.location.pathname,
      utmParams: this.getUTMParams(),
      sessionId: this.sessionId,
      isActive: true,
      lastActivity: Date.now()
    };

    this.visitors.set(this.visitorId, visitorData);
    this.trackPageView();
    this.setupActivityTracking();
    this.saveToStorage();
  }

  private setupActivityTracking(): void {
    // Track page visibility
    document.addEventListener('visibilitychange', () => {
      this.updateActivity();
    });

    // Track mouse movement
    let activityTimeout: NodeJS.Timeout;
    document.addEventListener('mousemove', () => {
      clearTimeout(activityTimeout);
      this.updateActivity();
      
      activityTimeout = setTimeout(() => {
        this.setInactive();
      }, 30000); // 30 seconds of inactivity
    });

    // Track clicks
    document.addEventListener('click', (event) => {
      this.trackClick(event);
    });

    // Update activity every 10 seconds
    setInterval(() => {
      this.updateActivity();
    }, 10000);
  }

  private updateActivity(): void {
    const visitor = this.visitors.get(this.visitorId);
    if (visitor) {
      visitor.isActive = true;
      visitor.lastActivity = Date.now();
      visitor.currentPage = window.location.pathname;
      this.visitors.set(this.visitorId, visitor);
      this.saveToStorage();
    }
  }

  private setInactive(): void {
    const visitor = this.visitors.get(this.visitorId);
    if (visitor) {
      visitor.isActive = false;
      this.visitors.set(this.visitorId, visitor);
      this.saveToStorage();
    }
  }

  private trackPageView(): void {
    const pageView: PageView = {
      id: this.generateId(),
      visitorId: this.visitorId,
      page: window.location.pathname,
      timestamp: Date.now()
    };

    this.pageViews.push(pageView);
    this.saveToStorage();
  }

  private trackClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    
    // Handle className for both HTML and SVG elements
    let className = '';
    if (target.className) {
      if (typeof target.className === 'string') {
        className = target.className;
      } else if (target.className.baseVal) {
        // SVG elements have className as SVGAnimatedString
        className = target.className.baseVal;
      }
    }
    
    const element = target.tagName.toLowerCase() + 
                   (className ? '.' + className.split(' ').join('.') : '') +
                   (target.id ? '#' + target.id : '');

    const clickEvent: ClickEvent = {
      id: this.generateId(),
      visitorId: this.visitorId,
      element: element,
      page: window.location.pathname,
      timestamp: Date.now(),
      utmParams: this.getUTMParams() as Record<string, unknown>
    };

    this.clickEvents.push(clickEvent);
    this.saveToStorage();
  }

  private saveToStorage(): void {
    const data = {
      visitors: Array.from(this.visitors.entries()),
      pageViews: this.pageViews,
      clickEvents: this.clickEvents
    };
    
    localStorage.setItem('tracking_data', JSON.stringify(data));
    
    // Also save to global window for admin access
    (window as any).trackingData = data;
  }

  public static loadFromStorage(): {
    visitors: Map<string, VisitorData>;
    pageViews: PageView[];
    clickEvents: ClickEvent[];
  } {
    try {
      const stored = localStorage.getItem('tracking_data');
      if (stored) {
        const data = JSON.parse(stored);
        return {
          visitors: new Map(data.visitors || []),
          pageViews: data.pageViews || [],
          clickEvents: data.clickEvents || []
        };
      }
    } catch (error) {
      console.warn('Failed to load tracking data:', error);
    }
    
    return {
      visitors: new Map(),
      pageViews: [],
      clickEvents: []
    };
  }

  public getActiveVisitors(): VisitorData[] {
    const now = Date.now();
    const activeThreshold = 5 * 60 * 1000; // 5 minutes
    
    return Array.from(this.visitors.values()).filter(visitor => 
      visitor.isActive && (now - visitor.lastActivity) < activeThreshold
    );
  }

  public getTodayStats(): {
    totalVisitors: number;
    totalPageViews: number;
    totalClicks: number;
  } {
    const today = new Date().setHours(0, 0, 0, 0);
    
    return {
      totalVisitors: Array.from(this.visitors.values()).filter(v => v.timestamp >= today).length,
      totalPageViews: this.pageViews.filter(pv => pv.timestamp >= today).length,
      totalClicks: this.clickEvents.filter(ce => ce.timestamp >= today).length
    };
  }
}

// Initialize tracker
export const realTimeTracker = new RealTimeTracker();

// Export types
export type { VisitorData, PageView, ClickEvent };