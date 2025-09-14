import React, { useState, useEffect } from 'react';
import { contentManager } from '../utils/contentManager';

interface ContentBlockerProps {
  children: React.ReactNode;
  contentId?: string;
  disabled?: boolean;
}

interface ContentBlockerState {
  unlockTimeMinutes: number;
}

const ContentBlocker: React.FC<ContentBlockerProps> = ({ children, contentId = 'default', disabled = false }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<ContentBlockerState | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);

  const formatTime = (minutes: number): string => {
    const totalSeconds = Math.floor(minutes * 60);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get content configuration
  const content = contentManager.getContent();
  const contentBlocker = content.contentBlocker;

  useEffect(() => {
    if (disabled || !contentBlocker?.enabled) {
      setIsUnlocked(true);
      return;
    }

    const storageKey = `contentBlocker_${contentId}`;
    const unlockTimeMinutes = contentBlocker.unlockTimeMinutes || 0;

    // Check if content is already unlocked
    const storedData = localStorage.getItem(storageKey);
    if (storedData) {
      try {
        const { unlockTime, config } = JSON.parse(storedData);
        const now = Date.now();
        
        // If unlock time has passed, unlock content
        if (now >= unlockTime) {
          setIsUnlocked(true);
          return;
        }
        
        // If configuration changed, reset timer
        const newConfig = JSON.stringify({ unlockTimeMinutes });
        if (config !== newConfig) {
          localStorage.removeItem(storageKey);
        } else {
          // Timer still active
          const remainingTimeMs = unlockTime - now;
          setRemainingTime(remainingTimeMs / 1000 / 60);
          
          const interval = setInterval(() => {
            const currentTime = Date.now();
            const timeLeft = (unlockTime - currentTime) / 1000 / 60;
            
            if (timeLeft <= 0) {
              setIsUnlocked(true);
              clearInterval(interval);
            } else {
              setRemainingTime(timeLeft);
            }
          }, 1000);
          
          setTimeout(() => {
            setIsUnlocked(true);
            clearInterval(interval);
          }, remainingTimeMs);
          return;
        }
      } catch (error) {
        localStorage.removeItem(storageKey);
      }
    }

    // Start new timer
    if (unlockTimeMinutes > 0) {
      const unlockTime = Date.now() + (unlockTimeMinutes * 60 * 1000);
      const config = JSON.stringify({ unlockTimeMinutes });
      
      localStorage.setItem(storageKey, JSON.stringify({ unlockTime, config }));
      
      setRemainingTime(unlockTimeMinutes);
      
      const interval = setInterval(() => {
        const currentTime = Date.now();
        const timeLeft = (unlockTime - currentTime) / 1000 / 60;
        
        if (timeLeft <= 0) {
          setIsUnlocked(true);
          clearInterval(interval);
          // Scroll to main offer when content is unlocked
          setTimeout(() => {
            const mainOfferElement = document.getElementById('main-offer');
            if (mainOfferElement) {
              mainOfferElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
              });
            }
          }, 500); // Small delay to ensure content is rendered
        } else {
          setRemainingTime(timeLeft);
        }
      }, 1000);
      
      setTimeout(() => {
        setIsUnlocked(true);
        clearInterval(interval);
        // Scroll to main offer when content is unlocked
        setTimeout(() => {
          const mainOfferElement = document.getElementById('main-offer');
          if (mainOfferElement) {
            mainOfferElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 500); // Small delay to ensure content is rendered
      }, unlockTimeMinutes * 60 * 1000);
    } else {
      // No timer set, unlock immediately
      setIsUnlocked(true);
    }

    setCurrentConfig({ unlockTimeMinutes });
  }, [contentId, disabled, contentBlocker]);

  // Track configuration changes
  useEffect(() => {
    if (!contentBlocker?.enabled) return;

    const newConfig = {
      unlockTimeMinutes: contentBlocker.unlockTimeMinutes || 0
    };

    if (JSON.stringify(currentConfig) !== JSON.stringify(newConfig)) {
      // Configuration changed, reset storage
      const storageKey = `contentBlocker_${contentId}`;
      localStorage.removeItem(storageKey);
      setCurrentConfig(newConfig);
      setIsUnlocked(false);
    }
  }, [contentBlocker, contentId, currentConfig]);

  // Return children if unlocked or disabled
  if (isUnlocked || disabled || !contentBlocker?.enabled) {
    return <>{children}</>;
  }

  // Content is blocked - return null (invisible blocking)
  return null;
};

export default ContentBlocker;
export { ContentBlocker };