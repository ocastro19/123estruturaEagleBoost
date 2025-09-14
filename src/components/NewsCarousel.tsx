import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useTracking } from './TrackingProvider';
import { useContentSection } from '../hooks/useContent';
import { VTURBPlayer } from './VTURBPlayer';

interface NewsCarouselProps {
  className?: string;
}

export const NewsCarousel: React.FC<NewsCarouselProps> = ({ className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { trackClick } = useTracking();
  const newsData = useContentSection('news');
  const newsArticles = newsData.articles;

  const goToArticle = (index: number) => {
    setCurrentIndex(index);
    trackClick('news_carousel_dot', {
      utm_content: 'news_navigation',
      utm_term: `article_${index + 1}`
    });
  };

  const handleReadArticleClick = (articleId: number, outlet: string) => {
    const article = newsArticles.find(a => a.id === articleId);
    
    trackClick('read_article_button', {
      utm_content: 'news_article',
      utm_term: `${outlet.toLowerCase().replace(/\s+/g, '_')}_article`,
      utm_campaign: 'news_outlets'
    });
    
    // Redirect to article URL if provided
    if (article?.redirectUrl) {
      window.open(article.redirectUrl, '_blank');
    }
  };

  const getCardStyle = (index: number) => {
    const diff = index - currentIndex;
    const totalCards = newsArticles.length;
    
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
      <div className="relative h-64 mb-6 overflow-visible px-8">
        {newsArticles.map((article, index) => (
          <div
            key={article.id}
            className="absolute inset-0 transition-all duration-700 ease-in-out"
            style={getCardStyle(index)}
          >
            <div className="bg-white rounded-2xl shadow-xl p-3 h-full flex flex-col mx-2">
              {/* News Outlet Logo */}
              <div className="flex justify-center mb-1">
                <img
                  src={article.logo}
                  alt={article.outlet}
                  className="h-8 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div class="h-8 flex items-center justify-center bg-blue-100 rounded px-3">
                        <span class="text-blue-800 font-bold text-sm">${article.outlet}</span>
                      </div>
                    `;
                  }}
                />
              </div>

              {/* Article Title */}
              <div className="mb-1 flex-1">
                <h3 className="text-blue-900 font-bold text-sm leading-tight mb-2">
                  {article.title}
                </h3>
                <p className="text-blue-700 text-xs leading-tight">
                  {article.description}
                </p>
              </div>
                
            {/* VTURB Video if available */}
            {article.videoEmbed && (
                <div className="h-24 mb-2 overflow-hidden rounded-lg bg-gray-100">
                <VTURBPlayer 
                  embedCode={article.videoEmbed}
                  aspectRatio="16:9"
                  className="w-full h-full"
                />
              </div>
            )}
              
              {/* Read Article Button */}
              <div>
                <button
                  onClick={() => handleReadArticleClick(article.id, article.outlet)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-xs py-2 px-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Read Full Article</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2">
        {newsArticles.map((_, index) => (
          <button
            key={index}
            onClick={() => goToArticle(index)}
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