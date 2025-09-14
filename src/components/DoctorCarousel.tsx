import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, CheckCircle } from 'lucide-react';
import { useTracking } from './TrackingProvider';
import { useContentSection } from '../hooks/useContent';
import { VTURBPlayer } from './VTURBPlayer';

interface DoctorCarouselProps {
  className?: string;
}

export const DoctorCarousel: React.FC<DoctorCarouselProps> = ({ className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { trackClick } = useTracking();
  const doctorsData = useContentSection('doctors');
  const doctors = doctorsData.doctors;
  
  // Debug: Log doctors count
  console.log('DoctorCarousel: Loading', doctors?.length || 0, 'doctors');
  
  // Safety check for doctors array
  if (!doctors || doctors.length === 0) {
    return (
      <div className="w-full max-w-sm mx-auto text-center px-4">
        <p className="text-white">Carregando doutores...</p>
      </div>
    );
  }

  const nextDoctor = () => {
    setCurrentIndex((prev) => (prev + 1) % doctors.length);
    trackClick('doctor_carousel_next', {
      utm_content: 'doctor_navigation',
      utm_term: `doctor_${currentIndex + 1}`
    });
  };

  const prevDoctor = () => {
    setCurrentIndex((prev) => (prev - 1 + doctors.length) % doctors.length);
    trackClick('doctor_carousel_prev', {
      utm_content: 'doctor_navigation',
      utm_term: `doctor_${currentIndex + 1}`
    });
  };

  const goToDoctor = (index: number) => {
    setCurrentIndex(index);
    trackClick('doctor_carousel_dot', {
      utm_content: 'doctor_navigation',
      utm_term: `doctor_${index + 1}`
    });
  };

  const handleVideoClick = (doctorId: number) => {
    trackClick('doctor_video_click', {
      utm_content: 'doctor_video',
      utm_term: `doctor_${doctorId}_video`
    });
  };



  const getCardStyle = (index: number) => {
    const diff = index - currentIndex;
    const totalCards = doctors.length;
    
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

  return (
    <div className={`w-full max-w-sm mx-auto ${className}`}>
      {/* Carousel Container */}
      <div className="relative h-[420px] mb-6 overflow-visible px-8">
        {doctors.map((doctor, index) => (
          <div
            key={doctor.id}
            className="absolute inset-0 transition-all duration-700 ease-in-out"
            style={getCardStyle(index)}
          >
            <div className="bg-white rounded-2xl shadow-xl p-4 h-full flex flex-col mx-2">
              {/* Doctor Header */}
              <div className="flex items-center gap-2 mb-1">
                <div className="relative">
                  <img
                    src={doctor.photo}
                    alt={doctor.name}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://imgur.com/Jsdpslh.png`;
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-blue-900 text-xs leading-tight">{doctor.name}</h3>
                  <p className="text-blue-600 text-xs font-medium leading-tight">{doctor.title}</p>
                  <p className="text-blue-500 text-xs leading-tight">{doctor.institution}</p>
                </div>
              </div>

              {/* MD Verified Badge */}
              <div className="flex justify-start mb-1">
                <div className="bg-green-500 text-white px-1 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                  <CheckCircle className="w-2 h-2" />
                  VERIFIED
                </div>
              </div>

              {/* Recommendation */}
              <div className="mb-1">
                <blockquote className="text-blue-800 text-xs italic leading-tight">
                  "{doctor.recommendation}"
                </blockquote>
              </div>

              {/* VTURB Video */}
              <div className="flex-1 w-full bg-gray-100 rounded-lg overflow-hidden min-h-[200px]">
                <VTURBPlayer 
                  embedCode={doctor.videoEmbed}
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
        {doctors.map((_, index) => (
          <button
            key={index}
            onClick={() => goToDoctor(index)}
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