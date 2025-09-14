import React from 'react';

export const MedicalAdvisoryBlock: React.FC = () => {
  return (
    <div className="w-full max-w-sm mx-auto px-4">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 rounded-lg p-2 flex-shrink-0">
            <div className="w-6 h-6 text-white flex items-center justify-center">
              🏥
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-blue-300 font-bold text-lg mb-1">
              Medical Advisory Board
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Reviewed and approved by licensed medical professionals
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};