import React from 'react';
import { useTracking } from '../TrackingProvider';

export const TransformationStartsTodayBlock: React.FC = () => {
  const { trackClick } = useTracking();

  const handleTransformationClick = () => {
    trackClick('transformation_starts_today', {
      utm_content: 'transformation_message',
      utm_term: 'transformation_starts_today',
      utm_campaign: 'final_motivation'
    });
  };

  return (
    <div className="w-full max-w-sm mx-auto px-4">
      <div 
        className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 shadow-xl cursor-pointer hover:from-white/15 hover:to-white/10 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl"
        onClick={handleTransformationClick}
      >
        {/* Header com ícone e título em linha */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full p-2 shadow-lg">
            <span className="text-white text-xl">🚀</span>
          </div>
          <h2 className="text-white font-black text-xl sm:text-2xl leading-tight">
            Your Transformation Starts Today
          </h2>
        </div>
        
        {/* Texto descritivo mais compacto */}
        <div className="text-center border-t border-white/20 pt-3">
          <p className="text-blue-200 text-sm font-medium leading-relaxed">
            Join thousands of men who have already discovered the power of EAGLEBOOST. With our 90-day guarantee, you have nothing to lose and everything to gain.
          </p>
        </div>
      </div>
    </div>
  );
};