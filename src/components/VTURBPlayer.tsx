import React, { useEffect, useRef, useState } from 'react';

interface VTURBPlayerProps {
  embedCode: string;
  aspectRatio: '16:9' | '9:16';
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export const VTURBPlayer: React.FC<VTURBPlayerProps> = ({ 
  embedCode, 
  aspectRatio,
  className = '', 
  style = {},
  onLoad,
  onError 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  /**
   * Extracts video URL from iframe onload attribute
   */
  const extractVideoUrl = (onloadAttr: string): string | null => {
    try {
      // Look for patterns like: this.src="<url>" or this.src='<url>'
      const urlMatch = onloadAttr.match(/this\.src\s*=\s*["']([^"']+)["']/);
      if (urlMatch && urlMatch[1]) {
        return urlMatch[1];
      }
      
      // Alternative pattern: src="<url>"
      const altMatch = onloadAttr.match(/src\s*=\s*["']([^"']+)["']/);
      if (altMatch && altMatch[1]) {
        return altMatch[1];
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting video URL:', error);
      return null;
    }
  };

  /**
   * Processes iframe element to extract and set video URL
   */
  const processIframe = (iframe: HTMLIFrameElement): void => {
    const onloadAttr = iframe.getAttribute('onload');
    
    if (onloadAttr) {
      // Extract video URL from onload attribute
      const videoUrl = extractVideoUrl(onloadAttr);
      
      if (videoUrl) {
        // Remove onload attribute to prevent conflicts
        iframe.removeAttribute('onload');
        
        // Set src directly
        iframe.src = videoUrl;
        
        // Add load event listener
        iframe.addEventListener('load', () => {
          setIsLoading(false);
          onLoad?.();
        });
        
        // Add error event listener
        iframe.addEventListener('error', () => {
          const error = new Error('Failed to load VTURB video');
          setHasError(true);
          setIsLoading(false);
          onError?.(error);
        });
        
        console.log('🎥 VTURB iframe processed with URL:', videoUrl);
      } else {
        console.warn('⚠️ Could not extract video URL from onload attribute');
        // Fallback: try to execute the original onload
        try {
          const func = new Function('iframe', onloadAttr.replace(/this/g, 'iframe'));
          func(iframe);
        } catch (error) {
          console.error('Error executing iframe onload:', error);
        }
      }
    } else {
      // No onload attribute, iframe might already have src set
      if (iframe.src && iframe.src !== 'about:blank') {
        iframe.addEventListener('load', () => {
          setIsLoading(false);
          onLoad?.();
        });
        
        iframe.addEventListener('error', () => {
          const error = new Error('Failed to load VTURB video');
          setHasError(true);
          setIsLoading(false);
          onError?.(error);
        });
      }
    }
  };
  useEffect(() => {
    if (!embedCode || !containerRef.current) {
      setIsLoading(false);
      return;
    }

    const container = containerRef.current;
    setIsLoading(true);
    setHasError(false);
    
    // Função de cleanup mais rigorosa
    const cleanup = () => {
      // Remove todos os elementos existentes
      const existingIframes = container.querySelectorAll('iframe');
      existingIframes.forEach(iframe => iframe.remove());
      
      const existingVturbElements = container.querySelectorAll('[id*="vturb"], [id*="ifr_"]');
      existingVturbElements.forEach(element => element.remove());
      
      // Remove scripts duplicados
      const existingScripts = container.querySelectorAll('script');
      existingScripts.forEach(script => script.remove());
      
      // Limpa completamente o container
      container.innerHTML = '';
    };
    
    try {
      // Executa cleanup antes de carregar novo conteúdo
      cleanup();
      
      // Processa o embed code de forma mais controlada
      const timestamp = Date.now();
      const uniqueId = `vturb_${timestamp}`;
      
      // Modifica IDs para serem únicos
      let modifiedEmbedCode = embedCode
        .replace(/id='([^']+)'/g, `id='${uniqueId}_$1'`)
        .replace(/id="([^"]+)"/g, `id="${uniqueId}_$1"`);
      
      // Insere diretamente no container
      container.innerHTML = modifiedEmbedCode;
      
      // Processa iframes após inserção
      const iframes = container.querySelectorAll('iframe');
      iframes.forEach((iframe) => {
        processIframe(iframe as HTMLIFrameElement);
      });
      
      // Processa scripts de forma sequencial
      const containerScripts = container.querySelectorAll('script');
      let scriptIndex = 0;
      
      const loadNextScript = () => {
        if (scriptIndex >= containerScripts.length) {
          // Define loading como false se não há iframes
          const processedIframes = container.querySelectorAll('iframe');
          if (processedIframes.length === 0) {
            setIsLoading(false);
            onLoad?.();
          }
          return;
        }
        
        const script = containerScripts[scriptIndex];
        const scriptSrc = script.src;
        const scriptContent = script.textContent || script.innerHTML;
        
        scriptIndex++;
        
        if (scriptSrc) {
          // Script externo - evita duplicação
          if (!scriptLoadedRef.current.has(scriptSrc)) {
            const newScript = document.createElement('script');
            newScript.src = scriptSrc;
            newScript.async = true;
            
            newScript.onload = () => {
              scriptLoadedRef.current.add(scriptSrc);
              setTimeout(loadNextScript, 100);
            };
            
            newScript.onerror = () => {
              const error = new Error(`Falha ao carregar script VTURB: ${scriptSrc}`);
              setHasError(true);
              setIsLoading(false);
              onError?.(error);
              loadNextScript();
            };
            
            document.head.appendChild(newScript);
          } else {
            loadNextScript();
          }
        } else if (scriptContent) {
          // Script inline - executa com controle de erro
          try {
            // Remove o script original para evitar duplicação
            script.remove();
            // Executa o conteúdo
            const func = new Function(scriptContent);
            func();
          } catch (e) {
            console.error('Erro ao executar script inline:', e);
          }
          setTimeout(loadNextScript, 50);
        } else {
          loadNextScript();
        }
      };
      
      // Inicia o carregamento dos scripts
      loadNextScript();
      
    } catch (error) {
      console.error('Erro ao processar embed VTURB:', error);
      setHasError(true);
      setIsLoading(false);
      onError?.(error as Error);
    }
    
    // Retorna função de cleanup para quando o componente for desmontado
    return cleanup;
  }, [embedCode, onLoad, onError]);

  if (!embedCode) {
    return (
      <div className={`w-full bg-gray-100 flex items-center justify-center ${className}`} style={style}>
        <p className="text-gray-500">Nenhum vídeo disponível</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`w-full bg-gray-100 flex items-center justify-center ${className}`} style={{
        aspectRatio: aspectRatio || '16/9',
        ...style
      }}>
        <p className="text-gray-500">Erro ao carregar vídeo</p>
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{
      aspectRatio: aspectRatio || '16/9',
      ...style
    }}>
      {isLoading && (
        <div className={`absolute inset-0 bg-gray-100 flex items-center justify-center z-10 ${className}`}>
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 text-sm">Carregando vídeo...</p>
          </div>
        </div>
      )}
      <div 
        ref={containerRef}
        className={`w-full h-full ${className}`}
      />
    </div>
  );
};

export default VTURBPlayer;