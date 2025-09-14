import React from 'react';
import { useContentSection } from '../../hooks/useContent';

export const ClinicallyReviewedBlock: React.FC = () => {
  const { clinicallyReviewed } = useContentSection('titleBlocks');
  
  return (
    <div className="w-full max-w-sm mx-auto text-center px-4 mb-8">
      <h2 className="text-3xl sm:text-4xl font-black mb-3 leading-tight">
        <span className={`${clinicallyReviewed.titleColor} drop-shadow-lg`}>
          {clinicallyReviewed.title}
        </span>
      </h2>
      <p className={`${clinicallyReviewed.subtitleColor} text-lg font-semibold`}>
        {clinicallyReviewed.subtitle}
      </p>
    </div>
  );
};