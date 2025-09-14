import React from 'react';
import { useContentSection } from '../../hooks/useContent';

export const HeaderBlock: React.FC = () => {
  const doctors = useContentSection('doctors');
  const { clinicallyReviewed } = useContentSection('titleBlocks');

  return (
    <div className="w-full max-w-sm mx-auto text-center px-4 mb-8">
      <h2 className="text-3xl sm:text-4xl font-black mb-3 leading-tight">
        <span className={`${clinicallyReviewed.titleColor} drop-shadow-lg`}>
          {clinicallyReviewed.title}
        </span>
        <br />
        <span className={`${clinicallyReviewed.subtitleColor} drop-shadow-lg`}>
          {clinicallyReviewed.subtitle}
        </span>
      </h2>
      <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl p-3 mb-4 border border-yellow-400/30">
        <p className="text-white text-xl font-bold tracking-wide">
          {doctors.subtitle}
        </p>
      </div>
      <div className="flex items-center justify-center gap-3 text-cyan-300 text-base font-semibold">
        <div className="animate-bounce">👇</div>
        <span className="text-center">
          {doctors.dragInstruction}
        </span>
      </div>
    </div>
  );
};