
import React, { useState, useEffect } from 'react';
import BookCampModal from './BookCampModal.tsx';

interface HealthCampPromoProps {
  onAskAdvisor?: (query: string) => void;
}

const HealthCampPromo: React.FC<HealthCampPromoProps> = ({ onAskAdvisor }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const hasSeenPromo = sessionStorage.getItem('sx_health_camp_promo');
    if (!hasSeenPromo) {
      const timer = setTimeout(() => setIsVisible(true), 6000);
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

  const handleConsultAI = () => {
    setIsVisible(false);
    sessionStorage.setItem('sx_health_camp_promo', 'true');
    if (onAskAdvisor) {
      onAskAdvisor("I'm interested in the Corporate Health Fest. How should I plan the logistics for a large-scale employee health camp at my facility?");
    }
  };

  if (!isVisible && !isBookingModalOpen) return null;

  return (
    <>
      {isVisible && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-6 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={handleClose}></div>
          <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500 border border-white/20">
            <div className="bg-scopex-blue p-8 pb-12 text-center relative overflow-hidden">
               <h3 className="text-3xl font-black text-white tracking-tighter mb-2">Corporate Health Fest</h3>
               <p className="text-blue-100 text-sm font-medium">India's most affordable diagnostic camps</p>
            </div>
            <div className="relative -mt-8 flex justify-center">
              <div className="bg-white p-2 rounded-full shadow-xl">
                <div className="w-24 h-24 bg-scopex-green rounded-full flex flex-col items-center justify-center text-white border-4 border-white">
                  <span className="text-[10px] font-black uppercase opacity-80">From</span>
                  <span className="text-3xl font-black">₹299</span>
                </div>
              </div>
            </div>
            <div className="p-8 pt-4 text-center">
              <p className="text-gray-500 text-sm font-medium leading-relaxed px-4 mb-6">Deploy specialized diagnostic units to your office locations nationwide.</p>
              <button onClick={handleConsultAI} className="w-full mb-4 py-3 bg-gray-50 border border-scopex-blue/10 text-scopex-blue rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-scopex-blue hover:text-white transition-all">Consult AI Advisor First</button>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={handleClose} className="py-4 rounded-2xl font-black text-xs text-gray-400 uppercase tracking-widest">Maybe Later</button>
                <button onClick={handleBookNow} className="bg-scopex-blue text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all">Book Slot Now</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <BookCampModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
    </>
  );
};

export default HealthCampPromo;