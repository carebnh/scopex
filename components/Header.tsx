
import React, { useState, useEffect, useCallback } from 'react';

interface HeaderProps {
  onEnquire: () => void;
}

const Header: React.FC<HeaderProps> = ({ onEnquire }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger shrink effect earlier for better UX
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when resizing to desktop to prevent layout bugs
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      // Small offset for the sticky header
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      window.history.pushState(null, '', href);
    }
  }, []);

  const navLinks = [
    { name: 'Solutions', href: '#solutions' },
    { name: 'Models', href: '#models' },
    { name: 'Expertise', href: '#expertise' },
    { name: 'Health Camps', href: '#checkups' },
    { name: 'AI Advisor', href: '#advisor' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out ${
        isScrolled || isMenuOpen
          ? 'bg-white/80 backdrop-blur-xl border-b border-slate-100 py-2.5 shadow-[0_4px_30px_rgba(0,0,0,0.03)]' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center">
          {/* Logo with Reactive Size */}
          <a 
            href="#" 
            onClick={(e) => handleNavClick(e, '#')}
            className="flex items-center space-x-3 group outline-none"
          >
            <div className={`rounded-xl flex items-center justify-center transition-all duration-500 shadow-sm group-hover:rotate-6 ${
              isScrolled || isMenuOpen 
                ? 'w-10 h-10 bg-scopex-blue' 
                : 'w-12 h-12 bg-white'
            }`}>
               <span className={`font-black transition-all duration-500 ${
                 isScrolled || isMenuOpen ? 'text-lg text-white' : 'text-xl text-scopex-blue'
               }`}>X</span>
            </div>
            <div className="flex flex-col">
              <span className={`font-black block leading-none transition-all duration-500 tracking-tight ${
                isScrolled || isMenuOpen ? 'text-lg text-scopex-blue' : 'text-xl text-white'
              }`}>SCOPE X</span>
              <span className={`font-bold tracking-[0.25em] uppercase transition-all duration-500 ${
                isScrolled || isMenuOpen ? 'text-[9px] text-scopex-green' : 'text-[10px] text-blue-100/80'
              }`}>Diagnostics</span>
            </div>
          </a>
          
          {/* Desktop Nav with Animated States */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                onClick={(e) => handleNavClick(e, link.href)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 relative group overflow-hidden ${
                  isScrolled 
                    ? 'text-slate-600 hover:text-scopex-blue hover:bg-slate-50' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="relative z-10">{link.name}</span>
                <span className={`absolute bottom-0 left-4 right-4 h-0.5 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-center ${
                  isScrolled ? 'bg-scopex-blue' : 'bg-scopex-green'
                }`}></span>
              </a>
            ))}
          </div>

          {/* Action Button */}
          <div className="hidden md:block">
            <button 
              onClick={onEnquire}
              className={`px-8 py-3 rounded-2xl font-black text-sm transition-all duration-500 active:scale-95 shadow-lg hover:shadow-xl ${
                isScrolled 
                  ? 'bg-scopex-blue text-white hover:bg-slate-900 shadow-blue-900/10' 
                  : 'bg-white text-scopex-blue hover:bg-scopex-green hover:text-white'
              }`}
            >
              Consult Now
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2.5 rounded-2xl transition-all duration-300 active:scale-90 flex items-center justify-center ${
              isScrolled || isMenuOpen ? 'text-scopex-blue bg-slate-50' : 'text-white bg-white/10 backdrop-blur-sm'
            }`}
          >
            <div className="w-6 h-6 relative">
              <span className={`absolute left-0 top-1/2 w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'}`}></span>
              <span className={`absolute left-0 top-1/2 w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`absolute left-0 top-1/2 w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed inset-x-0 top-0 h-screen md:hidden bg-white z-[-1] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="h-full pt-28 px-8 pb-10 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-6 px-4">Navigation Menu</p>
            {navLinks.map((link, i) => (
              <a 
                key={link.name}
                href={link.href} 
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-6 py-5 text-2xl font-black text-slate-800 hover:text-scopex-blue active:bg-slate-50 rounded-[2rem] transition-all flex items-center justify-between group"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <span>{link.name}</span>
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-scopex-blue group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
          
          <div className="pt-10 border-t border-slate-50">
            <button 
              onClick={() => { onEnquire(); setIsMenuOpen(false); }}
              className="w-full bg-scopex-blue text-white py-6 rounded-[2rem] font-black text-xl shadow-[0_20px_40px_rgba(5,74,122,0.2)] active:scale-[0.98] transition-all flex items-center justify-center space-x-3"
            >
              <span>Partner With Us</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <p className="mt-8 text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Established 2021 • National Health Core</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
