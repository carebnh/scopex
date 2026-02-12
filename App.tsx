
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
import { CRMUser } from './services/userService.ts';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CRMUser | null>(null);
  const advisorRef = useRef<AdvisorChatHandle>(null);

  const openEnquiry = () => setIsModalOpen(true);
  
  const handleAdvisorQuery = (query: string) => {
    if (advisorRef.current) {
      advisorRef.current.triggerQuery(query);
    }
  };

  const handleAdminSuccess = (user: CRMUser) => {
    setCurrentUser(user);
    setIsLoginModalOpen(false);
    setIsAdminOpen(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdminOpen(false);
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
        user={currentUser}
        onClose={() => setIsAdminOpen(false)} 
        onLogout={handleLogout}
      />
      
      <main className="flex-grow">
        <Hero onEnquire={openEnquiry} />
        
        <section id="solutions" className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold text-scopex-blue mb-8 leading-tight tracking-tight uppercase">Comprehensive Laboratory Intelligence</h2>
              <p className="text-xl text-gray-600 leading-relaxed font-medium">
                Scope X Diagnostics is not just a service provider; we are a strategic partner for hospitals looking to modernize their diagnostic wing. 
                Our team handles everything from physical lab design to complex NABL accreditation audits.
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
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button onClick={openEnquiry} className="bg-scopex-green text-white px-12 py-6 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-green-500/40">Request a Consultation</button>
            </div>
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
