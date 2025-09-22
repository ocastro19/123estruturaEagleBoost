import React from 'react';
import { useContentSection } from '../../hooks/useContent';

export const NewsOutletsTitleBlock: React.FC = () => {
  const { newsOutlets } = useContentSection('titleBlocks');
  
  // Garantir que os dados estão corretos
  const safeNewsOutlets = {
    title: newsOutlets?.title || "As Seen In Major News Outlets",
    subtitle: newsOutlets?.subtitle || "Leading Health Publications Cover EAGLEBOOST",
    dragInstruction: newsOutlets?.dragInstruction || "Drag to navigate between news articles",
    titleColor: newsOutlets?.titleColor || "bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent",
    subtitleColor: newsOutlets?.subtitleColor || "text-slate-300"
  };
  
  return (
    <div className="w-full max-w-sm mx-auto text-center px-4">
      <h2 className="text-3xl sm:text-4xl font-black mb-3 leading-tight">
        <span className={`${safeNewsOutlets.titleColor} drop-shadow-lg`}>
          {safeNewsOutlets.title}
        </span>
      </h2>
      <p className={`${safeNewsOutlets.subtitleColor} text-lg font-semibold mb-4`}>
        {safeNewsOutlets.subtitle}
      </p>
      <div className="flex items-center justify-center gap-2 text-cyan-300 text-sm sm:text-base font-semibold">
        <span className="text-xl">👆</span>
        <span className="text-center">{safeNewsOutlets.dragInstruction}</span>
      </div>
    </div>
  );
};