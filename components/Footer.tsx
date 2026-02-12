
import React from 'react';

interface FooterProps {
  onAdminLogin?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminLogin }) => {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-scopex-green rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                <span className="font-black text-xl">X</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight leading-none">SCOPE X</span>
                <span className="text-[10px] text-scopex-green font-black uppercase tracking-[0.3em]">Diagnostics</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              The national leader in hospital laboratory management and strategic diagnostic outsourcing. Modernizing healthcare infrastructure since 2021.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Solutions</h4>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              <li><a href="#models" className="hover:text-scopex-green transition-colors">Lab Outsourcing</a></li>
              <li><a href="#models" className="hover:text-scopex-green transition-colors">Hybrid Partnership</a></li>
              <li><a href="#expertise" className="hover:text-scopex-green transition-colors">NABL Compliance</a></li>
              <li><a href="#checkups" className="hover:text-scopex-green transition-colors">Corporate Wellness</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Administration</h4>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              <li>
                <button 
                  onClick={onAdminLogin}
                  className="flex items-center space-x-2 text-scopex-green hover:text-white transition-colors group"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="font-black uppercase tracking-widest text-[10px]">CRM Access</span>
                </button>
              </li>
              <li><a href="#" className="hover:text-scopex-green transition-colors">Portal Settings</a></li>
              <li><a href="#" className="hover:text-scopex-green transition-colors">LIMS Gateway</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Contact Us</h4>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              <li className="flex items-start">
                <span className="text-white block">8889947011</span>
              </li>
              <li className="flex items-center">
                <span className="text-gray-500">scopexdiagnostic@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-gray-500 text-[10px] font-black uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} Scope X Diagnostics Pvt Ltd.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
