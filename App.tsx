
import React, { useState, useRef } from 'react';
import Header from './components/Header.tsx';
import Hero from './components/Hero.tsx';
import ServiceModels from './components/ServiceModels.tsx';
import Expertise from './components/Expertise.tsx';
import CorporateCheckups from './components/CorporateCheckups.tsx';
import AdvisorChat, { AdvisorChatHandle } from './components/AdvisorChat.tsx';
import Testimonials from './components/Testimonials.tsx';
import Footer from './components/Footer.tsx';
import ScrollToTop from './components/ScrollToTop.tsx';
import EnquiryModal from './components/EnquiryModal.tsx';
import HealthCampPromo from './components/HealthCampPromo.tsx';
import LoginModal from './components/LoginModal.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const advisorRef = useRef<AdvisorChatHandle>(null);

  const openEnquiry = () => setIsModalOpen(true);
  
  const handleAdvisorQuery = (query: string) => {
    if (advisorRef.current) {
      advisorRef.current.triggerQuery(query);
    }
  };

  const handleDownloadBrochure = () => {
    alert("Downloading Scope X Strategic Laboratory Brochure...");
  };

  const handleAdminSuccess = () => {
    setIsLoginModalOpen(false);
    setIsAdminOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col scroll-smooth">
      <Header onEnquire={openEnquiry} />
      <EnquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <HealthCampPromo onAskAdvisor={handleAdvisorQuery} />
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSuccess={handleAdminSuccess} 
      />
      <AdminDashboard 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
      />
      
      <main className="flex-grow">
        <Hero onEnquire={openEnquiry} />
        
        <section id="solutions" className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold text-scopex-blue mb-8 leading-tight tracking-tight uppercase">Comprehensive Laboratory Intelligence</h2>
              <p className="text-xl text-gray-600 leading-relaxed font-medium">
                Scope X Diagnostics is not just a service provider; we are a strategic partner for hospitals looking to modernize their diagnostic wing. 
                Our team handles everything from physical lab design to complex NABL accreditation audits, allowing clinical staff to focus on patient care.
              </p>
              <div className="mt-10 flex justify-center space-x-4 md:space-x-8">
                <div className="flex flex-col items-center">
                   <span className="text-3xl md:text-4xl font-black text-scopex-green">50+</span>
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hospitals Partnered</span>
                </div>
                <div className="w-px h-10 bg-gray-100 self-center"></div>
                <div className="flex flex-col items-center">
                   <span className="text-3xl md:text-4xl font-black text-scopex-green">100%</span>
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">NABL Success</span>
                </div>
                <div className="w-px h-10 bg-gray-100 self-center"></div>
                <div className="flex flex-col items-center">
                   <span className="text-3xl md:text-4xl font-black text-scopex-green">24h</span>
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expert Support</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ServiceModels onEnquire={openEnquiry} />
        <Expertise onEnquire={openEnquiry} />
        <CorporateCheckups onAskAdvisor={handleAdvisorQuery} />
        <Testimonials />

        <section className="py-24 gradient-blue relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-scopex-green rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">Ready to Build Your <br />Diagnostic Future?</h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto font-medium">Schedule a free site survey and diagnostic feasibility study with our senior medical experts today.</p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={openEnquiry}
                className="bg-scopex-green text-white px-12 py-6 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-green-500/40"
              >
                Request a Consultation
              </button>
              <button 
                onClick={handleDownloadBrochure}
                className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-12 py-6 rounded-2xl font-black text-xl hover:bg-white hover:text-scopex-blue transition-all flex items-center justify-center group"
              >
                <svg className="w-6 h-6 mr-3 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Brochure
              </button>
            </div>
            
            <p className="mt-12 text-blue-200 text-[10px] font-black flex items-center justify-center uppercase tracking-[0.3em]">
              <svg className="w-4 h-4 mr-3 text-scopex-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Standardized Quality Protocols Enforced
            </p>
          </div>
        </section>

        <section id="advisor" className="h-0"></section>
      </main>

      <Footer onAdminLogin={() => setIsLoginModalOpen(true)} />
      <AdvisorChat ref={advisorRef} />
      <ScrollToTop />
    </div>
  );
}

export default App;
