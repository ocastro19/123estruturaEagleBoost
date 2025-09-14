import { useEffect } from 'react';
import { useTracking } from '../components/TrackingProvider';

// Hook personalizado para analytics avançados
export const useAnalytics = () => {
  const { currentUTM, trackClick } = useTracking();

  // Rastreia tempo na página
  useEffect(() => {
    const startTime = Date.now();
    
    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      trackClick('page_exit', {
        utm_content: 'time_on_page',
        utm_term: `${timeSpent}_seconds`
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [trackClick]);

  // Rastreia scroll
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollPercent = Math.round(
          (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
        
        if (scrollPercent > 0 && scrollPercent % 25 === 0) {
          trackClick('scroll_milestone', {
            utm_content: 'scroll_tracking',
            utm_term: `${scrollPercent}_percent`
          });
        }
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [trackClick]);

  // Rastreia visibilidade da página
  useEffect(() => {
    const handleVisibilityChange = () => {
      trackClick(document.hidden ? 'page_hidden' : 'page_visible', {
        utm_content: 'visibility_tracking',
        utm_term: document.hidden ? 'tab_hidden' : 'tab_visible'
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [trackClick]);

  return {
    currentUTM,
    trackClick
  };
};