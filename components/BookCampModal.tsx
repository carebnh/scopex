
import React, { useState, useEffect } from 'react';
import { submitCampBooking } from '../services/submissionService';

interface BookCampModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookCampModal: React.FC<BookCampModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    organization: '',
    phone: '',
    email: '',
    date: '',
    headcount: '',
    requirements: ''
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const success = await submitCampBooking({
      ...formData,
      timestamp: new Date().toLocaleString()
    });

    setIsSubmitting(false);
    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        // Reset form
        setFormData({
          fullName: '',
          organization: '',
          phone: '',
          email: '',
          date: '',
          headcount: '',
          requirements: ''
        });
      }, 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity duration-500" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white w-full max-w-xl rounded-[2rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.4)] overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-6 duration-400">
        {/* Decorative Top Accent */}
        <div className="h-1.5 bg-gradient-to-r from-scopex-blue via-scopex-green to-scopex-blue w-full"></div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-scopex-blue p-2 bg-gray-50 rounded-full transition-all hover:rotate-90 z-20 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {isSuccess ? (
          <div className="py-16 px-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-scopex-green/10 rounded-full flex items-center justify-center mb-6 mx-auto text-scopex-green relative">
              <div className="absolute inset-0 bg-scopex-green/20 rounded-full animate-ping opacity-20"></div>
              <svg className="w-10 h-10 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-scopex-blue mb-3 tracking-tight">Booking Received</h3>
            <p className="text-gray-500 text-lg font-medium max-w-xs mx-auto leading-relaxed">
              Enquiry saved to Registry. Notification sent to <span className="text-scopex-blue font-black">scopexdiagnostic@gmail.com</span>. 
              Our team will call you shortly.
            </p>
          </div>
        ) : (
          <div className="p-6 md:p-10">
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 bg-scopex-blue/5 px-3 py-1 rounded-full mb-3">
                 <span className="w-1.5 h-1.5 bg-scopex-blue rounded-full"></span>
                 <span className="text-[9px] font-black text-scopex-blue uppercase tracking-widest">Health Camp Booking</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-scopex-blue tracking-tighter">Schedule Site Camp</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                  <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-scopex-blue/20 focus:ring-4 focus:ring-scopex-blue/5 outline-none transition-all font-bold text-gray-700 text-xs" placeholder="Contact Person" />
                </div>
                <div className="group">
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Organization</label>
                  <input required type="text" name="organization" value={formData.organization} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-scopex-blue/20 focus:ring-4 focus:ring-scopex-blue/5 outline-none transition-all font-bold text-gray-700 text-xs" placeholder="Company Name" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Contact No</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-scopex-blue/20 focus:ring-4 focus:ring-scopex-blue/5 outline-none transition-all font-bold text-gray-700 text-xs" placeholder="+91 Mobile No" />
                </div>
                <div className="group">
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Work Email</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-scopex-blue/20 focus:ring-4 focus:ring-scopex-blue/5 outline-none transition-all font-bold text-gray-700 text-xs" placeholder="name@company.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="group">
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Expected Date</label>
                  <input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-scopex-blue/20 focus:ring-4 focus:ring-scopex-blue/5 outline-none transition-all font-bold text-gray-700 text-xs" />
                </div>
                 <div className="group">
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Est. Employee Count</label>
                  <div className="relative">
                    <select required name="headcount" value={formData.headcount} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-scopex-blue/20 focus:ring-4 focus:ring-scopex-blue/5 outline-none transition-all font-bold text-gray-700 text-xs appearance-none cursor-pointer">
                      <option value="" disabled>Select headcount</option>
                      <option value="<50">Less than 50</option>
                      <option value="50-200">50 to 200</option>
                      <option value="200-500">200 to 500</option>
                      <option value="500-1000">500 to 1000</option>
                      <option value="1000-2000">1000 to 2000</option>
                      <option value="2000+">2000 Plus</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-scopex-blue">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Specific Requirements</label>
                <textarea 
                  required 
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-scopex-blue/20 focus:ring-4 focus:ring-scopex-blue/5 outline-none transition-all font-bold text-gray-700 text-xs resize-none" 
                  placeholder="E.g. Full body checkup, BP/Sugar screening..."
                ></textarea>
              </div>

              <button 
                disabled={isSubmitting}
                className="w-full bg-scopex-blue text-white py-4 rounded-xl font-black text-base active:scale-[0.98] transition-all shadow-lg flex items-center justify-center space-x-2 hover:bg-blue-900 group/btn disabled:opacity-50"
              >
                {isSubmitting ? (
                   <span className="flex items-center">
                     <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     Processing...
                   </span>
                ) : (
                  <>
                    <span>Submit Request</span>
                    <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </>
                )}
              </button>
              
              <div className="flex items-center justify-center space-x-2 text-[8px] text-gray-400 font-bold uppercase tracking-widest pt-2">
                 <span className="w-1 h-1 bg-scopex-green rounded-full"></span>
                 <span>Automatic registry & notification enabled</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCampModal;
