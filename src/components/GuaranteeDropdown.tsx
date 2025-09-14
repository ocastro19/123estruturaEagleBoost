import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTracking } from './TrackingProvider';
import { useContentSection } from '../hooks/useContent';

interface GuaranteeDropdownProps {
  className?: string;
}

export const GuaranteeDropdown: React.FC<GuaranteeDropdownProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { trackClick } = useTracking();
  const guarantee = useContentSection('guarantee');

  const handleToggle = () => {
    setIsOpen(!isOpen);
    trackClick('guarantee_dropdown_toggle', {
      utm_content: 'guarantee_dropdown',
      utm_term: isOpen ? 'close_guarantee' : 'open_guarantee'
    });
  };

  return (
    <div className={`w-full max-w-sm mx-auto ${className}`}>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header - Always Visible */}
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-blue-50 hover:shadow-md transition-all duration-200 border-l-4 border-transparent hover:border-blue-400"
          onClick={handleToggle}
        >
          <div className="flex items-center gap-4">
            {/* Badge Icon */}
            <div className="relative">
              <img 
                src="https://imgur.com/gPrJHSX.png"
                alt="90 Days Guarantee Badge"
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `
                    <div class="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <div class="text-center">
                        <div class="text-white text-xs font-bold leading-tight">100%</div>
                        <div class="text-black text-xs font-black leading-tight">90</div>
                        <div class="text-black text-xs font-black leading-tight">DAYS</div>
                      </div>
                    </div>
                  `;
                }}
              />
            </div>
            
            {/* Text Content */}
            <div className="flex-1">
              <h3 className="text-orange-500 font-bold text-xl mb-1">
                {guarantee.title}
              </h3>
              <p className="text-blue-600 text-base font-medium">
                {guarantee.subtitle}
              </p>
            </div>
          </div>
          
          {/* Chevron Icon */}
          <div className="text-blue-600 transition-transform duration-200 hover:scale-110">
            {isOpen ? (
              <ChevronUp className="w-6 h-6" />
            ) : (
              <ChevronDown className="w-6 h-6" />
            )}
          </div>
        </div>
        
        {/* Expandable Content */}
        <div className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="px-4 pb-4">
            {/* Divider Line */}
            <div className="w-full h-px bg-blue-200 mb-4"></div>
            
            {/* Guarantee Text */}
            {guarantee.description.map((paragraph, index) => (
              <div key={index} className="text-blue-700 text-sm leading-relaxed mb-4">
                {paragraph}
              </div>
            ))}
            
            {/* Brand Logo */}
            <div className="flex justify-start">
              <div className="flex items-center">
                <img 
                  src="https://imgur.com/undefined"
                  alt="EAGLEBOOST Logo"
                  className="h-8 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div class="text-blue-600 font-black text-lg tracking-wide">
                        ${guarantee.brandName}
                      </div>
                    `;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};