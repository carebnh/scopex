
import React, { useState, useEffect } from 'react';
import { submitCampBooking } from '../services/submissionService.ts';

interface BookCampModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookCampModal: React.FC<BookCampModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(null);
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
    setError(null);
    
    try {
      const success = await submitCampBooking({
        ...formData,
        timestamp: new Date().toLocaleString()
      });

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
        }, 3000);
      } else {
        setError("System encountered a connection issue. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please refresh.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-6 duration-400">
        <div className="h-2 bg-gradient-to-r from-scopex-blue via-scopex-green to-scopex-blue w-full"></div>
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-scopex-blue p-2 bg-gray-50 rounded-full transition-all hover:rotate-90 z-20 shadow-sm">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {isSuccess ? (
          <div className="py-20 px-10 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-scopex-green/10 rounded-full flex items-center justify-center mb-8 mx-auto text-scopex-green relative">
              <div className="absolute inset-0 bg-scopex-green/20 rounded-full animate-ping opacity-20"></div>
              <svg className="w-12 h-12 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-3xl font-black text-scopex-blue mb-4 tracking-tighter uppercase">Booking Confirmed</h3>
            <p className="text-gray-400 text-lg font-bold max-w-xs mx-auto leading-relaxed italic">The management team will contact you shortly to finalize details.</p>
          </div>
        ) : (
          <div className="p-10 md:p-14">
            <div className="mb-10">
              <h3 className="text-3xl font-black text-scopex-blue tracking-tighter leading-none mb-2 uppercase">Schedule Site Camp</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Mobile Diagnostic Unit Deployment</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Organizer Name</label>
                  <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-scopex-blue/10 outline-none transition-all font-bold text-slate-800 text-xs" placeholder="Dr. John Doe" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Organization</label>
                  <input required type="text" name="organization" value={formData.organization} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-scopex-blue/10 outline-none transition-all font-bold text-slate-800 text-xs" placeholder="e.g. Apollo Hub" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Number</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-scopex-blue/10 outline-none transition-all font-bold text-slate-800 text-xs" placeholder="+91 888 999 0000" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Official Email</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-scopex-blue/10 outline-none transition-all font-bold text-slate-800 text-xs" placeholder="admin@domain.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Preferred Date</label>
                  <input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-scopex-blue/10 outline-none transition-all font-bold text-slate-800 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Est. Headcount</label>
                  <select required name="headcount" value={formData.headcount} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-scopex-blue/10 outline-none transition-all font-bold text-slate-800 text-xs cursor-pointer">
                    <option value="" disabled>Select Range</option>
                    <option value="<50">Less than 50</option>
                    <option value="50-200">50 to 200</option>
                    <option value="200-500">200 to 500</option>
                    <option value="2000+">2000 Plus</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Additional Requirements</label>
                <textarea required name="requirements" value={formData.requirements} onChange={handleChange} rows={2} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-scopex-blue/10 outline-none transition-all font-bold text-slate-800 text-xs resize-none" placeholder="Specific diagnostic tests or site instructions..."></textarea>
              </div>

              {error && (
                <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-center space-x-3 text-red-500 animate-bounce">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
                </div>
              )}

              <button 
                disabled={isSubmitting} 
                className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.25em] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center space-x-3 ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-scopex-blue text-white hover:bg-slate-900 shadow-blue-500/20'}`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Processing Registry...</span>
                  </>
                ) : (
                  <span>Submit Booking Request</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCampModal;
