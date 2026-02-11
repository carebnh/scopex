
import React, { useState, useEffect } from 'react';
import { submitHospitalEnquiry } from '../services/submissionService.ts';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EnquiryModal: React.FC<EnquiryModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    hospitalName: '',
    contactName: '',
    mobile: '',
    interest: 'Full Lab Outsourcing'
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const success = await submitHospitalEnquiry({
      ...formData,
      timestamp: new Date().toLocaleString()
    });

    setIsSubmitting(false);
    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setFormData({
          hospitalName: '',
          contactName: '',
          mobile: '',
          interest: 'Full Lab Outsourcing'
        });
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white w-full h-full sm:h-auto sm:max-w-lg sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-scopex-blue p-3 bg-gray-50 sm:bg-transparent rounded-full z-20"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {isSuccess ? (
          <div className="h-full flex flex-col items-center justify-center p-10 text-center">
            <div className="w-20 h-20 bg-scopex-green/10 rounded-full flex items-center justify-center mb-8 text-scopex-green">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-scopex-blue mb-4">Request Sent!</h3>
            <p className="text-gray-500 font-medium">Lead saved to registry. Notification sent to admin.</p>
          </div>
        ) : (
          <div className="p-8 md:p-12 h-full overflow-y-auto custom-scrollbar">
            <div className="mb-8 pt-6 sm:pt-0">
              <h3 className="text-2xl md:text-3xl font-black text-scopex-blue mb-2 tracking-tight">Connect With Us</h3>
              <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed">Hospital solutions tailored for national reach.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Hospital Name</label>
                <input required type="text" name="hospitalName" value={formData.hospitalName} onChange={handleChange} className="w-full px-5 py-3.5 md:py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-scopex-blue/10 outline-none transition-all font-medium text-sm" placeholder="e.g. Indore City Hospital" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Contact Name</label>
                <input required type="text" name="contactName" value={formData.contactName} onChange={handleChange} className="w-full px-5 py-3.5 md:py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-scopex-blue/10 outline-none transition-all font-medium text-sm" placeholder="Your Full Name" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">+91</span>
                  <input required type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full pl-14 pr-5 py-3.5 md:py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-scopex-blue/10 outline-none transition-all font-medium text-sm" placeholder="88899 47011" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Primary Interest</label>
                <div className="relative">
                  <select name="interest" value={formData.interest} onChange={handleChange} className="w-full px-5 py-3.5 md:py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-scopex-blue/10 outline-none appearance-none cursor-pointer font-medium text-sm">
                    <option>Full Lab Outsourcing</option>
                    <option>Hybrid Partnership</option>
                    <option>Technical Consultancy</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <button disabled={isSubmitting} className="w-full bg-scopex-blue text-white py-4.5 rounded-2xl font-black text-lg active:scale-[0.98] transition-all shadow-xl mt-6 disabled:opacity-50">
                {isSubmitting ? 'Processing...' : 'Submit Enquiry'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnquiryModal;