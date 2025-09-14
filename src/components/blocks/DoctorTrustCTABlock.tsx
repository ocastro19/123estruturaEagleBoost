import React from 'react';
import { useTracking } from '../TrackingProvider';
import { useContent } from '../../hooks/useContent';

export const DoctorTrustCTABlock: React.FC = () => {
  const { trackClick } = useTracking();
  const content = useContent();
  const ctaConfig = content.customCTAs.doctorTrustCTA;
  const mainOffer = content.mainOffer;

  const handleDoctorTrustClick = () => {
    trackClick('doctor_trust_cta', {
      utm_content: 'doctor_trust',
      utm_term: 'start_treatment_now',
      utm_campaign: 'doctor_approved_cta'
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

  const handleTapInstructionClick = () => {
    trackClick('tap_instruction', {
      utm_content: 'tap_instruction',
      utm_term: 'doctor_approved_treatment'
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
        onClick={handleDoctorTrustClick}
        className={`w-full bg-gradient-to-r ${ctaConfig.backgroundColor} hover:opacity-90 ${ctaConfig.textColor} font-bold text-lg py-5 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 mb-4 ${ctaConfig.usePulseAnimation ? 'pulse' : ''}`}
      >
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl">{ctaConfig.icon}</span>
          <span className="text-center leading-tight">
            {ctaConfig.text.split(' — ').map((part, index) => (
              <React.Fragment key={index}>
                {part}
                {index === 0 && ctaConfig.text.includes(' — ') && <br />}
              </React.Fragment>
            ))}
          </span>
        </div>
      </button>
      
      {/* Tap Instruction */}
      <div className="text-center space-y-2">
        <div 
          className="flex items-center justify-center gap-2 text-yellow-300 text-base font-semibold cursor-pointer"
          onClick={handleTapInstructionClick}
        >
          <span className="text-xl">👆</span>
          <span className="text-center">Tap to start your doctor-approved treatment</span>
        </div>
        <p className="text-blue-200 text-sm font-medium">
          Clinically reviewed • MD verified • 90-day guarantee
        </p>
      </div>
    </div>
  );
};