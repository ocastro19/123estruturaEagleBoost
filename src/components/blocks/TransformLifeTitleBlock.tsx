import React from 'react';
import { useContentSection } from '../../hooks/useContent';

export const TransformLifeTitleBlock: React.FC = () => {
  const { transformLife } = useContentSection('titleBlocks');
  
  return (
    <div className="w-full max-w-sm mx-auto text-center px-4">
      <h2 className="text-3xl sm:text-4xl font-black mb-3 leading-tight">
        <span className={`${transformLife.titleColor} drop-shadow-lg`}>
          {transformLife.title}
        </span>
      </h2>
      <p className={`${transformLife.subtitle1Color} text-lg font-semibold mb-2`}>
        {transformLife.subtitle1}
      </p>
      <p className={`${transformLife.subtitle2Color} text-base font-medium`}>
        {transformLife.subtitle2}
      </p>
    </div>
  );
};