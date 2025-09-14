import React from 'react';
import { useContentSection } from '../../hooks/useContent';

export const NoFiltersBlock: React.FC = () => {
  const { noFilters } = useContentSection('titleBlocks');
  
  return (
    <div className="w-full max-w-sm mx-auto text-center px-4">
      <h2 className="text-3xl sm:text-4xl font-black mb-3 leading-tight">
        <span className={`${noFilters.titleColor} drop-shadow-lg`}>
          {noFilters.title}
        </span>
      </h2>
      <p className={`${noFilters.subtitleColor} text-base sm:text-lg font-semibold text-center`}>
        {noFilters.subtitle}
      </p>
    </div>
  );
};