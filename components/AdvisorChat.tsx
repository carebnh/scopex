
import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { getLabAdvice } from '../services/geminiService.ts';

export interface AdvisorChatHandle {
  triggerQuery: (query: string) => void;
}

const AdvisorChat = forwardRef<AdvisorChatHandle>((_, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { 
      role: 'model', 
      text: "Welcome to the Scope X AI Strategic Suite. I am your AI Advisor.\n\nI specialize in laboratory planning, NABL compliance, and diagnostic operations. How can I support your facility today?" 
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
  }, [messages, loading, suggestions]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setShowTooltip(true);
    }, 8000);
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
    setSuggestions([]); 
    const newMessages = [...messages, { role: 'user', text: userMsg } as const];
    setMessages(newMessages);
    setLoading(true);

    // Gemini API history must alternate user/model and usually start with user.
    // We skip the first 'model' welcome message if it's the start of the conversation history.
    const history = newMessages
      .filter((m, idx) => !(idx === 0 && m.role === 'model'))
      .map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

    const rawResponse = await getLabAdvice(history);
    const { cleanedText, suggestionList } = parseSuggestions(rawResponse);
    
    setMessages(prev => [...prev, { role: 'model', text: cleanedText }]);
    
    if (suggestionList.length > 0) {
      setTimeout(() => setSuggestions(suggestionList), 800);
    } else {
      setTimeout(() => setSuggestions(["Audit NABL Readiness", "TAT Optimization Plan", "Request ROI Analysis"]), 800);
    }
    
    setLoading(false);
  };

  const operationalPillars = [
    { label: 'NABL Compliance', icon: '⚖️', query: 'What are the core requirements for NABL accreditation?' },
    { label: 'Operational TAT', icon: '⏱️', query: 'How can we optimize our sample processing TAT?' },
    { label: 'Outsourcing ROI', icon: '📊', query: 'What is the ROI impact of a complete lab outsource?' }
  ];

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[150] flex flex-col items-end pointer-events-none">
        {showTooltip && !isOpen && (
          <div 
            className="mb-4 mr-2 bg-white px-5 py-4 rounded-2xl shadow-2xl border border-gray-100 animate-in slide-in-from-right-4 fade-in duration-700 max-w-[300px] pointer-events-auto cursor-pointer group hover:border-scopex-blue/20 transition-all"
            onClick={() => setIsOpen(true)}
          >
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-scopex-blue text-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[12px] font-black text-scopex-blue mb-0.5 tracking-tight uppercase">Hospital Lab Questions?</p>
                <p className="text-[11px] font-medium text-gray-400 leading-tight italic">Ask Our AI</p>
              </div>
            </div>
            <div className="absolute right-8 -bottom-2 w-4 h-4 bg-white border-r border-b border-gray-100 rotate-45"></div>
          </div>
        )}
        
        <button 
          onClick={() => { setIsOpen(!isOpen); setShowTooltip(false); }}
          className={`pointer-events-auto w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-500 active:scale-90 ${
            isOpen ? 'bg-slate-900 rotate-90 rounded-full' : 'bg-scopex-blue hover:bg-blue-900'
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

      <div 
        className={`fixed inset-0 md:inset-auto md:bottom-28 md:right-8 z-[140] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-12 scale-95 pointer-events-none'
        }`}
      >
        <div className="bg-white w-full h-full md:h-[700px] md:w-[440px] md:rounded-[2.5rem] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.3)] border border-gray-100 flex flex-col overflow-hidden">
          
          <div className="px-7 py-6 border-b border-gray-50 flex items-center justify-between bg-white z-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm relative">
                <svg className="w-6 h-6 text-scopex-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-scopex-green border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight leading-none mb-1.5 uppercase">AI Strategic Advisor</h3>
                <div className="flex items-center space-x-2">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-scopex-green"></span>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Lab Intelligence Core</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 text-gray-300 hover:text-slate-900 transition-colors bg-gray-50 hover:bg-gray-100 rounded-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-7 py-8 space-y-8 bg-white custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <span className={`text-[9px] font-black text-gray-300 uppercase tracking-widest mb-2 px-1 ${msg.role === 'user' ? 'mr-2' : 'ml-2'}`}>
                  {msg.role === 'user' ? 'Hospital Management' : 'AI Advisor'}
                </span>
                
                <div className={`max-w-[90%] px-5 py-4 rounded-[1.8rem] text-[14px] leading-[1.6] font-semibold transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
                  msg.role === 'user' 
                    ? 'bg-scopex-blue text-white rounded-tr-none shadow-[0_10px_25px_rgba(5,74,122,0.15)]' 
                    : 'bg-gray-50 text-slate-800 border border-gray-100 rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>

                {idx === 0 && messages.length === 1 && (
                  <div className="grid grid-cols-1 gap-3 w-full mt-6 animate-in slide-in-from-bottom-4 duration-700 delay-300">
                    {operationalPillars.map(pillar => (
                      <button 
                        key={pillar.label}
                        onClick={() => handleSend(pillar.query)}
                        className="flex items-center space-x-4 p-4 bg-white border border-gray-100 rounded-2xl hover:border-scopex-blue hover:shadow-lg transition-all text-left group"
                      >
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl group-hover:bg-scopex-blue group-hover:scale-110 transition-all group-active:scale-95">
                          {pillar.icon}
                        </div>
                        <div>
                          <p className="text-xs font-black text-scopex-blue uppercase tracking-widest leading-none mb-1 group-hover:text-scopex-blue transition-colors">{pillar.label}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Diagnostic Strategy</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex flex-col items-start space-y-2">
                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest ml-2">Advisor Thinking...</span>
                <div className="bg-gray-50 px-6 py-5 rounded-[1.8rem] rounded-tl-none border border-gray-100 shadow-sm flex items-center space-x-3">
                  <div className="flex space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-scopex-blue/30 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-scopex-blue/30 rounded-full animate-bounce delay-150"></div>
                    <div className="w-1.5 h-1.5 bg-scopex-blue/30 rounded-full animate-bounce delay-300"></div>
                  </div>
                </div>
              </div>
            )}

            {suggestions.length > 0 && !loading && (
              <div className="flex flex-col space-y-2.5 pt-4 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="flex items-center space-x-2 px-1">
                   <div className="h-px flex-1 bg-gray-100"></div>
                   <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] whitespace-nowrap">Suggested Follow-ups</p>
                   <div className="h-px flex-1 bg-gray-100"></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s, i) => (
                    <button 
                      key={i}
                      onClick={() => handleSend(s)}
                      className="px-4 py-3 bg-white border border-scopex-blue/10 text-scopex-blue rounded-2xl text-[12px] font-bold hover:bg-scopex-blue hover:text-white hover:border-scopex-blue hover:shadow-md transition-all active:scale-95 text-left leading-snug"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-7 bg-white border-t border-gray-50">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Inquire with the AI Advisor..."
                className="w-full pl-6 pr-16 py-5 bg-gray-50 border-2 border-transparent rounded-[1.8rem] focus:bg-white focus:border-scopex-blue/10 focus:ring-4 focus:ring-scopex-blue/5 outline-none transition-all font-bold text-slate-800 text-sm placeholder-gray-400 shadow-inner"
              />
              <button 
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="absolute right-2.5 p-3.5 bg-scopex-blue text-white rounded-2xl hover:bg-blue-900 transition-all shadow-xl shadow-blue-500/20 active:scale-90 disabled:opacity-20 disabled:grayscale"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default AdvisorChat;