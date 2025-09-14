import React from 'react';
import { useTracking } from '../TrackingProvider';
import { useContent } from '../../hooks/useContent';

export const SuccessStoryCTABlock: React.FC = () => {
  const { trackClick } = useTracking();
  const content = useContent();
  const ctaConfig = content.customCTAs.successStoryCTA;
  const mainOffer = content.mainOffer;

  const handleSuccessStoryClick = () => {
    trackClick('success_story_cta', {
      utm_content: 'success_story_button',
      utm_term: 'ready_to_be_next_success',
      utm_campaign: 'transformation_cta'
    });
    
    // Scroll to main offer section
    setTimeout(() => {
      const mainOfferElement = document.getElementById('oferta-6-bottles');
      if (mainOfferElement) {
        mainOfferElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);
  };

  const handleSecureTransformationClick = () => {
    trackClick('secure_transformation', {
      utm_content: 'secure_transformation_link',
      utm_term: 'click_here_secure'
    });
    
    // Scroll to main offer section
    setTimeout(() => {
      const mainOfferElement = document.getElementById('oferta-6-bottles');
      if (mainOfferElement) {
        mainOfferElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);
  };

  // Don't render if disabled
  if (!ctaConfig.enabled) {
    return null;
  }

  return (
    <div className="w-full max-w-sm mx-auto px-4">
      {/* Main CTA Button */}
      <button
        onClick={handleSuccessStoryClick}
        className={`w-full bg-gradient-to-r ${ctaConfig.backgroundColor} hover:opacity-90 ${ctaConfig.textColor} font-bold text-lg py-5 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 mb-4 ${ctaConfig.usePulseAnimation ? 'pulse' : ''}`}
      >
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl">{ctaConfig.icon}</span>
          <span className="text-center leading-tight">
            {ctaConfig.text}
          </span>
        </div>
      </button>
      
      {/* Secondary Action */}
      <div className="text-center space-y-2">
        <div 
          className="flex items-center justify-center gap-2 text-green-400 text-base font-semibold cursor-pointer hover:text-green-300 transition-colors duration-300"
          onClick={handleSecureTransformationClick}
        >
          <span className="text-xl">👆</span>
          <span>Click here to secure your transformation</span>
        </div>
        <p className="text-blue-200 text-sm font-medium">
          Join 50,000+ men who chose EAGLEBOOST for lasting results
        </p>
      </div>
    </div>
  );
};