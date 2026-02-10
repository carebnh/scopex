
import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { getLabAdvice } from '../services/geminiService';

export interface AdvisorChatHandle {
  triggerQuery: (query: string) => void;
}

const AdvisorChat = forwardRef<AdvisorChatHandle>((_, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { 
      role: 'model', 
      text: "Welcome to Scope X Strategic Consulting. I am your Diagnostic Operations Advisor.\n\nTo begin, please select a consultation path or ask me anything about hospital lab management." 
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    triggerQuery: (query: string) => {
      setIsOpen(true);
      handleSend(query);
    }
  }));

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isOpen, loading, suggestions]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setShowTooltip(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const parseSuggestions = (text: string) => {
    const match = text.match(/\[SUGGESTIONS: (.*?)\]/);
    if (match) {
      const suggestedStr = match[1];
      const cleanedText = text.replace(/\[SUGGESTIONS: (.*?)\]/, '').trim();
      const suggestionList = suggestedStr.split('|').map(s => s.trim());
      return { cleanedText, suggestionList };
    }
    return { cleanedText: text, suggestionList: [] };
  };

  const handleSend = async (forcedInput?: string) => {
    const userMsg = forcedInput || input.trim();
    if (!userMsg || loading) return;

    setInput('');
    setSuggestions([]); // Clear old suggestions
    const newMessages = [...messages, { role: 'user', text: userMsg } as const];
    setMessages(newMessages);
    setLoading(true);

    const history = newMessages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const rawResponse = await getLabAdvice(history);
    const { cleanedText, suggestionList } = parseSuggestions(rawResponse);
    
    setMessages(prev => [...prev, { role: 'model', text: cleanedText }]);
    
    // Default suggestions if none provided
    const finalSuggestions = suggestionList.length > 0 
      ? suggestionList 
      : ["Tell me about NABL", "Lab Automation ROI", "How to optimize TAT?"];
    
    setTimeout(() => {
      setSuggestions(finalSuggestions);
    }, 600);
    
    setLoading(false);
  };

  const consultingPaths = [
    { id: 'nabl', label: 'NABL Prep', icon: '📋', query: 'Help me prepare for NABL accreditation.' },
    { id: 'automation', label: 'Lab Automation', icon: '🤖', query: 'How can lab automation improve my ROI?' },
    { id: 'outsource', label: 'Full Outsourcing', icon: '🏢', query: 'Explain the Complete Outsource Model.' }
  ];

  return (
    <>
      {/* Tooltip & Trigger Button */}
      <div className="fixed bottom-6 right-6 z-[150] flex flex-col items-end pointer-events-none">
        {showTooltip && !isOpen && (
          <div 
            className="mb-4 mr-2 bg-white px-5 py-4 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 animate-in slide-in-from-right-4 fade-in duration-500 max-w-[280px] pointer-events-auto cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setIsOpen(true)}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-scopex-blue text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-black text-scopex-blue leading-tight mb-0.5">Strategy Expert</p>
                <p className="text-[11px] font-medium text-gray-500 leading-tight">Need a lab audit today?</p>
              </div>
            </div>
            <div className="absolute right-8 -bottom-2 w-4 h-4 bg-white border-r border-b border-gray-100 rotate-45"></div>
          </div>
        )}
        
        <button 
          onClick={() => { setIsOpen(!isOpen); setShowTooltip(false); }}
          className={`pointer-events-auto w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-[0_20px_50px_rgba(5,74,122,0.3)] transition-all duration-500 active:scale-90 ${
            isOpen ? 'bg-slate-800 rotate-90 rounded-full' : 'bg-scopex-blue hover:bg-blue-900'
          }`}
        >
          {isOpen ? (
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <div className="relative">
              <div className="absolute inset-0 rounded-[2rem] bg-white/20 animate-ping"></div>
              <svg className="w-9 h-9 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          )}
        </button>
      </div>

      {/* Chat Window with Spring Animation */}
      <div 
        className={`fixed inset-0 md:inset-auto md:bottom-28 md:right-8 z-[140] transition-all duration-500 ${
          isOpen 
            ? 'opacity-100 pointer-events-auto translate-y-0 scale-100' 
            : 'opacity-0 pointer-events-none translate-y-12 scale-90'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        <div className="bg-white w-full h-full md:h-[680px] md:w-[420px] md:rounded-[2.5rem] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.25)] border border-gray-100 flex flex-col overflow-hidden">
          
          {/* Enhanced Header */}
          <div className="px-6 py-6 border-b border-gray-50 flex items-center justify-between bg-white shadow-sm z-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm relative">
                <svg className="w-7 h-7 text-scopex-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-scopex-green border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight leading-none mb-1.5">Consulting Core</h3>
                <div className="flex items-center space-x-2">
                  <span className="flex h-2 w-2 rounded-full bg-scopex-green animate-pulse"></span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Online & Ready</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <a href="tel:8889947011" className="p-2.5 bg-gray-50 text-scopex-blue hover:bg-scopex-blue hover:text-white rounded-xl transition-all shadow-sm border border-gray-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 text-gray-300 hover:text-slate-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8 space-y-8 bg-gray-50/20 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[88%] px-5 py-4 rounded-[1.8rem] text-[14px] leading-relaxed font-semibold shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
                  msg.role === 'user' 
                    ? 'bg-scopex-blue text-white rounded-tr-none shadow-blue-500/10' 
                    : 'bg-white text-slate-800 border border-gray-100 rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
                
                {/* Onboarding Cards (Only after the first message) */}
                {idx === 0 && messages.length === 1 && (
                  <div className="grid grid-cols-1 gap-3 w-full mt-6">
                    {consultingPaths.map(path => (
                      <button 
                        key={path.id}
                        onClick={() => handleSend(path.query)}
                        className="flex items-center space-x-4 p-4 bg-white border border-gray-100 rounded-2xl hover:border-scopex-blue hover:shadow-md transition-all text-left group"
                      >
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl group-hover:bg-scopex-blue group-hover:scale-110 transition-all">
                          {path.icon}
                        </div>
                        <div>
                          <p className="text-xs font-black text-scopex-blue uppercase tracking-widest">{path.label}</p>
                          <p className="text-[11px] text-gray-500 font-medium">Click to discuss details</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex items-start space-x-2">
                <div className="bg-white px-5 py-4 rounded-[1.5rem] rounded-tl-none border border-gray-100 shadow-sm flex items-center space-x-3">
                  <div className="flex space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-scopex-blue rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-scopex-blue rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-scopex-blue rounded-full animate-bounce delay-200"></div>
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Formulating Strategy</p>
                </div>
              </div>
            )}

            {/* Suggested Follow-ups */}
            {suggestions.length > 0 && !loading && (
              <div className="flex flex-wrap gap-2 pt-4 animate-in fade-in slide-in-from-left-4 duration-500">
                <p className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Suggested Follow-ups:</p>
                {suggestions.map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSend(s)}
                    className="px-4 py-2.5 bg-white border border-scopex-blue/20 text-scopex-blue rounded-xl text-xs font-bold hover:bg-scopex-blue hover:text-white transition-all shadow-sm active:scale-95"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input Footer */}
          <div className="p-6 bg-white border-t border-gray-50">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Message Advisor..."
                className="w-full pl-6 pr-16 py-5 bg-gray-50 border-2 border-transparent rounded-[1.8rem] focus:bg-white focus:border-scopex-blue/10 focus:ring-4 focus:ring-scopex-blue/5 outline-none transition-all font-bold text-slate-800 text-sm placeholder-gray-400"
              />
              <button 
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="absolute right-2.5 p-3.5 bg-scopex-blue text-white rounded-2xl hover:bg-blue-900 transition-all shadow-xl shadow-blue-500/20 active:scale-90 disabled:opacity-20"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between opacity-50 px-2">
               <div className="flex items-center space-x-1 text-[8px] font-black uppercase tracking-[0.2em] text-gray-500">
                  <span className="w-1.5 h-1.5 bg-scopex-green rounded-full"></span>
                  <span>Diagnostic Intelligence v3.5</span>
               </div>
               <div className="flex items-center space-x-1 text-[8px] font-black uppercase tracking-[0.2em] text-gray-500">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>GDPR Compliant</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
});

export default AdvisorChat;
