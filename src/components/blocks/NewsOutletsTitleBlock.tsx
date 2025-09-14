import React from 'react';
import { useContentSection } from '../../hooks/useContent';

export const NewsOutletsTitleBlock: React.FC = () => {
  const { newsOutlets } = useContentSection('titleBlocks');
  
  return (
    <div className="w-full max-w-sm mx-auto text-center px-4">
      <h2 className="text-3xl sm:text-4xl font-black mb-3 leading-tight">
        <span className={`${newsOutlets.titleColor} drop-shadow-lg`}>
          {newsOutlets.title}
        </span>
      </h2>
      <p className={`${newsOutlets.subtitleColor} text-lg font-semibold mb-4`}>
        {newsOutlets.subtitle}
      </p>
      <div className="flex items-center justify-center gap-2 text-cyan-300 text-sm sm:text-base font-semibold">
        <span className="text-xl">👆</span>
        <span className="text-center">{newsOutlets.dragInstruction}</span>
      </div>
    </div>
  );
};