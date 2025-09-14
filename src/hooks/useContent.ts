import { useState, useEffect } from 'react';
import { contentManager, SiteContent } from '../utils/contentManager';

// Hook para usar conteúdo dinâmico nos componentes
export const useContent = () => {
  const [content, setContent] = useState<SiteContent>(contentManager.getContent());

  useEffect(() => {
    console.log('🎯 useContent: Hook initialized');
    
    const handleContentUpdate = (newContent: SiteContent) => {
      console.log('🔄 useContent: Content update received');
      setContent({ ...newContent });
    };

    // Subscribe to content manager
    const unsubscribe = contentManager.subscribe(handleContentUpdate);
    
    return () => {
      unsubscribe();
    };
  }, []);

  return { ...content };
};

// Hook para seção específica
export const useContentSection = <K extends keyof SiteContent>(section: K): SiteContent[K] => {
  const content = useContent();
  return { ...content[section] };
};