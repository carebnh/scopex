
import React, { useState } from 'react';
import BookCampModal from './BookCampModal';

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
      
      {/* Decorative background elements */}
      <div className="absolute left-0 bottom-0 w-64 h-64 bg-scopex-green/5 rounded-tr-[100px] -z-0"></div>
      <div className="absolute right-0 top-0 w-96 h-96 bg-scopex-blue/5 rounded-bl-full -z-0 opacity-40"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 bg-gray-50 border border-gray-100 px-5 py-2.5 rounded-full mb-6">
             <span className="flex h-2.5 w-2.5 rounded-full bg-scopex-green animate-pulse"></span>
             <span className="text-[11px] font-black text-scopex-blue uppercase tracking-[0.25em]">B2B Wellness Solutions</span>
          </div>
          <h2 className="text-4xl font-black text-scopex-blue sm:text-6xl tracking-tight mb-8">Corporate Health Camps</h2>
          
          {/* Enhanced Price Highlight */}
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

        {/* Benefits Strip */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          {[
             { label: 'India-wide Reach', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
             { label: 'Instant Digital Reports', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
             { label: 'Doctor Consultation', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
          ].map((benefit, i) => (
            <div key={i} className="flex items-center space-x-3 text-scopex-blue">
              <div className="w-10 h-10 bg-scopex-blue/5 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={benefit.icon} />
                </svg>
              </div>
              <span className="font-black text-[11px] uppercase tracking-widest">{benefit.label}</span>
            </div>
          ))}
        </div>

        {/* AI Advisor Contextual Trigger */}
        <div className="mb-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-scopex-blue/5 to-scopex-green/5 border border-dashed border-scopex-blue/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between group hover:border-scopex-blue/40 transition-all">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="w-14 h-14 bg-scopex-blue rounded-2xl flex items-center justify-center text-white mr-6 shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-black text-scopex-blue mb-1">Planning a Corporate Camp?</h4>
                <p className="text-sm text-gray-500 font-medium">Calculate your wellness ROI with our AI Diagnostic Strategist.</p>
              </div>
            </div>
            <button 
              onClick={() => onAskAdvisor?.("Can you explain the ROI and benefits of corporate health camps for employee wellness?")}
              className="px-8 py-3.5 bg-white border border-scopex-blue text-scopex-blue rounded-xl font-black text-xs uppercase tracking-widest hover:bg-scopex-blue hover:text-white transition-all shadow-md active:scale-95"
            >
              Ask AI Advisor
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {checkupServices.map((service, idx) => (
            <div 
              key={idx} 
              className={`p-10 rounded-[3rem] border transition-all group flex flex-col ${
                service.highlight 
                  ? 'bg-white text-slate-800 border-scopex-blue/20 shadow-[0_30px_60px_-15px_rgba(5,74,122,0.1)] scale-105 z-10' 
                  : 'bg-gray-50 text-slate-800 border-gray-100 hover:border-scopex-green hover:bg-white hover:shadow-2xl'
              }`}
            >
              <div className={`w-16 h-16 rounded-[1.5rem] shadow-sm flex items-center justify-center mb-8 transition-all ${
                service.highlight ? 'bg-scopex-blue text-white' : 'bg-white text-scopex-blue group-hover:bg-scopex-blue group-hover:text-white'
              }`}>
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.icon} />
                </svg>
              </div>
              <h3 className={`text-2xl font-black mb-4 leading-tight text-scopex-blue`}>{service.title}</h3>
              <p className={`text-base leading-relaxed mb-10 text-gray-500`}>
                {service.desc}
              </p>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className={`mt-auto w-full py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center space-x-2 group/btn bg-scopex-green text-white hover:bg-blue-900`}
              >
                <span>Book Now</span>
                <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Global CTA Section */}
        <div className="mt-24 p-12 md:p-20 bg-gradient-to-br from-[#021B31] via-[#054A7A] to-[#021B31] rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between shadow-[0_50px_100px_-20px_rgba(5,74,122,0.6)] relative overflow-hidden border border-white/10">
          <div className="absolute -right-20 -bottom-20 w-[450px] h-[450px] bg-scopex-green/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
          <div className="absolute -left-20 -top-20 w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="mb-12 md:mb-0 md:mr-16 text-center md:text-left relative z-10 flex-1">
            <h4 className="text-3xl md:text-6xl font-black mb-8 tracking-tighter text-white drop-shadow-sm">Schedule Your <br className="hidden lg:block"/> Health Camp</h4>
            <p className="text-blue-50/90 text-lg md:text-2xl max-w-xl font-medium leading-[1.6]">
              Join <span className="text-scopex-green font-black underline decoration-2 underline-offset-8">50+ leading organizations</span> across India who trust Scope X for employee wellness. Our team handles logistics, manpower, and reporting.
            </p>
          </div>
          
          <div className="flex flex-col gap-6 w-full md:w-auto relative z-10 items-center md:items-start">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto whitespace-nowrap bg-scopex-green text-white px-14 py-8 rounded-full font-black text-2xl hover:scale-105 hover:bg-white hover:text-scopex-green transition-all shadow-[0_25px_50px_-12px_rgba(93,178,56,0.5)] flex items-center justify-center space-x-4 group border-2 border-transparent hover:border-scopex-green"
            >
              <span>Book Your Camp</span>
              <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 pt-4">
              <a href="tel:8889947011" className="flex items-center group/phone">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mr-4 group-hover/phone:bg-scopex-green transition-all border border-white/5">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">National Helpline</span>
                  <span className="text-2xl font-black text-white group-hover/phone:text-scopex-green transition-colors">88899 47011</span>
                </div>
              </a>
              <div className="hidden md:block h-12 w-px bg-white/10"></div>
              <div className="flex items-center">
                 <span className="w-2.5 h-2.5 bg-scopex-green rounded-full animate-pulse mr-3 shadow-[0_0_12px_#5DB238]"></span>
                 <p className="text-blue-50 font-bold uppercase text-xs tracking-widest">Experts Available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CorporateCheckups;
