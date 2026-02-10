
import React, { useState, useEffect } from 'react';

interface HeroProps {
  onEnquire: () => void;
}

const Hero: React.FC<HeroProps> = ({ onEnquire }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const circleOffset = scrollY * 0.1;
  const textOffset = scrollY * 0.03;

  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-40 md:pb-40 gradient-blue text-white">
      {/* Decorative Background Circle */}
      <div 
        className="hidden md:block absolute top-0 right-0 -mt-20 -mr-20 opacity-10 pointer-events-none"
        style={{ transform: `translateY(${circleOffset}px)` }}
      >
        <svg width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="300" cy="300" r="300" fill="white" />
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto md:mx-0">
          <div 
            className="space-y-6 md:space-y-8 text-center md:text-left"
            style={{ transform: `translateY(${textOffset}px)` }}
          >
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <span className="flex h-2 w-2 rounded-full bg-scopex-green"></span>
              <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase">Premium Lab Management</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black leading-tight tracking-tight">
              Elevate Your Hospital’s <br className="hidden sm:block" />
              <span className="text-scopex-green">Diagnostic Potential</span>
            </h1>
            
            <p className="text-base md:text-xl text-blue-100 max-w-2xl mx-auto md:mx-0 leading-relaxed font-medium">
              Scope X Diagnostics provides end-to-end laboratory outsourcing and stabilization. 
              Achieve gold-standard NABL accreditation while reducing operational stress.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <button 
                onClick={onEnquire}
                className="bg-scopex-green text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all"
              >
                Get Started
              </button>
              <button 
                onClick={onEnquire}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg active:scale-95 transition-all"
              >
                Partner With Us
              </button>
            </div>

            <div className="pt-10 flex items-center space-x-6 md:space-x-8 justify-center md:justify-start">
              <div className="text-center md:text-left">
                <p className="text-xl md:text-2xl font-black">100%</p>
                <p className="text-[10px] uppercase tracking-wider font-bold text-blue-200">Compliance</p>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center md:text-left">
                <p className="text-xl md:text-2xl font-black">40%</p>
                <p className="text-[10px] uppercase tracking-wider font-bold text-blue-200">Faster TAT</p>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center md:text-left">
                <p className="text-xl md:text-2xl font-black">24/7</p>
                <p className="text-[10px] uppercase tracking-wider font-bold text-blue-200">Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
