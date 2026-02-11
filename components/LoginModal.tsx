
import React, { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'SCOPE-X-2025') {
      onSuccess();
      setPassword('');
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[400] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-400 border border-white/20">
        <div className="bg-scopex-blue p-10 text-center relative">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/20">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight uppercase">Admin Access</h3>
          <p className="text-blue-100/60 text-xs font-black tracking-widest uppercase mt-2">Partner Intelligence Portal</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Access Key Code</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="••••••••"
              className={`w-full px-6 py-5 bg-gray-50 rounded-2xl border-2 outline-none transition-all font-black text-center tracking-widest ${error ? 'border-red-500 animate-shake' : 'border-transparent focus:bg-white focus:border-scopex-blue/10'}`}
            />
            {error && <p className="text-red-500 text-[10px] font-black uppercase text-center mt-3 tracking-widest">Invalid Access Code</p>}
          </div>

          <button className="w-full bg-scopex-blue text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl active:scale-[0.98] transition-all">
            Unlock Dashboard
          </button>
          
          <button 
            type="button"
            onClick={onClose}
            className="w-full py-4 text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-gray-500 transition-colors"
          >
            Cancel Access
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
