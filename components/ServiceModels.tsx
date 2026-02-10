
import React from 'react';

interface ServiceModelsProps {
  onEnquire: () => void;
}

const ServiceModels: React.FC<ServiceModelsProps> = ({ onEnquire }) => {
  return (
    <section id="models" className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-scopex-green uppercase tracking-[0.2em] mb-4">How We Work</h2>
          <h2 className="text-3xl font-extrabold text-scopex-blue sm:text-5xl">Flexible Service Models</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Tailored solutions designed to meet the unique volume and budgetary requirements of modern healthcare institutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Complete Outsource Card */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all border border-gray-100 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-scopex-blue/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
            <div className="w-16 h-16 bg-scopex-blue/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-scopex-blue group-hover:text-white transition-colors">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-scopex-blue mb-6">Complete Outsource</h3>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Experience zero operational headache. We take full ownership of the entire laboratory ecosystem.
            </p>
            <ul className="space-y-4 mb-10">
              {[
                'Full Lab Setup & Infrastructure',
                'Advanced Scientific Manpower',
                'Global Reagent Supply Chain',
                'Total Quality Management (NABL)',
                'Technological Automation'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center text-gray-700 font-medium">
                  <svg className="w-5 h-5 text-scopex-green mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <button 
              onClick={onEnquire}
              className="w-full bg-scopex-blue text-white py-4 rounded-xl font-bold hover:bg-opacity-90 active:scale-[0.98] transition-all shadow-lg hover:shadow-blue-900/20"
            >
              Inquire Now
            </button>
          </div>

          {/* Hybrid Partnership Card */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all border border-gray-100 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-scopex-green/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
            <div className="w-16 h-16 bg-scopex-green/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-scopex-green group-hover:text-white transition-colors">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-scopex-blue mb-6">Hybrid Partnership</h3>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              A balanced collaborative model focusing on technical quality and resource efficiency.
            </p>
            <ul className="space-y-4 mb-10">
              {[
                'Quality System Implementation',
                'Advanced Equipment Leasing',
                'Reagent Inventory Management',
                'Hospital-led Manpower Teams',
                'TAT Monitoring Systems'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center text-gray-700 font-medium">
                  <svg className="w-5 h-5 text-scopex-green mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <button 
              onClick={onEnquire}
              className="w-full bg-scopex-blue text-white py-4 rounded-xl font-bold hover:bg-opacity-90 active:scale-[0.98] transition-all shadow-lg hover:shadow-blue-900/20"
            >
              Inquire Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceModels;
