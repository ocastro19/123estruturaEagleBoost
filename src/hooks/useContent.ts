import { useState, useEffect } from 'react';
import { contentManager, SiteContent } from '../utils/contentManager';

// Hook para usar conteúdo dinâmico nos componentes
export const useContent = () => {
  const [content, setContent] = useState<SiteContent>(contentManager.getContent());
  const [updateKey, setUpdateKey] = useState(0);

  useEffect(() => {
    console.log('🎯 useContent: Hook initialized');
    
    const handleContentUpdate = (newContent: SiteContent) => {
      console.log('🔄 useContent: Content update received');
      setContent({ ...newContent });
      setUpdateKey(prev => prev + 1);
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'site_content' && e.newValue) {
        console.log('🔄 useContent: Storage change detected, reloading content');
        const newContent = contentManager.getContent();
        setContent({ ...newContent });
        setUpdateKey(prev => prev + 1);
      }
    };

    const handleForceReload = (e: CustomEvent) => {
      console.log('🔄 useContent: Force reload event received');
      const newContent = contentManager.getContent();
      setContent({ ...newContent });
      setUpdateKey(prev => prev + 1);
    };

    // Subscribe to content manager
    const unsubscribe = contentManager.subscribe(handleContentUpdate);
    
    // Listen for storage changes (cross-tab sync)
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for force reload events
    window.addEventListener('forceContentReload', handleForceReload as EventListener);
    window.addEventListener('adminContentSaved', handleForceReload as EventListener);
    
    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('forceContentReload', handleForceReload as EventListener);
      window.removeEventListener('adminContentSaved', handleForceReload as EventListener);
    };
  }, []);

  return { ...content, _updateKey: updateKey };
};

// Hook para seção específica
export const useContentSection = <K extends keyof SiteContent>(section: K): SiteContent[K] => {
  const content = useContent();
  return { ...content[section] };
};