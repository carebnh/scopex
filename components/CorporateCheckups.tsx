
import React, { useState } from 'react';
import BookCampModal from './BookCampModal.tsx';

interface CorporateCheckupsProps {
  onAskAdvisor?: (query: string) => void;
}

const checkupServices = [
  {
    title: 'On-Site Health Camps',
    desc: 'Turnkey mobile clinical units for on-premise sample collection, physician consultations, and baseline screenings.',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    highlight: true
  },
  {
    title: 'Pre-Employment Checkups',
    desc: 'Rigorous medical fitness evaluations for new recruits to ensure a high-performance workforce.',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    title: 'Annual Employee Screening',
    desc: 'Structured annual wellness packages designed for staff longevity and early diagnostic detection.',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
  },
  {
    title: 'Industrial Health Packages',
    desc: 'Occupational health screenings optimized for factory environments and statutory compliance.',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
  }
];

const CorporateCheckups: React.FC<CorporateCheckupsProps> = ({ onAskAdvisor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="checkups" className="py-24 bg-white relative overflow-hidden">
      <BookCampModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <div className="absolute left-0 bottom-0 w-64 h-64 bg-scopex-green/5 rounded-tr-[100px] -z-0"></div>
      <div className="absolute right-0 top-0 w-96 h-96 bg-scopex-blue/5 rounded-bl-full -z-0 opacity-40"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 bg-gray-50 border border-gray-100 px-5 py-2.5 rounded-full mb-6">
             <span className="flex h-2.5 w-2.5 rounded-full bg-scopex-green animate-pulse"></span>
             <span className="text-[11px] font-black text-scopex-blue uppercase tracking-[0.25em]">B2B Wellness Solutions</span>
          </div>
          <h2 className="text-4xl font-black text-scopex-blue sm:text-6xl tracking-tight mb-8">Corporate Health Camps</h2>
          
          <div className="mb-10 inline-flex flex-col md:flex-row items-center bg-white shadow-2xl shadow-blue-900/10 border border-gray-100 rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-4 bg-scopex-blue text-white font-black text-sm uppercase tracking-widest">Pricing Model</div>
            <div className="px-10 py-4">
               <p className="text-scopex-blue font-black text-xl">
                Packages from <span className="text-4xl text-scopex-green">₹299</span> <span className="text-xs text-gray-400 font-bold uppercase tracking-wider ml-2">/ Employee</span>
              </p>
            </div>
          </div>

          <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-medium">
            Deploy advanced diagnostic capabilities directly to your office premises across India. We manage the entire lifecycle from planning to report delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {checkupServices.map((service, idx) => (
            <div key={idx} className={`p-10 rounded-[3rem] border transition-all group flex flex-col ${service.highlight ? 'bg-white text-slate-800 border-scopex-blue/20 shadow-[0_30px_60px_-15px_rgba(5,74,122,0.1)] scale-105 z-10' : 'bg-gray-50 text-slate-800 border-gray-100 hover:border-scopex-green hover:bg-white hover:shadow-2xl'}`}>
              <div className={`w-16 h-16 rounded-[1.5rem] shadow-sm flex items-center justify-center mb-8 transition-all ${service.highlight ? 'bg-scopex-blue text-white' : 'bg-white text-scopex-blue group-hover:bg-scopex-blue group-hover:text-white'}`}>
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.icon} />
                </svg>
              </div>
              <h3 className="text-2xl font-black mb-4 leading-tight text-scopex-blue">{service.title}</h3>
              <p className="text-base leading-relaxed mb-10 text-gray-500">{service.desc}</p>
              <button onClick={() => setIsModalOpen(true)} className="mt-auto w-full py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center space-x-2 group/btn bg-scopex-green text-white hover:bg-blue-900">
                <span>Book Now</span>
                <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CorporateCheckups;