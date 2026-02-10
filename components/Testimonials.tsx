
import React from 'react';

const testimonials = [
  {
    hospital: "AVP Hospital",
    location: "Regional Care Center",
    quote: "Scope X Diagnostics has been instrumental in streamlining our laboratory operations. Their end-to-end management allowed us to achieve NABL accreditation in record time while significantly reducing our operational overhead. Their commitment to TAT and quality is unmatched.",
    author: "Medical Director",
    image: "https://picsum.photos/id/1012/100/100"
  },
  {
    hospital: "City Life Multispecialty",
    location: "Metro Unit",
    quote: "Partnering with Scope X was the best decision for our diagnostic wing. The hybrid model they offered perfectly balanced our need for control with their technical expertise in automation and reagent management.",
    author: "Chief Administrator",
    image: "https://picsum.photos/id/1011/100/100"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-scopex-green uppercase tracking-[0.2em] mb-4">Success Stories</h2>
          <h2 className="text-3xl font-extrabold text-scopex-blue sm:text-5xl">Trusted by Healthcare Leaders</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            See how Scope X is helping hospitals across the region achieve diagnostic excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 relative group transition-all hover:-translate-y-2">
              <div className="absolute -top-5 -left-5 w-12 h-12 bg-scopex-green rounded-2xl flex items-center justify-center text-white shadow-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H11.017C10.4647 13 10.017 12.5523 10.017 12V9C10.017 7.34315 11.3601 6 13.017 6H19.017C20.6738 6 22.017 7.34315 22.017 9V15C22.017 17.7614 19.7784 20 17.017 20H14.017V21ZM4.017 21L4.017 18C4.017 16.8954 4.91243 16 6.017 16H9.017C9.56928 16 10.017 15.5523 10.017 15V9C10.017 8.44772 9.56928 8 9.017 8H5.017C4.46472 8 4.017 8.44772 4.017 9V12C4.017 12.5523 3.56928 13 3.017 13H1.017C0.464722 13 0.017 12.5523 0.017 12V9C0.017 7.34315 1.36015 6 3.017 6H9.017C10.6739 6 12.017 7.34315 12.017 9V15C12.017 17.7614 9.77843 20 7.017 20H4.017V21Z" />
                </svg>
              </div>
              
              <div className="flex items-center space-x-4 mb-8">
                <img src={t.image} alt={t.hospital} className="w-16 h-16 rounded-full border-4 border-scopex-blue/5 shadow-inner" />
                <div>
                  <h4 className="text-xl font-bold text-scopex-blue">{t.hospital}</h4>
                  <p className="text-sm text-scopex-green font-semibold uppercase tracking-wider">{t.location}</p>
                </div>
              </div>

              <p className="text-gray-600 italic text-lg leading-relaxed mb-6">
                "{t.quote}"
              </p>

              <div className="pt-6 border-t border-gray-50">
                <p className="text-scopex-blue font-bold">— {t.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
