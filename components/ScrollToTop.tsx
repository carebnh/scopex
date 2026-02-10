
import React, { useState, useEffect } from 'react';

/**
 * ScrollToTop Component
 * A functional floating action button that appears after the user scrolls down 400px.
 * Adjusted position to sit alongside the AI Advisor widget.
 */
const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Monitor scroll position to toggle visibility
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div 
      className={`fixed bottom-8 right-[100px] z-[60] transition-all duration-500 ease-in-out transform ${
        isVisible 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-12 opacity-0 scale-50 pointer-events-none'
      }`}
    >
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="group relative flex items-center justify-center w-16 h-16 bg-white border border-gray-100 text-scopex-blue rounded-full shadow-2xl hover:shadow-gray-200 active:scale-90 transition-all duration-300"
      >
        {/* Glow layer that appears on hover */}
        <div className="absolute inset-0 rounded-full bg-scopex-blue blur-md opacity-0 group-hover:opacity-10 transition-opacity"></div>
        
        {/* The arrow icon with a bounce effect on hover */}
        <svg 
          className="w-7 h-7 relative z-10 transition-transform duration-300 group-hover:-translate-y-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2.5} 
            d="M5 10l7-7m0 0l7 7m-7-7v18" 
          />
        </svg>

        <span className="sr-only">Scroll back to the top of the page</span>
      </button>
    </div>
  );
};

export default ScrollToTop;
