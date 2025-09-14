import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTracking } from './TrackingProvider';
import { useContentSection } from '../hooks/useContent';

interface FAQBlockProps {
  className?: string;
}

export const FAQBlock: React.FC<FAQBlockProps> = ({ className = '' }) => {
  const [activeItems, setActiveItems] = useState<number[]>([]);
  const { trackClick } = useTracking();
  const faqData = useContentSection('faq');

  const toggleFAQ = (itemId: number) => {
    setActiveItems(prev => {
      const isActive = prev.includes(itemId);
      if (isActive) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });

    trackClick('faq_toggle', {
      utm_content: 'faq_interaction',
      utm_term: `faq_item_${itemId}`,
      utm_campaign: 'faq_engagement'
    });
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-t-2xl p-3 sm:p-4 relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
        
        <h2 className="text-white font-bold text-lg sm:text-xl relative z-10">
          {faqData.title}
        </h2>
      </div>

      {/* FAQ Container */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-b-2xl overflow-hidden">
        {faqData.items.map((item, index) => (
          <div
            key={item.id}
            className={`border-b border-white/10 last:border-b-0 transition-all duration-300 hover:bg-white/5 ${
              activeItems.includes(item.id) ? 'bg-white/5' : ''
            }`}
          >
            {/* Question */}
            <div
              className="p-3 sm:p-4 cursor-pointer flex justify-between items-center group"
              onClick={() => toggleFAQ(item.id)}
            >
              <span className="text-gray-100 font-semibold text-xs sm:text-sm pr-4 group-hover:text-red-400 transition-colors duration-300">
                {item.question}
              </span>
              <div className="flex-shrink-0 ml-3">
                {activeItems.includes(item.id) ? (
                  <ChevronUp className="w-4 h-4 text-gray-300 transition-transform duration-300" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-300 transition-transform duration-300" />
                )}
              </div>
            </div>

            {/* Answer */}
            <div
              className={`overflow-hidden transition-all duration-400 ease-in-out ${
                activeItems.includes(item.id) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-5 md:pb-6 bg-black/20">
                <p className="text-gray-300 leading-relaxed text-xs">
                  {item.answer}
                </p>
                {item.hasBadge && (
                  <div className="inline-block mt-1 bg-gradient-to-r from-red-600 to-red-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold shadow-lg">
                    {item.badgeText}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};