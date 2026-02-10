
import React, { useState, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ServiceModels from './components/ServiceModels';
import Expertise from './components/Expertise';
import CorporateCheckups from './components/CorporateCheckups';
import AdvisorChat, { AdvisorChatHandle } from './components/AdvisorChat';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import EnquiryModal from './components/EnquiryModal';
import HealthCampPromo from './components/HealthCampPromo';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const advisorRef = useRef<AdvisorChatHandle>(null);

  const openEnquiry = () => setIsModalOpen(true);
  
  const handleAdvisorQuery = (query: string) => {
    if (advisorRef.current) {
      advisorRef.current.triggerQuery(query);
    }
  };

  return (
    <div className="min-h-screen flex flex-col scroll-smooth">
      <Header onEnquire={openEnquiry} />
      <EnquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <HealthCampPromo />
      
      <main className="flex-grow">
        <Hero onEnquire={openEnquiry} />
        
        {/* Solutions Intro */}
        <section id="solutions" className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold text-scopex-blue mb-8 leading-tight tracking-tight">Comprehensive Laboratory Intelligence</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Scope X Diagnostics is not just a service provider; we are a strategic partner for hospitals looking to modernize their diagnostic wing. 
                Our team handles everything from physical lab design to complex NABL accreditation audits, allowing clinical staff to focus on patient care.
              </p>
              <div className="mt-10 flex justify-center space-x-4">
                <div className="flex flex-col items-center">
                   <span className="text-3xl font-black text-scopex-green">50+</span>
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hospitals Partnered</span>
                </div>
                <div className="w-px h-10 bg-gray-100 self-center"></div>
                <div className="flex flex-col items-center">
                   <span className="text-3xl font-black text-scopex-green">100%</span>
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">NABL Success</span>
                </div>
                <div className="w-px h-10 bg-gray-100 self-center"></div>
                <div className="flex flex-col items-center">
                   <span className="text-3xl font-black text-scopex-green">24h</span>
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Support</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ServiceModels onEnquire={openEnquiry} />
        <Expertise onEnquire={openEnquiry} />
        <CorporateCheckups onAskAdvisor={handleAdvisorQuery} />
        <Testimonials />
        <AdvisorChat ref={advisorRef} />

        {/* Final CTA */}
        <section className="py-24 gradient-blue relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-scopex-green rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">Ready to Build Your <br />Diagnostic Future?</h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto font-medium">Schedule a free site survey and diagnostic feasibility study with our senior medical experts today.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={openEnquiry}
                className="bg-scopex-green text-white px-12 py-6 rounded-2xl font-bold text-xl hover:scale-105 transition-all shadow-2xl hover:shadow-green-500/40"
              >
                Request a Consultation
              </button>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-12 py-6 rounded-2xl font-bold text-xl hover:bg-white hover:text-scopex-blue transition-all">
                Download Brochure
              </button>
            </div>
            <p className="mt-12 text-blue-200 text-sm font-bold flex items-center justify-center uppercase tracking-[0.2em]">
              <svg className="w-5 h-5 mr-3 text-scopex-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              National Expert Line: 88899 47011
            </p>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
