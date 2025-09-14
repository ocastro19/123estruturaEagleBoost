import React from 'react';
import { useTracking } from './TrackingProvider';
import { useContentSection } from '../hooks/useContent';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const { trackClick } = useTracking();
  const footer = useContentSection('footer');

  const handleFooterClick = () => {
    trackClick('footer_interaction', {
      utm_content: 'footer',
      utm_term: 'footer_click'
    });
  };

  return (
    <footer className={`w-full ${className}`}>
      <div 
        className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-12 px-6 cursor-pointer rounded-3xl mx-4 shadow-2xl border border-white/10"
        onClick={handleFooterClick}
      >
        <div className="max-w-2xl mx-auto">
          {/* Copyright Section */}
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <img
                src="https://imgur.com/gOC08r7"
                alt="EAGLEBOOST Logo"
                className="h-12 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `
                    <div class="text-blue-100 font-black text-2xl tracking-wide">
                      ${footer.brandName}
                    </div>
                  `;
                }}
              />
            </div>
            
            <h3 className="text-blue-100 text-xl font-bold mb-2 tracking-wide">
              {footer.copyright}
            </h3>
            <p className="text-blue-200 text-lg font-medium">
              All Rights Reserved
            </p>
          </div>
          
          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent mb-8"></div>
          
          {/* FDA Disclaimer */}
          <div className="text-center">
            <p className="text-blue-300 text-sm leading-relaxed max-w-xl mx-auto">
              {footer.disclaimer}
            </p>
          </div>
          
          {/* Additional Professional Elements */}
          <div className="mt-8 pt-6 border-t border-blue-700/30">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-blue-400 text-xs">
              {footer.links.map((link, index) => (
                <React.Fragment key={index}>
                  <span className="hover:text-blue-300 transition-colors cursor-pointer">{link}</span>
                  {index < footer.links.length - 1 && <span className="hidden sm:block">•</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};