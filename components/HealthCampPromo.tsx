
import React, { useState, useEffect } from 'react';
import BookCampModal from './BookCampModal';

const HealthCampPromo: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    // Check if user has already seen the promo this session
    const hasSeenPromo = sessionStorage.getItem('sx_health_camp_promo');
    
    if (!hasSeenPromo) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 6000); // 6 second delay for better UX
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('sx_health_camp_promo', 'true');
  };

  const handleBookNow = () => {
    setIsVisible(false);
    setIsBookingModalOpen(true);
    sessionStorage.setItem('sx_health_camp_promo', 'true');
  };

  if (!isVisible && !isBookingModalOpen) return null;

  return (
    <>
      {/* Promo Popup */}
      {isVisible && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-6 sm:p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-500"
            onClick={handleClose}
          ></div>
          
          <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-10 duration-500 border border-white/20">
            {/* Top Badge */}
            <div className="bg-scopex-blue p-8 pb-12 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-scopex-green"></div>
               <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
               
               <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full mb-4 border border-white/10">
                 <span className="w-1.5 h-1.5 bg-scopex-green rounded-full animate-pulse"></span>
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Limited Time Offer</span>
               </div>
               
               <h3 className="text-3xl font-black text-white tracking-tighter mb-2">Corporate Health Fest</h3>
               <p className="text-blue-100 text-sm font-medium">India's most affordable diagnostic camps</p>
            </div>

            {/* Price Circle */}
            <div className="relative -mt-8 flex justify-center">
              <div className="bg-white p-2 rounded-full shadow-xl">
                <div className="w-24 h-24 bg-scopex-green rounded-full flex flex-col items-center justify-center text-white border-4 border-white shadow-inner">
                  <span className="text-[10px] font-black uppercase leading-none opacity-80">From</span>
                  <span className="text-3xl font-black leading-none">₹299</span>
                  <span className="text-[9px] font-bold uppercase leading-none mt-1">/ Head</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 pt-4 text-center">
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-center space-x-4">
                   <div className="flex flex-col items-center">
                     <span className="text-xl font-black text-scopex-blue">50+</span>
                     <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Tests</span>
                   </div>
                   <div className="w-px h-6 bg-gray-100"></div>
                   <div className="flex flex-col items-center">
                     <span className="text-xl font-black text-scopex-blue">24h</span>
                     <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Reports</span>
                   </div>
                   <div className="w-px h-6 bg-gray-100"></div>
                   <div className="flex flex-col items-center">
                     <span className="text-xl font-black text-scopex-blue">NABL</span>
                     <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Standard</span>
                   </div>
                </div>
                <p className="text-gray-500 text-sm font-medium leading-relaxed px-4">
                  Deploy specialized diagnostic units to your office locations nationwide. Limited slots available for next month.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleClose}
                  className="py-4 rounded-2xl font-black text-xs text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-all"
                >
                  Maybe Later
                </button>
                <button 
                  onClick={handleBookNow}
                  className="bg-scopex-blue text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-blue-900/30 active:scale-95 transition-all"
                >
                  Book Slot
                </button>
              </div>
            </div>
            
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Booking Modal (triggered by promo) */}
      <BookCampModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
    </>
  );
};

export default HealthCampPromo;
