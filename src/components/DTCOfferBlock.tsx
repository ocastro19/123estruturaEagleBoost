import React from 'react';
import { Shield, Truck, Clock } from 'lucide-react';
import { useTracking } from './TrackingProvider';
import { useContentSection } from '../hooks/useContent';

interface DTCOfferBlockProps {
  className?: string;
}

export const DTCOfferBlock: React.FC<DTCOfferBlockProps> = ({ className = '' }) => {
  const { trackClick, buildTrackingURL } = useTracking();
  const mainOffer = useContentSection('mainOffer');

  const handleClaimOfferClick = () => {
    trackClick('claim_offer_button', {
      utm_content: 'dtc_offer',
      utm_term: 'eagleboost_6_bottles',
      utm_campaign: 'main_offer'
    });
    
    // Check if there's a configured URL to redirect to
    if (mainOffer.buttonUrl && mainOffer.buttonUrl.trim() !== '') {
      window.open(mainOffer.buttonUrl, '_blank');
      return;
    }
    
    // Fallback: Scroll to alternative offers section if no URL is configured
    setTimeout(() => {
      const alternativeOffersElement = document.querySelector('.alternative-offers-section');
      if (alternativeOffersElement) {
        alternativeOffersElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);
  };

  const handleProductImageClick = () => {
    trackClick('product_image', {
      utm_content: 'product_bottles',
      utm_term: 'eagleboost_image'
    });
  };

  return (
    <div id="main-offer" className={`w-full max-w-sm mx-auto relative ${className}`}>
      {/* Best Value Badge - Positioned on the border */}
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold px-6 py-2 rounded-full text-sm shadow-lg">
          ⭐ BEST VALUE
        </div>
      </div>
      
      <div className="bg-gradient-to-b from-blue-500 to-blue-600 rounded-3xl shadow-2xl overflow-hidden relative pt-4 min-h-[600px]">
        {/* Product Image Section */}
        <div className="pt-2 pb-1 px-6">
          <div 
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={handleProductImageClick}
          >
            <img 
              src={mainOffer.productImage}
              alt={`${mainOffer.productName} ${mainOffer.packageName}`}
              className="w-full h-67 object-contain"
              onError={(e) => {
                // Fallback se a imagem não carregar
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `
                  <div class="w-full h-67 bg-blue-800 rounded-lg flex items-center justify-center">
                    <div class="text-center text-white">
                      <div class="text-3xl mb-2">💊</div>
                      <div class="font-black text-xl tracking-wide">${mainOffer.productName}</div>
                      <div class="text-sm opacity-80 font-semibold">${mainOffer.packageName}</div>
                    </div>
                  </div>
                `;
              }}
            />
          </div>
        </div>

        {/* Product Title */}
        <div className="text-center px-6 mb-4">
          <h2 className="text-white font-black text-4xl mb-1 tracking-wide">{mainOffer.productName}</h2>
          <p className="text-blue-100 text-lg font-bold tracking-wide">{mainOffer.packageName}</p>
        </div>

        {/* Savings Banner */}
        <div className="text-center mb-6">
          <div className="text-yellow-300 font-black text-xl tracking-wide">
            {mainOffer.savings}
          </div>
        </div>

        {/* CTA Button */}
        <div className="px-6 mb-6">
          <button
            onClick={handleClaimOfferClick}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-black text-lg py-5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 tracking-wide"
          >
            {mainOffer.buttonText}
          </button>
        </div>

        {/* Pricing */}
        <div className="text-center px-6 mb-6">
          <p className="text-white text-base font-medium">
            only <span className="font-black text-xl">{mainOffer.pricePerBottle} per bottle</span>, {mainOffer.totalPrice} total
          </p>
        </div>

        {/* Trust Badges */}
        <div className="flex justify-center gap-2 px-6 mb-6">
          <div className="bg-blue-800 rounded-lg px-3 py-2 flex items-center gap-1">
            <Clock className="w-4 h-4 text-yellow-300" />
            <span className="text-white text-sm font-bold">{mainOffer.badges.guarantee}</span>
          </div>
          <div className="bg-blue-800 rounded-lg px-3 py-2 flex items-center gap-1">
            <Truck className="w-4 h-4 text-yellow-300" />
            <span className="text-white text-sm font-bold">{mainOffer.badges.shipping}</span>
          </div>
          <div className="bg-blue-800 rounded-lg px-3 py-2 flex items-center gap-1">
            <Shield className="w-4 h-4 text-yellow-300" />
            <span className="text-white text-sm font-bold">{mainOffer.badges.security}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="px-6 pb-8">
          <div className="bg-white rounded-lg p-3">
            <img 
              src="https://imgur.com/lSPuUBx.png"
              alt="Accepted Payment Methods"
              className="w-full h-16 object-contain"
              onError={(e) => {
                // Fallback se a imagem não carregar
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `
                  <div class="flex justify-center items-center gap-2 h-16">
                    <div class="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">VISA</div>
                    <div class="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">MC</div>
                    <div class="bg-orange-600 text-white px-2 py-1 rounded text-xs font-bold">DISC</div>
                    <div class="bg-blue-800 text-white px-2 py-1 rounded text-xs font-bold">AMEX</div>
                    <div class="bg-blue-700 text-white px-2 py-1 rounded text-xs font-bold">PP</div>
                  </div>
                `;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};