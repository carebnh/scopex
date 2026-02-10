
import React, { useState, useEffect, useCallback } from 'react';

interface HeaderProps {
  onEnquire: () => void;
}

const Header: React.FC<HeaderProps> = ({ onEnquire }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when resizing to desktop
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
      element.scrollIntoView({ behavior: 'smooth' });
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
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled || isMenuOpen
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 py-3 shadow-md' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a 
            href="#" 
            onClick={(e) => handleNavClick(e, '#')}
            className="flex items-center space-x-2 group outline-none"
          >
            <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm group-active:scale-95 ${isScrolled || isMenuOpen ? 'bg-scopex-blue' : 'bg-white'}`}>
               <span className={`font-black text-lg md:text-xl ${isScrolled || isMenuOpen ? 'text-white' : 'text-scopex-blue'}`}>X</span>
            </div>
            <div className="flex flex-col">
              <span className={`text-lg md:text-xl font-black block leading-none transition-colors duration-300 ${isScrolled || isMenuOpen ? 'text-scopex-blue' : 'text-white'}`}>SCOPE X</span>
              <span className={`text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase transition-colors duration-300 ${isScrolled || isMenuOpen ? 'text-scopex-green' : 'text-blue-100'}`}>Diagnostics</span>
            </div>
          </a>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                onClick={(e) => handleNavClick(e, link.href)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 relative group ${
                  isScrolled 
                    ? 'text-gray-600 hover:text-scopex-blue' 
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {link.name}
                <span className={`absolute bottom-1 left-4 right-4 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left ${isScrolled ? 'bg-scopex-blue' : 'bg-scopex-green'}`}></span>
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <button 
              onClick={onEnquire}
              className={`px-7 py-2.5 rounded-full font-bold text-sm transition-all duration-300 active:scale-95 shadow-lg ${
                isScrolled 
                  ? 'bg-scopex-blue text-white hover:bg-blue-900' 
                  : 'bg-white text-scopex-blue hover:bg-scopex-green hover:text-white'
              }`}
            >
              Connect Now
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-xl transition-all duration-300 active:scale-90 ${
              isScrolled || isMenuOpen ? 'text-scopex-blue bg-gray-50' : 'text-white bg-white/10'
            }`}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      <div 
        className={`fixed inset-0 top-[60px] md:hidden bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed inset-x-0 top-[60px] md:hidden bg-white shadow-2xl transition-all duration-500 ease-out transform ${
          isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="px-6 py-8 flex flex-col space-y-1">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href} 
              onClick={(e) => handleNavClick(e, link.href)}
              className="px-6 py-4 text-base font-bold text-scopex-blue active:bg-gray-50 rounded-2xl transition-colors flex items-center justify-between"
            >
              {link.name}
              <svg className="w-5 h-5 text-scopex-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))}
          <div className="pt-6">
            <button 
              onClick={() => { onEnquire(); setIsMenuOpen(false); }}
              className="w-full bg-scopex-blue text-white py-4.5 rounded-2xl font-black text-lg shadow-xl active:scale-[0.98] transition-all"
            >
              Connect Now
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
