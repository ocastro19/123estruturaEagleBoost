import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Star, CheckCircle } from 'lucide-react';
import { useTracking } from './TrackingProvider';
import { useContentSection } from '../hooks/useContent';
import { VTURBPlayer } from './VTURBPlayer';

interface CustomerTestimonialsProps {
  className?: string;
}

export const CustomerTestimonials: React.FC<CustomerTestimonialsProps> = ({ className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { trackClick } = useTracking();
  const testimonialsData = useContentSection('testimonials');
  const customers = testimonialsData.customers;

  const nextCustomer = () => {
    setCurrentIndex((prev) => (prev + 1) % customers.length);
    trackClick('customer_carousel_next', {
      utm_content: 'customer_navigation',
      utm_term: `customer_${currentIndex + 1}`
    });
  };

  const prevCustomer = () => {
    setCurrentIndex((prev) => (prev - 1 + customers.length) % customers.length);
    trackClick('customer_carousel_prev', {
      utm_content: 'customer_navigation',
      utm_term: `customer_${currentIndex + 1}`
    });
  };

  const goToCustomer = (index: number) => {
    setCurrentIndex(index);
    trackClick('customer_carousel_dot', {
      utm_content: 'customer_navigation',
      utm_term: `customer_${index + 1}`
    });
  };

  const handleTestimonialClick = (customerId: number) => {
    trackClick('customer_testimonial_click', {
      utm_content: 'customer_testimonial',
      utm_term: `customer_${customerId}_testimonial`
    });
  };

  const getCardStyle = (index: number) => {
    const diff = index - currentIndex;
    const totalCards = customers.length;
    
    // Normalize difference to handle circular array
    const normalizedDiff = ((diff % totalCards) + totalCards) % totalCards;
    const adjustedDiff = normalizedDiff > totalCards / 2 ? normalizedDiff - totalCards : normalizedDiff;
    
    if (adjustedDiff === 0) {
      // Center card
      return {
        transform: 'translateX(0%) scale(1)',
        zIndex: 30,
        opacity: 1,
        filter: 'blur(0px)'
      };
    } else if (adjustedDiff === 1) {
      // Right card
      return {
        transform: 'translateX(50%) translateY(-15%) scale(0.75) rotate(8deg)',
        zIndex: 20,
        opacity: 0.8,
        filter: 'blur(1px)'
      };
    } else if (adjustedDiff === -1) {
      // Left card
      return {
        transform: 'translateX(-50%) translateY(-15%) scale(0.75) rotate(-8deg)',
        zIndex: 20,
        opacity: 0.8,
        filter: 'blur(1px)'
      };
    } else {
      // Hidden cards
      return {
        transform: 'translateX(0%) scale(0.6)',
        zIndex: 10,
        opacity: 0,
        filter: 'blur(2px)'
      };
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* Carousel Container */}
      <div className="relative h-[420px] mb-6 overflow-visible px-8">
        {customers.map((customer, index) => (
          <div
            key={customer.id}
            className="absolute inset-0 transition-all duration-700 ease-in-out"
            style={getCardStyle(index)}
          >
            <div className="bg-white rounded-2xl shadow-xl p-4 h-full flex flex-col mx-2">
              {/* Customer Header */}
              <div className="flex items-center gap-2 mb-1">
                <div className="relative">
                  <img
                    src={customer.photo}
                    alt={customer.name}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://imgur.com/uEGrHTs.png`;
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-blue-900 text-xs leading-tight">{customer.name}</h3>
                  <p className="text-blue-600 text-xs font-medium leading-tight">{customer.location}</p>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="flex justify-start mb-1">
                <div className="bg-green-500 text-white px-1 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                  <CheckCircle className="w-2 h-2" />
                  VERIFIED
                </div>
              </div>

              {/* Testimonial */}
              <div className="mb-1">
                <blockquote className="text-blue-800 text-xs italic leading-tight">
                  "{customer.testimonial}"
                </blockquote>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center gap-1 mb-1">
                {renderStars(customer.rating)}
                <span className="text-blue-800 font-bold text-xs ml-1">{customer.rating.toFixed(1)}</span>
              </div>

              {/* VTURB Video Testimonial */}
              <div className="flex-1 w-full overflow-hidden rounded-lg bg-gray-100 min-h-[200px]">
                <VTURBPlayer 
                  embedCode={customer.videoEmbed}
                  aspectRatio="9:16"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mb-4">
        {customers.map((_, index) => (
          <button
            key={index}
            onClick={() => goToCustomer(index)}
            className={`w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 ${
              index === currentIndex
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};