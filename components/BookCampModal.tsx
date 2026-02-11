
import React, { useState, useEffect } from 'react';
import { submitCampBooking } from '../services/submissionService.ts';

interface BookCampModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookCampModal: React.FC<BookCampModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-6 duration-400">
        <div className="h-1.5 bg-gradient-to-r from-scopex-blue via-scopex-green to-scopex-blue w-full"></div>
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-scopex-blue p-2 bg-gray-50 rounded-full transition-all hover:rotate-90 z-20 shadow-sm">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {isSuccess ? (
          <div className="py-16 px-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-scopex-green/10 rounded-full flex items-center justify-center mb-6 mx-auto text-scopex-green relative">
              <div className="absolute inset-0 bg-scopex-green/20 rounded-full animate-ping opacity-20"></div>
              <svg className="w-10 h-10 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-3xl font-black text-scopex-blue mb-3 tracking-tight">Booking Received</h3>
            <p className="text-gray-500 text-lg font-medium max-w-xs mx-auto leading-relaxed">Enquiry saved to Registry. Notification sent to admin. Our team will call you shortly.</p>
          </div>
        ) : (
          <div className="p-6 md:p-10">
            <h3 className="text-2xl md:text-3xl font-black text-scopex-blue tracking-tighter mb-6">Schedule Site Camp</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-scopex-blue/5 outline-none transition-all font-bold text-gray-700 text-xs" placeholder="Full Name" />
                <input required type="text" name="organization" value={formData.organization} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-scopex-blue/5 outline-none transition-all font-bold text-gray-700 text-xs" placeholder="Organization" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-scopex-blue/5 outline-none transition-all font-bold text-gray-700 text-xs" placeholder="Contact Number" />
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-scopex-blue/5 outline-none transition-all font-bold text-gray-700 text-xs" placeholder="Work Email" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-scopex-blue/5 outline-none transition-all font-bold text-gray-700 text-xs" />
                <select required name="headcount" value={formData.headcount} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-scopex-blue/5 outline-none transition-all font-bold text-gray-700 text-xs cursor-pointer">
                  <option value="" disabled>Headcount</option>
                  <option value="<50">Less than 50</option>
                  <option value="50-200">50 to 200</option>
                  <option value="200-500">200 to 500</option>
                  <option value="2000+">2000 Plus</option>
                </select>
              </div>
              <textarea required name="requirements" value={formData.requirements} onChange={handleChange} rows={2} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-scopex-blue/5 outline-none transition-all font-bold text-gray-700 text-xs resize-none" placeholder="Requirements"></textarea>
              <button disabled={isSubmitting} className="w-full bg-scopex-blue text-white py-4 rounded-xl font-black text-base active:scale-[0.98] transition-all shadow-lg flex items-center justify-center space-x-2 hover:bg-blue-900 disabled:opacity-50">
                {isSubmitting ? 'Processing...' : 'Submit Request'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCampModal;