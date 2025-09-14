import React from 'react';
import { Shield, Truck, Clock } from 'lucide-react';
import { useTracking } from './TrackingProvider';
import { useContentSection } from '../hooks/useContent';

interface AlternativeOffersProps {
  className?: string;
}

export const AlternativeOffers: React.FC<AlternativeOffersProps> = ({ className = '' }) => {
  const { trackClick } = useTracking();
  const alternativeOffers = useContentSection('alternativeOffers');

  const handleBuyNowClick = (packageType: '3-bottle' | '2-bottle') => {
    trackClick(`buy_now_${packageType}`, {
      utm_content: 'alternative_offers',
      utm_term: packageType,
      utm_campaign: 'secondary_offers'
    });
    
    // Redirect to URL if configured
    const offer = packageType === '3-bottle' ? alternativeOffers.offer1 : alternativeOffers.offer2;
    if (offer.buttonUrl) {
      window.open(offer.buttonUrl, '_blank');
    }
  };

  const handleProductImageClick = (packageType: '3-bottle' | '2-bottle') => {
    trackClick(`product_image_${packageType}`, {
      utm_content: 'alternative_product_image',
      utm_term: packageType
    });
  };

  return (
    <div className={`w-full max-w-sm mx-auto ${className}`}>
      <div className="flex gap-2 min-h-[350px]">
        {/* 3 Bottle Package - Left Card */}
        <div className="flex-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-2xl shadow-xl overflow-hidden relative">
          <div className="p-4 h-full flex flex-col">
            {/* Product Image */}
            <div 
              className="cursor-pointer transition-transform hover:scale-105 mb-3"
              onClick={() => handleProductImageClick('3-bottle')}
            >
              <img 
                src={alternativeOffers.offer1.productImage}
                alt={`EAGLEBOOST ${alternativeOffers.offer1.packageName}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `
                    <div class="w-full h-full bg-blue-800 rounded-lg flex items-center justify-center">
                      <div class="text-center text-white">
                        <div class="text-xl mb-1">💊💊💊</div>
                        <div class="font-bold text-xs">${alternativeOffers.offer1.packageName}</div>
                      </div>
                    </div>
                  `;
                }}
              />
            </div>

            {/* Product Title */}
            <div className="text-center mb-1">
              <h3 className="text-white font-black text-lg tracking-wide">{alternativeOffers.offer1.productName}</h3>
              <p className="text-blue-100 text-sm font-bold tracking-wide">{alternativeOffers.offer1.packageName}</p>
            </div>

            {/* Savings */}
            <div className="text-center mb-1">
              <div className="text-yellow-300 font-black text-lg">{alternativeOffers.offer1.savings}</div>
            </div>

            {/* CTA Button */}
            <div className="mt-auto">
              <button
                onClick={() => handleBuyNowClick('3-bottle')}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-black text-sm py-4 px-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 mb-2"
              >
                BUY NOW
              </button>

              {/* Pricing */}
               <div className="text-center mb-1">
                  <p className="text-white text-xs">
                    <span className="font-bold">{alternativeOffers.offer1.pricePerBottle} per bottle, {alternativeOffers.offer1.totalPrice} total</span>
                  </p>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="flex justify-center gap-1">
              <div className="bg-blue-800 rounded-lg px-2 py-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-yellow-300" />
                <span className="text-white text-xs font-bold">{alternativeOffers.offer1.guarantee}</span>
              </div>
              <div className="bg-blue-800 rounded-lg px-2 py-1 flex items-center gap-1">
                <Truck className="w-3 h-3 text-yellow-300" />
                <span className="text-white text-xs font-bold">{alternativeOffers.offer1.shipping}</span>
              </div>
              <div className="bg-blue-800 rounded-lg px-2 py-1 flex items-center gap-1">
                <Shield className="w-3 h-3 text-yellow-300" />
                <span className="text-white text-xs font-bold">{alternativeOffers.offer1.security}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2 Bottle Package - Right Card */}
        <div className="flex-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-2xl shadow-xl overflow-hidden relative">
          <div className="p-4 h-full flex flex-col">
            {/* Product Image */}
            <div 
              className="cursor-pointer transition-transform hover:scale-105 mb-3"
              onClick={() => handleProductImageClick('2-bottle')}
            >
              <img 
                src={alternativeOffers.offer2.productImage}
                alt={`EAGLEBOOST ${alternativeOffers.offer2.packageName}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `
                    <div class="w-full h-full bg-blue-800 rounded-lg flex items-center justify-center">
                      <div class="text-center text-white">
                        <div class="text-xl mb-1">💊💊</div>
                        <div class="font-bold text-xs">${alternativeOffers.offer2.packageName}</div>
                      </div>
                    </div>
                  `;
                }}
              />
            </div>

            {/* Product Title */}
            <div className="text-center mb-1">
              <h3 className="text-white font-black text-lg tracking-wide">{alternativeOffers.offer2.productName}</h3>
              <p className="text-blue-100 text-sm font-bold tracking-wide">{alternativeOffers.offer2.packageName}</p>
            </div>

            {/* Savings */}
            <div className="text-center mb-1">
              <div className="text-yellow-300 font-black text-lg">{alternativeOffers.offer2.savings}</div>
            </div>

            {/* CTA Button */}
            <div className="mt-auto">
              <button
                onClick={() => handleBuyNowClick('2-bottle')}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-black text-sm py-4 px-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 mb-2"
              >
                BUY NOW
              </button>

              {/* Pricing */}
               <div className="text-center mb-1">
                  <p className="text-white text-xs">
                    <span className="font-bold">{alternativeOffers.offer2.pricePerBottle} per bottle, {alternativeOffers.offer2.totalPrice} total</span>
                  </p>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="flex justify-center gap-1">
              <div className="bg-blue-800 rounded-lg px-2 py-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-yellow-300" />
                <span className="text-white text-xs font-bold">{alternativeOffers.offer2.guarantee}</span>
              </div>
              <div className="bg-blue-800 rounded-lg px-2 py-1 flex items-center gap-1">
                <Truck className="w-3 h-3 text-yellow-300" />
                <span className="text-white text-xs font-bold">{alternativeOffers.offer2.shipping}</span>
              </div>
              <div className="bg-blue-800 rounded-lg px-2 py-1 flex items-center gap-1">
                <Shield className="w-3 h-3 text-yellow-300" />
                <span className="text-white text-xs font-bold">{alternativeOffers.offer2.security}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};