import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { utmTracker, UTMParams } from '../utils/utm';

interface TrackingContextType {
  currentUTM: UTMParams;
  trackClick: (element: string, customUTM?: Partial<UTMParams>) => void;
  trackVideoInteraction: (action: 'play' | 'pause' | 'complete' | 'click', customUTM?: Partial<UTMParams>) => void;
  buildTrackingURL: (baseUrl: string, customUTM?: Partial<UTMParams>) => string;
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

interface TrackingProviderProps {
  children: ReactNode;
}

export const TrackingProvider: React.FC<TrackingProviderProps> = ({ children }) => {
  const currentUTM = utmTracker.getCurrentUTMParams();

  useEffect(() => {
    // Rastreia visualização da página quando o componente monta
    utmTracker.trackPageView();
  }, []);

  const trackClick = (element: string, customUTM?: Partial<UTMParams>) => {
    utmTracker.trackClick(element, customUTM);
  };

  const trackVideoInteraction = (action: 'play' | 'pause' | 'complete' | 'click', customUTM?: Partial<UTMParams>) => {
    utmTracker.trackVideoInteraction(action, customUTM);
  };

  const buildTrackingURL = (baseUrl: string, customUTM?: Partial<UTMParams>) => {
    return utmTracker.buildTrackingURL(baseUrl, customUTM);
  };

  return (
    <TrackingContext.Provider value={{
      currentUTM,
      trackClick,
      trackVideoInteraction,
      buildTrackingURL
    }}>
      {children}
    </TrackingContext.Provider>
  );
};

export const useTracking = (): TrackingContextType => {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
};