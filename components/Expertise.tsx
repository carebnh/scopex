
import React from 'react';

interface ExpertiseProps {
  onEnquire?: () => void;
}

const expertiseItems = [
  {
    title: 'Lab Designing',
    desc: 'Ergonomic layouts optimized for high-volume sample processing and minimal cross-contamination.',
    icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z'
  },
  {
    title: 'Automation',
    desc: 'Integration of LIS (Lab Information Systems) and automated diagnostic instruments to eliminate human error.',
    icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z'
  },
  {
    title: 'NABL Compliance',
    desc: 'Comprehensive support for ISO 15189 standards, ensuring your lab meets global quality benchmarks.',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
  },
  {
    title: 'TAT Optimization',
    desc: 'Reducing turnaround time from collection to reporting by refining logistics and technical workflows.',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  }
];

const Expertise: React.FC<ExpertiseProps> = ({ onEnquire }) => {
  return (
    <section id="expertise" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gray-50 rounded-bl-[100px] -z-10 opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4">
          <div className="md:w-2/3">
            <h2 className="text-3xl font-extrabold text-scopex-blue sm:text-5xl tracking-tight">Technical Mastery</h2>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed max-w-2xl">
              We don’t just manage labs; we engineer excellence through data-driven operational design and stringent quality control protocols.
            </p>
          </div>
          <div className="hidden md:block pb-2">
            <div className="flex -space-x-4">
              <img className="w-14 h-14 rounded-full border-4 border-white shadow-xl" src="https://picsum.photos/id/1012/100/100" alt="Specialist" />
              <img className="w-14 h-14 rounded-full border-4 border-white shadow-xl" src="https://picsum.photos/id/1011/100/100" alt="Specialist" />
              <img className="w-14 h-14 rounded-full border-4 border-white shadow-xl" src="https://picsum.photos/id/1027/100/100" alt="Specialist" />
              <div className="w-14 h-14 rounded-full border-4 border-white bg-scopex-green text-white flex items-center justify-center text-xs font-black shadow-xl">
                +25
              </div>
            </div>
            <p className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">In-house Medical Experts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {expertiseItems.map((item, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-scopex-green transition-all hover:bg-white hover:shadow-2xl group flex flex-col">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-scopex-blue transition-all duration-300">
                <svg className="w-9 h-9 text-scopex-blue group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-scopex-blue mb-4">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm mb-auto">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {onEnquire && (
          <div className="text-center">
            <button 
              onClick={onEnquire}
              className="inline-flex items-center px-8 py-4 bg-scopex-blue text-white rounded-2xl font-bold hover:bg-opacity-95 transition-all shadow-xl hover:shadow-blue-900/20 active:scale-95 group"
            >
              Request Technical Consultation
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Expertise;
